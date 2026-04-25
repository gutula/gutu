/** Auto-populate `mail.contact` from sent + received addresses.
 *
 *  Increments `useCount` on every sighting so the recipient picker can
 *  surface frequent correspondents first. Idempotent on (userId, email). */

import { db, nowIso } from "../../db";
import { uuid } from "../id";
import { isValidEmail, normalizeEmail } from "./address";

export function recordContactSeen(userId: string, tenantId: string, email: string, name?: string): void {
  if (!email || !isValidEmail(email)) return;
  const norm = normalizeEmail(email);
  const existing = db
    .prepare(
      `SELECT id, data FROM records WHERE resource = 'mail.contact'
       AND json_extract(data, '$.userId') = ? AND LOWER(json_extract(data, '$.email')) = ? LIMIT 1`,
    )
    .get(userId, norm) as { id: string; data: string } | undefined;
  const now = nowIso();
  if (existing) {
    const c = JSON.parse(existing.data) as { useCount?: number; name?: string };
    c.useCount = (c.useCount ?? 0) + 1;
    if (!c.name && name) c.name = name;
    db.prepare(`UPDATE records SET data = ?, updated_at = ? WHERE resource = 'mail.contact' AND id = ?`)
      .run(JSON.stringify({ ...c, updatedAt: now }), now, existing.id);
    return;
  }
  const id = `con_auto_${uuid()}`;
  const data = JSON.stringify({
    id,
    userId,
    tenantId,
    email: norm,
    name,
    tags: ["auto"],
    useCount: 1,
    createdAt: now,
    updatedAt: now,
  });
  db.prepare(
    `INSERT INTO records (resource, id, data, created_at, updated_at) VALUES ('mail.contact', ?, ?, ?, ?)`,
  ).run(id, data, now, now);
}
