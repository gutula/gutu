import { describe, expect, test } from "bun:test";
import { parseUnsubscribe } from "../../src/lib/mail/unsubscribe";

describe("List-Unsubscribe parsing", () => {
  test("returns null when header is missing", () => {
    expect(parseUnsubscribe(undefined, undefined)).toBeNull();
  });

  test("prefers HTTP one-click when post header present", () => {
    const p = parseUnsubscribe(
      "<https://list.example/unsub?u=1>, <mailto:unsub@list.example>",
      "List-Unsubscribe=One-Click",
    );
    expect(p?.oneClick).toBe(true);
    expect(p?.http?.method).toBe("POST");
  });

  test("falls back to HTTP GET without one-click header", () => {
    const p = parseUnsubscribe("<https://list.example/unsub?u=1>", undefined);
    expect(p?.http?.method).toBe("GET");
  });

  test("parses mailto", () => {
    const p = parseUnsubscribe("<mailto:unsub@list.example?subject=Unsub>", undefined);
    expect(p?.mailto?.to).toBe("unsub@list.example");
  });
});
