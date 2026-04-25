import { db } from "./db";

/** All schema lives here. Every resource goes through a single generic
 *  `records` table keyed by (resource, id), with the record body stored as
 *  JSON. That keeps adding a resource zero-effort and lets the generic CRUD
 *  handler be one file. For hot queries we index json-extracted fields when
 *  needed (see query.ts).
 *
 *  Users + sessions are proper tables because auth touches them on every
 *  request. */
export function migrate(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS records (
      resource   TEXT NOT NULL,
      id         TEXT NOT NULL,
      data       TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (resource, id)
    );
    CREATE INDEX IF NOT EXISTS records_resource_idx ON records(resource);
    CREATE INDEX IF NOT EXISTS records_updated_idx  ON records(resource, updated_at DESC);

    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE,
      name          TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'member',
      password_hash TEXT NOT NULL,
      email_verified_at TEXT,
      mfa_secret    TEXT,
      mfa_enabled   INTEGER NOT NULL DEFAULT 0,
      created_at    TEXT NOT NULL,
      updated_at    TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS users_email_idx ON users(LOWER(email));

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      token      TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used_at    TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS pw_reset_user_idx ON password_reset_tokens(user_id);

    CREATE TABLE IF NOT EXISTS email_verify_tokens (
      token      TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used_at    TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token      TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      ua         TEXT,
      ip         TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);

    CREATE TABLE IF NOT EXISTS audit_events (
      id          TEXT PRIMARY KEY,
      actor       TEXT NOT NULL,
      action      TEXT NOT NULL,
      resource    TEXT NOT NULL,
      record_id   TEXT,
      level       TEXT NOT NULL DEFAULT 'info',
      ip          TEXT,
      occurred_at TEXT NOT NULL,
      payload     TEXT
    );
    CREATE INDEX IF NOT EXISTS audit_occurred_idx ON audit_events(occurred_at DESC);

    -- Per-document access control list. Each row grants a SUBJECT a
    -- ROLE on a specific (resource, record_id). The subject is one of:
    --   user        — a single user id; row created on every share
    --   tenant      — every member of a tenant gets the role; default
    --                 row created on doc creation so existing UX (every
    --                 tenant member sees every doc) keeps working
    --   public-link — anyone holding the link token, scoped to a role
    --                 (typically "viewer")
    --   public      — unauthenticated read (anonymous web; we don't
    --                 expose this in the UI yet but the row format is
    --                 ready for it)
    -- Roles: 'owner' > 'editor' > 'viewer' (ordering enforced in code).
    CREATE TABLE IF NOT EXISTS editor_acl (
      resource     TEXT NOT NULL,
      record_id    TEXT NOT NULL,
      subject_kind TEXT NOT NULL,
      subject_id   TEXT NOT NULL,
      role         TEXT NOT NULL,
      granted_by   TEXT NOT NULL,
      granted_at   TEXT NOT NULL,
      PRIMARY KEY (resource, record_id, subject_kind, subject_id)
    );
    CREATE INDEX IF NOT EXISTS editor_acl_subject_idx
      ON editor_acl(subject_kind, subject_id);
    CREATE INDEX IF NOT EXISTS editor_acl_record_idx
      ON editor_acl(resource, record_id);
  `);

  // Backfill-style ALTERs for columns added after the initial schema.
  const userCols = new Set(
    (db
      .prepare("PRAGMA table_info(users)")
      .all() as { name: string }[]).map((c) => c.name),
  );
  if (!userCols.has("email_verified_at"))
    db.exec("ALTER TABLE users ADD COLUMN email_verified_at TEXT");
  if (!userCols.has("mfa_secret"))
    db.exec("ALTER TABLE users ADD COLUMN mfa_secret TEXT");
  if (!userCols.has("mfa_enabled"))
    db.exec("ALTER TABLE users ADD COLUMN mfa_enabled INTEGER NOT NULL DEFAULT 0");

  // One-time backfill: any editor record that pre-dates the ACL
  // schema has zero rows in editor_acl, which would make it invisible
  // to every user (the list endpoint joins on accessible IDs). Seed a
  // tenant-editor row so existing docs keep behaving like before
  // (every member of the tenant can edit) and a user-owner row for the
  // creator if we know who created it. The "have we backfilled?"
  // marker is stored in `meta`. Idempotent.
  const backfilled = db
    .prepare(`SELECT value FROM meta WHERE key = ?`)
    .get("editor_acl_backfilled") as { value: string } | undefined;
  if (!backfilled) {
    const editorResources = [
      "spreadsheet.workbook",
      "document.page",
      "slides.deck",
      "collab.page",
      "whiteboard.canvas",
    ];
    const records = db
      .prepare(
        `SELECT resource, id, data FROM records
         WHERE resource IN (${editorResources.map(() => "?").join(",")})`,
      )
      .all(...editorResources) as { resource: string; id: string; data: string }[];
    let inserted = 0;
    const insertStmt = db.prepare(
      `INSERT OR IGNORE INTO editor_acl
         (resource, record_id, subject_kind, subject_id, role, granted_by, granted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    );
    const now = new Date().toISOString();
    for (const row of records) {
      let parsed: { tenantId?: string; createdBy?: string };
      try {
        parsed = JSON.parse(row.data) as { tenantId?: string; createdBy?: string };
      } catch {
        continue;
      }
      const tenantId = parsed.tenantId;
      const creator = parsed.createdBy;
      if (tenantId) {
        insertStmt.run(row.resource, row.id, "tenant", tenantId, "editor", "system:backfill", now);
        inserted++;
      }
      if (creator) {
        // Resolve email → user id (creator is stored as email).
        const userRow = db
          .prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(?)")
          .get(creator) as { id: string } | undefined;
        if (userRow) {
          insertStmt.run(row.resource, row.id, "user", userRow.id, "owner", "system:backfill", now);
          inserted++;
        }
      }
    }
    db.prepare(
      `INSERT INTO meta (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    ).run("editor_acl_backfilled", new Date().toISOString());
    if (inserted > 0) {
      // eslint-disable-next-line no-console
      console.log(`[migrate] backfilled ${inserted} editor_acl rows for ${records.length} pre-existing records`);
    }
  }
}
