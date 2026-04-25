import { describe, expect, test } from "bun:test";
import { computeThreadKey } from "../../src/lib/mail/threading";

describe("threading", () => {
  test("groups messages with shared in-reply-to", () => {
    const map = new Map<string, string>();
    map.set("a@x", "thread-A");
    const r = computeThreadKey(
      { messageId: "b@x", inReplyTo: "a@x", references: ["a@x"], receivedAt: new Date().toISOString() },
      (id) => map.get(id) ?? null,
    );
    expect(r.threadKey).toBe("thread-A");
  });

  test("falls back to subject-bucketed thread when no parent matches", () => {
    const r = computeThreadKey(
      { messageId: "x@y", subject: "Project Apollo", receivedAt: "2026-01-15T00:00:00.000Z" },
      () => null,
    );
    expect(r.threadKey.startsWith("subj:")).toBe(true);
  });

  test("standalone thread for messages with no signal", () => {
    const r = computeThreadKey(
      { messageId: "lonely@x", receivedAt: "2026-01-15T00:00:00.000Z" },
      () => null,
    );
    expect(r.threadKey.startsWith("msg:") || r.threadKey.startsWith("subj:")).toBe(true);
  });

  test("Re:/Fwd: collapse to same subject bucket", () => {
    const a = computeThreadKey(
      { messageId: "1@x", subject: "Apollo", receivedAt: "2026-01-15T00:00:00.000Z" },
      () => null,
    );
    const b = computeThreadKey(
      { messageId: "2@x", subject: "Re: Apollo", receivedAt: "2026-01-15T03:00:00.000Z" },
      () => null,
    );
    expect(a.threadKey).toBe(b.threadKey);
  });
});
