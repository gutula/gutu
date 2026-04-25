/** Seed demo mail data — only when no real connection exists.
 *
 *  Idempotent: detects existing `mail.connection` rows and skips. The
 *  fixture is a stub Gmail-shaped connection plus 6 threads, sample
 *  labels, signature, contacts, and one rule. Bodies route through the
 *  ingest pipeline so trackers/sanitization/auth-results are exercised. */

import { db, nowIso } from "../db";
import { encryptString } from "../lib/mail/crypto/at-rest";
import { ingestMessage } from "../lib/mail/ingest";

interface SeedResult { resource: string; n: number }

export function seedMail(): SeedResult[] {
  const out: SeedResult[] = [];
  const existing = db
    .prepare(`SELECT COUNT(*) AS c FROM records WHERE resource = 'mail.connection'`)
    .get() as { c: number };
  if (existing.c > 0) return out;
  if (process.env.MAIL_SEED_DEMO !== "1") return out;

  const userRow = db.prepare(`SELECT id, email FROM users LIMIT 1`).get() as { id: string; email: string } | undefined;
  if (!userRow) return out;
  const userId = userRow.id;
  const tenantId = "default";

  const now = nowIso();
  const connectionId = "demo_conn_1";
  const connection = {
    id: connectionId,
    userId,
    tenantId,
    provider: "imap",
    email: userRow.email,
    displayName: "Demo mailbox",
    status: "active",
    accessTokenCipher: Buffer.from(encryptString("demo-token")).toString("base64"),
    isDefault: true,
    imapHost: "demo.local",
    imapPort: 993,
    imapTLS: true,
    smtpHost: "demo.local",
    smtpPort: 587,
    smtpTLS: true,
    username: userRow.email,
    createdAt: now,
    updatedAt: now,
  };
  insert("mail.connection", connection);

  const labels = [
    { id: "demo_label_work", name: "work", color: "#06B6D4", order: 1 },
    { id: "demo_label_bills", name: "bills", color: "#F59E0B", order: 2 },
  ];
  for (const l of labels) {
    insert("mail.label", { ...l, userId, tenantId, createdAt: now, updatedAt: now });
  }

  insert("mail.signature", {
    id: "demo_sig",
    userId,
    tenantId,
    name: "Default",
    bodyHtml: `<p>— ${userRow.email}</p>`,
    default: true,
    createdAt: now,
    updatedAt: now,
  });

  // Demo threads + messages.
  const senders = [
    { name: "Acme Billing", email: "billing@acme.test", subject: "Invoice INV-1023 ready" },
    { name: "Project Apollo", email: "team@apollo.test", subject: "Sprint review notes" },
    { name: "GitHub", email: "noreply@github.com", subject: "Pull request reviewed" },
    { name: "Stripe", email: "support@stripe.test", subject: "Receipt for your subscription" },
    { name: "Calendar", email: "calendar@acme.test", subject: "Meeting invite — quarterly review" },
    { name: "Newsletter", email: "news@example.test", subject: "Weekly digest" },
  ];

  const known = new Set<string>();
  let n = 0;
  for (const [i, s] of senders.entries()) {
    const threadId = `mt_demo_${i}`;
    const messageProviderId = `demo_msg_${i}`;
    const html = `<p>This is a demo message from <b>${escapeHtml(s.name)}</b>.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`;
    const receivedAt = new Date(Date.now() - i * 3600_000).toISOString();
    // Upsert the thread row first so the inbox shows it instantly.
    insert("mail.thread", {
      id: threadId,
      threadId,
      connectionId,
      tenantId,
      userId,
      providerThreadId: messageProviderId,
      providerLastMessageId: messageProviderId,
      subject: s.subject,
      fromName: s.name,
      fromEmail: s.email,
      participants: [{ name: s.name, email: s.email }],
      labelIds: i === 0 ? ["demo_label_bills"] : i === 1 ? ["demo_label_work"] : [],
      folder: "inbox",
      hasAttachment: i === 0,
      hasCalendarInvite: i === 4,
      unreadCount: i < 3 ? 1 : 0,
      messageCount: 1,
      preview: "This is a demo message…",
      lastMessageAt: receivedAt,
      starred: i === 1,
      createdAt: receivedAt,
      updatedAt: receivedAt,
    });
    ingestMessage({
      id: `mm_${connectionId}_${messageProviderId}`,
      threadId,
      connectionId,
      tenantId,
      userId,
      providerMessageId: messageProviderId,
      providerThreadId: messageProviderId,
      messageIdHeader: `${messageProviderId}@demo.local`,
      from: { name: s.name, email: s.email },
      to: [{ email: userRow.email }],
      cc: [],
      bcc: [],
      replyTo: [],
      subject: s.subject,
      bodyHtml: html,
      bodyText: undefined,
      receivedAt,
      attachments: [],
      labelIds: [],
      folder: "inbox",
      isRead: i >= 3,
      isStarred: i === 1,
      headers: {
        "authentication-results": "demo.local; spf=pass; dkim=pass; dmarc=pass",
        "from": `${s.name} <${s.email}>`,
        "to": userRow.email,
        "subject": s.subject,
        "date": receivedAt,
      },
    }, known);
    n++;
  }

  out.push({ resource: "mail.connection", n: 1 });
  out.push({ resource: "mail.label", n: labels.length });
  out.push({ resource: "mail.signature", n: 1 });
  out.push({ resource: "mail.thread", n });
  out.push({ resource: "mail.message", n });
  return out;
}

function insert(resource: string, rec: Record<string, unknown>): void {
  db.prepare(
    `INSERT OR REPLACE INTO records (resource, id, data, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(
    resource,
    String(rec.id),
    JSON.stringify(rec),
    String(rec.createdAt ?? nowIso()),
    String(rec.updatedAt ?? nowIso()),
  );
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] ?? c));
}
