import { describe, expect, test } from "bun:test";
import { parseAuthResults, phishHeuristics } from "../../src/lib/mail/verification";

describe("Authentication-Results parsing", () => {
  test("extracts spf/dkim/dmarc verdicts", () => {
    const v = parseAuthResults({
      "authentication-results": "mx.example.com; spf=pass; dkim=pass header.d=x.test; dmarc=pass action=none",
    });
    expect(v.spf).toBe("pass");
    expect(v.dkim).toBe("pass");
    expect(v.dmarc).toBe("pass");
  });

  test("returns source=none when header absent", () => {
    expect(parseAuthResults({}).source).toBe("none");
  });
});

describe("phishHeuristics", () => {
  test("scores DMARC failure highly", () => {
    const h = phishHeuristics(
      "support@bank.test",
      "Customer Support",
      "Verify account",
      "Click here to reset password",
      { dmarc: "fail", source: "header" },
      false,
    );
    expect(h.score).toBeGreaterThanOrEqual(40);
    expect(h.reasons.some((r) => r.includes("DMARC"))).toBe(true);
  });

  test("brand-on-free-domain impersonation flags", () => {
    const h = phishHeuristics(
      "scammer@gmail.com",
      "PayPal Support",
      "Account locked",
      "click to verify",
      { source: "none" },
      false,
    );
    expect(h.score).toBeGreaterThan(0);
  });

  test("known-contact lowers score", () => {
    const known = phishHeuristics("a@x.test", "Alice", "hi", "hello", { source: "none" }, true);
    const unknown = phishHeuristics("a@x.test", "Alice", "hi", "hello", { source: "none" }, false);
    expect(known.score).toBeLessThanOrEqual(unknown.score);
  });
});
