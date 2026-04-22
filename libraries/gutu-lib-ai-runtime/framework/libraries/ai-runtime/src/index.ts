import { createHash } from "node:crypto";

import type { ToolContract } from "@platform/ai";
export { loadJsonState, resolveStateDirectory, resolveStateFile, saveJsonState, updateJsonState } from "./state";

export const packageId = "ai-runtime" as const;
export const packageDisplayName = "AI Runtime" as const;
export const packageDescription =
  "Durable agent runtime contracts, branching, checkpoints, replay, verifier hooks, and runner handoff enforcement." as const;

export type AgentStepStatus = "queued" | "running" | "waiting-approval" | "completed" | "failed" | "cancelled";

export type AgentStepKind =
  | "intake"
  | "classification"
  | "plan"
  | "model"
  | "tool"
  | "approval"
  | "human-task"
  | "memory"
  | "workflow"
  | "sandbox"
  | "verification"
  | "escalation";

export type ApprovalCheckpointState = "pending" | "approved" | "rejected" | "expired";

export type AgentCapabilityProfile = {
  toolIds: string[];
  mcpServerIds?: string[] | undefined;
  appIds?: string[] | undefined;
  skillIds?: string[] | undefined;
  readModelIds?: string[] | undefined;
  memoryCollectionIds?: string[] | undefined;
  workflowDefinitionKeys?: string[] | undefined;
  agentProfileIds?: string[] | undefined;
  promptTemplateIds?: string[] | undefined;
  deniedToolIds?: string[] | undefined;
};

export type AgentCapabilityTaxonomy = {
  tools: string[];
  mcp: string[];
  apps: string[];
  skills: string[];
  knowledge: string[];
  workflows: string[];
  agentProfiles: string[];
};

export type AgentBudgetPolicy = {
  maxSteps: number;
  maxToolCalls: number;
  maxInputTokens?: number | undefined;
  maxOutputTokens?: number | undefined;
  maxTotalTokens?: number | undefined;
  maxEstimatedCostUsd?: number | undefined;
  maxRuntimeMs?: number | undefined;
};

export type AgentFailurePolicy = {
  maxRetryAttempts: number;
  retryableCodes: string[];
  pauseOnApprovalRequired: boolean;
  failOnReplayMismatch: boolean;
  failOnGuardrailBlock: boolean;
};

export type ApprovalCheckpoint = {
  id: string;
  runId: string;
  stepId: string;
  reason: string;
  requestedAt: string;
  expiresAt?: string | undefined;
  state: ApprovalCheckpointState;
  toolId?: string | undefined;
  approvedAt?: string | undefined;
  approverId?: string | undefined;
  decisionNote?: string | undefined;
};

export type AgentStep = {
  id: string;
  kind: AgentStepKind;
  status: AgentStepStatus;
  summary: string;
  startedAt: string;
  completedAt?: string | undefined;
  correlationId?: string | undefined;
  toolId?: string | undefined;
  approvalCheckpointId?: string | undefined;
  input?: Record<string, unknown> | undefined;
  output?: Record<string, unknown> | undefined;
  errorCode?: string | undefined;
};

export type PromptTemplate = {
  id: string;
  label: string;
  body: string;
  version: string;
};

export type PromptVersion = {
  id: string;
  templateId: string;
  version: string;
  body: string;
  createdAt: string;
  changelog?: string | undefined;
};

export type AgentVerifierHook = {
  id: string;
  label: string;
  stage: "pre-flight" | "post-step" | "pre-complete";
  required: boolean;
  description?: string | undefined;
};

export type AgentVerifierResult = {
  id: string;
  hookId: string;
  outcome: "pass" | "warn" | "fail";
  summary: string;
  evidenceRefs?: string[] | undefined;
  createdAt: string;
};

export type AgentDefinition = {
  id: string;
  label: string;
  description: string;
  defaultModelId: string;
  capabilities: AgentCapabilityProfile;
  budget: AgentBudgetPolicy;
  failurePolicy: AgentFailurePolicy;
  promptTemplateId?: string | undefined;
  verifierHooks?: AgentVerifierHook[] | undefined;
};

export type AgentRunRequest = {
  agentId: string;
  tenantId: string;
  packageId: string;
  prompt: string;
  tools: ToolContract[];
  actorId?: string | undefined;
  serviceIdentityId?: string | undefined;
  modelId?: string | undefined;
  correlationId?: string | undefined;
  promptVersionId?: string | undefined;
  memorySnapshotRefs?: string[] | undefined;
  modelRoutingProfileId?: string | undefined;
  policyDecisions?: string[] | undefined;
  executionMode?: AgentExecutionMode | undefined;
  verifierHooks?: AgentVerifierHook[] | undefined;
  classification?:
    | {
        processClass: string;
        riskTier: "low" | "moderate" | "high" | "critical";
        slaMinutes: number;
      }
    | undefined;
  context?: Record<string, unknown> | undefined;
};

export type AgentRunUsage = {
  stepCount: number;
  toolCallCount: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  runtimeMs: number;
};

export type AgentRunStatus = "queued" | "running" | "waiting-approval" | "completed" | "failed" | "cancelled" | "escalated";

export type AgentExecutionMode =
  | "deterministic"
  | "bounded-agent"
  | "human-task"
  | "sandbox"
  | "strict-process"
  | "exploratory";

export type AgentRunArtifact = {
  id: string;
  kind: "plan" | "result" | "approval-packet" | "handoff" | "report" | "release-candidate";
  label: string;
  uri?: string | undefined;
  summary?: string | undefined;
  createdAt: string;
};

export type AgentRunEvidence = {
  id: string;
  kind: "citation" | "policy-check" | "verification" | "eval-gate" | "notification" | "workflow";
  label: string;
  passed: boolean;
  detail?: string | undefined;
  createdAt: string;
};

export type ImprovementCandidate = {
  id: string;
  targetKind: "prompt-version" | "workflow-definition" | "memory-promotion" | "release-gate";
  targetId: string;
  summary: string;
  state: "proposed" | "accepted" | "rejected";
  createdAt: string;
};

export type AgentRunLineage = {
  rootRunId: string;
  parentRunId: string | null;
  branchKey: string;
  branchReason: string;
  depth: number;
  path: string[];
};

export type AgentRunEvent = {
  id: string;
  runId: string;
  type: "status" | "step" | "approval" | "artifact" | "evidence" | "branch" | "verifier" | "handoff";
  summary: string;
  payload?: Record<string, unknown> | undefined;
  createdAt: string;
};

export type AgentRunnerHandoff = {
  id: string;
  target: "same-process" | "queue-worker" | "sandbox" | "external-runner";
  state: "prepared" | "accepted" | "completed" | "failed";
  requestedAt: string;
  acceptedAt?: string | undefined;
  completedAt?: string | undefined;
  endpoint?: string | undefined;
  note?: string | undefined;
};

export type AgentRunRecord = {
  id: string;
  agentId: string;
  tenantId: string;
  packageId: string;
  prompt: string;
  status: AgentRunStatus;
  startedAt: string;
  completedAt?: string | undefined;
  actorId?: string | undefined;
  serviceIdentityId?: string | undefined;
  modelId: string;
  correlationId: string;
  tools: ToolContract[];
  allowedToolIds: string[];
  capabilityTaxonomy: AgentCapabilityTaxonomy;
  budget: AgentBudgetPolicy;
  failurePolicy: AgentFailurePolicy;
  checkpoints: ApprovalCheckpoint[];
  steps: AgentStep[];
  lineage: AgentRunLineage;
  events: AgentRunEvent[];
  verifierHooks: AgentVerifierHook[];
  verifierResults: AgentVerifierResult[];
  runnerHandoffs: AgentRunnerHandoff[];
  usage: AgentRunUsage;
  executionMode: AgentExecutionMode;
  classification: {
    processClass: string;
    riskTier: "low" | "moderate" | "high" | "critical";
    slaMinutes: number;
  };
  promptVersionId?: string | undefined;
  memorySnapshotRefs: string[];
  modelRoutingProfileId?: string | undefined;
  policyDecisions: string[];
  escalation?:
    | {
        reason: string;
        escalatedAt: string;
        queue: string;
      }
    | undefined;
  artifacts: AgentRunArtifact[];
  evidence: AgentRunEvidence[];
  improvementCandidates: ImprovementCandidate[];
  replayFingerprint: string;
  replaySnapshot: {
    toolSchema: Record<string, { inputSchema: Record<string, unknown>; outputSchema: Record<string, unknown> }>;
    policyDecisions: string[];
    memorySnapshotRefs: string[];
    promptVersionId?: string | undefined;
    modelRoutingProfileId?: string | undefined;
  };
};

export class AgentToolDeniedError extends Error {
  readonly toolId: string;

  constructor(toolId: string) {
    super(`Tool '${toolId}' is not allowed for this agent run`);
    this.name = "AgentToolDeniedError";
    this.toolId = toolId;
  }
}

export class AgentBudgetExceededError extends Error {
  readonly budget: AgentBudgetPolicy;
  readonly usage: AgentRunUsage;

  constructor(message: string, budget: AgentBudgetPolicy, usage: AgentRunUsage) {
    super(message);
    this.name = "AgentBudgetExceededError";
    this.budget = budget;
    this.usage = usage;
  }
}

export class AgentReplayMismatchError extends Error {
  readonly expectedFingerprint: string;
  readonly actualFingerprint: string;

  constructor(expectedFingerprint: string, actualFingerprint: string) {
    super(`Replay mismatch: expected ${expectedFingerprint}, found ${actualFingerprint}`);
    this.name = "AgentReplayMismatchError";
    this.expectedFingerprint = expectedFingerprint;
    this.actualFingerprint = actualFingerprint;
  }
}

export function defineAgent(definition: AgentDefinition): AgentDefinition {
  return Object.freeze({
    ...definition,
    capabilities: {
      toolIds: [...definition.capabilities.toolIds].sort((left, right) => left.localeCompare(right)),
      ...(definition.capabilities.mcpServerIds
        ? { mcpServerIds: [...definition.capabilities.mcpServerIds].sort((left, right) => left.localeCompare(right)) }
        : {}),
      ...(definition.capabilities.appIds
        ? { appIds: [...definition.capabilities.appIds].sort((left, right) => left.localeCompare(right)) }
        : {}),
      ...(definition.capabilities.skillIds
        ? { skillIds: [...definition.capabilities.skillIds].sort((left, right) => left.localeCompare(right)) }
        : {}),
      ...(definition.capabilities.readModelIds ? { readModelIds: [...definition.capabilities.readModelIds].sort((left, right) => left.localeCompare(right)) } : {}),
      ...(definition.capabilities.memoryCollectionIds
        ? { memoryCollectionIds: [...definition.capabilities.memoryCollectionIds].sort((left, right) => left.localeCompare(right)) }
        : {}),
      ...(definition.capabilities.workflowDefinitionKeys
        ? { workflowDefinitionKeys: [...definition.capabilities.workflowDefinitionKeys].sort((left, right) => left.localeCompare(right)) }
        : {}),
      ...(definition.capabilities.agentProfileIds
        ? { agentProfileIds: [...definition.capabilities.agentProfileIds].sort((left, right) => left.localeCompare(right)) }
        : {}),
      ...(definition.capabilities.promptTemplateIds
        ? { promptTemplateIds: [...definition.capabilities.promptTemplateIds].sort((left, right) => left.localeCompare(right)) }
        : {}),
      ...(definition.capabilities.deniedToolIds
        ? { deniedToolIds: [...definition.capabilities.deniedToolIds].sort((left, right) => left.localeCompare(right)) }
        : {})
    },
    budget: { ...definition.budget },
    failurePolicy: {
      ...definition.failurePolicy,
      retryableCodes: [...definition.failurePolicy.retryableCodes].sort((left, right) => left.localeCompare(right))
    },
    ...(definition.verifierHooks
      ? {
          verifierHooks: definition.verifierHooks.map((hook) => ({
            ...hook
          }))
        }
      : {})
  });
}

export function createAgentRunRecord(
  definition: AgentDefinition,
  request: AgentRunRequest,
  options: {
    runId?: string | undefined;
    startedAt?: string | Date | undefined;
  } = {}
): AgentRunRecord {
  const startedAt = normalizeTimestamp(options.startedAt ?? new Date());
  const runId = options.runId ?? `${request.agentId}:run:${startedAt}`;
  const allowedToolIds = definition.capabilities.toolIds.filter((toolId) => !definition.capabilities.deniedToolIds?.includes(toolId));
  const capabilityTaxonomy = createCapabilityTaxonomy(definition.capabilities);
  const classification: AgentRunRecord["classification"] = request.classification ?? {
    processClass: "general",
    riskTier: "moderate",
    slaMinutes: 120
  };
  const replaySnapshot = createReplaySnapshot(request.tools, {
    policyDecisions: request.policyDecisions ?? [],
    memorySnapshotRefs: request.memorySnapshotRefs ?? [],
    ...(request.promptVersionId ? { promptVersionId: request.promptVersionId } : {}),
    ...(request.modelRoutingProfileId ? { modelRoutingProfileId: request.modelRoutingProfileId } : {})
  });

  return Object.freeze({
    id: runId,
    agentId: request.agentId,
    tenantId: request.tenantId,
    packageId: request.packageId,
    prompt: request.prompt,
    status: "queued",
    startedAt,
    ...(request.actorId ? { actorId: request.actorId } : {}),
    ...(request.serviceIdentityId ? { serviceIdentityId: request.serviceIdentityId } : {}),
    modelId: request.modelId ?? definition.defaultModelId,
    correlationId: request.correlationId ?? `${request.tenantId}:${request.agentId}:${startedAt}`,
    tools: [...request.tools],
    allowedToolIds,
    capabilityTaxonomy,
    budget: { ...definition.budget },
    failurePolicy: {
      ...definition.failurePolicy,
      retryableCodes: [...definition.failurePolicy.retryableCodes]
    },
    checkpoints: [],
    steps: [],
    lineage: {
      rootRunId: runId,
      parentRunId: null,
      branchKey: "root",
      branchReason: "Initial governed submission",
      depth: 0,
      path: [runId]
    },
    events: [
      createRunEvent({
        runId,
        type: "status",
        summary: "Run queued for governed execution.",
        createdAt: startedAt,
        payload: {
          status: "queued",
          executionMode: request.executionMode ?? "bounded-agent"
        }
      })
    ],
    verifierHooks: [...(request.verifierHooks ?? definition.verifierHooks ?? [])],
    verifierResults: [],
    runnerHandoffs: [],
    usage: {
      stepCount: 0,
      toolCallCount: 0,
      inputTokens: 0,
      outputTokens: 0,
      estimatedCostUsd: 0,
      runtimeMs: 0
    },
    executionMode: request.executionMode ?? "bounded-agent",
    classification,
    ...(request.promptVersionId ? { promptVersionId: request.promptVersionId } : {}),
    memorySnapshotRefs: [...(request.memorySnapshotRefs ?? [])],
    ...(request.modelRoutingProfileId ? { modelRoutingProfileId: request.modelRoutingProfileId } : {}),
    policyDecisions: [...(request.policyDecisions ?? [])],
    artifacts: [],
    evidence: [],
    improvementCandidates: [],
    replayFingerprint: createReplayFingerprint({
      promptVersionId: request.promptVersionId,
      modelRoutingProfileId: request.modelRoutingProfileId,
      tools: request.tools,
      memorySnapshotRefs: request.memorySnapshotRefs ?? [],
      policyDecisions: request.policyDecisions ?? []
    }),
    replaySnapshot
  });
}

export function appendAgentStep(
  run: AgentRunRecord,
  step: Omit<AgentStep, "startedAt"> & { startedAt?: string | Date | undefined }
): AgentRunRecord {
  const normalizedStep: AgentStep = {
    ...step,
    startedAt: normalizeTimestamp(step.startedAt ?? new Date())
  };
  const nextStatus = normalizedStep.status === "waiting-approval" ? "waiting-approval" : run.status === "queued" ? "running" : run.status;

  return Object.freeze({
    ...run,
    status: nextStatus,
    steps: [...run.steps, normalizedStep],
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "step",
        summary: normalizedStep.summary,
        createdAt: normalizedStep.startedAt,
        payload: {
          stepId: normalizedStep.id,
          kind: normalizedStep.kind,
          status: normalizedStep.status
        }
      }),
      ...(nextStatus !== run.status
        ? [
            createRunEvent({
              runId: run.id,
              type: "status",
              summary: `Run status changed to ${nextStatus}.`,
              createdAt: normalizedStep.startedAt,
              payload: {
                status: nextStatus
              }
            })
          ]
        : [])
    ],
    usage: {
      ...run.usage,
      stepCount: run.usage.stepCount + 1,
      toolCallCount: run.usage.toolCallCount + (normalizedStep.kind === "tool" ? 1 : 0)
    }
  });
}

export function pauseAgentRunForApproval(
  run: AgentRunRecord,
  input: {
    stepId: string;
    reason: string;
    toolId?: string | undefined;
    checkpointId?: string | undefined;
    requestedAt?: string | Date | undefined;
    expiresAt?: string | Date | undefined;
  }
): AgentRunRecord {
  const checkpoint: ApprovalCheckpoint = {
    id: input.checkpointId ?? `${run.id}:approval:${run.checkpoints.length + 1}`,
    runId: run.id,
    stepId: input.stepId,
    reason: input.reason,
    requestedAt: normalizeTimestamp(input.requestedAt ?? new Date()),
    ...(input.expiresAt ? { expiresAt: normalizeTimestamp(input.expiresAt) } : {}),
    state: "pending",
    ...(input.toolId ? { toolId: input.toolId } : {})
  };

  return Object.freeze({
    ...run,
    status: "waiting-approval",
    checkpoints: [...run.checkpoints, checkpoint],
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "approval",
        summary: input.reason,
        createdAt: checkpoint.requestedAt,
        payload: {
          checkpointId: checkpoint.id,
          toolId: checkpoint.toolId ?? null,
          state: checkpoint.state
        }
      })
    ]
  });
}

export function approveCheckpoint(
  run: AgentRunRecord,
  checkpointId: string,
  input: {
    approverId: string;
    approvedAt?: string | Date | undefined;
    decisionNote?: string | undefined;
  }
): AgentRunRecord {
  const approvedAt = normalizeTimestamp(input.approvedAt ?? new Date());
  return Object.freeze({
    ...run,
    status: "running",
    checkpoints: run.checkpoints.map((checkpoint) =>
      checkpoint.id === checkpointId
        ? {
            ...checkpoint,
            state: "approved" as const,
            approverId: input.approverId,
            approvedAt,
            ...(input.decisionNote ? { decisionNote: input.decisionNote } : {})
          }
        : checkpoint
    ),
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "approval",
        summary: `Checkpoint ${checkpointId} approved.`,
        createdAt: approvedAt,
        payload: {
          checkpointId,
          approverId: input.approverId,
          state: "approved"
        }
      })
    ]
  });
}

export function rejectCheckpoint(
  run: AgentRunRecord,
  checkpointId: string,
  input: {
    approverId: string;
    rejectedAt?: string | Date | undefined;
    decisionNote?: string | undefined;
  }
): AgentRunRecord {
  const rejectedAt = normalizeTimestamp(input.rejectedAt ?? new Date());
  return Object.freeze({
    ...run,
    status: "failed",
    completedAt: rejectedAt,
    checkpoints: run.checkpoints.map((checkpoint) =>
      checkpoint.id === checkpointId
        ? {
            ...checkpoint,
            state: "rejected" as const,
            approverId: input.approverId,
            approvedAt: rejectedAt,
            ...(input.decisionNote ? { decisionNote: input.decisionNote } : {})
          }
        : checkpoint
    ),
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "approval",
        summary: `Checkpoint ${checkpointId} rejected.`,
        createdAt: rejectedAt,
        payload: {
          checkpointId,
          approverId: input.approverId,
          state: "rejected"
        }
      })
    ]
  });
}

export function resumeAgentRun(run: AgentRunRecord): AgentRunRecord {
  const resumedAt = normalizeTimestamp(new Date());
  return Object.freeze({
    ...run,
    status: run.status === "waiting-approval" ? "running" : run.status,
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "status",
        summary: "Run resumed for continued execution.",
        createdAt: resumedAt,
        payload: {
          status: run.status === "waiting-approval" ? "running" : run.status
        }
      })
    ]
  });
}

export function completeAgentRun(run: AgentRunRecord, completedAt: string | Date = new Date()): AgentRunRecord {
  const completedAtValue = normalizeTimestamp(completedAt);
  return Object.freeze({
    ...run,
    status: "completed",
    completedAt: completedAtValue,
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "status",
        summary: "Run completed successfully.",
        createdAt: completedAtValue,
        payload: {
          status: "completed"
        }
      })
    ]
  });
}

export function failAgentRun(run: AgentRunRecord, completedAt: string | Date = new Date()): AgentRunRecord {
  const completedAtValue = normalizeTimestamp(completedAt);
  return Object.freeze({
    ...run,
    status: "failed",
    completedAt: completedAtValue,
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "status",
        summary: "Run failed.",
        createdAt: completedAtValue,
        payload: {
          status: "failed"
        }
      })
    ]
  });
}

export function cancelAgentRun(run: AgentRunRecord, completedAt: string | Date = new Date()): AgentRunRecord {
  const completedAtValue = normalizeTimestamp(completedAt);
  return Object.freeze({
    ...run,
    status: "cancelled",
    completedAt: completedAtValue,
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "status",
        summary: "Run cancelled.",
        createdAt: completedAtValue,
        payload: {
          status: "cancelled"
        }
      })
    ]
  });
}

export function expireCheckpoint(
  run: AgentRunRecord,
  checkpointId: string,
  expiredAt: string | Date = new Date()
): AgentRunRecord {
  const completedAt = normalizeTimestamp(expiredAt);
  return Object.freeze({
    ...run,
    status: "failed",
    completedAt,
    checkpoints: run.checkpoints.map((checkpoint) =>
      checkpoint.id === checkpointId
        ? {
            ...checkpoint,
            state: "expired" as const
          }
        : checkpoint
    ),
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "approval",
        summary: `Checkpoint ${checkpointId} expired.`,
        createdAt: completedAt,
        payload: {
          checkpointId,
          state: "expired"
        }
      })
    ]
  });
}

export function escalateAgentRun(
  run: AgentRunRecord,
  input: {
    reason: string;
    queue: string;
    escalatedAt?: string | Date | undefined;
  }
): AgentRunRecord {
  const escalatedAt = normalizeTimestamp(input.escalatedAt ?? new Date());
  return Object.freeze({
    ...run,
    status: "escalated",
    escalation: {
      reason: input.reason,
      queue: input.queue,
      escalatedAt
    },
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "status",
        summary: input.reason,
        createdAt: escalatedAt,
        payload: {
          status: "escalated",
          queue: input.queue
        }
      })
    ]
  });
}

export function attachRunArtifact(
  run: AgentRunRecord,
  artifact: Omit<AgentRunArtifact, "createdAt"> & { createdAt?: string | Date | undefined }
): AgentRunRecord {
  const createdAt = normalizeTimestamp(artifact.createdAt ?? new Date());
  return Object.freeze({
    ...run,
    artifacts: [
      ...run.artifacts,
      {
        ...artifact,
        createdAt
      }
    ],
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "artifact",
        summary: artifact.label,
        createdAt,
        payload: {
          artifactId: artifact.id,
          kind: artifact.kind
        }
      })
    ]
  });
}

export function attachRunEvidence(
  run: AgentRunRecord,
  evidence: Omit<AgentRunEvidence, "createdAt"> & { createdAt?: string | Date | undefined }
): AgentRunRecord {
  const createdAt = normalizeTimestamp(evidence.createdAt ?? new Date());
  return Object.freeze({
    ...run,
    evidence: [
      ...run.evidence,
      {
        ...evidence,
        createdAt
      }
    ],
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "evidence",
        summary: evidence.label,
        createdAt,
        payload: {
          evidenceId: evidence.id,
          kind: evidence.kind,
          passed: evidence.passed
        }
      })
    ]
  });
}

export function recordImprovementCandidate(
  run: AgentRunRecord,
  candidate: Omit<ImprovementCandidate, "createdAt"> & { createdAt?: string | Date | undefined }
): AgentRunRecord {
  return Object.freeze({
    ...run,
    improvementCandidates: [
      ...run.improvementCandidates,
      {
        ...candidate,
        createdAt: normalizeTimestamp(candidate.createdAt ?? new Date())
      }
    ]
  });
}

export function recordVerifierResult(
  run: AgentRunRecord,
  result: Omit<AgentVerifierResult, "createdAt"> & { createdAt?: string | Date | undefined }
): AgentRunRecord {
  const createdAt = normalizeTimestamp(result.createdAt ?? new Date());
  return Object.freeze({
    ...run,
    verifierResults: [
      ...run.verifierResults,
      {
        ...result,
        createdAt
      }
    ],
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "verifier",
        summary: result.summary,
        createdAt,
        payload: {
          hookId: result.hookId,
          outcome: result.outcome
        }
      })
    ]
  });
}

export function forkAgentRun(
  run: AgentRunRecord,
  input: {
    runId: string;
    branchKey: string;
    branchReason: string;
    startedAt?: string | Date | undefined;
    executionMode?: AgentExecutionMode | undefined;
  }
): AgentRunRecord {
  const startedAt = normalizeTimestamp(input.startedAt ?? new Date());
  const forkedRunId = input.runId;
  return Object.freeze({
    ...run,
    id: forkedRunId,
    status: "queued",
    startedAt,
    completedAt: undefined,
    checkpoints: [],
    steps: [],
    events: [
      createRunEvent({
        runId: forkedRunId,
        type: "branch",
        summary: input.branchReason,
        createdAt: startedAt,
        payload: {
          parentRunId: run.id,
          branchKey: input.branchKey
        }
      })
    ],
    verifierResults: [],
    runnerHandoffs: [],
    usage: {
      stepCount: 0,
      toolCallCount: 0,
      inputTokens: 0,
      outputTokens: 0,
      estimatedCostUsd: 0,
      runtimeMs: 0
    },
    executionMode: input.executionMode ?? run.executionMode,
    artifacts: [],
    evidence: [],
    improvementCandidates: [],
    lineage: {
      rootRunId: run.lineage.rootRunId,
      parentRunId: run.id,
      branchKey: input.branchKey,
      branchReason: input.branchReason,
      depth: run.lineage.depth + 1,
      path: [...run.lineage.path, forkedRunId]
    }
  });
}

export function prepareRunnerHandoff(
  run: AgentRunRecord,
  handoff: Omit<AgentRunnerHandoff, "requestedAt" | "state"> & { requestedAt?: string | Date | undefined }
): AgentRunRecord {
  const requestedAt = normalizeTimestamp(handoff.requestedAt ?? new Date());
  return Object.freeze({
    ...run,
    runnerHandoffs: [
      ...run.runnerHandoffs,
      {
        ...handoff,
        requestedAt,
        state: "prepared" as const
      }
    ],
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "handoff",
        summary: `Prepared runner handoff to ${handoff.target}.`,
        createdAt: requestedAt,
        payload: {
          handoffId: handoff.id,
          target: handoff.target,
          endpoint: handoff.endpoint ?? null
        }
      })
    ]
  });
}

export function acknowledgeRunnerHandoff(
  run: AgentRunRecord,
  handoffId: string,
  acceptedAt: string | Date = new Date()
): AgentRunRecord {
  const acceptedAtValue = normalizeTimestamp(acceptedAt);
  return Object.freeze({
    ...run,
    runnerHandoffs: run.runnerHandoffs.map((handoff) =>
      handoff.id === handoffId
        ? {
            ...handoff,
            state: "accepted" as const,
            acceptedAt: acceptedAtValue
          }
        : handoff
    ),
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "handoff",
        summary: `Runner handoff ${handoffId} accepted.`,
        createdAt: acceptedAtValue,
        payload: {
          handoffId,
          state: "accepted"
        }
      })
    ]
  });
}

export function completeRunnerHandoff(
  run: AgentRunRecord,
  handoffId: string,
  completedAt: string | Date = new Date()
): AgentRunRecord {
  const completedAtValue = normalizeTimestamp(completedAt);
  return Object.freeze({
    ...run,
    runnerHandoffs: run.runnerHandoffs.map((handoff) =>
      handoff.id === handoffId
        ? {
            ...handoff,
            state: "completed" as const,
            completedAt: completedAtValue
          }
        : handoff
    ),
    events: [
      ...run.events,
      createRunEvent({
        runId: run.id,
        type: "handoff",
        summary: `Runner handoff ${handoffId} completed.`,
        createdAt: completedAtValue,
        payload: {
          handoffId,
          state: "completed"
        }
      })
    ]
  });
}

export function consumeBudget(
  run: AgentRunRecord,
  delta: Partial<Omit<AgentRunUsage, "stepCount" | "toolCallCount">> & {
    stepCount?: number | undefined;
    toolCallCount?: number | undefined;
  }
): AgentRunRecord {
  const nextUsage: AgentRunUsage = {
    stepCount: run.usage.stepCount + (delta.stepCount ?? 0),
    toolCallCount: run.usage.toolCallCount + (delta.toolCallCount ?? 0),
    inputTokens: run.usage.inputTokens + (delta.inputTokens ?? 0),
    outputTokens: run.usage.outputTokens + (delta.outputTokens ?? 0),
    estimatedCostUsd: Number((run.usage.estimatedCostUsd + (delta.estimatedCostUsd ?? 0)).toFixed(6)),
    runtimeMs: run.usage.runtimeMs + (delta.runtimeMs ?? 0)
  };

  assertBudgetWithinLimits(run.budget, nextUsage);

  return Object.freeze({
    ...run,
    usage: nextUsage
  });
}

export function assertToolAllowed(run: AgentRunRecord, toolId: string): void {
  if (!run.allowedToolIds.includes(toolId)) {
    throw new AgentToolDeniedError(toolId);
  }
}

export function assertReplayFingerprint(run: AgentRunRecord, fingerprint: string): void {
  if (run.replayFingerprint !== fingerprint) {
    throw new AgentReplayMismatchError(run.replayFingerprint, fingerprint);
  }
}

export function createReplayFingerprint(input: {
  promptVersionId?: string | undefined;
  modelRoutingProfileId?: string | undefined;
  tools: ToolContract[];
  memorySnapshotRefs: string[];
  policyDecisions: string[];
}): string {
  const serialized = JSON.stringify({
    promptVersionId: input.promptVersionId ?? null,
    modelRoutingProfileId: input.modelRoutingProfileId ?? null,
    tools: input.tools
      .map((tool) => ({
        id: tool.id,
        permission: tool.permission,
        approvalMode: tool.approvalMode,
        inputSchema: tool.inputSchema,
        outputSchema: tool.outputSchema
      }))
      .sort((left, right) => left.id.localeCompare(right.id)),
    memorySnapshotRefs: [...input.memorySnapshotRefs].sort((left, right) => left.localeCompare(right)),
    policyDecisions: [...input.policyDecisions].sort((left, right) => left.localeCompare(right))
  });

  return createHash("sha256").update(serialized).digest("hex");
}

export function createCapabilityTaxonomy(capabilities: AgentCapabilityProfile): AgentCapabilityTaxonomy {
  return Object.freeze({
    tools: [...capabilities.toolIds].sort((left, right) => left.localeCompare(right)),
    mcp: [...(capabilities.mcpServerIds ?? [])].sort((left, right) => left.localeCompare(right)),
    apps: [...(capabilities.appIds ?? [])].sort((left, right) => left.localeCompare(right)),
    skills: [...(capabilities.skillIds ?? [])].sort((left, right) => left.localeCompare(right)),
    knowledge: [...(capabilities.memoryCollectionIds ?? [])].sort((left, right) => left.localeCompare(right)),
    workflows: [...(capabilities.workflowDefinitionKeys ?? [])].sort((left, right) => left.localeCompare(right)),
    agentProfiles: [...(capabilities.agentProfileIds ?? [])].sort((left, right) => left.localeCompare(right))
  });
}

function createReplaySnapshot(
  tools: ToolContract[],
  input: {
    policyDecisions: string[];
    memorySnapshotRefs: string[];
    promptVersionId?: string | undefined;
    modelRoutingProfileId?: string | undefined;
  }
): AgentRunRecord["replaySnapshot"] {
  return {
    toolSchema: Object.fromEntries(
      [...tools]
        .sort((left, right) => left.id.localeCompare(right.id))
        .map((tool) => [
          tool.id,
          {
            inputSchema: tool.inputSchema,
            outputSchema: tool.outputSchema
          }
        ])
    ),
    policyDecisions: [...input.policyDecisions].sort((left, right) => left.localeCompare(right)),
    memorySnapshotRefs: [...input.memorySnapshotRefs].sort((left, right) => left.localeCompare(right)),
    ...(input.promptVersionId ? { promptVersionId: input.promptVersionId } : {}),
    ...(input.modelRoutingProfileId ? { modelRoutingProfileId: input.modelRoutingProfileId } : {})
  };
}

function createRunEvent(input: Omit<AgentRunEvent, "id">): AgentRunEvent {
  return {
    id: `${input.runId}:event:${input.type}:${input.createdAt}:${Math.abs(hashString(input.summary))}`,
    ...input
  };
}

function assertBudgetWithinLimits(budget: AgentBudgetPolicy, usage: AgentRunUsage): void {
  if (usage.stepCount > budget.maxSteps) {
    throw new AgentBudgetExceededError("step budget exceeded", budget, usage);
  }
  if (usage.toolCallCount > budget.maxToolCalls) {
    throw new AgentBudgetExceededError("tool-call budget exceeded", budget, usage);
  }
  if (budget.maxInputTokens !== undefined && usage.inputTokens > budget.maxInputTokens) {
    throw new AgentBudgetExceededError("input token budget exceeded", budget, usage);
  }
  if (budget.maxOutputTokens !== undefined && usage.outputTokens > budget.maxOutputTokens) {
    throw new AgentBudgetExceededError("output token budget exceeded", budget, usage);
  }
  if (budget.maxTotalTokens !== undefined && usage.inputTokens + usage.outputTokens > budget.maxTotalTokens) {
    throw new AgentBudgetExceededError("total token budget exceeded", budget, usage);
  }
  if (budget.maxEstimatedCostUsd !== undefined && usage.estimatedCostUsd > budget.maxEstimatedCostUsd) {
    throw new AgentBudgetExceededError("cost budget exceeded", budget, usage);
  }
  if (budget.maxRuntimeMs !== undefined && usage.runtimeMs > budget.maxRuntimeMs) {
    throw new AgentBudgetExceededError("runtime budget exceeded", budget, usage);
  }
}

function normalizeTimestamp(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return hash;
}
