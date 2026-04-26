import { describe, test, expect } from "bun:test";
import {
  encodeChip,
  decodeChip,
  encodeChips,
  decodeChips,
} from "../hooks/_filterCodec";

describe("encodeChip / decodeChip", () => {
  test("round-trips a simple chip", () => {
    const c = { field: "stage", op: "eq" as const, value: "lead" };
    expect(encodeChip(c)).toBe("stage:eq:lead");
    expect(decodeChip("stage:eq:lead")).toEqual(c);
  });

  test("escapes special characters in value", () => {
    const c = { field: "name", op: "contains" as const, value: "a:b;c" };
    const enc = encodeChip(c);
    expect(decodeChip(enc)).toEqual(c);
  });

  test("supports operator-less form (defaults eq)", () => {
    expect(decodeChip("stage:lead")).toEqual({
      field: "stage",
      op: "eq",
      value: "lead",
    });
  });

  test("rejects invalid operator", () => {
    expect(decodeChip("stage:bogus:lead")).toBeNull();
  });

  test("rejects empty field", () => {
    expect(decodeChip(":eq:foo")).toBeNull();
    expect(decodeChip("")).toBeNull();
  });
});

describe("encodeChips / decodeChips", () => {
  test("multiple chips serialise with semicolon", () => {
    const chips = [
      { field: "stage", op: "eq" as const, value: "lead" },
      { field: "owner", op: "eq" as const, value: "alex" },
    ];
    const s = encodeChips(chips);
    expect(s).toBe("stage:eq:lead;owner:eq:alex");
    expect(decodeChips(s)).toEqual(chips);
  });

  test("empty list encodes to undefined", () => {
    expect(encodeChips([])).toBeUndefined();
    expect(decodeChips(undefined)).toEqual([]);
  });

  test("handles values containing semicolons via escape", () => {
    const chips = [
      { field: "note", op: "contains" as const, value: "a;b;c" },
    ];
    const s = encodeChips(chips);
    expect(decodeChips(s)).toEqual(chips);
  });

  test("drops invalid entries gracefully", () => {
    expect(decodeChips("stage:eq:lead;bogus:invalid:x")).toEqual([
      { field: "stage", op: "eq", value: "lead" },
    ]);
  });
});
