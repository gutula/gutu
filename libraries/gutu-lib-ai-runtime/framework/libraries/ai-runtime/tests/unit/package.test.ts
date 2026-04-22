import { describe, expect, it } from "bun:test";

import { defineAction } from "@platform/schema";
import { createToolContract } from "@platform/ai";
import { z } from "zod";

import {
  AgentBudgetExceededError,
  acknowledgeRunnerHandoff,
  assertReplayFingerprint,
  assertToolAllowed,
  completeAgentRun,
  consumeBudget,
  createAgentRunRecord,
  createCapabilityTaxonomy,
  defineAgent,
  forkAgentRun,
  packageId,
  pauseAgentRunForApproval,
  prepareRunnerHandoff,
  recordVerifierResult
} from "../../src";

describe("ai-runtime", () => {
  it("exposes a stable package id", () => {
    expect(packageId).toBe("ai-runtime");
  });

  it("creates durable run records with replay fingerprints and approval checkpoints", () => {
    const archiveTool = createToolContract(
      defineAction({
        id: "crm.contacts.archive",
        input: z.object({ contactId: z.string() }),
        output: z.object({ ok: z.literal(true) }),
        permission: "crm.contacts.archive",
        idempotent: true,
        audit: true,
        ai: {
          purpose: "Archive a CRM contact.",
          riskLevel: "high",
          approvalMode: "required"
        },
        handler: () => ({ ok: true as const })
      })
    );

    const agent = defineAgent({
      id: "crm-account-manager",
      label: "CRM Account Manager",
      description: "Runs CRM follow-up automation with approvals.",
      defaultModelId: "gpt-test",
      capabilities: {
        toolIds: ["crm.contacts.archive"],
        mcpServerIds: ["crm-mcp"],
        appIds: ["crm-console"],
        skillIds: ["skill.crm-archive"],
        memoryCollectionIds: ["crm-knowledge"],
        workflowDefinitionKeys: ["crm-archive-flow"],
        agentProfileIds: ["agent-profile:crm-account-manager"]
      },
      budget: {
        maxSteps: 6,
        maxToolCalls: 3,
        maxRuntimeMs: 5_000
      },
      failurePolicy: {
        maxRetryAttempts: 2,
        retryableCodes: ["ai.provider.timeout"],
        pauseOnApprovalRequired: true,
        failOnReplayMismatch: true,
        failOnGuardrailBlock: true
      },
      verifierHooks: [
        {
          id: "verifier:pre-complete",
          label: "Completion gate",
          stage: "pre-complete",
          required: true
        }
      ]
    });

    const run = createAgentRunRecord(agent, {
      agentId: agent.id,
      tenantId: "tenant-1",
      packageId: "ai-core",
      prompt: "Archive duplicate contact c-1",
      tools: [archiveTool],
      actorId: "actor-1",
      promptVersionId: "prompt-v1",
      memorySnapshotRefs: ["crm.contacts.snapshot"],
      policyDecisions: ["tool.require_approval"]
    });

    expect(run.allowedToolIds).toEqual(["crm.contacts.archive"]);
    expect(run.capabilityTaxonomy).toEqual(
      createCapabilityTaxonomy({
        toolIds: ["crm.contacts.archive"],
        mcpServerIds: ["crm-mcp"],
        appIds: ["crm-console"],
        skillIds: ["skill.crm-archive"],
        memoryCollectionIds: ["crm-knowledge"],
        workflowDefinitionKeys: ["crm-archive-flow"],
        agentProfileIds: ["agent-profile:crm-account-manager"]
      })
    );
    expect(run.replayFingerprint).toHaveLength(64);
    expect(run.events[0]?.type).toBe("status");
    assertReplayFingerprint(run, run.replayFingerprint);

    const waiting = pauseAgentRunForApproval(run, {
      stepId: "step-approval",
      toolId: "crm.contacts.archive",
      reason: "High-risk archive requires support approval."
    });

    expect(waiting.status).toBe("waiting-approval");
    expect(waiting.checkpoints[0]?.state).toBe("pending");
    expect(completeAgentRun(waiting).status).toBe("completed");
  });

  it("supports run lineage, verifier results, and runner handoffs", () => {
    const agent = defineAgent({
      id: "release-agent",
      label: "Release Agent",
      description: "Stages governed work across execution backends.",
      defaultModelId: "gpt-test",
      capabilities: {
        toolIds: ["deploy.plan"],
        skillIds: ["skill.release-plan"]
      },
      budget: {
        maxSteps: 4,
        maxToolCalls: 2
      },
      failurePolicy: {
        maxRetryAttempts: 1,
        retryableCodes: [],
        pauseOnApprovalRequired: false,
        failOnReplayMismatch: true,
        failOnGuardrailBlock: true
      }
    });

    const rootRun = createAgentRunRecord(agent, {
      agentId: agent.id,
      tenantId: "tenant-1",
      packageId: "ai-core",
      prompt: "Plan a release branch.",
      tools: [],
      actorId: "actor-1"
    });
    const branched = forkAgentRun(rootRun, {
      runId: "release-agent:run:branch-1",
      branchKey: "release-canary",
      branchReason: "Fork for canary validation.",
      executionMode: "sandbox"
    });
    const verified = recordVerifierResult(branched, {
      id: "verifier-result:1",
      hookId: "verifier:canary",
      outcome: "pass",
      summary: "Canary guard passed."
    });
    const handoffPrepared = prepareRunnerHandoff(verified, {
      id: "handoff:1",
      target: "sandbox",
      endpoint: "sandbox://worker/release-canary"
    });
    const handoffAccepted = acknowledgeRunnerHandoff(handoffPrepared, "handoff:1");

    expect(branched.lineage.parentRunId).toBe(rootRun.id);
    expect(branched.executionMode).toBe("sandbox");
    expect(verified.verifierResults[0]?.outcome).toBe("pass");
    expect(handoffPrepared.runnerHandoffs[0]?.state).toBe("prepared");
    expect(handoffAccepted.runnerHandoffs[0]?.state).toBe("accepted");
    expect(handoffAccepted.events.some((event) => event.type === "handoff")).toBe(true);
  });

  it("fails closed on denied tools and exhausted budgets", () => {
    const agent = defineAgent({
      id: "report-agent",
      label: "Report Agent",
      description: "Builds internal reports only.",
      defaultModelId: "gpt-test",
      capabilities: {
        toolIds: ["reports.run"],
        deniedToolIds: ["reports.delete"]
      },
      budget: {
        maxSteps: 1,
        maxToolCalls: 1,
        maxRuntimeMs: 1_000
      },
      failurePolicy: {
        maxRetryAttempts: 1,
        retryableCodes: [],
        pauseOnApprovalRequired: false,
        failOnReplayMismatch: true,
        failOnGuardrailBlock: true
      }
    });

    const run = createAgentRunRecord(agent, {
      agentId: agent.id,
      tenantId: "tenant-1",
      packageId: "ai-core",
      prompt: "Run report",
      tools: [],
      actorId: "actor-1"
    });

    expect(() => assertToolAllowed(run, "reports.delete")).toThrow();
    expect(() => consumeBudget(run, { stepCount: 2 })).toThrow(AgentBudgetExceededError);
  });
});
