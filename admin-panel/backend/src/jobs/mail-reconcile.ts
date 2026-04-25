/** Microsoft Graph send reconciliation.
 *
 *  /sendMail returns 202 with no provider id. We schedule a sync
 *  intent for every connection that has a recent "pending-" entry in
 *  mail_send_queue so the next sync picks up the actual sent message
 *  and we can patch the queue row with the real providerMessageId. */

import { db, nowIso } from "../db";
import { uuid } from "../lib/id";
import { registerJob } from "./scheduler";

const TICK_MS = parseInt(process.env.MAIL_RECONCILE_TICK_MS ?? "60000", 10);

async function tick(): Promise<void> {
  // Find recently-sent rows with placeholder provider ids (microsoft).
  const rows = db
    .prepare(
      `SELECT id, connection_id FROM mail_send_queue
       WHERE status = 'sent' AND provider_message_id LIKE 'pending-%' AND sent_at >= ?
       LIMIT 50`,
    )
    .all(new Date(Date.now() - 30 * 60_000).toISOString()) as { id: string; connection_id: string }[];
  if (rows.length === 0) return;
  ensureIntentTable();
  const seen = new Set<string>();
  for (const r of rows) {
    if (seen.has(r.connection_id)) continue;
    seen.add(r.connection_id);
    db.prepare(
      `INSERT INTO mail_sync_intent (id, connection_id, reason, created_at) VALUES (?, ?, 'reconcile', ?)`,
    ).run(`syn_${uuid()}`, r.connection_id, nowIso());
  }
}

function ensureIntentTable(): void {
  db.exec(
    `CREATE TABLE IF NOT EXISTS mail_sync_intent (
      id TEXT PRIMARY KEY,
      connection_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,
  );
}

export function registerMailReconcile(): void {
  registerJob({ id: "mail.reconcile", intervalMs: TICK_MS, fn: tick, runOnStart: false });
}
