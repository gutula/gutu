# Gutu Platform Dev Console

<p align="center">
  <img src="./docs/assets/gutu-mascot.png" alt="Gutu mascot" width="220" />
</p>

Developer harness for verifying the platform admin workbench, AI operator surfaces, and shell integrations.

## Where It Fits In Gutu

| Aspect | Value |
| --- | --- |
| Repo kind | First-party app |
| Role | Operator-facing verification surface for admin, AI, dashboard, and notification flows |
| Solves | Lets the ecosystem prove UI and orchestration behavior in one place instead of only through unit tests |
| Depends on | `@platform/admin-shell-workbench`, `@platform/ui-shell`, `@platform/plugin-solver`, and selected plugins |

## Why It Matters

- Gutu is not only a package graph; it also needs a believable operator experience.
- This app acts as the place where product teams can feel how the framework behaves from an admin and orchestration point of view.

## Source Layout

- `apps/platform-dev-console`

## Quick Start

```bash
bun install
bun --cwd apps/platform-dev-console run build
bun --cwd apps/platform-dev-console run test
bun --cwd apps/platform-dev-console run test:e2e
```
