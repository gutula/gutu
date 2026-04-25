#!/usr/bin/env bash
# push-all-new-repos.sh — create + push every brand-new Gutu repo.
#
# Run AFTER `gh auth login` (web flow, select gutula org). Idempotent —
# re-running after partial success skips repos that already exist.
#
# Covers:
#   Storage layer (4 repos):
#     - libraries/gutu-lib-storage
#     - plugins/gutu-plugin-storage-local
#     - plugins/gutu-plugin-storage-s3
#     - plugins/gutu-plugin-storage-core
#
#   Editor layer (7 repos):
#     - libraries/gutu-lib-collab-realtime
#     - libraries/gutu-lib-editor-bridge
#     - plugins/gutu-plugin-spreadsheet-core
#     - plugins/gutu-plugin-document-editor-core
#     - plugins/gutu-plugin-slides-core
#     - plugins/gutu-plugin-collab-pages-core
#     - plugins/gutu-plugin-whiteboard-core

set -euo pipefail

REPOS=(
  "libraries/gutu-lib-storage|gutu-lib-storage|Storage adapter contract + registry. One interface, every backend (local, S3, R2, MinIO, Wasabi, B2, custom)."
  "plugins/gutu-plugin-storage-local|gutu-plugin-storage-local|Local-filesystem storage adapter implementing @platform/storage."
  "plugins/gutu-plugin-storage-s3|gutu-plugin-storage-s3|S3-compatible storage adapter — AWS, R2, MinIO, Wasabi, Backblaze B2, DO Spaces, Scaleway, Linode, Vultr, Oracle, IBM, custom."
  "plugins/gutu-plugin-storage-core|gutu-plugin-storage-core|Storage orchestration plugin — registry hydration, admin CRUD, presign + test-connection actions."

  "libraries/gutu-lib-collab-realtime|gutu-lib-collab-realtime|Yjs facade — IndexedDB + WebSocket + REST-fallback providers, awareness merging, ref-counted room manager."
  "libraries/gutu-lib-editor-bridge|gutu-lib-editor-bridge|Common EditorAdapter contract every visual editor in Gutu implements."
  "plugins/gutu-plugin-spreadsheet-core|gutu-plugin-spreadsheet-core|Excel-class spreadsheet for Gutu — Univer engine, formulas, conditional formatting, charts, pivots, XLSX I/O."
  "plugins/gutu-plugin-document-editor-core|gutu-plugin-document-editor-core|Word-class rich-text editor for Gutu — Univer engine, comments, headers/footers, DOCX I/O."
  "plugins/gutu-plugin-slides-core|gutu-plugin-slides-core|Presentation editor for Gutu — Univer Slides engine."
  "plugins/gutu-plugin-collab-pages-core|gutu-plugin-collab-pages-core|Notion-class block editor for Gutu — BlockSuite engine, embedded databases, code blocks, LaTeX."
  "plugins/gutu-plugin-whiteboard-core|gutu-plugin-whiteboard-core|Miro-class infinite canvas for Gutu — BlockSuite Edgeless engine."
)

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI not installed. Install with: brew install gh" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: gh not authenticated. Run: gh auth login" >&2
  echo "       (select GitHub.com → HTTPS → Login with a web browser)" >&2
  exit 1
fi

failed=()

for entry in "${REPOS[@]}"; do
  IFS='|' read -r rel_path repo_name description <<< "$entry"
  local_path="$ROOT/$rel_path"

  if [ ! -d "$local_path/.git" ]; then
    echo "==> SKIP $repo_name (not a git repo: $local_path)"
    continue
  fi

  echo "==> $repo_name"

  # Create the GitHub repo if it doesn't exist.
  if gh repo view "gutula/$repo_name" >/dev/null 2>&1; then
    echo "    exists on GitHub"
  else
    if gh repo create "gutula/$repo_name" \
        --public \
        --description "$description" \
        --disable-wiki >/dev/null 2>&1; then
      echo "    created on GitHub"
    else
      echo "    FAILED to create — check permissions on gutula org"
      failed+=("$repo_name")
      continue
    fi
  fi

  # Push.
  if (cd "$local_path" && git push -u origin main 2>&1 | tail -3); then
    echo "    pushed"
  else
    echo "    FAILED to push"
    failed+=("$repo_name")
  fi
done

echo
if [ ${#failed[@]} -eq 0 ]; then
  echo "✓ All 11 repos pushed to https://github.com/gutula"
else
  echo "✗ Failed: ${failed[*]}"
  exit 1
fi
