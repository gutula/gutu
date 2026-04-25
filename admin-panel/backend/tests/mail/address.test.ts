import { describe, expect, test } from "bun:test";
import {
  isValidEmail,
  parseAddress,
  parseAddressList,
  formatAddress,
  formatAddresses,
  decodeEncodedWords,
  participantsHash,
  normalizeSubject,
  normalizeEmail,
} from "../../src/lib/mail/address";

describe("address", () => {
  test("isValidEmail accepts good and rejects bad", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("a".repeat(260) + "@b.co")).toBe(false);
  });

  test("parseAddress handles bare addr-spec", () => {
    expect(parseAddress("a@b.co")).toEqual({ email: "a@b.co" });
  });

  test("parseAddress handles display-name", () => {
    expect(parseAddress('"Alice Q" <a@b.co>')).toEqual({ name: "Alice Q", email: "a@b.co" });
    expect(parseAddress("Alice <a@b.co>")).toEqual({ name: "Alice", email: "a@b.co" });
  });

  test("parseAddressList splits on commas not inside angle-brackets", () => {
    const list = parseAddressList('"A, Q" <a@b.co>, c@d.co');
    expect(list.length).toBe(2);
    expect(list[0].name).toBe("A, Q");
  });

  test("formatAddress quotes names with special chars", () => {
    expect(formatAddress({ name: "A, Q", email: "a@b.co" })).toBe('"A, Q" <a@b.co>');
    expect(formatAddress({ email: "a@b.co" })).toBe("a@b.co");
  });

  test("formatAddresses joins", () => {
    expect(formatAddresses([{ email: "a@b.co" }, { email: "c@d.co" }])).toBe("a@b.co, c@d.co");
  });

  test("decodeEncodedWords handles utf-8 base64 + quoted-printable", () => {
    expect(decodeEncodedWords("=?utf-8?B?aGVsbG8=?=")).toBe("hello");
    expect(decodeEncodedWords("=?utf-8?Q?hi_there?=")).toBe("hi there");
  });

  test("participantsHash is stable + order-independent", () => {
    const h1 = participantsHash([{ email: "a@x.co" }, { email: "B@x.co" }]);
    const h2 = participantsHash([{ email: "b@x.co" }, { email: "A@x.co" }]);
    expect(h1).toBe(h2);
  });

  test("normalizeSubject strips Re:/Fwd:/etc.", () => {
    expect(normalizeSubject("Re: Fwd: hi")).toBe("hi");
    expect(normalizeSubject("AW: ÅPNiNg")).toBe("ÅPNiNg");
  });

  test("normalizeEmail lowercases", () => {
    expect(normalizeEmail("X@Y.CO")).toBe("x@y.co");
  });
});
