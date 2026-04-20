# Contracts

<p align="center">
  <img src="./docs/assets/gutu-mascot.png" alt="Gutu mascot" width="220" />
</p>

Canonical public contract surface for admin plugins.

![Maturity: Hardened](https://img.shields.io/badge/Maturity-Hardened-2563eb) ![Verification: Build+Typecheck+Lint+Test+Contracts](https://img.shields.io/badge/Verification-Build%2BTypecheck%2BLint%2BTest%2BContracts-2563eb) ![UI: Headless typed exports](https://img.shields.io/badge/UI-Headless%20typed%20exports-6b7280) ![Consumption: Imports + typed helpers](https://img.shields.io/badge/Consumption-Imports%20%2B%20typed%20helpers-2563eb)

## Part Of The Gutu Stack

| Aspect | Value |
| --- | --- |
| Repo kind | First-party library |
| Domain group | Core Data And Query |
| Primary focus | shared contracts, type utilities, cross-package consistency |
| Best when | You need reusable contracts or UI/runtime helpers with their own release cadence and docs. |
| Consumed through | Imports + typed helpers |

- Gutu libraries stay intentionally separate from apps and plugins so teams can version shared contracts, UI primitives, and runtime helpers without burying them in product code.
- This library should be consumed through explicit imports, providers, callbacks, and typed helpers rather than undocumented global extension points.

## What It Does Now

- Publishes 4 public modules from `@platform/contracts`: `@platform/admin-contracts`, `@platform/kernel`, `@platform/schema`, `zod`.
- Exports 3 named symbols through the public entrypoint, including `packageId`, `packageDisplayName`, `packageDescription`.
- Keeps the public surface headless and import-driven rather than requiring a UI runtime.
- Verification lanes present: Build+Typecheck+Lint+Test+Contracts with 1 contract file(s).

## Maturity

**Maturity Tier:** `Hardened`

Why this tier:
- Group: **Core Data And Query**
- Public modules: 4
- Named exports: 3
- Test files: 2
- Contract lane: present

## Verified API Summary

| Field | Value |
| --- | --- |
| Package ID | `contracts` |
| Import Name | `@platform/contracts` |
| UI Surface | Headless typed exports |
| Consumption Model | Imports + typed helpers |
| Verification | Build+Typecheck+Lint+Test+Contracts |

## Dependency And Compatibility Summary

| Field | Value |
| --- | --- |
| Package Name | `@platform/contracts` |
| Direct Dependencies | `@platform/admin-contracts`, `@platform/kernel`, `@platform/schema`, `zod` |
| Peer Dependencies | None |
| React Runtime | No |
| Workspace Requirement | Compatible Gutu workspace required |

## Capability Matrix

| Capability | Count / Mode | Notes |
| --- | --- | --- |
| Public Modules | 4 | `@platform/admin-contracts`, `@platform/kernel`, `@platform/schema`, `zod` |
| Named Exports | 3 | `packageId`, `packageDisplayName`, `packageDescription` |
| UI Surface | Headless typed exports | Headless typed helpers |
| Tests | 2 | Build+Typecheck+Lint+Test+Contracts |

## Quick Start For Integrators

Use this repo inside a **compatible Gutu workspace** or the **ecosystem certification workspace** so its `workspace:*` dependencies resolve honestly.

```bash
# from a compatible workspace that already includes this library's dependency graph
bun install
bun run build
bun run test
bun run docs:check
```

```ts
import { packageId, packageDisplayName } from "@platform/contracts";

console.log(packageId, packageDisplayName);
```

Use the root repo scripts for day-to-day work after the workspace is bootstrapped, or run the nested package directly from `framework/libraries/contracts` if you need lower-level control.

## Current Test Coverage

- `bun run build`
- `bun run typecheck`
- `bun run lint`
- `bun run test`
- `bun run docs:check`
- `bun run test:contracts`
- `bun run test:unit`
- Unit files: 1
- Contract files: 1
- Integration files: 0
- Migration files: 0

## Known Boundaries And Non-Goals

- Not a vertical application or domain plugin by itself.
- Not a generic hook bus or hidden orchestration layer.
- This library should be consumed through explicit imports, providers, callbacks, and typed helpers rather than undocumented global hooks.

## Recommended Next Milestones

- Strengthen contract coverage around the most widely consumed helper surfaces.
- Add deeper integration examples where downstream packages repeatedly compose the same APIs.
- Keep compatibility examples current as more extracted repos consume this library through the workspace vendor model.

## More Docs

- [Developer Guide](./DEVELOPER.md)
- [TODO](./TODO.md)
- [Security](./SECURITY.md)
- [Contributing](./CONTRIBUTING.md)
