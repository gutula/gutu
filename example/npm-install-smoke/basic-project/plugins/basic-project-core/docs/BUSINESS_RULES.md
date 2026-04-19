# Basic Project Core Business Rules

## Invariants

- Every record belongs to one tenant.

## Lifecycle notes

- _Document retention, activation, archival, and reversal rules._

## Actor expectations

- operator
- manager
- automation

## Decision boundaries

- Document which decisions are automated, which are recommendation-only, and which always require a human or approval checkpoint.
- Document which policies or compliance rules override convenience.
- Document what counts as a safe retry versus a risky duplicate.