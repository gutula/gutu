import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { vanillaExtractPlugin as veEsbuildPlugin } from "@vanilla-extract/esbuild-plugin";
import { transform as esbuildTransform } from "esbuild";
import path from "node:path";
import fs from "node:fs";

/** Read `package.json`'s `gutuPlugins` array and expose it as
 *  `import.meta.env.VITE_GUTU_PLUGINS` (CSV). This lets plugin authors
 *  publish to npm and have the shell auto-pick them up — they just add
 *  `"gutuPlugins": ["@acme/gutu-foo"]` to package.json. */
function readGutuPlugins(): string {
  try {
    const pkgPath = path.resolve(__dirname, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8")) as {
      gutuPlugins?: string[];
    };
    return (pkg.gutuPlugins ?? []).filter(Boolean).join(",");
  } catch {
    return "";
  }
}

// Auto-discover every installed @blocksuite/* package so we don't ship
// a hardcoded list that drifts with upstream releases. Only directories
// with `src/` are taken — that's the marker for the un-built BlockSuite
// packages that need vanilla-extract handling. Built sub-packages
// without `src/` (e.g. `@blocksuite/icons`) skip the BlockSuite chain.
function discoverBlockSuitePackages(): string[] {
  const root = path.resolve(__dirname, "node_modules/@blocksuite");
  if (!fs.existsSync(root)) return [];
  const out: string[] = [];
  for (const name of fs.readdirSync(root)) {
    if (name.startsWith(".")) continue;
    const dir = path.join(root, name);
    if (!fs.statSync(dir).isDirectory()) continue;
    if (!fs.existsSync(path.join(dir, "src"))) continue;
    out.push(`@blocksuite/${name}`);
  }
  return out;
}
const BLOCKSUITE_PKGS = discoverBlockSuitePackages();

/** Check whether a package has a JS entry that vite's optimizer can
 *  resolve. Vite calls `resolvePackageEntry` which inspects (in order)
 *  `exports["."]`, `module`, and `main`. If none resolve to JS, the
 *  optimizer fails. We mirror that check so auto-discovery doesn't
 *  feed in packages like `y-protocols` (sub-paths only) or
 *  `@emoji-mart/data` (JSON main).
 *
 *  Heuristic for "JS-like":
 *    - explicit JS extension (`.js`/`.mjs`/`.cjs`/`.jsx`/`.ts`/`.tsx`)
 *    - OR no extension at all — Node resolves bare paths like
 *      `extend`'s `main: "index"` to `index.js`
 *  Anything explicitly non-JS (`.json`, `.css`, …) is excluded. */
function hasJsEntry(pkgDir: string): boolean {
  const pkgPath = path.join(pkgDir, "package.json");
  if (!fs.existsSync(pkgPath)) return false;
  let manifest: {
    main?: string;
    module?: string;
    exports?: unknown;
  };
  try {
    manifest = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  } catch {
    return false;
  }
  const ext = (p: string): string => {
    const m = /\.([^./]+)$/.exec(p);
    return m ? m[1].toLowerCase() : "";
  };
  const isJsLike = (p: string): boolean => {
    const e = ext(p);
    if (!e) return true; // no extension → Node resolves to .js
    return ["js", "mjs", "cjs", "jsx", "ts", "tsx"].includes(e);
  };
  // exports may be a string (means "."), or an object with "." key
  const exp = manifest.exports as unknown;
  if (typeof exp === "string") {
    if (isJsLike(exp)) return true;
  } else if (exp && typeof exp === "object") {
    const dot = (exp as Record<string, unknown>)["."];
    if (typeof dot === "string" && isJsLike(dot)) return true;
    if (dot && typeof dot === "object") {
      const conds = dot as Record<string, unknown>;
      for (const cond of ["import", "default", "require", "module", "browser", "node"]) {
        const v = conds[cond];
        if (typeof v === "string" && isJsLike(v)) return true;
        if (v && typeof v === "object") {
          const vv = v as Record<string, unknown>;
          for (const k of Object.keys(vv)) {
            const x = vv[k];
            if (typeof x === "string" && isJsLike(x)) return true;
          }
        }
      }
    }
  }
  if (manifest.module && isJsLike(manifest.module)) return true;
  if (manifest.main && isJsLike(manifest.main)) return true;
  // Bare package with no entry fields at all → Node treats as `index.js`.
  if (!manifest.exports && !manifest.main && !manifest.module) {
    return fs.existsSync(path.join(pkgDir, "index.js"))
        || fs.existsSync(path.join(pkgDir, "index.mjs"));
  }
  return false;
}

/** Packages that the BFS walks into but should NEVER be pre-bundled
 *  for the browser:
 *    - Node-only build/test infra (`vite`, `vitest`, `esbuild`,
 *      `rollup`, `@vitest/*`) — they reach for `.node` natives like
 *      `fsevents` and crash esbuild's pre-bundle.
 *    - Babel toolchain (`@babel/*`, `babel-plugin-macros`) — pulled
 *      in by `@emotion/babel-plugin` as a peer dep, runtime never
 *      uses it.
 *    - Misc node-only utilities that surface via dev tooling. */
const NODE_ONLY_DENYLIST = new Set<string>([
  "vite", "vitest", "vite-node", "esbuild", "rollup",
  "@vitest/expect", "@vitest/mocker", "@vitest/pretty-format",
  "@vitest/runner", "@vitest/snapshot", "@vitest/spy", "@vitest/utils",
  "babel-plugin-macros", "find-root",
  "jiti", "cac", "tinyglobby", "tinypool", "tinyspy", "tinybench",
  "tinyrainbow", "tinyexec", "fdir", "pathe", "picomatch", "picocolors",
  "cosmiconfig", "magic-string", "siginfo", "stackback", "std-env",
  "strip-literal", "loupe", "chai", "expect-type", "assertion-error",
  "check-error", "deep-eql", "pathval", "dedent", "why-is-node-running",
  "yaml", "convert-source-map", "lines-and-columns", "es-module-lexer",
  "resolve", "is-core-module", "path-parse", "supports-preserve-symlinks-flag",
  "json-parse-even-better-errors", "lru-cache", "hasown", "es-errors",
]);
const NODE_ONLY_PATTERNS = [/^@babel\//];

/** Walk every BlockSuite package's manifest, then walk THOSE deps'
 *  manifests too. CJS shims like `extend` and `bind-event-listener`
 *  often hide one level deeper — `unified` (an affine-shared dep)
 *  imports `extend`, and that shim never gets pre-bundled unless we
 *  enumerate it explicitly. We BFS the dependency graph rooted at
 *  every BlockSuite package, recursing through every node_modules dir,
 *  and emit every non-BlockSuite, non-`@types` package that has a JS
 *  entry vite's optimizer can resolve. */
function discoverBlockSuiteTransitiveDeps(): string[] {
  const blocksuiteRoot = path.resolve(__dirname, "node_modules/@blocksuite");
  if (!fs.existsSync(blocksuiteRoot)) return [];
  const nodeModules = path.resolve(__dirname, "node_modules");
  const deps = new Set<string>();
  const queue: string[] = [];
  for (const name of fs.readdirSync(blocksuiteRoot)) {
    if (name.startsWith(".")) continue;
    const pkgPath = path.join(blocksuiteRoot, name, "package.json");
    if (fs.existsSync(pkgPath)) queue.push(`@blocksuite/${name}`);
  }
  const visited = new Set<string>(queue);
  const isNodeOnly = (dep: string) =>
    NODE_ONLY_DENYLIST.has(dep) || NODE_ONLY_PATTERNS.some((re) => re.test(dep));

  while (queue.length > 0) {
    const dep = queue.shift()!;
    const pkgPath = path.join(nodeModules, dep, "package.json");
    if (!fs.existsSync(pkgPath)) continue;
    let manifest: { dependencies?: Record<string, string>; peerDependencies?: Record<string, string> };
    try {
      manifest = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    } catch { continue; }
    for (const map of [manifest.dependencies, manifest.peerDependencies]) {
      for (const k of Object.keys(map ?? {})) {
        if (k.startsWith("@types/")) continue;
        if (visited.has(k)) continue;
        visited.add(k);
        // Skip entirely — don't add to includes AND don't walk in (their
        // sub-deps are equally node-only / dev-only).
        if (isNodeOnly(k)) continue;
        if (!k.startsWith("@blocksuite/")) deps.add(k);
        queue.push(k);
      }
    }
  }
  return [...deps]
    .filter((dep) => hasJsEntry(path.join(nodeModules, dep)))
    .sort();
}
const BLOCKSUITE_TRANSITIVE = discoverBlockSuiteTransitiveDeps();

/** Custom plugin: lower BlockSuite source `.ts` files via esbuild with
 *  `target: esnext` so the TC39 stage-3 `accessor` keyword and Lit
 *  decorators compile down before the browser sees them.
 *
 *  Why we need this: BlockSuite ships un-built TS source in
 *  `node_modules/@blocksuite/*\/src/`. Vite's default config doesn't
 *  transform anything under `node_modules` — it assumes those are
 *  already JS. When we exclude BlockSuite from `optimizeDeps`, vite
 *  serves the .ts files raw. The browser hits the `accessor` keyword
 *  and throws SyntaxError.
 *
 *  We can't pre-bundle BlockSuite via `optimizeDeps.include` because
 *  that route doesn't run the vanilla-extract vite plugin chain that
 *  the .css.ts side-files need. Surgical transform plugin sidesteps
 *  both. Only fires on `.ts` (not `.css.ts` — vanilla-extract owns
 *  those), only inside `node_modules/@blocksuite/`. */
function blocksuiteTsTransform(): Plugin {
  return {
    name: "gutu:blocksuite-ts-transform",
    enforce: "pre",
    async transform(code, id) {
      if (!id.includes("/node_modules/@blocksuite/")) return null;
      if (!id.endsWith(".ts") && !id.includes(".ts?")) return null;
      if (id.includes(".css.ts")) return null;
      // Target es2021 picks the right combination of esbuild lowerings
      // for BlockSuite source:
      //   - es2022's `accessor` keyword: lowered to getter/setter
      //   - TC39 "define" class fields: NOT applied (the legacy TS
      //     `[[Set]]` semantic preserves the BlockSuite pattern of
      //     `container = this.provider.container` reading parameter
      //     properties — at es2022 the field init runs BEFORE param
      //     props get assigned and throws TypeError)
      //   - Decorators: BlockSuite uses Lit's `@customElement`/
      //     `@property`/`@state` (TC39 stage-3) — esbuild handles
      //     those at any target.
      const result = await esbuildTransform(code, {
        loader: "ts",
        target: "es2021",
        sourcemap: true,
        sourcefile: id,
      });
      return { code: result.code, map: result.map };
    },
  };
}

export default defineConfig({
  define: {
    "import.meta.env.VITE_GUTU_PLUGINS": JSON.stringify(readGutuPlugins()),
  },
  // BlockSuite ships .css.ts files in its published packages; let the
  // Vite plugin transform them at request time. Pre-bundling via
  // optimizeDeps would route around the plugin, so exclude every
  // discovered BlockSuite package from optimizeDeps. The CJS shim deps
  // (extend, lodash-es, etc) still get pre-bundled normally.
  optimizeDeps: {
    // BlockSuite packages are excluded so the Vite plugin chain
    // (vanilla-extract → esbuild) transforms their .css.ts at request
    // time. Excluding them also means their *transitive* deps need to
    // be explicitly pre-bundled below.
    exclude: BLOCKSUITE_PKGS,
    // Pre-bundle every transitive dep of BlockSuite (mostly CJS shims
    // like extend, lodash-es, bind-event-listener, lib0/*, …) so they
    // expose ESM-compatible exports under the dev-mode `import()` chain.
    // Discovered automatically from the dependency graph — drift-free.
    include: BLOCKSUITE_TRANSITIVE,
    esbuildOptions: {
      // BlockSuite source uses TC39 stage-3 `accessor` keyword (Lit
      // decorator-class properties). esbuild's default target is older
      // than ES2022 — bumping to esnext lets it lower `accessor` to
      // plain getter/setter pairs the browser can run.
      target: "esnext",
      plugins: [veEsbuildPlugin() as never],
    },
  },
  // Source-transform pass for non-pre-bundled `.ts` files (which
  // includes every BlockSuite source we excluded above). Same target
  // bump as the optimizer. Default `esbuild.include` excludes
  // `node_modules` — we override so BlockSuite's un-built TS source
  // (`accessor`, decorators, …) lowers to plain JS the browser can run.
  esbuild: {
    target: "esnext",
    include: /\.(ts|tsx|jsx|js|mjs)$/,
    exclude: [],
  },
  // vanillaExtractPlugin compiles `.css.ts` files used by BlockSuite/AFFiNE
  // (e.g. @blocksuite/affine-shared/styles). Without it, those files
  // import as plain TS and the editor mount fails with "Styles were
  // unable to be assigned to a file".
  //
  // blocksuiteTsTransform: vite's built-in esbuild is hard-coded to skip
  // node_modules; BlockSuite ships un-built TS source there which uses
  // TC39 stage-3 `accessor` (Lit decorator-class fields). This plugin
  // intercepts those .ts requests, runs esbuild with target=esnext to
  // lower the stage-3 syntax, and returns plain JS the browser parses.
  plugins: [vanillaExtractPlugin(), blocksuiteTsTransform(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@gutu/admin-shell-next": path.resolve(__dirname, "./packages/admin-shell-next/src/index.ts"),
    },
  },
  // Multi-page entry: the main shell + a separate /editor-frame.html that
  // hosts each Univer / BlockSuite editor in its own React root (no
  // StrictMode), insulating the host shell from upstream lifecycle bugs.
  appType: "mpa",
  build: {
    sourcemap: true,
    target: "es2022",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "./index.html"),
        editorFrame: path.resolve(__dirname, "./editor-frame.html"),
      },
    },
  },
  server: {
    port: Number(process.env.PORT ?? 5173),
    strictPort: true,
    host: "127.0.0.1",
    proxy: {
      "/api/ws": {
        target: process.env.VITE_API_TARGET ?? "http://127.0.0.1:3333",
        changeOrigin: true,
        ws: true,
      },
      "/api": {
        target: process.env.VITE_API_TARGET ?? "http://127.0.0.1:3333",
        changeOrigin: true,
      },
    },
  },
});
