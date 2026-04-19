# Basic Project Core Flows

## Happy paths

_No workflows were discovered for this target._

## Action-level flows

### `basic-project-core.records.publish`

Moves a record into the active state.

Permission: `basic-project-core.records.publish`

Business purpose: Provides a safe command for activation.

Preconditions:
- The record must already exist.

Side effects:
- The record appears in active views.

Forbidden shortcuts:
- Do not write the status directly in storage.

## Cross-package interactions

- Describe upstream triggers, downstream side effects, notifications, and jobs.
- Document when this target depends on auth, approvals, billing, or data freshness from another package.
- Document how failures recover and who owns reconciliation.