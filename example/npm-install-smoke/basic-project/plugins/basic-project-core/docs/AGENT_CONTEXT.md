# Basic Project Core Agent Context

Package/app id: `basic-project-core`
Target type: `package`  | Package kind: `app`
Location: `plugins/basic-project-core`

## Purpose

Starter business plugin for the Basic Project Core project workspace.

## System role

Describe how this target fits into the larger product, which teams depend on it, and which business outcomes it is responsible for.

## Declared dependencies

- auth-core
- org-tenant-core
- role-policy-core
- audit-core

## Provided capabilities

- basic-project-core.manage

## Requested capabilities

- ui.register.admin
- api.rest.mount
- data.write.basic-project-core

## Core resources

### `basic-project-core.records`

Primary tenant-scoped record used by the starter project.

Business purpose: Gives the team a clean default entity to extend.

Key fields:
- `label` (Label) | Short operator-facing title for the record. | Business meaning: Primary human-readable value.
- `status` (Status) | Current lifecycle stage of the record.
- `createdAt` (Created) | When the record was created.

## Core actions

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

## Core workflows

_No workflows were discovered for this target._