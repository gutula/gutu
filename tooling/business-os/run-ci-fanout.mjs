import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { businessPackCatalogSpec, businessPluginSpecs } from "./specs.mjs";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const reportRoot = join(workspaceRoot, "integrations", "gutu-ecosystem-integration", "reports");

main();

function main() {
  const startedAt = Date.now();
  const results = [];
  const targets = [
    ...businessPluginSpecs.map((spec) => ({
      id: spec.id,
      label: spec.repoName,
      cwd: join(workspaceRoot, "plugins", spec.repoName)
    })),
    {
      id: "business-pack-catalog",
      label: businessPackCatalogSpec.repoName,
      cwd: join(workspaceRoot, "catalogs", businessPackCatalogSpec.repoName)
    }
  ];

  for (const target of targets) {
    const targetStartedAt = Date.now();
    const executed = spawnSync("bun", ["run", "ci"], {
      cwd: target.cwd,
      encoding: "utf8",
      stdio: "pipe"
    });
    const combinedOutput = [executed.stdout ?? "", executed.stderr ?? ""].filter(Boolean).join("\n").trim();

    results.push({
      id: target.id,
      label: target.label,
      cwd: target.cwd,
      ok: executed.status === 0,
      exitCode: executed.status ?? 1,
      durationMs: Date.now() - targetStartedAt,
      outputTail: tailLines(combinedOutput, 24)
    });
  }

  writeReports({
    generatedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    repoCount: results.length,
    passingCount: results.filter((entry) => entry.ok).length,
    failingCount: results.filter((entry) => !entry.ok).length
  }, results);

  const failures = results.filter((entry) => !entry.ok);
  if (failures.length > 0) {
    console.error("Business repo CI fan-out failed:");
    for (const failure of failures) {
      console.error(`- ${failure.id} (${failure.exitCode})`);
    }
    process.exit(1);
  }

  console.log(
    `Business repo CI fan-out passed for ${results.length} targets: ${results.map((entry) => entry.id).join(", ")}.`
  );
}

function writeReports(summary, results) {
  mkdirSync(reportRoot, { recursive: true });
  writeFileSync(
    join(reportRoot, "business-os-ci.json"),
    `${JSON.stringify({ summary, targets: results }, null, 2)}\n`,
    "utf8"
  );
  writeFileSync(join(reportRoot, "business-os-ci.md"), renderMarkdownReport(summary, results), "utf8");
}

function renderMarkdownReport(summary, results) {
  const lines = [
    "# Business OS Repo CI Fan-out",
    "",
    `Generated at: ${summary.generatedAt}`,
    "",
    `- Passing targets: ${summary.passingCount}/${summary.repoCount}`,
    `- Aggregate duration: ${summary.durationMs} ms`,
    "",
    "## Targets",
    ""
  ];

  for (const target of results) {
    lines.push(`### ${target.label}`);
    lines.push("");
    lines.push(`- ID: \`${target.id}\``);
    lines.push(`- Status: ${target.ok ? "passed" : "failed"}`);
    lines.push(`- Directory: \`${target.cwd}\``);
    lines.push(`- Duration: ${target.durationMs} ms`);
    lines.push(`- Exit code: ${target.exitCode}`);
    lines.push("");
    lines.push("```text");
    lines.push(target.outputTail || "(no output)");
    lines.push("```");
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function tailLines(value, maxLines) {
  if (!value) {
    return "";
  }
  return value.split(/\r?\n/).slice(-maxLines).join("\n");
}
