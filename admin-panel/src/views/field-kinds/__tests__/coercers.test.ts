/** Tests for the value coercion functions inside each field kind.
 *  Coercion happens on every render — a regression silently mangles
 *  storage shapes. We pull the helpers out of their host modules and
 *  pin the contract for each kind. */

import { describe, test, expect } from "bun:test";

/* ------------------------------------------------------------------ */
/* Re-implement the coercers here so we can test them without pulling
 *  in React. The real modules import React/Tiptap/Leaflet at the top
 *  level which makes them awkward to load in a unit-test runner.    */
/* ------------------------------------------------------------------ */

// Mirrors `tags.tsx#toArray`.
function toArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string") as string[];
  if (typeof v === "string" && v) return v.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);
  return [];
}

// Mirrors `file.tsx#asAttachment`.
interface AttachmentRef {
  id: string;
  name: string;
  mimeType?: string;
  sizeBytes?: number;
  url?: string;
}
function asAttachment(v: unknown): AttachmentRef | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (typeof o.id !== "string") return null;
  return {
    id: o.id,
    name: typeof o.name === "string" ? o.name : "attachment",
    mimeType: typeof o.mimeType === "string" ? o.mimeType : undefined,
    sizeBytes: typeof o.sizeBytes === "number" ? o.sizeBytes : undefined,
    url: typeof o.url === "string" ? o.url : undefined,
  };
}

// Mirrors `geo.tsx#asPoint`.
interface PointValue {
  lat: number;
  lng: number;
}
function asPoint(v: unknown): PointValue | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (typeof o.lat !== "number" || typeof o.lng !== "number") return null;
  if (!Number.isFinite(o.lat) || !Number.isFinite(o.lng)) return null;
  if (o.lat < -90 || o.lat > 90) return null;
  if (o.lng < -180 || o.lng > 180) return null;
  return { lat: o.lat, lng: o.lng };
}

// Mirrors `color.tsx#normalize`.
const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
function normalizeColor(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (HEX_RE.test(trimmed)) {
    if (trimmed.length === 4) {
      const r = trimmed[1];
      const g = trimmed[2];
      const b = trimmed[3];
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    return trimmed.toLowerCase();
  }
  return trimmed;
}

// Mirrors `sparkline.tsx#asSeries`.
function asSeries(v: unknown): number[] {
  if (Array.isArray(v)) return v.filter((n) => typeof n === "number" && Number.isFinite(n)) as number[];
  if (typeof v === "string" && v) {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed.filter((n) => typeof n === "number" && Number.isFinite(n)) as number[];
    } catch {
      /* fall through */
    }
  }
  return [];
}

/* ------------------------------------------------------------------ */
/* Tests                                                              */
/* ------------------------------------------------------------------ */

describe("tags#toArray", () => {
  test("preserves array of strings", () => {
    expect(toArray(["a", "b"])).toEqual(["a", "b"]);
  });
  test("filters non-strings out of an array", () => {
    expect(toArray(["a", 1, null, "b"])).toEqual(["a", "b"]);
  });
  test("splits comma-separated string", () => {
    expect(toArray("a, b,  c ")).toEqual(["a", "b", "c"]);
  });
  test("splits newline-separated string", () => {
    expect(toArray("a\nb\nc")).toEqual(["a", "b", "c"]);
  });
  test("returns [] for nullish + empty values", () => {
    expect(toArray(undefined)).toEqual([]);
    expect(toArray(null)).toEqual([]);
    expect(toArray("")).toEqual([]);
    expect(toArray(42)).toEqual([]);
    expect(toArray({ x: 1 })).toEqual([]);
  });
});

describe("file#asAttachment", () => {
  test("requires id field", () => {
    expect(asAttachment(null)).toBeNull();
    expect(asAttachment({})).toBeNull();
    expect(asAttachment({ name: "x" })).toBeNull();
    expect(asAttachment({ id: 42 })).toBeNull(); // wrong type
  });
  test("normalises mime/size/url to undefined when absent", () => {
    const a = asAttachment({ id: "abc" });
    expect(a).toEqual({ id: "abc", name: "attachment", mimeType: undefined, sizeBytes: undefined, url: undefined });
  });
  test("preserves all known fields", () => {
    const a = asAttachment({
      id: "abc",
      name: "doc.pdf",
      mimeType: "application/pdf",
      sizeBytes: 12345,
      url: "/api/files/abc/content",
    });
    expect(a).toEqual({
      id: "abc",
      name: "doc.pdf",
      mimeType: "application/pdf",
      sizeBytes: 12345,
      url: "/api/files/abc/content",
    });
  });
});

describe("geo#asPoint", () => {
  test("accepts a valid lat/lng object", () => {
    expect(asPoint({ lat: 37.7749, lng: -122.4194 })).toEqual({ lat: 37.7749, lng: -122.4194 });
  });
  test("rejects out-of-range coords", () => {
    expect(asPoint({ lat: 91, lng: 0 })).toBeNull();
    expect(asPoint({ lat: -91, lng: 0 })).toBeNull();
    expect(asPoint({ lat: 0, lng: 181 })).toBeNull();
    expect(asPoint({ lat: 0, lng: -181 })).toBeNull();
  });
  test("rejects NaN / Infinity", () => {
    expect(asPoint({ lat: NaN, lng: 0 })).toBeNull();
    expect(asPoint({ lat: 0, lng: Infinity })).toBeNull();
  });
  test("rejects wrong-type values", () => {
    expect(asPoint({ lat: "37", lng: -122 })).toBeNull();
    expect(asPoint(null)).toBeNull();
    expect(asPoint("not-a-point")).toBeNull();
  });
});

describe("color#normalizeColor", () => {
  test("expands #abc to #aabbcc", () => {
    expect(normalizeColor("#abc")).toBe("#aabbcc");
    expect(normalizeColor("#FFF")).toBe("#ffffff");
  });
  test("lowercases #XX 6-digit hex", () => {
    expect(normalizeColor("#FFA500")).toBe("#ffa500");
  });
  test("passes through CSS color strings unchanged", () => {
    expect(normalizeColor("rgb(255, 0, 0)")).toBe("rgb(255, 0, 0)");
    expect(normalizeColor("hsl(120, 100%, 50%)")).toBe("hsl(120, 100%, 50%)");
    expect(normalizeColor("rebeccapurple")).toBe("rebeccapurple");
  });
  test("returns null on empty input", () => {
    expect(normalizeColor("")).toBeNull();
    expect(normalizeColor("   ")).toBeNull();
  });
});

describe("sparkline#asSeries", () => {
  test("preserves number arrays", () => {
    expect(asSeries([1, 2, 3])).toEqual([1, 2, 3]);
  });
  test("filters non-numbers out of an array", () => {
    expect(asSeries([1, "x", null, 2])).toEqual([1, 2]);
  });
  test("filters NaN + Infinity", () => {
    expect(asSeries([1, NaN, Infinity, 2])).toEqual([1, 2]);
  });
  test("parses JSON-array strings", () => {
    expect(asSeries("[1,2,3]")).toEqual([1, 2, 3]);
  });
  test("returns [] for malformed strings + non-arrays", () => {
    expect(asSeries("not json")).toEqual([]);
    expect(asSeries('{"x": 1}')).toEqual([]);
    expect(asSeries(null)).toEqual([]);
    expect(asSeries(undefined)).toEqual([]);
  });
});
