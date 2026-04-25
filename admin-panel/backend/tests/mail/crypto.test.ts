import { describe, expect, test } from "bun:test";
import {
  encryptString,
  decryptString,
  encryptBytes,
  decryptBytes,
  hmacHex,
  tryDecryptString,
} from "../../src/lib/mail/crypto/at-rest";

describe("at-rest crypto", () => {
  test("string round-trip", () => {
    const ct = encryptString("hello");
    expect(decryptString(ct)).toBe("hello");
  });

  test("bytes round-trip", () => {
    const ct = encryptBytes(new TextEncoder().encode("👋"));
    expect(new TextDecoder().decode(decryptBytes(ct))).toBe("👋");
  });

  test("tampering detection", () => {
    const ct = encryptString("hello");
    ct[ct.length - 1] ^= 0xff;
    expect(() => decryptString(ct)).toThrow();
  });

  test("tryDecryptString returns null on bad ciphertext", () => {
    expect(tryDecryptString(new Uint8Array([1, 2, 3]))).toBeNull();
    expect(tryDecryptString(undefined)).toBeNull();
  });

  test("hmacHex is deterministic + namespaced", () => {
    const a = hmacHex("x", "ns1");
    const b = hmacHex("x", "ns1");
    const c = hmacHex("x", "ns2");
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });
});
