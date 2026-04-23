import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { businessEndToEndScenarios, businessPluginSpecs } from "./specs.mjs";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const pluginSpecById = new Map(businessPluginSpecs.map((spec) => [spec.id, spec]));
const reportRoot = join(workspaceRoot, "integrations", "gutu-ecosystem-integration", "reports");

await main();

async function main() {
  const results = [];

  for (const scenario of businessEndToEndScenarios) {
    results.push(await runScenario(scenario));
  }

  writeReports(results);

  const failures = results.filter((entry) => !entry.ok);
  if (failures.length > 0) {
    console.error("Business end-to-end flows failed:");
    for (const failure of failures) {
      console.error(`- ${failure.id}: ${failure.error}`);
    }
    process.exit(1);
  }

  console.log(
    `Business end-to-end flows passed for ${results.length} named scenarios: ${results
      .map((entry) => entry.id)
      .join(", ")}.`
  );
}

async function runScenario(scenario) {
  const stateDir = mkdtempSync(join(tmpdir(), `${scenario.id}-e2e-`));
  const previousStateDir = process.env.GUTU_STATE_DIR;
  const tenantId = `tenant-${scenario.id}`;
  const actorId = `actor-${scenario.id}`;
  const moduleCache = new Map();
  const startedAt = Date.now();

  try {
    process.env.GUTU_STATE_DIR = stateDir;

    for (const step of scenario.steps) {
      if (step.type === "action") {
        const pluginModule = await loadPluginModule(step.pluginId, moduleCache, scenario.id);
        const flowDefinition = pluginModule.businessFlowDefinitions.find((entry) => entry.id === step.actionId);
        if (!flowDefinition) {
          throw new Error(`Missing flow definition for action '${step.actionId}'.`);
        }
        const handler = pluginModule[flowDefinition.methodName];
        if (typeof handler !== "function") {
          throw new Error(`Missing flow handler '${flowDefinition.methodName}' for '${step.actionId}'.`);
        }

        if (step.phase === "create") {
          await handler(
            buildCreateInput({
              scenario,
              step,
              tenantId,
              actorId
            })
          );
          continue;
        }

        if (step.phase === "advance") {
          await handler(
            buildAdvanceInput({
              scenario,
              step,
              tenantId,
              actorId
            })
          );
          continue;
        }

        if (step.phase === "reconcile") {
          await handler(
            buildReconcileInput({
              scenario,
              step,
              tenantId,
              actorId
            })
          );
          continue;
        }

        throw new Error(`Unsupported action phase '${step.phase}'.`);
      }

      if (step.type === "resolve") {
        const pluginModule = await loadPluginModule(step.pluginId, moduleCache, scenario.id);
        const pending = (await pluginModule.listPendingDownstreamItems()).filter((entry) => entry.tenantId === tenantId);

        for (const target of step.targets) {
          const matchingItems = pending.filter((entry) => entry.target === target);
          if (matchingItems.length === 0) {
            throw new Error(`Scenario '${scenario.id}' could not find pending target '${target}' in '${step.pluginId}'.`);
          }

          for (const pendingItem of matchingItems) {
            await pluginModule.resolvePendingDownstreamItem({
              tenantId,
              actorId,
              inboxId: pendingItem.id,
              resolutionRef: `${step.resolutionPrefix}:${sanitizeTarget(target)}`
            });
          }
        }

        continue;
      }

      throw new Error(`Unsupported step type '${step.type}'.`);
    }

    const pluginSummaries = [];
    for (const pluginId of scenario.pluginIds) {
      const pluginModule = await loadPluginModule(pluginId, moduleCache, scenario.id);
      const pending = (await pluginModule.listPendingDownstreamItems()).filter((entry) => entry.tenantId === tenantId);
      if (pending.length > 0) {
        throw new Error(`Scenario '${scenario.id}' left ${pending.length} pending downstream item(s) in '${pluginId}'.`);
      }

      const overview = await pluginModule.getBusinessOverview();
      pluginSummaries.push({
        pluginId,
        primaryRecords: overview.totals.primaryRecords,
        secondaryRecords: overview.totals.secondaryRecords,
        openExceptions: overview.totals.openExceptions
      });
    }

    return {
      id: scenario.id,
      ok: true,
      label: scenario.label,
      pluginIds: [...scenario.pluginIds],
      stepCount: scenario.steps.length,
      durationMs: Date.now() - startedAt,
      pluginSummaries
    };
  } catch (error) {
    return {
      id: scenario.id,
      ok: false,
      label: scenario.label,
      pluginIds: [...scenario.pluginIds],
      stepCount: scenario.steps.length,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error)
    };
  } finally {
    if (previousStateDir === undefined) {
      delete process.env.GUTU_STATE_DIR;
    } else {
      process.env.GUTU_STATE_DIR = previousStateDir;
    }
    rmSync(stateDir, { recursive: true, force: true });
  }
}

async function loadPluginModule(pluginId, moduleCache, scenarioId) {
  if (moduleCache.has(pluginId)) {
    return moduleCache.get(pluginId);
  }

  const spec = pluginSpecById.get(pluginId);
  if (!spec) {
    throw new Error(`Unknown plugin '${pluginId}'.`);
  }

  const modulePath = join(
    workspaceRoot,
    "plugins",
    spec.repoName,
    "framework",
    "builtin-plugins",
    spec.packageDir,
    "src",
    "index.ts"
  );
  const imported = await import(`${pathToFileURL(modulePath).href}?e2e=${scenarioId}:${pluginId}:${Date.now()}`);
  moduleCache.set(pluginId, imported);
  return imported;
}

function buildCreateInput({ scenario, step, tenantId, actorId }) {
  return {
    tenantId,
    actorId,
    recordId: step.recordId,
    title: `${scenario.label} ${step.actionId}`,
    counterpartyId: `party-${scenario.id}`,
    companyId: "company-primary",
    branchId: "branch-main",
    amountMinor: step.amountMinor ?? 100_000,
    currencyCode: step.currencyCode ?? "USD",
    effectiveAt: "2026-04-23T00:00:00.000Z",
    correlationId: `${scenario.id}:${step.recordId}`,
    processId: `${scenario.id}:${step.pluginId}`
  };
}

function buildAdvanceInput({ scenario, step, tenantId, actorId }) {
  return {
    tenantId,
    actorId,
    recordId: step.recordId,
    expectedRevisionNo: step.expectedRevisionNo,
    recordState: step.recordState ?? "active",
    approvalState: step.approvalState ?? "approved",
    postingState: step.postingState ?? "unposted",
    fulfillmentState: step.fulfillmentState ?? "partial",
    downstreamRef: step.downstreamRef ?? `${scenario.id}:${sanitizeTarget(step.actionId)}`,
    reasonCode: step.reasonCode
  };
}

function buildReconcileInput({ scenario, step, tenantId, actorId }) {
  return {
    tenantId,
    actorId,
    recordId: step.recordId,
    exceptionId: step.exceptionId,
    expectedRevisionNo: step.expectedRevisionNo,
    severity: step.severity ?? "medium",
    reasonCode: step.reasonCode,
    downstreamRef: step.downstreamRef ?? `${scenario.id}:${sanitizeTarget(step.actionId)}`
  };
}

function sanitizeTarget(value) {
  return value.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
}

function writeReports(results) {
  mkdirSync(reportRoot, { recursive: true });
  const generatedAt = new Date().toISOString();
  const summary = {
    generatedAt,
    scenarioCount: results.length,
    passingCount: results.filter((entry) => entry.ok).length,
    failingCount: results.filter((entry) => !entry.ok).length,
    totalStepCount: results.reduce((total, entry) => total + entry.stepCount, 0),
    totalDurationMs: results.reduce((total, entry) => total + entry.durationMs, 0)
  };

  writeFileSync(
    join(reportRoot, "business-os-flows.json"),
    `${JSON.stringify({ summary, scenarios: results }, null, 2)}\n`,
    "utf8"
  );
  writeFileSync(join(reportRoot, "business-os-flows.md"), renderMarkdownReport(summary, results), "utf8");
}

function renderMarkdownReport(summary, results) {
  const lines = [
    "# Business OS End-to-End Flows",
    "",
    `Generated at: ${summary.generatedAt}`,
    "",
    `- Passing scenarios: ${summary.passingCount}/${summary.scenarioCount}`,
    `- Total steps: ${summary.totalStepCount}`,
    `- Aggregate duration: ${summary.totalDurationMs} ms`,
    "",
    "## Scenarios",
    ""
  ];

  for (const scenario of results) {
    lines.push(`### ${scenario.label}`);
    lines.push("");
    lines.push(`- ID: \`${scenario.id}\``);
    lines.push(`- Status: ${scenario.ok ? "passed" : "failed"}`);
    lines.push(`- Plugins: ${scenario.pluginIds.map((entry) => `\`${entry}\``).join(", ")}`);
    lines.push(`- Steps: ${scenario.stepCount}`);
    lines.push(`- Duration: ${scenario.durationMs} ms`);
    if (!scenario.ok) {
      lines.push(`- Error: ${scenario.error}`);
    }
    if (scenario.ok) {
      lines.push("- Plugin summaries:");
      for (const plugin of scenario.pluginSummaries) {
        lines.push(
          `  - \`${plugin.pluginId}\`: primary=${plugin.primaryRecords}, secondary=${plugin.secondaryRecords}, openExceptions=${plugin.openExceptions}`
        );
      }
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}
