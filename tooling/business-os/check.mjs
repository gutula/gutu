import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { createContractRegistry, previewPackInstall } from "../../gutu-core/framework/core/business-runtime/src/index.ts";

import {
  businessContractScenarios,
  businessEndToEndScenarios,
  businessGoalRequiredHeadings,
  businessPackCatalogSpec,
  businessPackSpecs,
  businessPluginSpecs,
  businessWorkspaceRepoPaths,
  businessTodoRequiredHeadings
} from "./specs.mjs";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const failures = [];
const jsonOutput = process.argv.includes("--json");
const verification = {
  businessRuntime: {
    packageRoot: "gutu-core/framework/core/business-runtime",
    ok: true,
    checkedFiles: []
  },
  packCatalog: {
    repoRoot: `catalogs/${businessPackCatalogSpec.repoName}`,
    ok: true,
    packs: []
  },
  packages: [],
  packs: [],
  lifecycleScenarios: [],
  contractScenarios: [],
  contractReport: null,
  summary: {
    pluginRepoCount: businessPluginSpecs.length,
    packCount: businessPackSpecs.length,
    lifecycleScenarioCount: 0,
    endToEndScenarioCount: businessEndToEndScenarios.length,
    recoveryScenarioCount: 0,
    contractScenarioCount: 0,
    ownedEntityCount: 0,
    reportCount: 0,
    exceptionQueueCount: 0,
    operationalScenarioCount: 0
  }
};

checkWorkspaceDoc(
  join(workspaceRoot, "Business Plugin Goal.md"),
  businessGoalRequiredHeadings,
  "Business Plugin Goal.md"
);
checkWorkspaceDoc(
  join(workspaceRoot, "Business Plugin TODO.md"),
  businessTodoRequiredHeadings,
  "Business Plugin TODO.md"
);

const workspaceReposPath = join(workspaceRoot, "WORKSPACE_REPOS.md");
if (!existsSync(workspaceReposPath)) {
  failures.push("WORKSPACE_REPOS.md is missing.");
} else {
  const workspaceRepos = readFileSync(workspaceReposPath, "utf8");
  for (const repoPath of businessWorkspaceRepoPaths) {
    if (!workspaceRepos.includes(`\`${repoPath}\``)) {
      failures.push(`WORKSPACE_REPOS.md is missing ${repoPath}.`);
    }
  }
}

for (const spec of businessPluginSpecs) {
  const repoRoot = join(workspaceRoot, "plugins", spec.repoName);
  const packageRoot = join(repoRoot, "framework", "builtin-plugins", spec.packageDir);
  const packRoot = join(packageRoot, "packs", `${spec.packageDir}-${spec.packType}`);
  const requiredRootFiles = [
    "package.json",
    "README.md",
    "DEVELOPER.md",
    "TODO.md",
    "SECURITY.md",
    "CONTRIBUTING.md",
    "docs/assets/gutu-mascot.png"
  ];
  const requiredPackageFiles = [
    "package.json",
    "package.ts",
    "src/index.ts",
    "src/actions/default.action.ts",
    "src/domain/catalog.ts",
    "src/exceptions/catalog.ts",
    "src/flows/catalog.ts",
    "src/resources/main.resource.ts",
    "src/reports/catalog.ts",
    "src/scenarios/catalog.ts",
    "src/services/main.service.ts",
    "src/settings/catalog.ts",
    "src/jobs/catalog.ts",
    "src/workflows/catalog.ts",
    "src/postgres.ts",
    "src/sqlite.ts",
    "db/schema.ts",
    "tests/unit/package.test.ts",
    "tests/contracts/ui-surface.test.ts",
    "tests/integration/lifecycle.test.ts",
    "tests/migrations/postgres.test.ts",
    "tests/migrations/sqlite.test.ts",
    "docs/AGENT_CONTEXT.md",
    "docs/BUSINESS_RULES.md",
    "docs/EDGE_CASES.md",
    "docs/FLOWS.md",
    "docs/GLOSSARY.md",
    "docs/MANDATORY_STEPS.md"
  ];
  const requiredPackFiles = [
    "pack.json",
    "dependencies.json",
    "signatures.json",
    "objects/settings/defaults.json",
    "objects/reports/overview.json",
    "objects/automations/reconciliation.json",
    `objects/workflows/${spec.workflow.id}.json`,
    "tests/validation.json"
  ];

  for (const relativePath of requiredRootFiles) {
    if (!existsSync(join(repoRoot, relativePath))) {
      failures.push(`${spec.repoName}: missing ${relativePath}`);
    }
  }
  for (const relativePath of requiredPackageFiles) {
    if (!existsSync(join(packageRoot, relativePath))) {
      failures.push(`${spec.repoName}: missing framework/builtin-plugins/${spec.packageDir}/${relativePath}`);
    }
  }
  const servicePath = join(packageRoot, "src", "services", "main.service.ts");
  if (existsSync(servicePath)) {
    const serviceSource = readFileSync(servicePath, "utf8");
    if (serviceSource.includes("loadJsonState(") || serviceSource.includes("updateJsonState(")) {
      failures.push(`${spec.repoName}: service layer still depends on JSON state helpers.`);
    }
    if (!serviceSource.includes("createBusinessDomainStateStore(")) {
      failures.push(`${spec.repoName}: service layer is missing shared SQL-backed business state store wiring.`);
    }
  }
  for (const relativePath of requiredPackFiles) {
    if (!existsSync(join(packRoot, relativePath))) {
      failures.push(`${spec.repoName}: missing framework/builtin-plugins/${spec.packageDir}/packs/${spec.packageDir}-${spec.packType}/${relativePath}`);
    }
  }
}

const packCatalogRoot = join(workspaceRoot, "catalogs", businessPackCatalogSpec.repoName);
const requiredPackCatalogFiles = [
  "package.json",
  "README.md",
  "DEVELOPER.md",
  "TODO.md",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "scripts/validate-pack-catalog.mjs",
  "scripts/sign-pack-catalog.mjs",
  "scripts/promote-pack-channel.mjs",
  "catalog/index.json",
  "channels/next.json",
  "channels/stable.json",
  "docs/assets/gutu-mascot.png"
];
for (const relativePath of requiredPackCatalogFiles) {
  const absolutePath = join(packCatalogRoot, relativePath);
  if (!existsSync(absolutePath)) {
    verification.packCatalog.ok = false;
    failures.push(`business-pack-catalog: missing catalogs/${businessPackCatalogSpec.repoName}/${relativePath}`);
  }
}

for (const spec of businessPackSpecs) {
  const packRoot = join(packCatalogRoot, "packs", spec.id);
  const requiredPackFiles = [
    "README.md",
    "package.ts",
    "pack.json",
    "dependencies.json",
    "signatures.json",
    "objects/settings/defaults.json",
    "objects/workflows/default.json",
    "objects/dashboards/overview.json",
    "objects/reports/overview.json",
    "objects/automations/default.json",
    "tests/validation.json"
  ];

  for (const relativePath of requiredPackFiles) {
    if (!existsSync(join(packRoot, relativePath))) {
      verification.packCatalog.ok = false;
      failures.push(`business-pack-catalog: missing packs/${spec.id}/${relativePath}`);
    }
  }
}

const businessRuntimeRoot = join(workspaceRoot, "gutu-core", "framework", "core", "business-runtime");
const requiredBusinessRuntimeFiles = [
  "package.json",
  "tsconfig.json",
  "src/index.ts",
  "src/postgres.ts",
  "src/sqlite.ts",
  "tests/unit/package.test.ts",
  "tests/unit/postgres.test.ts",
  "tests/unit/sqlite.test.ts"
];
for (const relativePath of requiredBusinessRuntimeFiles) {
  const absolutePath = join(businessRuntimeRoot, relativePath);
  verification.businessRuntime.checkedFiles.push(relativePath);
  if (!existsSync(absolutePath)) {
    verification.businessRuntime.ok = false;
    failures.push(`business-runtime: missing gutu-core/framework/core/business-runtime/${relativePath}`);
  }
}

const registry = createContractRegistry();
const loadedPackageManifests = new Map();
const pluginsRoot = join(workspaceRoot, "plugins");
if (existsSync(pluginsRoot)) {
  for (const repoName of readdirSync(pluginsRoot)) {
    const nestedRoot = join(pluginsRoot, repoName, "framework", "builtin-plugins");
    if (!existsSync(nestedRoot)) {
      continue;
    }
    for (const packageDir of readdirSync(nestedRoot)) {
      const packageManifestPath = join(nestedRoot, packageDir, "package.ts");
      if (!existsSync(packageManifestPath)) {
        continue;
      }
      const manifestModule = await import(`${pathToFileURL(packageManifestPath).href}?t=${Date.now()}:${repoName}:${packageDir}`);
      loadedPackageManifests.set(packageManifestPath, manifestModule.default);
      registry.registerPackage(manifestModule.default);
    }
  }
}

for (const spec of businessPackSpecs) {
  const packageManifestPath = join(packCatalogRoot, "packs", spec.id, "package.ts");
  if (!existsSync(packageManifestPath)) {
    continue;
  }

  const manifestModule = await import(`${pathToFileURL(packageManifestPath).href}?t=${Date.now()}:pack:${spec.id}`);
  loadedPackageManifests.set(packageManifestPath, manifestModule.default);
  registry.registerPackage(manifestModule.default);
}

for (const spec of businessPluginSpecs) {
  const repoRoot = join(workspaceRoot, "plugins", spec.repoName);
  const packageRoot = join(repoRoot, "framework", "builtin-plugins", spec.packageDir);
  const packRoot = join(packageRoot, "packs", `${spec.packageDir}-${spec.packType}`);
  const packageManifestPath = join(packageRoot, "package.ts");
  const packageManifest = loadedPackageManifests.get(packageManifestPath);
  const manifestDomainCatalog = packageManifest.domainCatalog ?? {};
  verification.packages.push({
    repoName: spec.repoName,
    packageId: packageManifest.id,
    version: packageManifest.version,
    providesCapabilities: packageManifest.providesCapabilities.length,
    ownsData: packageManifest.ownsData.length,
    ownedEntities: manifestDomainCatalog.ownedEntities?.length ?? 0,
    reports: manifestDomainCatalog.reports?.length ?? 0,
    exceptionQueues: manifestDomainCatalog.exceptionQueues?.length ?? 0,
    operationalScenarios: manifestDomainCatalog.operationalScenarios?.length ?? 0
  });
  verification.summary.ownedEntityCount += manifestDomainCatalog.ownedEntities?.length ?? 0;
  verification.summary.reportCount += manifestDomainCatalog.reports?.length ?? 0;
  verification.summary.exceptionQueueCount += manifestDomainCatalog.exceptionQueues?.length ?? 0;
  verification.summary.operationalScenarioCount += manifestDomainCatalog.operationalScenarios?.length ?? 0;
  if ((manifestDomainCatalog.ownedEntities?.length ?? 0) === 0) {
    failures.push(`${spec.repoName}: package manifest is missing owned entity parity metadata.`);
  }
  if ((manifestDomainCatalog.reports?.length ?? 0) === 0) {
    failures.push(`${spec.repoName}: package manifest is missing report parity metadata.`);
  }
  if ((manifestDomainCatalog.exceptionQueues?.length ?? 0) === 0) {
    failures.push(`${spec.repoName}: package manifest is missing exception queue parity metadata.`);
  }
  if ((manifestDomainCatalog.operationalScenarios?.length ?? 0) === 0) {
    failures.push(`${spec.repoName}: package manifest is missing operational scenario parity metadata.`);
  }

  const packManifest = JSON.parse(readFileSync(join(packRoot, "pack.json"), "utf8"));
  registry.registerPack(packManifest);
  const packObjects = [
    {
      type: "settings",
      logicalKey: `${spec.packageDir}.defaults`,
      dependencyRefs: [],
      payload: JSON.parse(readFileSync(join(packRoot, "objects", "settings", "defaults.json"), "utf8"))
    },
    {
      type: "workflows",
      logicalKey: spec.workflow.id,
      dependencyRefs: [],
      payload: JSON.parse(readFileSync(join(packRoot, "objects", "workflows", `${spec.workflow.id}.json`), "utf8"))
    },
    {
      type: "reports",
      logicalKey: `${spec.packageDir}.overview`,
      dependencyRefs: [],
      payload: JSON.parse(readFileSync(join(packRoot, "objects", "reports", "overview.json"), "utf8"))
    },
    {
      type: "automations",
      logicalKey: `${spec.packageDir}.reconciliation`,
      dependencyRefs: [],
      payload: JSON.parse(readFileSync(join(packRoot, "objects", "automations", "reconciliation.json"), "utf8"))
    }
  ];
  const preview = previewPackInstall({
    manifest: packManifest,
    objects: packObjects
  });
  verification.packs.push({
    repoName: spec.repoName,
    packName: packManifest.name,
    version: packManifest.version,
    preview
  });
  if (preview.blocked > 0) {
    failures.push(`${spec.repoName}: pack preview blocked ${preview.blocked} object(s).`);
  }
}

for (const spec of businessPackSpecs) {
  const packRoot = join(packCatalogRoot, "packs", spec.id);
  const packageManifestPath = join(packRoot, "package.ts");
  const packageManifest = loadedPackageManifests.get(packageManifestPath);
  const packManifest = JSON.parse(readFileSync(join(packRoot, "pack.json"), "utf8"));
  registry.registerPack(packManifest);
  const packObjects = [
    {
      type: "settings",
      logicalKey: `${spec.id}.defaults`,
      dependencyRefs: [],
      payload: JSON.parse(readFileSync(join(packRoot, "objects", "settings", "defaults.json"), "utf8"))
    },
    {
      type: "workflows",
      logicalKey: `${spec.id}.workflow`,
      dependencyRefs: [],
      payload: JSON.parse(readFileSync(join(packRoot, "objects", "workflows", "default.json"), "utf8"))
    },
    {
      type: "dashboards",
      logicalKey: `${spec.id}.overview`,
      dependencyRefs: [],
      payload: JSON.parse(readFileSync(join(packRoot, "objects", "dashboards", "overview.json"), "utf8"))
    },
    {
      type: "reports",
      logicalKey: `${spec.id}.reports`,
      dependencyRefs: [],
      payload: JSON.parse(readFileSync(join(packRoot, "objects", "reports", "overview.json"), "utf8"))
    },
    {
      type: "automations",
      logicalKey: `${spec.id}.automation`,
      dependencyRefs: [],
      payload: JSON.parse(readFileSync(join(packRoot, "objects", "automations", "default.json"), "utf8"))
    }
  ];
  const preview = previewPackInstall({
    manifest: packManifest,
    objects: packObjects
  });

  verification.packCatalog.packs.push({
    packId: packageManifest?.id ?? spec.id,
    packName: packManifest.name,
    version: packManifest.version,
    preview
  });
  if (preview.blocked > 0) {
    failures.push(`business-pack-catalog: pack preview blocked ${preview.blocked} object(s) for ${spec.id}.`);
  }
}

verification.contractReport = registry.evaluate({
  platformVersion: "0.1.0"
});
if (!verification.contractReport.ok) {
  for (const finding of verification.contractReport.findings.filter((entry) => entry.severity === "error")) {
    failures.push(`contract-registry: ${finding.subject} -> ${finding.message}`);
  }
}

for (const spec of businessPluginSpecs) {
  const scenario = await runLifecycleScenario(spec);
  verification.lifecycleScenarios.push(scenario);
  if (!scenario.ok) {
    failures.push(`${spec.repoName}: scenario verification failed - ${scenario.error}`);
  }
}

for (const scenarioSpec of businessContractScenarios) {
  const scenario = await runContractScenario(scenarioSpec, loadedPackageManifests);
  verification.contractScenarios.push(scenario);
  if (!scenario.ok) {
    failures.push(`contract-scenario ${scenarioSpec.id} failed - ${scenario.error}`);
  }
}

verification.summary.lifecycleScenarioCount = verification.lifecycleScenarios.length;
verification.summary.recoveryScenarioCount = verification.lifecycleScenarios.filter((entry) => entry.ok).length;
verification.summary.contractScenarioCount = verification.contractScenarios.length;

if (failures.length > 0) {
  if (jsonOutput) {
    console.log(
      JSON.stringify(
        {
          ok: false,
          failures,
          verification
        },
        null,
        2
      )
    );
  } else {
    console.error("Business OS check failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
  }
  process.exitCode = 1;
} else {
  if (jsonOutput) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          verification
        },
        null,
        2
      )
    );
  } else {
    console.log(
      `Business OS check passed for ${businessPluginSpecs.length} plugin repos, ${businessPackSpecs.length} packs, ${verification.summary.lifecycleScenarioCount} lifecycle scenarios, ${verification.summary.endToEndScenarioCount} named end-to-end scenarios, ${businessContractScenarios.length} direct contract scenarios, ${verification.summary.ownedEntityCount} owned entities, ${verification.summary.reportCount} reports, and ${verification.summary.exceptionQueueCount} exception queues.`
    );
  }
}

function checkWorkspaceDoc(path, headings, label) {
  if (!existsSync(path)) {
    failures.push(`${label} is missing.`);
    return;
  }

  const content = readFileSync(path, "utf8");
  for (const heading of headings) {
    if (!content.includes(heading)) {
      failures.push(`${label} is missing heading '${heading}'.`);
    }
  }
}

async function runLifecycleScenario(spec) {
  const stateDir = mkdtempSync(join(tmpdir(), `${spec.id}-scenario-`));
  const previousStateDir = process.env.GUTU_STATE_DIR;

  try {
    process.env.GUTU_STATE_DIR = stateDir;
    const serviceModulePath = join(
      workspaceRoot,
      "plugins",
      spec.repoName,
      "framework",
      "builtin-plugins",
      spec.packageDir,
      "src",
      "services",
      "main.service.ts"
    );
    const service = await import(`${pathToFileURL(serviceModulePath).href}?scenario=${Date.now()}:${spec.id}`);
    const recordId = `${spec.id}:scenario`;

    await service.createPrimaryRecord({
      tenantId: "tenant_business_check",
      actorId: "actor_checker",
      recordId,
      title: `${spec.displayName} Verification`,
      counterpartyId: "party_checker",
      companyId: "company_checker",
      branchId: "branch_checker",
      amountMinor: 5_000,
      currencyCode: "USD",
      effectiveAt: "2026-04-23T00:00:00.000Z",
      correlationId: `${spec.id}:corr`,
      processId: `${spec.workflow.id}:scenario`
    });

    const advanced = await service.advancePrimaryRecord({
      tenantId: "tenant_business_check",
      actorId: "actor_checker",
      recordId,
      expectedRevisionNo: 1,
      approvalState: "approved",
      postingState: "posted",
      fulfillmentState: "partial",
      downstreamRef: "downstream:verify"
    });
    if (advanced.revisionNo !== 2) {
      throw new Error(`expected revision 2 after advance, received ${advanced.revisionNo}`);
    }

    const pendingAfterAdvance = await service.listPendingDownstreamItems();
    if (pendingAfterAdvance.length === 0) {
      throw new Error("expected at least one pending downstream item after advance");
    }

    const failed = await service.failPendingDownstreamItem({
      tenantId: "tenant_business_check",
      actorId: "actor_checker",
      inboxId: pendingAfterAdvance[0]?.id,
      error: "simulated-downstream-outage",
      maxAttempts: 1
    });
    if (failed.status !== "dead-letter") {
      throw new Error(`expected dead-letter status, received '${failed.status}'`);
    }

    const deadLetters = await service.listDeadLetters();
    if (deadLetters.length !== 1) {
      throw new Error(`expected 1 dead letter, received ${deadLetters.length}`);
    }

    await service.replayDeadLetter({
      tenantId: "tenant_business_check",
      actorId: "actor_checker",
      deadLetterId: deadLetters[0]?.id
    });

    const reconciled = await service.reconcilePrimaryRecord({
      tenantId: "tenant_business_check",
      actorId: "actor_checker",
      recordId,
      exceptionId: `${spec.id}:scenario-exception`,
      expectedRevisionNo: 2,
      severity: "medium",
      reasonCode: "business-check",
      downstreamRef: "repair:verify"
    });
    if (reconciled.revisionNo !== 3) {
      throw new Error(`expected revision 3 after reconcile, received ${reconciled.revisionNo}`);
    }

    for (const item of await service.listPendingDownstreamItems()) {
      await service.resolvePendingDownstreamItem({
        tenantId: "tenant_business_check",
        actorId: "actor_checker",
        inboxId: item.id,
        resolutionRef: `resolved:${item.target}`
      });
    }

    const overview = await service.getBusinessOverview();
    const projections = await service.listProjectionRecords();
    const remainingPending = await service.listPendingDownstreamItems();

    if (overview.totals.openExceptions !== 0) {
      throw new Error(`expected 0 open exceptions after downstream resolution, received ${overview.totals.openExceptions}`);
    }
    if (remainingPending.length !== 0) {
      throw new Error(`expected 0 pending downstream items, received ${remainingPending.length}`);
    }
    if (overview.orchestration.deadLetters !== 0) {
      throw new Error(`expected 0 dead letters after replay and resolution, received ${overview.orchestration.deadLetters}`);
    }
    if (projections.length < 3) {
      throw new Error(`expected at least 3 projection records, received ${projections.length}`);
    }

    return {
      repoName: spec.repoName,
      ok: true,
      pendingAfterAdvance: pendingAfterAdvance.length,
      projections: projections.length,
      processedInbox: overview.orchestration.inbox.processed,
      lastRevision: reconciled.revisionNo
    };
  } catch (error) {
    return {
      repoName: spec.repoName,
      ok: false,
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

async function runContractScenario(scenarioSpec, loadedPackageManifests) {
  const spec = businessPluginSpecs.find((entry) => entry.id === scenarioSpec.sourcePluginId);
  if (!spec) {
    return {
      id: scenarioSpec.id,
      ok: false,
      error: `Unknown source plugin '${scenarioSpec.sourcePluginId}'.`
    };
  }

  const stateDir = mkdtempSync(join(tmpdir(), `${scenarioSpec.id}-scenario-`));
  const previousStateDir = process.env.GUTU_STATE_DIR;

  try {
    process.env.GUTU_STATE_DIR = stateDir;
    const serviceModulePath = join(
      workspaceRoot,
      "plugins",
      spec.repoName,
      "framework",
      "builtin-plugins",
      spec.packageDir,
      "src",
      "services",
      "main.service.ts"
    );
    const service = await import(`${pathToFileURL(serviceModulePath).href}?contract=${Date.now()}:${scenarioSpec.id}`);
    const recordId = `${spec.id}:${scenarioSpec.id}`;

    await service.createPrimaryRecord({
      tenantId: "tenant_contract_check",
      actorId: "actor_contract_checker",
      recordId,
      title: `${spec.displayName} Contract Verification`,
      counterpartyId: "party_contract_checker",
      companyId: "company_contract_checker",
      branchId: "branch_contract_checker",
      amountMinor: 7_500,
      currencyCode: "USD",
      effectiveAt: "2026-04-23T00:00:00.000Z",
      correlationId: `${scenarioSpec.id}:corr`,
      processId: `${spec.workflow.id}:contract`
    });

    let pendingTargets = [];

    if (scenarioSpec.operation === "advance") {
      await service.advancePrimaryRecord({
        tenantId: "tenant_contract_check",
        actorId: "actor_contract_checker",
        recordId,
        expectedRevisionNo: 1,
        approvalState: "approved",
        postingState: "posted",
        fulfillmentState: "partial",
        downstreamRef: `${scenarioSpec.id}:downstream`
      });
      pendingTargets = (await service.listPendingDownstreamItems()).map((entry) => entry.target);
    } else {
      await service.advancePrimaryRecord({
        tenantId: "tenant_contract_check",
        actorId: "actor_contract_checker",
        recordId,
        expectedRevisionNo: 1,
        approvalState: "approved",
        postingState: "posted",
        fulfillmentState: "partial",
        downstreamRef: `${scenarioSpec.id}:prepared`
      });
      for (const item of await service.listPendingDownstreamItems()) {
        await service.resolvePendingDownstreamItem({
          tenantId: "tenant_contract_check",
          actorId: "actor_contract_checker",
          inboxId: item.id,
          resolutionRef: `resolved:${item.target}`
        });
      }
      await service.reconcilePrimaryRecord({
        tenantId: "tenant_contract_check",
        actorId: "actor_contract_checker",
        recordId,
        exceptionId: `${scenarioSpec.id}:exception`,
        expectedRevisionNo: 2,
        severity: "medium",
        reasonCode: scenarioSpec.id,
        downstreamRef: `${scenarioSpec.id}:reconcile`
      });
      pendingTargets = (await service.listPendingDownstreamItems()).map((entry) => entry.target);
    }

    const sortedActual = [...new Set(pendingTargets)].sort((left, right) => left.localeCompare(right));
    const sortedExpected = [...scenarioSpec.expectedTargets].sort((left, right) => left.localeCompare(right));
    if (JSON.stringify(sortedActual) !== JSON.stringify(sortedExpected)) {
      throw new Error(`expected targets ${sortedExpected.join(", ")} but received ${sortedActual.join(", ")}`);
    }

    const missingCommands = sortedExpected.filter((target) => !findCommandOwner(target, loadedPackageManifests));
    if (missingCommands.length > 0) {
      throw new Error(`missing command owners for ${missingCommands.join(", ")}`);
    }

    return {
      id: scenarioSpec.id,
      ok: true,
      sourcePluginId: spec.id,
      operation: scenarioSpec.operation,
      expectedTargets: sortedExpected,
      actualTargets: sortedActual,
      commandOwners: sortedExpected.map((target) => ({
        target,
        packageId: findCommandOwner(target, loadedPackageManifests)
      }))
    };
  } catch (error) {
    return {
      id: scenarioSpec.id,
      ok: false,
      sourcePluginId: spec.id,
      operation: scenarioSpec.operation,
      expectedTargets: scenarioSpec.expectedTargets,
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

function findCommandOwner(commandId, loadedPackageManifests) {
  for (const manifest of loadedPackageManifests.values()) {
    if (manifest.publicCommands.includes(commandId)) {
      return manifest.id;
    }
  }
  return null;
}
