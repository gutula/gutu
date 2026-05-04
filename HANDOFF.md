# Gutu — Developer Handoff

Welcome. This is the **single starting point** for anyone taking over the
Gutu ecosystem. It assumes you have not seen the codebase before.

The codebase is large and existing documentation is comprehensive but
scattered across ~17 files. This handoff:

1. Gets you productive in **30 minutes** (Quick start).
2. Builds a correct **mental model** of the architecture (90 minutes more).
3. Indexes the deeper docs in reading order so you don't get lost.
4. Documents **conventions, rules, and pre-existing landmines** that aren't
   covered anywhere else.
5. Gives you a **cookbook** for the most common dev tasks.

If you read this end-to-end, you should be able to ship a new plugin,
publish it as its own repo, and have it loaded by the umbrella backend
within a day.

---

## Table of contents

- [1. Quick start — 30 minutes to a running system](#1-quick-start--30-minutes-to-a-running-system)
- [2. The mental model in five paragraphs](#2-the-mental-model-in-five-paragraphs)
- [3. Repository topology](#3-repository-topology)
- [4. Reading order for the existing docs](#4-reading-order-for-the-existing-docs)
- [5. Anatomy of a plugin (using `entitlements-core`)](#5-anatomy-of-a-plugin-using-entitlements-core)
- [6. The HostPlugin contract — non-negotiable rules](#6-the-hostplugin-contract--non-negotiable-rules)
- [7. Adding a new plugin](#7-adding-a-new-plugin)
- [8. Publishing a plugin to its own GitHub repo](#8-publishing-a-plugin-to-its-own-github-repo)
- [9. Testing, smoke harness, typecheck](#9-testing-smoke-harness-typecheck)
- [10. Release / verification gates](#10-release--verification-gates)
- [11. Pre-existing issues and workarounds](#11-pre-existing-issues-and-workarounds)
- [12. Cookbook — common tasks](#12-cookbook--common-tasks)
- [13. Where to look for X — file map](#13-where-to-look-for-x--file-map)
- [14. Glossary](#14-glossary)

---

## 1. Quick start — 30 minutes to a running system

### Prerequisites

| Tool | Version | Why |
|---|---|---|
| **Bun** | ≥ 1.3 | Runtime, package manager, test runner — everything is bun |
| **Node** | ≥ 18 (occasional `node` scripts) | A few tooling/* scripts use node |
| **Git** | any | Multi-repo workflow |
| **gh CLI** *(optional)* | latest | For creating new plugin repos in `gutula` org |

You do **not** need Docker, Postgres, Redis, or any external service for
local dev. SQLite is the default DB; everything runs on `localhost`.

### Clone and install

```bash
# Clone the umbrella
git clone git@github.com:gutula/gutu.git Framework
cd Framework

# Each plugin is its own git repo — they live under plugins/.
# Most plugin repos are already cloned as part of the umbrella checkout.
# If a plugin repo is missing, clone it directly:
#   git clone git@github.com:gutula/gutu-plugin-trust-safety-core.git \
#     plugins/gutu-plugin-trust-safety-core

# Install dependencies — three places, in this order:
bun install                                     # umbrella root
cd admin-panel && bun install                   # admin-panel workspace
cd backend && bun install                       # backend (Hono server)
cd ../..                                        # back to root
```

### First boot

Two processes need to run. Open two terminals.

```bash
# Terminal 1 — backend on :3333
cd admin-panel/backend
bun run dev                # hot-reload mode

# Terminal 2 — frontend (Vite) on :5173
cd admin-panel
bun run dev:ui
```

Open http://localhost:5173, log in with:

```
chinmoy@gutu.dev / password
```

You'll land on the admin dashboard. The left sidebar should expand to
**14 sections**. If you see a quarantined plugin notice, see §11.

### Verify everything works (5 minutes)

```bash
# From repo root
bun test plugins/gutu-plugin-entitlements-core   # 10 tests pass
bun run scripts/internet-products-smoke.ts        # all checks pass
```

If both pass, you're set up correctly. Move to §2.

---

## 2. The mental model in five paragraphs

**It is a stateless plugin-based framework, not a monolith.** The umbrella
backend (`admin-panel/backend/`) is a thin Hono+SQLite host that knows how
to load plugins, route requests to them, and enforce a few cross-cutting
invariants (RBAC, audit chain, tenant isolation). It owns no business
logic. Every business behaviour — from accounting to ride-hailing to AI
model registries — lives in a plugin.

**Each plugin is a separate git repository.** There are currently
**32 plugin repos** under the `gutula` GitHub org (`gutu-plugin-*`) plus
roughly **45 library packages** (`gutu-lib-*`). At runtime they're linked
via Bun workspaces; in version control they're independent. A plugin can
be developed, versioned, and shipped without touching the umbrella.

**Plugins communicate via a HostPlugin contract.** A plugin exports a
`hostPlugin: HostPlugin` object with `id`, `version`, `manifest`,
`dependsOn`, `resources[]`, `migrate()`, `routes[]`, optional `start/stop`
lifecycle hooks. The umbrella's `loadPlugins()` topologically sorts them,
runs each `migrate()`, mounts the routes under `/api/<mountPath>`, and
auto-registers `resources[]` into a UI catalog. Plugins can also
**re-export** action functions through `lib/index.ts` so other plugins
import them as `@gutu-plugin/<name>` workspace packages — a deliberate
narrow API surface.

**Every state mutation is an Action → Event → Audit triad.** Actions are
named functions (`grantsIssue`, `couponRedeem`, `caseOpen`, etc.) that
take a Zod-validated input, mutate state in a SQLite transaction, append
an entry to a hash-chained audit log via `recordAudit`, and return a
`CommandResult` envelope listing the events emitted. There is no direct
DB access from one plugin into another's tables — cross-plugin reads go
through `lib/` exports (e.g. `isRestricted`, `loyaltyAccountFor`,
`isServiceable`).

**Plugins compose into Packs.** A "pack" (`packs/<name>/pack.json`) is a
declarative bundle of plugin ids that together implement a known
internet-product shape (storefront pack, social-network pack, ride-hailing
pack, AI-research pack, …). Packs are pure metadata — they enable a curated
subset of plugins for a tenant. The 32 plugin × 13 pack catalog is
documented in `docs/internet-products/00-blueprint.md`.

---

## 3. Repository topology

```
gutula/                                       (GitHub org)
├── gutu                                      ← umbrella (this repo)
│   ├── admin-panel/                          ← Hono backend + Vite frontend
│   ├── docs/                                 ← deep documentation
│   ├── scripts/                              ← scaffolders + smoke harness
│   ├── packs/                                ← Pack JSON specs
│   ├── plugins/                              ← clones of the 32 plugin repos
│   ├── libraries/                            ← clones of the 45 lib repos
│   ├── apps/, catalogs/, integrations/       ← extra workspaces
│   ├── tooling/business-os/                  ← certification scripts
│   ├── HANDOFF.md                            ← you are here
│   └── README.md, AGENTS.md, RUNBOOK.md, …
│
├── gutu-plugin-entitlements-core             ← 7 fully-implemented plugins
├── gutu-plugin-usage-metering-core           ← (full actions+lib+routes+tests)
├── gutu-plugin-wallet-ledger-core
├── gutu-plugin-reviews-ratings-core
├── gutu-plugin-trust-safety-core
├── gutu-plugin-geospatial-routing-core
├── gutu-plugin-promotions-loyalty-core
│
├── gutu-plugin-commerce-storefront-core      ← 25 scaffold-only plugins
├── gutu-plugin-feed-core                     ← (manifest + db scaffold,
├── gutu-plugin-recommendations-core           ←  no actions yet)
│   …
└── gutu-plugin-regulated-ai-compliance-core
```

Bun workspaces (declared in the umbrella `package.json`):

```json
"workspaces": [
  "gutu-core/framework/core/*",
  "libraries/*/framework/libraries/*",
  "plugins/*/framework/builtin-plugins/*",
  "apps/*/apps/*",
  "catalogs/*",
  "integrations/gutu-ecosystem-integration"
]
```

So a plugin's runtime path inside the umbrella is:

```
plugins/gutu-plugin-<id>/framework/builtin-plugins/<id>/
└── package.json   (name: "@plugins/<id>")
└── src/host-plugin/
    ├── index.ts          (exports hostPlugin: HostPlugin)
    ├── db/migrate.ts
    ├── actions/index.ts
    ├── lib/index.ts      (cross-plugin API surface)
    ├── routes/<id>.ts
    ├── tests/actions.test.ts
    └── ui/   (optional)
```

---

## 4. Reading order for the existing docs

Start with the items in **bold**. Skim the others.

**Foundational (read in order):**

1. **`README.md`** — One-page elevator pitch. ~5 min.
2. **`docs/ARCHITECTURE.md`** — System design: kernel, host, commands,
   events, jobs, workflows, tenancy, permissions. 721 lines. ~30 min.
3. **`docs/PLUGIN-DEVELOPMENT.md`** — Deep plugin guide. 1194 lines.
   Skim §§1–5, deep-read §§6–9 when you build your first plugin.
4. **`docs/HOST-SDK-REFERENCE.md`** — API reference for `@gutu-host`:
   `db`, `recordAudit`, `currentUser`, `getTenantContext`,
   `withLeadership`. Use as lookup, not narrative.
5. **`docs/SECURITY.md`** — RBAC clamp, audit hash chain, ACL model,
   tenant isolation. **Required reading** before touching auth/permissions.
6. **`docs/internet-products/00-blueprint.md`** — The 32-plugin × 13-pack
   catalog. Tells you what each plugin is supposed to do at the product
   level (Netflix, Uber, TikTok shapes, …).

**Reference (lookup as needed):**

| Doc | Use when |
|---|---|
| `PLUGIN_AUTHORING.md` (root) | Quick scaffold + contract reminder |
| `RUNBOOK.md` | Production incident: quarantined plugin, rate-limit, audit verify |
| `DEPLOYMENT.md` | Setting up env vars, Postgres, object storage, multi-tenancy |
| `WORKSPACE_REPOS.md` | List of every split repo and its remote |
| `docs/TESTING.md` | Unit / integration / contract / smoke patterns |
| `docs/OBSERVABILITY.md` | Logging, tracing, metrics, health checks |
| `docs/CONTRIBUTING.md` | PR workflow, review process, coding standards |
| `docs/UI-UX-GUIDELINES.md` | Design tokens, accessibility, error UX |
| `docs/PAGE-DESIGN-SYSTEM.md` + `docs/PAGE-DESIGN-IMPLEMENTATION.md` | Building admin pages |
| `docs/customization-layer.md` | JSON-driven tenant customization |
| `docs/internet-products/01-todo.md` | Status of each of the 32 internet-products plugins |
| `docs/internet-products/02-verification.md` | Per-plugin / per-pack release gates |

**Background / strategy (skim once):**

- `Business Plugin Goal.md`, `Business Plugin TODO.md` — the Business OS
  layer (ERPNext-shaped plugins).
- `docs/erpnext-gutu-business-os-comparison.md` — feature audit.
- `docs/bi-lightdash-gap-report.md` — analytics gap analysis.
- `docs/phase-2/3/4-*.md` — staged roadmap.

---

## 5. Anatomy of a plugin (using `entitlements-core`)

`entitlements-core` is the **canonical reference implementation**. When in
doubt, mirror what it does. Six other plugins (`usage-metering-core`,
`wallet-ledger-core`, `reviews-ratings-core`, `trust-safety-core`,
`geospatial-routing-core`, `promotions-loyalty-core`) follow the same
template — read them all when you have time.

```
plugins/gutu-plugin-entitlements-core/
├── package.json                              "@plugins/entitlements-core"
├── README.md
├── tsconfig.base.json
└── framework/builtin-plugins/entitlements-core/
    ├── package.json
    ├── tsconfig.json                         (path mapping for @gutu-host)
    └── src/host-plugin/
        ├── index.ts                          ★ HostPlugin export
        ├── db/migrate.ts                     ★ CREATE TABLE IF NOT EXISTS
        ├── actions/index.ts                  ★ all action functions + Zod schemas
        ├── events/index.ts                   recordAudit wiring
        ├── jobs/index.ts                     leader-elected jobs
        ├── workflows/index.ts                long-running state machines
        ├── services/decision-engine.ts       business logic
        ├── routes/entitlements-core.ts       Hono routes
        ├── lib/index.ts                      ★ cross-plugin API surface
        └── tests/decision-engine.test.ts     ★ bun:test
```

The five files marked ★ are the **minimum viable plugin shape**. Everything
else is optional but conventional.

### What each file does

**`index.ts`** — exports the `hostPlugin` object the umbrella loader picks
up:

```ts
export const hostPlugin: HostPlugin = {
  id: "entitlements-core",
  version: "1.0.0",
  manifest: { label: "Entitlements", icon: "Shield", vendor: "gutu",
              permissions: ["db.read", "db.write", "audit.write"] },
  dependsOn: ["auth-core", "workflow-core"],
  resources: [
    "entitlements.grants", "entitlements.policies",
    "entitlements.decisions", "entitlements.benefits",
    "entitlements.revocations",
  ],
  migrate,
  routes: [{ mountPath: "/entitlements", router: entitlementsCoreRoutes }],
  health: async () => ({ ok: true }),
};
export * from "./lib";
```

**`db/migrate.ts`** — idempotent SQL. Always `CREATE TABLE IF NOT EXISTS`.
Plugin migrations run on every backend boot.

**`actions/index.ts`** — Zod schema + action function pairs. Pattern:

```ts
export const GrantIssueSchema = z.object({
  tenantId: z.string().min(1),
  actor: z.string().min(1),
  subjectKind: z.enum(["user", "tenant", "group"]),
  // ...
});

export function grantsIssue(input: z.input<typeof GrantIssueSchema>):
  CommandResult<{ id: string }> {
  const a = GrantIssueSchema.parse(input);
  // ... DB mutation in a transaction ...
  recordAudit({ actor: a.actor, action: "entitlement.grant.issued",
                resource: "entitlements.grants", recordId: id });
  return { actionId: "entitlements.grants.issue", status: "succeeded",
           resource: { id }, events: ["entitlement.grant.issued"] };
}
```

> ⚠️ Use **`z.input<typeof Schema>`** (not `z.infer`) for the function input
> type whenever the schema has any `.default()` fields. `z.infer` is the
> _output_ type — it makes Zod-defaulted fields look required to TS, which
> breaks call sites that legitimately omit them.

**`lib/index.ts`** — re-exports everything other plugins are allowed to
import. Treat this as a public API; everything else in the plugin is
internal.

**`routes/<id>.ts`** — thin Hono shell that calls the actions:

```ts
export const entitlementsCoreRoutes = new Hono();
entitlementsCoreRoutes.use("*", requireAuth);

entitlementsCoreRoutes.post("/grants", async (c) => {
  try { return c.json(grantsIssue({
    tenantId: getTenantContext()?.tenantId ?? "default",
    actor: currentUser(c).email,
    ...await c.req.json(),
  }), 201); }
  catch (e) { /* error envelope */ }
});
```

**`tests/*.test.ts`** — bun:test. Each test uses a unique `tenantId` per
test for isolation:

```ts
const t = (s: string) => `t-${s}-${Date.now()}`;

beforeAll(async () => {
  process.env.DB_PATH ??= ":memory:";
  process.env.NODE_ENV = "test";
  await import("@gutu-host");
  const { migrate: hostMigrate } =
    await import("../../../../../../../../admin-panel/backend/src/migrations");
  hostMigrate();
  ({ migrate } = await import("../db/migrate"));
  actions = await import("../actions");
  migrate();
});
```

> ⚠️ The relative path in tests is exactly **8 `../` segments** from
> `tests/` to `admin-panel/backend/src/migrations`. Off-by-one breaks
> the import silently and the test will fail to migrate.

---

## 6. The HostPlugin contract — non-negotiable rules

Violating any of these will cause boot quarantine, runtime errors, or
silent data corruption. Treat as immutable.

| # | Rule | Why |
|---|---|---|
| 1 | `hostPlugin.id` must equal the plugin's directory code | Loader topology + audit `resource` prefixes depend on it |
| 2 | `hostPlugin.version` must be valid semver | Used by dependency resolution and by the plugin registry |
| 3 | `manifest.permissions` lists **every** host-SDK capability the plugin uses | Production runs with `GUTU_PERMISSIONS=enforce`; missing perms quarantine the plugin |
| 4 | `dependsOn` references only **existing first-party plugin ids** | Loader topo-sorts; missing dep aborts boot |
| 5 | `resources[]` follows `<plugin-prefix>.<entity>` regex `^[a-z][a-z-]*\.[a-z][a-z-]*$` | The catalog gate uses it as the namespace allow-list |
| 6 | `migrate()` is idempotent | Runs on every boot; non-idempotent migrations corrupt restarts |
| 7 | Every action returns a `CommandResult` envelope | Routes, audit, and tests rely on the shape |
| 8 | Every state-mutating action calls `recordAudit(...)` | Hash-chained audit log is the legal source of truth |
| 9 | Every query filters by `tenant_id` | Multi-tenancy is enforced at the SQL level, not the route layer |
| 10 | No direct DB access from one plugin into another's tables | Cross-plugin reads go through `lib/` exports only |
| 11 | Idempotent actions accept an `idempotencyKey` and short-circuit on retry | Money operations, event ingestion, etc. |
| 12 | Background jobs are wrapped in `withLeadership("plugin:job", ...)` | Cluster: only one replica runs each cron tick |
| 13 | Action input types use `z.input<typeof Schema>`, not `z.infer<…>` | See §5 — `z.input` keeps Zod defaults optional at call sites |
| 14 | Plugin source must not import another plugin's source directly | Use `@plugins/<id>` workspace package, or a `gutu-lib-*` library |

---

## 7. Adding a new plugin

### Use the scaffolder

```bash
bun run scaffold:plugin <code> [--ui] [--worker]
# e.g.
bun run scaffold:plugin fleet-core
bun run scaffold:plugin invoicing-core --ui --worker
```

Plugin code rules: lowercase, hyphens only, must end in `-core` (regex
`^[a-z][a-z0-9-]+-core$`).

The scaffolder creates:

```
plugins/gutu-plugin-<code>/
├── package.json                              "@plugins/<code>"
├── README.md
├── tsconfig.base.json
└── framework/builtin-plugins/<code>/
    ├── tsconfig.json
    └── src/host-plugin/
        ├── index.ts            (HostPlugin export — fill resources[])
        ├── db/migrate.ts       (CREATE TABLE IF NOT EXISTS scaffold)
        ├── routes/<code>.ts    (Hono router placeholder)
        ├── lib/index.ts        (empty barrel)
        └── ui/                 (only with --ui)
            ├── index.ts
            └── pages/HomePage.tsx
```

It also prints exactly what to add to:
- `admin-panel/backend/package.json` `gutuPlugins[]`
- `admin-panel/vite.config.ts` (plugin path alias)
- `admin-panel/tsconfig.json` (paths)

Apply those three edits, restart the backend, and the new plugin loads.

### Then implement the five ★ files

In order:

1. **`db/migrate.ts`** — define your tables.
2. **`actions/index.ts`** — Zod schemas + action functions. Mirror
   `entitlements-core/actions/index.ts` for shape.
3. **`lib/index.ts`** — re-export your public action surface + schemas.
4. **`routes/<code>.ts`** — thin Hono shell calling the actions.
5. **`tests/actions.test.ts`** — copy the boilerplate from
   `reviews-ratings-core/tests/actions.test.ts`.

Run tests as you go:

```bash
bun test plugins/gutu-plugin-<code>
```

### Smoke-test against a live backend

Once your plugin's routes are mounted, add a section to
`scripts/internet-products-smoke.ts` that hits a happy path + one
negative path. Mirror the existing patterns at the bottom of that file.

---

## 8. Publishing a plugin to its own GitHub repo

Each plugin is its own git repo at `git@github.com:gutula/gutu-plugin-<id>.git`.

### Option A — gh CLI is authenticated

```bash
cd plugins/gutu-plugin-<id>
git init                                   # if not already
git add . && git commit -m "feat: initial scaffold"
git branch -M main
gh repo create "gutula/gutu-plugin-<id>" --public --disable-wiki \
  --description "<one-liner>"
git push -u origin main
```

### Option B — gh CLI not authenticated (use the keychain token)

If `gh auth status` reports "not logged in", git's `osxkeychain` credential
helper still has a token from a previous web push. You can bypass `gh`
entirely and call the REST API:

```bash
TOKEN=$(printf 'host=github.com\nprotocol=https\n\n' \
  | git credential-osxkeychain get | awk -F= '/^password=/{print $2}')

curl -s -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -X POST -d '{"name":"gutu-plugin-<id>","description":"...","private":false,"has_wiki":false}' \
  https://api.github.com/orgs/gutula/repos

cd plugins/gutu-plugin-<id> && git push -u origin main
```

### Option C — bulk create / push for all 32 internet-products plugins

```bash
bun run scripts/push-internet-products-repos.sh   # gh-CLI based
# or, the REST-API based pattern from §8 Option B applied in a loop
# (see commit history of HANDOFF.md for the inline script we used)
```

### After pushing

Verify origin matches local:

```bash
cd plugins/gutu-plugin-<id>
git ls-remote origin main | awk '{print $1}'
git rev-parse main
# Both should print the same SHA.
```

---

## 9. Testing, smoke harness, typecheck

### Per-plugin unit tests

```bash
bun test plugins/gutu-plugin-<id>
```

Tests use in-memory SQLite, run host migrations + plugin migrations, and
isolate by per-test `tenantId`. Fast — full suite of all 7 implemented
plugins runs in ~2s.

### Live HTTP smoke harness

```bash
# Backend must be running on :3333
bun run scripts/internet-products-smoke.ts
```

Asserts:
- Every plugin in `admin-panel/backend/package.json["gutuPlugins"]` shows
  up as `loaded` on `/api/_plugins`.
- Every plugin's declared resources appear in `/api/ui/resources`.
- Every pack's referenced plugins exist.
- 7 plugin happy-path round-trips work end-to-end (entitlements decision
  flow, wallet credit/debit, usage quota check, etc.).

Exits 0 on success, 1 on first failure.

### Backend typecheck

```bash
cd admin-panel/backend && bun x tsc --noEmit
```

Expected: **0 errors in shipped backend `src/`**. There are pre-existing
errors in the plugin tree (cross-package `@gutu-host` resolution — see §11)
which are noise; the `src/` count is what matters.

### Frontend typecheck

```bash
cd admin-panel && bun run typecheck
```

### Full certification (CI gate)

```bash
bun run business:certify
```

Runs split-repo hygiene + business contract check + e2e flows + resilience
+ CI fanout + pack validation + plugin docs + tsc.

---

## 10. Release / verification gates

Authoritative checklist: **`docs/internet-products/02-verification.md`**.

A plugin is **NOT** ready to ship until:

**Per-plugin:**
- ✅ `package.json` has `name`, `version`, `private: true`, `type: "module"`, `exports`
- ✅ `hostPlugin.id` matches code; semver version; permissions listed
- ✅ `dependsOn` only references existing plugins
- ✅ `resources[]` declared (or empty for cross-cutting plugins)
- ✅ Resource ids match `<plugin>.<entity>` regex
- ✅ `migrate()` idempotent
- ✅ Unit tests pass
- ✅ Integration test (action → event → DB → cross-plugin reaction) passes
- ✅ Tenant-isolation test passes (cross-tenant query returns empty)
- ✅ Plugin appears as `loaded` on `/api/_plugins`
- ✅ Every declared resource appears in `/api/ui/resources`

**Cross-cutting:**
- ✅ `bun test` (backend) — 0 failures
- ✅ `bun x tsc --noEmit` (backend `src/`) — 0 errors for shipped code
- ✅ `bun x tsc --noEmit` (frontend) — 0 errors
- ✅ `scripts/internet-products-smoke.ts` exits 0
- ✅ No quarantined plugins on `/api/_plugins`

**Production-readiness (when graduating to `stable`):**
- ✅ Every action emits at least one domain event
- ✅ Every event row has `prev_hash` (audit chain intact via `/api/audit/verify`)
- ✅ Every workflow has a quarantine path
- ✅ Every job wrapped in `withLeadership()`
- ✅ Every external HTTP egress goes through `net.outbound` capability
- ✅ No secrets in source (gitleaks scan)
- ✅ PII fields tagged for GDPR fan-out
- ✅ `exportSubjectData` + `deleteSubjectData` implemented

---

## 11. Pre-existing issues and workarounds

These exist before any new work — do not waste time chasing them.

### TS2307 `Cannot find module '@gutu-host'` errors in the plugin tree

When you run `bun x tsc --noEmit` from `admin-panel/backend/`, you'll see
hundreds of errors of the form:

```
../../plugins/gutu-plugin-X/.../actions/index.ts: error TS2307:
  Cannot find module '@gutu-host' or its corresponding type declarations.
```

**Cause:** Bun's runtime resolves `@gutu-host` via per-plugin `tsconfig.json`
path mapping, but the umbrella backend's `tsc` invocation crosses workspace
boundaries and doesn't follow per-plugin path maps.

**Effect:** Cosmetic. Runtime works. Only `backend/src/` errors are
release-blocking.

**Workaround:** Filter the typecheck output:

```bash
bun x tsc --noEmit 2>&1 | grep -v '^\.\./\.\./plugins/' | grep 'error TS'
```

### Frontend `[plugin-loader] npm "@gutu-plugin/X" failed`

Console errors at boot. **Pre-existing naming-convention drift** —
`admin-panel/package.json` `gutuPlugins[]` declares `@gutu-plugin/<id>`
specifiers, but the actual workspace packages publish as `@plugins/<id>`.

**Effect:** The npm-loader path is dead; the **filesystem loader** picks
the plugins up regardless. Login works, sidebar renders, all 58 backend
plugins load. No functional impact.

**Fix when you have a slow afternoon:** rename entries in
`admin-panel/package.json` to `@plugins/...`.

### `.DS_Store` shows as untracked in every plugin repo

macOS Finder metadata. Should never be committed. Either add to a global
gitignore or ignore the noise.

### `graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json` regenerate on every commit

A graphify watcher refreshes them. Either commit the refresh as a
follow-up `chore(graph): …` commit or add the directory to a local
post-commit hook to suppress.

### `data.db` lives in `admin-panel/backend/`

Reset with `rm -f admin-panel/backend/data.db && cd admin-panel/backend && bun run seed`.
Never commit `data.db`.

### Test path `../../../../../../../../`

Eight `../` segments from `tests/` to `admin-panel/backend/src/migrations`.
Off-by-one is silent. If a plugin's tests can't find host migrations, count
the segments first.

### `gh repo create` requires auth — REST API works without

The keychain often has a usable PAT even when `gh auth status` reports
not-logged-in. See §8 Option B.

---

## 12. Cookbook — common tasks

### Reset everything to a clean state

```bash
pkill -f "bun run src/main.ts" 2>/dev/null
rm -f admin-panel/backend/data.db
cd admin-panel/backend && bun run start    # auto-migrates on boot
```

### Add a new resource type to an existing plugin

1. Add the table to `db/migrate.ts`.
2. Add the new resource id to `hostPlugin.resources[]`.
3. Add Zod schema + action(s) to `actions/index.ts`.
4. Re-export from `lib/index.ts` if other plugins need it.
5. Add Hono routes to `routes/<id>.ts`.
6. Add unit tests.
7. Add a smoke check to `scripts/internet-products-smoke.ts`.
8. Restart backend.

### Cross-plugin call: how plugin A calls into plugin B

Don't import B's source directly. Import its workspace package:

```ts
// In plugin-A/src/host-plugin/services/some-service.ts
import { isRestricted } from "@plugins/trust-safety-core";

if (isRestricted(tenantId, "user", userId)) {
  throw new Error("user is currently restricted");
}
```

The `lib/index.ts` of plugin B is the only allowed entry point.

### Log in as a different seeded user

| Email | Password | Role |
|---|---|---|
| `chinmoy@gutu.dev` | `password` | admin |
| `sam@gutu.dev` | `password` | member |
| `alex@gutu.dev` | `password` | member |

### Check why a plugin is quarantined

```bash
curl -s -H "Authorization: Bearer $(curl -s -X POST \
  http://localhost:3333/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"chinmoy@gutu.dev","password":"password"}' \
  | bun -e 'console.log((await Bun.stdin.json()).token)')" \
  http://localhost:3333/api/_plugins | bun -e \
  'const j=await Bun.stdin.json();
   console.log(j.rows.filter(r=>r.status!=="loaded"));'
```

Or just check `/tmp/gutu-backend.log` (or wherever you tee'd `bun run`).

### Verify the audit hash chain

```bash
curl -s -H "Authorization: Bearer $TOK" \
  http://localhost:3333/api/audit/verify
```

Returns `{ ok: true }` if every event row's `prev_hash` matches the
predecessor's `hash`. A break indicates tampering or a buggy `recordAudit`
caller.

### Run a single plugin's tests with verbose output

```bash
bun test plugins/gutu-plugin-trust-safety-core --verbose
```

### Audit / push every plugin repo's sync state

```bash
PLUGINS=(entitlements-core usage-metering-core wallet-ledger-core ...)
for p in "${PLUGINS[@]}"; do
  cd "plugins/gutu-plugin-$p"
  ahead=$(git log origin/main..main --oneline 2>/dev/null | wc -l)
  behind=$(git log main..origin/main --oneline 2>/dev/null | wc -l)
  printf '%-32s ahead=%s behind=%s\n' "$p" "$ahead" "$behind"
done
```

### Open the live preview to QA the admin

Vite dev server is on `:5173`. Login is pre-filled with demo creds. The
sidebar has 14 sections, ~445 routes. Use `mcp__Claude_Preview__*` tools
or your normal browser.

---

## 13. Where to look for X — file map

| You want… | Look at |
|---|---|
| The umbrella backend entry point | `admin-panel/backend/src/main.ts` |
| Auth middleware | `admin-panel/backend/src/middleware/auth.ts` |
| Login API route | `admin-panel/backend/src/routes/auth.ts` |
| HostPlugin contract + loader | `admin-panel/backend/src/host/plugin-contract.ts` |
| Resource catalog gate (write) | `admin-panel/backend/src/routes/resources.ts` |
| RBAC clamp | `admin-panel/backend/src/lib/acl.ts` |
| Audit log + hash chain | `admin-panel/backend/src/lib/audit.ts` |
| Host migrations entry | `admin-panel/backend/src/migrations.ts` |
| Reference plugin to copy from | `plugins/gutu-plugin-entitlements-core/...` |
| The other 6 fully-implemented plugins | `plugins/gutu-plugin-{usage-metering,wallet-ledger,reviews-ratings,trust-safety,geospatial-routing,promotions-loyalty}-core/` |
| Plugin scaffolder | `scripts/scaffold-plugin.ts` |
| Smoke harness | `scripts/internet-products-smoke.ts` |
| Bulk repo creator/pusher | `scripts/push-internet-products-repos.sh` |
| Pack JSON specs | `packs/pack-*/pack.json` |
| Frontend entry | `admin-panel/src/main.tsx` (or `index.html` → `src/`) |
| Frontend plugin loader | `admin-panel/src/host/pluginLoaders.ts` |
| Frontend route registry | `admin-panel/src/runtime/registries.ts` |
| Sidebar nav contributions | `admin-panel/src/host/AdminRoot.tsx` |
| Mail-app settings example (template for admin pages) | `admin-panel/src/examples/mail/views/settings/Settings.tsx` |

---

## 14. Glossary

| Term | Definition |
|---|---|
| **Action** | A named function that mutates state. Returns a `CommandResult`. Examples: `grantsIssue`, `couponRedeem`, `holdRelease`. |
| **Audit chain** | Append-only `audit_events` table with `prev_hash`/`hash` columns linking each row to its predecessor. Verifiable end-to-end. |
| **`CommandResult`** | The return envelope of every action: `{ actionId, status, resource?, events: string[] }`. |
| **Event** | A domain event name emitted by an action. Pure metadata in `CommandResult.events[]`; does not imply a message bus. |
| **HostPlugin** | The contract object every plugin's `index.ts` exports. See §5–6. |
| **Job** | A scheduled background task. Wrapped in `withLeadership("plugin:job", …)` for cluster singleton behaviour. |
| **`@gutu-host`** | The host SDK package every plugin imports from. Provides `db`, `recordAudit`, `currentUser`, `Hono`, `requireAuth`, `getTenantContext`, `withLeadership`, etc. |
| **`@plugins/<id>`** | The workspace package name of plugin `<id>`. Used for cross-plugin imports. |
| **Pack** | A declarative bundle of plugin ids. JSON file at `packs/<name>/pack.json`. Composes plugins into a "product shape" (storefront, ride-hailing, social network, …). |
| **Quarantine** | A loaded-but-failed plugin state. Indicates a contract violation. Inspect via `/api/_plugins` or backend logs. |
| **RBAC clamp** | The mechanism that ceilings a per-record ACL role to the user's tenant role. See `admin-panel/backend/src/lib/acl.ts`. |
| **Resource** | A typed record kind owned by a plugin. ID format `<plugin>.<entity>`. The umbrella's resource-write gate uses the namespace allow-list derived from declared resources. |
| **Restriction** | A trust-safety state preventing a target from acting (shadow-ban, feature-block, full-suspend). Cross-plugin lookup via `isRestricted(tenantId, kind, id)`. |
| **Tenant** | A logical isolation boundary. Every record has a `tenant_id`. Multi-tenant by default; single-tenant deployments still set `tenantId = "default"`. |
| **Workflow** | A long-running state machine. Has a quarantine path for stuck instances. |

---

## Closing notes

You'll be productive faster by:

1. Doing the §1 Quick start.
2. Reading `docs/ARCHITECTURE.md` end-to-end (one sitting).
3. Skimming `docs/PLUGIN-DEVELOPMENT.md` and `docs/HOST-SDK-REFERENCE.md`.
4. Cloning `gutu-plugin-entitlements-core` and reading every file in
   `src/host-plugin/` start to finish — it's ~1000 LoC and is the
   "minimum interesting plugin." If you understand it, you understand
   the framework.
5. Running through §7 (Adding a new plugin) with a throwaway plugin name
   like `playground-core` to convince yourself the loop closes.

When something doesn't work, check in this order:
- Backend log (where you `bun run start`'d)
- `curl /api/_plugins` for quarantine state
- `bun x tsc --noEmit` filtered to `backend/src/`
- §11 known issues

Have fun. Don't break the audit chain.
