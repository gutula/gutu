import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const sourceAsset = join(workspaceRoot, "brand", "gutu-mascot.png");

main();

function main() {
  if (!existsSync(sourceAsset)) {
    throw new Error(`Canonical mascot asset is missing at ${sourceAsset}`);
  }

  const targets = discoverTargets(workspaceRoot);
  for (const repoRoot of targets) {
    const assetsDir = join(repoRoot, "docs", "assets");
    mkdirSync(assetsDir, { recursive: true });
    copyFileSync(sourceAsset, join(assetsDir, "gutu-mascot.png"));
  }

  console.log(`Synced mascot to ${targets.length} repo roots.`);
}

function discoverTargets(root) {
  const directTargets = [
    root,
    join(root, "gutu-core"),
    join(root, "catalogs", "gutu-libraries"),
    join(root, "catalogs", "gutu-plugins"),
    join(root, "integrations", "gutu-ecosystem-integration")
  ];

  const groupedTargets = [
    ...discoverChildren(join(root, "apps")),
    ...discoverChildren(join(root, "libraries")),
    ...discoverChildren(join(root, "plugins"))
  ];

  return [...new Set([...directTargets, ...groupedTargets].filter((entry) => existsSync(entry)))].sort((left, right) =>
    left.localeCompare(right)
  );
}

function discoverChildren(baseDir) {
  if (!existsSync(baseDir)) {
    return [];
  }

  return readdirSync(baseDir)
    .map((entry) => join(baseDir, entry))
    .filter((entry) => statSync(entry).isDirectory())
    .sort((left, right) => left.localeCompare(right));
}
