/** Pin the exact normalization rules — these strings flow into a DNS
 *  TXT record, so a regression here can break deliverability for every
 *  self-hosted user. */

import { describe, test, expect } from "bun:test";
import { normalizeDkimPublicKey } from "./dkim";

const VALID_BASE64 = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A" + "x".repeat(200);

describe("normalizeDkimPublicKey", () => {
  test("strips PEM headers and inner whitespace", () => {
    const pem =
      "-----BEGIN PUBLIC KEY-----\n" +
      VALID_BASE64.match(/.{1,64}/g)!.join("\n") +
      "\n-----END PUBLIC KEY-----\n";
    const r = normalizeDkimPublicKey(pem);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(VALID_BASE64);
  });

  test("accepts already-stripped base64", () => {
    const r = normalizeDkimPublicKey(VALID_BASE64);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(VALID_BASE64);
  });

  test("tolerates inner whitespace + line breaks", () => {
    const wrapped = VALID_BASE64.match(/.{1,40}/g)!.join("\n  \t  ");
    const r = normalizeDkimPublicKey(wrapped);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(VALID_BASE64);
  });

  test("rejects empty input", () => {
    const r = normalizeDkimPublicKey("");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/empty/i);
  });

  test("rejects too-short keys", () => {
    const r = normalizeDkimPublicKey("MIIBabc=");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/short/i);
  });

  test("rejects non-base64 characters", () => {
    const bad = "MIIB" + "?".repeat(200);
    const r = normalizeDkimPublicKey(bad);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/base64/i);
  });

  test("accepts the standard padding chars", () => {
    const padded = VALID_BASE64.slice(0, -2) + "==";
    const r = normalizeDkimPublicKey(padded);
    expect(r.ok).toBe(true);
  });

  test("rejects keys with internal padding (invalid base64)", () => {
    const bad = "MIIB==" + "x".repeat(200);
    const r = normalizeDkimPublicKey(bad);
    expect(r.ok).toBe(false);
  });
});
