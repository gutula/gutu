#!/usr/bin/env bash
# push-internet-products-repos.sh — create + push the 32 plugin repos
# introduced by the Internet-Product Clone Framework.
#
# Run AFTER `gh auth login` (web flow, select gutula org). Idempotent —
# re-running after partial success skips repos that already exist on
# GitHub and pushes only what's new locally.
#
# Each repo is initialised in `feat/scaffold` shape — entitlements-core
# is the full Phase 1 reference; the other 31 are manifest-only
# scaffolds, all already committed locally.

set -euo pipefail

PLUGINS=(
  "entitlements-core|Central authority for access decisions: plan benefits, content gates, region/age rules, revocations."
  "commerce-storefront-core|Consumer storefront sessions, carts, wishlists, checkout-intents, customer order pages."
  "reviews-ratings-core|Universal rating/review engine for products, sellers, drivers, content."
  "feed-core|Materialized feeds for social home, marketplace discovery, creator feeds, trending."
  "recommendations-core|Candidate generation and ranking signals for products, videos, audio, restaurants, jobs."
  "messaging-core|Direct/group/business chat, business inboxes, order/trip conversation threads."
  "trust-safety-core|Reports, cases, policies, decisions, restrictions, appeals, risk scoring."
  "usage-metering-core|Quotas, usage events, aggregates, overage rules, billing snapshots for AI/SaaS/streaming."
  "geospatial-routing-core|Service areas, geofences, ETA estimates, route + distance matrices."
  "realtime-presence-core|Online state, live location, typing, watch presence, heartbeats."
  "wallet-ledger-core|User/seller/driver/creator wallets, holds, payouts, ledger entries, reconciliation."
  "promotions-loyalty-core|Coupons, campaigns, redemptions, loyalty accounts, referrals, cashback."
  "ads-campaign-core|Native ads accounts, campaigns, ad groups, creatives, budgets, conversions, leads."
  "media-processing-core|Upload ingest, transcoding, thumbnails, captions, rendition state."
  "marketplace-core|Multi-seller marketplace: onboarding, listings, commission, settlement, dispute."
  "quick-commerce-core|Dark-store ops: serviceability, picker/packer tasks, substitutions, ETA promises."
  "restaurant-delivery-core|Outlets, menus, KOTs, food orders, prep-time, packaging, complaints."
  "last-mile-dispatch-core|Delivery jobs, riders, pickup/drop points, POD, COD, return pickups."
  "rental-core|Rentable assets, reservations, deposits, inspections, damage claims, late fees."
  "membership-access-core|Paid memberships, gated content, drip schedules, member benefits, trials, grace."
  "mobility-rides-core|Real-time ride-hailing: drivers, riders, trips, fare, surge, safety incidents."
  "media-streaming-core|OTT/audio titles, episodes, playback sessions, rights windows, age ratings."
  "social-graph-core|Profiles, follows, friendships, blocks, pages, groups, memberships."
  "posts-engagement-core|Posts, comments, reactions, shares, mentions, hashtags, counters."
  "short-video-core|TikTok/Reels-style short-form video: uploads, sounds, effects, duets, watch events."
  "professional-network-core|LinkedIn-style: profiles, company pages, jobs, applications, recruiter pipelines."
  "cloud-platform-core|Projects, environments, deployments, secrets, quotas, domains, log streams."
  "research-ops-core|Studies, hypotheses, protocols, experiments, findings, review packets."
  "dataset-governance-core|Dataset lineage, consent, license, sensitivity, retention, access."
  "model-registry-core|Models, versions, artifacts, evaluations, approvals, deployments, lineage."
  "experiment-tracking-core|Runs, parameters, metrics, artifacts, comparisons."
  "regulated-ai-compliance-core|Risk classes, controls, evidence packs, approval gates, incidents, audit reports."
)

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI not installed. brew install gh" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: gh not authenticated." >&2
  echo "       Run: gh auth login (select GitHub.com → HTTPS → web)" >&2
  exit 1
fi

failed=()
created=0
pushed=0

for entry in "${PLUGINS[@]}"; do
  IFS='|' read -r plugin description <<< "$entry"
  repo_name="gutu-plugin-$plugin"
  local_path="$ROOT/plugins/$repo_name"

  if [ ! -d "$local_path/.git" ]; then
    echo "==> SKIP $repo_name (not a git repo: $local_path)"
    continue
  fi

  echo "==> $repo_name"

  if gh repo view "gutula/$repo_name" >/dev/null 2>&1; then
    echo "    exists on GitHub"
  else
    if gh repo create "gutula/$repo_name" \
        --public \
        --description "$description" \
        --disable-wiki >/dev/null 2>&1; then
      echo "    created"
      created=$((created+1))
    else
      echo "    FAILED to create"
      failed+=("$repo_name")
      continue
    fi
  fi

  if (cd "$local_path" && git push -u origin main 2>&1 | tail -3 | sed 's/^/    /'); then
    pushed=$((pushed+1))
  else
    failed+=("$repo_name")
  fi
done

echo
if [ ${#failed[@]} -eq 0 ]; then
  echo "✓ Created $created, pushed $pushed of ${#PLUGINS[@]} repos to https://github.com/gutula"
else
  echo "✗ Failed: ${failed[*]}"
  exit 1
fi
