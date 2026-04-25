/** Vacation responder — enqueues real outbound MIME via the send queue.
 *
 *  Anti-loop guards (RFC 3834): skip Auto-Submitted, Precedence: bulk,
 *  List-Id, List-Unsubscribe, and self-as-sender. One reply per sender
 *  per 7 days. */

import { db, nowIso } from "../db";
import { recordAudit } from "../lib/audit";
import { registerJob } from "./scheduler";
import { enqueueSend } from "../lib/mail/send-helpers";
import { plainTextToHtml } from "../lib/mail/mime/sanitize";
import { isValidEmail, parseAddress } from "../lib/mail/address";

const TICK_MS = parseInt(process.env.MAIL_VACATION_TICK_MS ?? `${10 * 60_000}`, 10);

async function tick(): Promise<void> {
  const settings = db
    .prepare(
      `SELECT id, data FROM records WHERE resource = 'mail.settings'
       AND json_extract(data, '$.vacation.enabled') = 1`,
    )
    .all() as { id: string; data: string }[];
  if (settings.length === 0) return;

  for (const s of settings) {
    let cfg: {
      userId: string;
      tenantId: string;
      defaultConnectionId?: string;
      vacation: {
        enabled?: boolean;
        from?: string;
        to?: string;
        subject?: string;
        body?: string;
        onlyContacts?: boolean;
      };
    };
    try { cfg = JSON.parse(s.data); } catch { continue; }
    if (!cfg.vacation?.enabled || !withinWindow(cfg.vacation.from, cfg.vacation.to)) continue;
    if (!cfg.defaultConnectionId) continue;

    const connRow = db
      .prepare(`SELECT data FROM records WHERE resource = 'mail.connection' AND id = ?`)
      .get(cfg.defaultConnectionId) as { data: string } | undefined;
    if (!connRow) continue;
    let conn: { email: string; status: string };
    try { conn = JSON.parse(connRow.data); } catch { continue; }
    if (conn.status !== "active") continue;

    const sinceIso = new Date(Date.now() - 7 * 86_400_000).toISOString();
    const messages = db
      .prepare(
        `SELECT data FROM records WHERE resource = 'mail.message'
         AND json_extract(data, '$.userId') = ? AND json_extract(data, '$.tenantId') = ?
         AND json_extract(data, '$.folder') = 'inbox'
         AND json_extract(data, '$.receivedAt') >= ?
         AND (json_extract(data, '$.isOutgoing') IS NULL OR json_extract(data, '$.isOutgoing') = 0)
         LIMIT 200`,
      )
      .all(cfg.userId, cfg.tenantId, sinceIso) as { data: string }[];

    for (const m of messages) {
      let msg: Record<string, unknown>;
      try { msg = JSON.parse(m.data); } catch { continue; }
      const headers = (msg.headers as Record<string, string> | undefined) ?? {};
      // RFC 3834 anti-loop conditions.
      if (headers["auto-submitted"] && headers["auto-submitted"].toLowerCase() !== "no") continue;
      if (headers["precedence"] && /(bulk|junk|list)/i.test(headers["precedence"])) continue;
      if (headers["list-id"] || headers["list-unsubscribe"]) continue;

      const fromEmail = ((msg.from as { email?: string } | undefined)?.email ?? "").toLowerCase();
      if (!fromEmail || !isValidEmail(fromEmail)) continue;
      if (fromEmail === conn.email.toLowerCase()) continue;
      if (cfg.vacation.onlyContacts && !inContacts(cfg.userId, fromEmail)) continue;

      const sentKey = `vacation_${cfg.userId}_${fromEmail}`;
      const last = db
        .prepare(`SELECT data FROM records WHERE resource = 'mail.vacation-sent' AND id = ?`)
        .get(sentKey) as { data: string } | undefined;
      if (last) {
        const ls = JSON.parse(last.data) as { sentAt: string };
        if (Date.parse(ls.sentAt) > Date.now() - 7 * 86_400_000) continue;
      }

      const fromAddr = parseAddress(conn.email);
      if (!fromAddr) continue;

      try {
        enqueueSend({
          userId: cfg.userId,
          tenantId: cfg.tenantId,
          connectionId: cfg.defaultConnectionId,
          kind: "vacation",
          threadProviderId: msg.providerThreadId as string | undefined,
          inReplyToProviderId: msg.messageIdHeader as string | undefined,
          idempotencyKey: `vacation:${sentKey}:${msg.id}`,
          message: {
            from: fromAddr,
            to: [{ email: fromEmail }],
            subject: cfg.vacation.subject || "Out of office",
            text: cfg.vacation.body || "I'm currently away and will reply when I'm back.",
            html: plainTextToHtml(cfg.vacation.body || "I'm currently away and will reply when I'm back."),
            inReplyTo: msg.messageIdHeader as string | undefined,
            references: [
              ...((msg.references as string[] | undefined) ?? []),
              ...(msg.messageIdHeader ? [msg.messageIdHeader as string] : []),
            ],
            headers: { "Auto-Submitted": "auto-replied", "X-Auto-Response-Suppress": "All" },
          },
        });
        recordAudit({
          actor: cfg.userId,
          action: "mail.vacation.replied",
          resource: "mail.message",
          recordId: String(msg.id),
          payload: { to: fromEmail },
        });
        db.prepare(
          `INSERT INTO records (resource, id, data, created_at, updated_at)
           VALUES ('mail.vacation-sent', ?, ?, ?, ?)
           ON CONFLICT(resource, id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
        ).run(
          sentKey,
          JSON.stringify({ id: sentKey, userId: cfg.userId, fromEmail, sentAt: nowIso(), tenantId: cfg.tenantId }),
          nowIso(),
          nowIso(),
        );
      } catch (err) {
        console.warn(`[mail-vacation] enqueue failed`, err);
      }
    }
  }
}

function withinWindow(from?: string, to?: string): boolean {
  const now = Date.now();
  if (from && Date.parse(from) > now) return false;
  if (to && Date.parse(to) < now) return false;
  return true;
}

function inContacts(userId: string, email: string): boolean {
  const r = db
    .prepare(
      `SELECT 1 FROM records WHERE resource = 'mail.contact'
       AND json_extract(data, '$.userId') = ? AND LOWER(json_extract(data, '$.email')) = ? LIMIT 1`,
    )
    .get(userId, email);
  return !!r;
}

export function registerMailVacation(): void {
  registerJob({ id: "mail.vacation", intervalMs: TICK_MS, fn: tick, runOnStart: false });
}
