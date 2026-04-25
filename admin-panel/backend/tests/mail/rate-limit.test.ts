import { describe, expect, test, beforeAll } from "bun:test";
import { Database } from "bun:sqlite";

beforeAll(() => {
  // Create a fresh in-memory db for tests (the rate limit module uses
  // process-global db; we prepopulate the table by running migrations).
  process.env.DB_PATH = ":memory:";
});

describe("rate limit", () => {
  test("token bucket allows N then rejects", async () => {
    // Lazy import so DB_PATH takes effect first.
    const { db } = await import("../../src/db");
    db.exec(`
      CREATE TABLE IF NOT EXISTS mail_rate_state (
        bucket_key TEXT PRIMARY KEY,
        tokens REAL NOT NULL,
        last_refill_at TEXT NOT NULL,
        max_tokens REAL NOT NULL,
        refill_per_s REAL NOT NULL
      );
    `);
    const { takeToken } = await import("../../src/lib/mail/rate-limit");
    const policy = { maxTokens: 3, refillPerS: 0 };
    const a = takeToken("test-bucket-A", policy);
    const b = takeToken("test-bucket-A", policy);
    const c = takeToken("test-bucket-A", policy);
    const d = takeToken("test-bucket-A", policy);
    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
    expect(c.allowed).toBe(true);
    expect(d.allowed).toBe(false);
    expect(d.retryAfterMs).toBeGreaterThan(0);
  });
});
