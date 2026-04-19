# Basic Project

This is a clean Gutu project workspace.

## Layout

- `apps/*` for runnable hosts and verification apps
- `plugins/*` for project-specific business modules
- `libraries/*` for local shared code if you need it later
- `vendor/framework/gutu` for the vendored framework distribution
- `vendor/plugins/*` and `vendor/libraries/*` for future store-installed extensions
- `docs/*` for project context and agent understanding material

## Starter content

- app host: `basic-project-studio`
- business plugin: `basic-project-core`

## First steps

```bash
bun install
bun run docs:scaffold
bun run docs:index
bun run ci:check
```

## Useful commands

- `bun run gutu -- --help`
- `bun run gutu -- docs validate --all`
- `bun run gutu -- init ../another-project`
- `bun run build`
- `bun run ci:check`
