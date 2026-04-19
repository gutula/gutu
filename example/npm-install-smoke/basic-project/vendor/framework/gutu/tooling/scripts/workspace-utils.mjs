import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import path from "node:path";

export const rootDir = process.cwd();
export const BUN_BIN = process.env.BUN_BIN || process.execPath || "bun";
export const fallbackWorkspacePatterns = [
  "apps/*",
  path.join("framework", "core", "*"),
  path.join("framework", "libraries", "*"),
  path.join("framework", "builtin-plugins", "*"),
  "plugins/*",
  "libraries/*",
  "tooling/*"
];

export function getWorkspacePackageDirs(root = rootDir) {
  const packageDirs = new Set();

  for (const workspacePattern of getWorkspacePatterns(root)) {
    for (const packageDir of expandWorkspacePattern(root, workspacePattern)) {
      packageDirs.add(packageDir);
    }
  }

  return [...packageDirs].sort((left, right) => left.localeCompare(right));
}

export function getWorkspacePatterns(root = rootDir) {
  const packageJsonPath = path.join(root, "package.json");
  if (!existsSync(packageJsonPath)) {
    return [...fallbackWorkspacePatterns];
  }

  const packageJson = readJson(packageJsonPath);
  if (Array.isArray(packageJson.workspaces) && packageJson.workspaces.every((entry) => typeof entry === "string")) {
    return packageJson.workspaces;
  }

  return [...fallbackWorkspacePatterns];
}

export function expandWorkspacePattern(root, workspacePattern) {
  const normalizedPattern = workspacePattern.replace(/\/+$/, "");

  if (normalizedPattern.endsWith("/*")) {
    const parentPath = path.join(root, normalizedPattern.slice(0, -2));
    if (!existsSync(parentPath)) {
      return [];
    }

    const packageDirs = [];
    for (const entry of readdirSync(parentPath)) {
      const absoluteEntry = path.join(parentPath, entry);
      if (!statSync(absoluteEntry).isDirectory()) {
        continue;
      }

      if (existsSync(path.join(absoluteEntry, "package.json"))) {
        packageDirs.push(absoluteEntry);
      }
    }

    return packageDirs;
  }

  const absolutePath = path.join(root, normalizedPattern);
  if (existsSync(path.join(absolutePath, "package.json"))) {
    return [absolutePath];
  }

  return [];
}

export function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function ensureDir(directoryPath) {
  mkdirSync(directoryPath, { recursive: true });
  return directoryPath;
}

export function cleanDir(directoryPath) {
  rmSync(directoryPath, { force: true, recursive: true });
  mkdirSync(directoryPath, { recursive: true });
  return directoryPath;
}

export function slugifyPackageName(packageName) {
  return packageName.replace(/^@/, "").replace(/[\\/]/g, "__");
}

export function stripAnsi(value) {
  return value.replace(new RegExp(String.raw`\u001B\[[0-9;]*m`, "g"), "");
}

export function hasTests(packageDir) {
  return existsSync(path.join(packageDir, "tests"));
}
