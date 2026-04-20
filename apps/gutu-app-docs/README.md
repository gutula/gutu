# Gutu Docs App

<p align="center">
  <img src="./docs/assets/gutu-mascot.png" alt="Gutu mascot" width="220" />
</p>

Documentation surface for framework concepts, guides, and reference material.

## Where It Fits In Gutu

| Aspect | Value |
| --- | --- |
| Repo kind | First-party app |
| Role | Canonical docs and reference surface for framework and ecosystem learning |
| Solves | Gives operators, integrators, and contributors one place to read the story behind the split ecosystem |
| Depends on | `@platform/kernel` plus the shared app runtime |

## Why It Matters

- A modular framework is only useful when teams can understand how the parts fit together.
- This app turns the framework’s concepts, guides, and reference material into a standalone surface instead of burying them in code-only repos.

## Source Layout

- `apps/docs`

## Quick Start

```bash
bun install
bun --cwd apps/docs run build
bun --cwd apps/docs run test
```
