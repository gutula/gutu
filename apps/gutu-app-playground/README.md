# Gutu Playground App

<p align="center">
  <img src="./docs/assets/gutu-mascot.png" alt="Gutu mascot" width="220" />
</p>

Sandbox app for interactive framework experiments and local feature prototyping.

## Where It Fits In Gutu

| Aspect | Value |
| --- | --- |
| Repo kind | First-party app |
| Role | Safe sandbox for trying new ideas against the framework foundations |
| Solves | Gives contributors a place to experiment without destabilizing the docs or operator surfaces |
| Depends on | `@platform/kernel` plus the shared app runtime |

## Why It Matters

- Framework work needs a fast loop for spikes, new surfaces, and local experiments.
- This app keeps experimentation inside the ecosystem while preserving cleaner boundaries in the more formal repos.

## Source Layout

- `apps/playground`

## Quick Start

```bash
bun install
bun --cwd apps/playground run build
bun --cwd apps/playground run test
```
