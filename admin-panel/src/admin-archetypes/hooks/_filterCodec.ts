/** Pure encode/decode for filter chips. Extracted so it can be unit-tested
 *  without React. The hook in `useFilterChips` is a thin URL-state shell
 *  on top of these. */

import type { FilterChip, FilterOperator } from "./useFilterChips";

const OP_RX = /^(eq|neq|gt|gte|lt|lte|in|nin|contains|startswith|endswith|exists)$/;

export function encodeChip(c: FilterChip): string {
  const v = c.value.replace(/[\\;:]/g, (m) => "\\" + m);
  return `${c.field}:${c.op}:${v}`;
}

export function decodeChip(s: string): FilterChip | null {
  const parts: string[] = [];
  let buf = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "\\" && i + 1 < s.length) {
      buf += s[i + 1];
      i++;
      continue;
    }
    if (ch === ":") {
      parts.push(buf);
      buf = "";
      continue;
    }
    buf += ch;
  }
  parts.push(buf);
  if (parts.length < 2) return null;
  const field = parts[0];
  const op = (parts.length === 2 ? "eq" : parts[1]) as FilterOperator;
  const value = parts.length === 2 ? parts[1] : parts.slice(2).join(":");
  if (!field) return null;
  if (!OP_RX.test(op)) return null;
  return { field, op, value };
}

export function encodeChips(chips: readonly FilterChip[]): string | undefined {
  if (chips.length === 0) return undefined;
  return chips.map(encodeChip).join(";");
}

export function decodeChips(raw: string | undefined): FilterChip[] {
  if (!raw) return [];
  const parts = raw.split(/(?<!\\);/g);
  return parts.map(decodeChip).filter((c): c is FilterChip => c != null);
}
