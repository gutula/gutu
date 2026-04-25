#!/usr/bin/env bash
# push-storage-repos.sh — create the 4 new storage repos under gutula/ and push.
#
# Run this AFTER `gh auth login` (web flow, select gutula org) — or create the
# 4 repos manually via https://github.com/organizations/gutula/repositories/new
# and then just run the push loop at the bottom.

set -euo pipefail

REPOS=(
  "libraries/gutu-lib-storage|gutu-lib-storage|Storage adapter contract + registry (local, S3, R2, MinIO, Wasabi, B2, custom). One interface, every backend."
  "plugins/gutu-plugin-storage-local|gutu-plugin-storage-local|Local-filesystem storage adapter implementing @platform/storage."
  "plugins/gutu-plugin-storage-s3|gutu-plugin-storage-s3|S3-compatible storage adapter. AWS, Cloudflare R2, MinIO, Wasabi, Backblaze B2, DO Spaces, Scaleway, Linode, Vultr, Oracle, IBM, custom."
  "plugins/gutu-plugin-storage-core|gutu-plugin-storage-core|Storage orchestration plugin — declares backends, hydrates registry, admin CRUD + presign/test actions."
)

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

for entry in "${REPOS[@]}"; do
  IFS='|' read -r rel_path repo_name description <<< "$entry"
  local_path="$ROOT/$rel_path"

  echo "==> $repo_name"

  # Create the GitHub repo if it doesn't already exist.
  if gh repo view "gutula/$repo_name" >/dev/null 2>&1; then
    echo "    exists on GitHub — skipping create"
  else
    gh repo create "gutula/$repo_name" \
      --public \
      --description "$description" \
      --source "$local_path" \
      --remote origin \
      --disable-wiki \
      2>&1 | tail -1 || {
        echo "    gh repo create failed — falling back to git push (assume repo exists)"
      }
  fi

  # Push main.
  (cd "$local_path" && git push -u origin main 2>&1 | tail -2)
done

echo
echo "All 4 storage repos pushed to https://github.com/gutula"
