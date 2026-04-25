/** Push fan-out job.
 *
 *  Runs every 30s. Picks up `mail.push-pending` rows queued by the
 *  ingest path and dispatches them to every active subscription for the
 *  recipient user. Stale subscriptions (404 / 410 from the push service)
 *  are auto-removed. */

import { db, nowIso } from "../db";
import { sendPush, isPushConfigured, type PushSubscription } from "../lib/mail/push/vapid";
import { registerJob } from "./scheduler";

const TICK_MS = parseInt(process.env.MAIL_PUSH_TICK_MS ?? "30000", 10);

interface PendingRow {
  id: string;
  userId: string;
  tenantId: string;
  payload: { title?: string; body?: string; url?: string; tag?: string };
  createdAt: string;
}

async function tick(): Promise<void> {
  if (!isPushConfigured()) return;
  ensurePendingTable();
  const rows = db
    .prepare(`SELECT id, user_id, tenant_id, payload, created_at FROM mail_push_pending ORDER BY created_at ASC LIMIT 50`)
    .all() as { id: string; user_id: string; tenant_id: string; payload: string; created_at: string }[];
  for (const r of rows) {
    db.prepare(`DELETE FROM mail_push_pending WHERE id = ?`).run(r.id);
    let pending: PendingRow;
    try {
      pending = { id: r.id, userId: r.user_id, tenantId: r.tenant_id, payload: JSON.parse(r.payload), createdAt: r.created_at };
    } catch { continue; }
    const subs = db
      .prepare(
        `SELECT id, data FROM records WHERE resource = 'mail.push-subscription'
         AND json_extract(data, '$.userId') = ? AND json_extract(data, '$.tenantId') = ?`,
      )
      .all(pending.userId, pending.tenantId) as { id: string; data: string }[];
    for (const s of subs) {
      let sub: PushSubscription & { id: string };
      try { sub = JSON.parse(s.data); } catch { continue; }
      try {
        const res = await sendPush({
          subscription: sub,
          payload: JSON.stringify(pending.payload),
          ttl: 60 * 60,
          topic: pending.payload.tag,
          urgency: "high",
        });
        if (res.status === 404 || res.status === 410) {
          db.prepare(`DELETE FROM records WHERE resource = 'mail.push-subscription' AND id = ?`).run(s.id);
        }
      } catch (err) {
        console.warn(`[mail-push] send failed`, err);
      }
    }
  }
}

function ensurePendingTable(): void {
  db.exec(
    `CREATE TABLE IF NOT EXISTS mail_push_pending (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,
  );
}

export function enqueuePush(userId: string, tenantId: string, payload: { title?: string; body?: string; url?: string; tag?: string }): void {
  ensurePendingTable();
  db.prepare(
    `INSERT INTO mail_push_pending (id, user_id, tenant_id, payload, created_at) VALUES (?, ?, ?, ?, ?)`,
  ).run(`pp_${nowIso()}_${Math.random().toString(16).slice(2, 8)}`, userId, tenantId, JSON.stringify(payload), nowIso());
}

export function registerMailPush(): void {
  registerJob({ id: "mail.push", intervalMs: TICK_MS, fn: tick, runOnStart: false });
}
