# Gutu Mail — operations runbook

## First-time setup

1. **Encryption key** — generate and persist `MAIL_AT_REST_KEY`:

   ```sh
   openssl rand -base64 32
   ```

   Store this in your secret manager. Losing it makes all encrypted
   tokens, drafts, and bodies unrecoverable.

2. **OAuth providers** — register apps:

   * Google Cloud Console → OAuth 2.0 client ID → Web application
     * Authorized redirect URI: `${PUBLIC_BASE_URL}/api/mail/connections/oauth/google/callback`
     * Scopes: `gmail.modify`, `gmail.send`, `gmail.labels`, `gmail.metadata`,
       `userinfo.email`, `userinfo.profile`, `openid`
   * Azure Entra ID → App registrations → Web platform
     * Redirect URI: `${PUBLIC_BASE_URL}/api/mail/connections/oauth/microsoft/callback`
     * API permissions: `Mail.ReadWrite`, `Mail.Send`,
       `MailboxSettings.ReadWrite`, `User.Read`, `offline_access`

3. **Push notifications (optional)** — Gmail uses Pub/Sub, Graph uses
   change-notification webhooks. Both need a publicly-reachable HTTPS
   URL. In dev, expose `${PUBLIC_BASE_URL}` via cloudflared or ngrok.

4. **AI provider (optional)** — pick one in `MAIL_AI_PROVIDER` and set
   the matching key. AI is opt-in per tenant + per user; tenant
   policy at `/api/mail/settings/tenant` controls global availability.

5. **VAPID keys (optional, for browser push)** — generate a P-256
   keypair using your tooling of choice and set
   `MAIL_PUSH_VAPID_PUBLIC` / `MAIL_PUSH_VAPID_PRIVATE` /
   `MAIL_PUSH_VAPID_SUBJECT`.

## Health checks

* `GET /api/health` — overall liveness
* `GET /api/mail/health` — mail plugin liveness
* `GET /api/mail/connections` (with auth) — must return 200

## Routine operations

| What | How |
|---|---|
| Force a sync for one connection | Insert into `mail_sync_intent (id, connection_id, reason='manual')`; the next tick picks it up |
| Drain stuck send queue | `bun run scripts/admin/drain-send-queue.ts` (operator script — optional) |
| Reindex search | Set `indexedAt = NULL` on `mail.message` rows; the index job rebuilds |
| Rotate at-rest key | Set the new key as `MAIL_AT_REST_KEY` (version N+1), keep old as `_OLD`; reads transparent. Re-encryption job re-keys at idle. |
| Purge a tenant | Delete `mail.connection`, `mail.thread`, `mail.message`, `mail_send_queue`, `mail_body`, `mail_search`, `mail_vector` rows by tenant_id |

## Failure modes + responses

* **OAuth refresh-token revoked** → connection moves to `auth_required`,
  surfaced in nav + Connections settings. User re-authorizes.
* **Provider 429** → driver backs off via token-bucket; sync resumes
  automatically; surfaced as `lastError` on connection.
* **Gmail history-id expired** → driver returns `fullRescanRequired`;
  next sync does a full pull from the last folder cursor.
* **VAPID key missing in production** → push silently disables (log
  warning); rest of the system continues normally.
* **Send fails after max retries** → row marked `status='failed'` in
  `mail_send_queue`, audited as `mail.message.failed`. User sees the
  bounce in the developer panel.
* **Image proxy timeout** → cached as `blocked_reason` so retries
  don't hammer the upstream.

## Audit + observability

Every state change writes to `audit_events`. Common queries:

```sql
-- Last 24h of vacation auto-replies
SELECT actor, payload FROM audit_events
WHERE action = 'mail.vacation.replied' AND occurred_at > datetime('now','-1 day');

-- Trackers blocked by tenant
SELECT json_extract(data, '$.host') AS host, COUNT(*) AS n
FROM records
WHERE resource = 'mail.tracking-block'
GROUP BY host ORDER BY n DESC LIMIT 50;

-- Send queue health
SELECT status, COUNT(*) FROM mail_send_queue GROUP BY status;

-- AI cost (USD micros) per tenant in the last 30 days
SELECT tenant_id, SUM(cost_usd_micros) / 1e6 AS usd
FROM mail_ai_usage WHERE created_at > datetime('now','-30 day')
GROUP BY tenant_id;
```

## Backup + restore

* **Backup**: snapshot `data.db` while the WAL is checkpointed
  (`PRAGMA wal_checkpoint(TRUNCATE)`); copy storage adapter contents
  for any attachments stored as blobs.
* **Restore**: stop the service, replace `data.db`, restart. Encrypted
  tokens remain valid as long as `MAIL_AT_REST_KEY` matches.

## Test suite

```sh
cd backend
bun test tests/mail/
```

11 test files, ~56 assertions cover: address parsing, MIME round-trip,
HTML sanitization (XSS, event handlers, javascript: URL, expression(),
cid: rewriting, tracker logging), AES-GCM round-trip + tampering
detection, query operator parsing + compilation, JWZ-lite threading,
ICS REQUEST/REPLY, SPF/DKIM/DMARC parsing + phish heuristics,
List-Unsubscribe (one-click + mailto), token-bucket rate limit,
tracker-host classification.
