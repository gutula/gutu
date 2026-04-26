import * as React from "react";
import { useUrlState } from "./useUrlState";
import { encodeChips, decodeChips } from "./_filterCodec";

export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "nin"
  | "contains"
  | "startswith"
  | "endswith"
  | "exists";

export interface FilterChip {
  field: string;
  op: FilterOperator;
  value: string;
}

/** URL-backed filter chips. Encoded in a single `?filter=` parameter as
 *  semicolon-separated entries; supports add / remove / clear / replace. */
export function useFilterChips(): {
  chips: FilterChip[];
  add: (chip: FilterChip) => void;
  remove: (predicate: (c: FilterChip) => boolean) => void;
  clear: () => void;
  replace: (chips: FilterChip[]) => void;
} {
  const [state, set] = useUrlState(["filter"] as const);

  const chips = React.useMemo(
    () => decodeChips(state.filter),
    [state.filter],
  );

  const replace = React.useCallback(
    (next: FilterChip[]) => {
      set({ filter: encodeChips(next) ?? null });
    },
    [set],
  );

  const add = React.useCallback(
    (chip: FilterChip) => {
      const seen = chips.some(
        (c) =>
          c.field === chip.field && c.op === chip.op && c.value === chip.value,
      );
      if (seen) return;
      replace([...chips, chip]);
    },
    [chips, replace],
  );

  const remove = React.useCallback(
    (predicate: (c: FilterChip) => boolean) => {
      replace(chips.filter((c) => !predicate(c)));
    },
    [chips, replace],
  );

  const clear = React.useCallback(() => replace([]), [replace]);

  return { chips, add, remove, clear, replace };
}
