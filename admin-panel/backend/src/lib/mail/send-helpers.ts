/** Shared helpers for enqueueing outbound mail.
 *
 *  Used by the vacation responder, scheduled-send, undo-send pipeline. */

import { db, nowIso } from "../../db";
import { uuid } from "../id";
import { buildMessage, newMessageId, type OutgoingMessage } from "./mime/builder";

export interface EnqueueArgs {
  userId: string;
  tenantId: string;
  connectionId: string;
  message: Omit<OutgoingMessage, "messageId"> & { messageId?: string };
  releaseAt?: Date;
  kind?: "undo" | "scheduled" | "vacation" | "system";
  threadProviderId?: string;
  inReplyToProviderId?: string;
  idempotencyKey?: string;
}

export function enqueueSend(args: EnqueueArgs): { id: string; releaseAt: string } {
  const messageId = args.message.messageId ?? newMessageId(deriveDomain(args.message.from.email));
  const built = buildMessage({ ...args.message, messageId });
  const releaseAt = (args.releaseAt ?? new Date()).toISOString();
  const id = `ms_${uuid()}`;
  const idem = args.idempotencyKey ?? `${id}:${messageId}`;
  const kind = args.kind ?? "system";
  const snapshot = JSON.stringify({
    to: built.envelope.to.join(", "),
    cc: built.envelope.cc.join(", "),
    bcc: built.envelope.bcc.join(", "),
    subject: args.message.subject,
    hasHtml: !!args.message.html,
    hasText: !!args.message.text,
    kind,
  });

  db.prepare(
    `INSERT INTO mail_send_queue
       (id, tenant_id, user_id, connection_id, draft_snapshot, mime_blob,
        release_at, status, attempts, max_attempts, idempotency_key, kind,
        thread_id, in_reply_to, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'queued', 0, 5, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    args.tenantId,
    args.userId,
    args.connectionId,
    snapshot,
    Buffer.from(built.raw),
    releaseAt,
    idem,
    kind,
    args.threadProviderId ?? null,
    args.inReplyToProviderId ?? null,
    nowIso(),
    nowIso(),
  );
  return { id, releaseAt };
}

function deriveDomain(email: string): string {
  const at = email.indexOf("@");
  return at === -1 ? "gutu.local" : email.slice(at + 1);
}
