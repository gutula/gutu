/** /api/mail/push — VAPID public key + subscribe / unsubscribe endpoints.
 *
 *  Subscriptions are persisted as `mail.push-subscription` resource rows.
 *  The mail-sync job dispatches a push when an unread thread lands. */

import { Hono } from "hono";
import { requireAuth } from "../../middleware/auth";
import { db, nowIso } from "../../db";
import { uuid } from "../../lib/id";
import { errorResponse, tenantId, userIdOf } from "./_helpers";
import { isPushConfigured, vapidPublicKey } from "../../lib/mail/push/vapid";

export const pushRoutes = new Hono();
pushRoutes.use("*", requireAuth);

pushRoutes.get("/key", (c) => {
  return c.json({ configured: isPushConfigured(), publicKey: vapidPublicKey() });
});

pushRoutes.post("/subscribe", async (c) => {
  let body: {
    endpoint?: string;
    expirationTime?: number | null;
    keys?: { p256dh?: string; auth?: string };
    userAgent?: string;
  } = {};
  try { body = await c.req.json(); } catch { return errorResponse(c, 400, "invalid-json", "JSON body required"); }
  if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
    return errorResponse(c, 400, "invalid-subscription", "endpoint + keys.p256dh + keys.auth required");
  }
  const id = `psub_${uuid()}`;
  const now = nowIso();
  const data = JSON.stringify({
    id,
    userId: userIdOf(c),
    tenantId: tenantId(),
    endpoint: body.endpoint,
    expirationTime: body.expirationTime ?? null,
    keys: { p256dh: body.keys.p256dh, auth: body.keys.auth },
    userAgent: body.userAgent ?? c.req.header("user-agent") ?? "",
    createdAt: now,
    updatedAt: now,
  });
  db.prepare(
    `INSERT INTO records (resource, id, data, created_at, updated_at)
     VALUES ('mail.push-subscription', ?, ?, ?, ?)`,
  ).run(id, data, now, now);
  return c.json({ id, ok: true });
});

pushRoutes.delete("/subscribe/:id", (c) => {
  const id = c.req.param("id") ?? "";
  const row = db
    .prepare(`SELECT data FROM records WHERE resource = 'mail.push-subscription' AND id = ?`)
    .get(id) as { data: string } | undefined;
  if (!row) return errorResponse(c, 404, "not-found", "subscription not found");
  const rec = JSON.parse(row.data) as { userId: string };
  if (rec.userId !== userIdOf(c)) return errorResponse(c, 403, "forbidden", "not your subscription");
  db.prepare(`DELETE FROM records WHERE resource = 'mail.push-subscription' AND id = ?`).run(id);
  return c.json({ ok: true });
});

pushRoutes.get("/subscriptions", (c) => {
  const rows = db
    .prepare(
      `SELECT data FROM records WHERE resource = 'mail.push-subscription'
       AND json_extract(data, '$.userId') = ?`,
    )
    .all(userIdOf(c)) as { data: string }[];
  return c.json({
    rows: rows.map((r) => {
      const o = JSON.parse(r.data) as Record<string, unknown>;
      return { id: o.id, userAgent: o.userAgent, createdAt: o.createdAt };
    }),
  });
});
