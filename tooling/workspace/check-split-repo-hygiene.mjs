#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const trackedPrefixes = [
  "apps/gutu-app-",
  "catalogs/gutu-business-packs/",
  "catalogs/gutu-libraries/",
  "catalogs/gutu-plugins/",
  "gutu-core/",
  "integrations/gutu-ecosystem-integration/",
  "libraries/gutu-lib-",
  "plugins/gutu-plugin-",
];

function runGit(args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" });
}

function listStandaloneRoots() {
  const candidates = [
    ...globRoots("apps", "gutu-app-"),
    ...globRoots("catalogs", "gutu-"),
    ...globRoots("libraries", "gutu-lib-"),
    ...globRoots("plugins", "gutu-plugin-"),
    "gutu-core",
    "integrations/gutu-ecosystem-integration",
  ];
  return candidates.filter((entry, index) => candidates.indexOf(entry) === index);
}

function globRoots(parent, prefix) {
  const names = safeList(parent);
  return names
    .filter((name) => name.startsWith(prefix))
    .map((name) => `${parent}/${name}`)
    .filter((entry) => existsSync(path.join(root, entry, ".git")));
}

function safeList(parent) {
  try {
    return execFileSync("bash", ["-lc", `ls -1 ${JSON.stringify(parent)}`], {
      cwd: root,
      encoding: "utf8",
    })
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function listTrackedOffenders() {
  const tracked = runGit(["ls-files", "-z"])
    .split("\0")
    .filter(Boolean);
  return tracked.filter((entry) =>
    trackedPrefixes.some((prefix) => entry.startsWith(prefix)),
  );
}

function listVisibleStandaloneStatus() {
  const status = runGit(["status", "--porcelain", "--ignored=matching", "-z"])
    .split("\0")
    .filter(Boolean);
  const standaloneRoots = listStandaloneRoots();
  return status.filter((entry) => {
    const relative = entry.slice(3);
    return standaloneRoots.some(
      (rootPath) => relative === rootPath || relative.startsWith(`${rootPath}/`),
    );
  });
}

const trackedOffenders = listTrackedOffenders();
const visibleStatus = listVisibleStandaloneStatus();

if (trackedOffenders.length === 0 && visibleStatus.length === 0) {
  console.log("split-repo hygiene ok");
  process.exit(0);
}

if (trackedOffenders.length > 0) {
  console.error("Tracked nested repo paths still exist in the umbrella root index:");
  for (const entry of trackedOffenders.slice(0, 40)) {
    console.error(`- ${entry}`);
  }
  if (trackedOffenders.length > 40) {
    console.error(`- ... ${trackedOffenders.length - 40} more`);
  }
}

if (visibleStatus.length > 0) {
  console.error("Nested standalone repos still surface in root status:");
  for (const entry of visibleStatus.slice(0, 40)) {
    console.error(`- ${entry}`);
  }
  if (visibleStatus.length > 40) {
    console.error(`- ... ${visibleStatus.length - 40} more`);
  }
}

process.exit(1);
