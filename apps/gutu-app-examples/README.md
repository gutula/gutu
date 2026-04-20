# Gutu Examples App

<p align="center">
  <img src="./docs/assets/gutu-mascot.png" alt="Gutu mascot" width="220" />
</p>

Reference app for example compositions built on the framework package and plugin surfaces.

## Where It Fits In Gutu

| Aspect | Value |
| --- | --- |
| Repo kind | First-party app |
| Role | Reference implementation for common framework assembly patterns |
| Solves | Shows how libraries, plugins, and `gutu-core` surfaces compose in practice |
| Depends on | `@platform/kernel` plus the shared app runtime |

## Why It Matters

- Teams evaluating the framework often need a realistic example before committing to the ecosystem.
- This app gives them composition patterns they can copy without guessing how the split repos are meant to work together.

## Source Layout

- `apps/examples`

## Quick Start

```bash
bun install
bun --cwd apps/examples run build
bun --cwd apps/examples run test
```
