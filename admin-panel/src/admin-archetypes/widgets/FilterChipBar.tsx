import * as React from "react";
import { X, Filter, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/primitives/Button";
import type { FilterChip, FilterOperator } from "../hooks/useFilterChips";

export interface FilterChipBarProps {
  chips: readonly FilterChip[];
  onRemove: (predicate: (c: FilterChip) => boolean) => void;
  onClear: () => void;
  /** Optional handler for "+ Add filter" button (opens a builder). */
  onAdd?: () => void;
  /** Pretty-print the chip value (e.g. resolve customer-id → name). */
  format?: (chip: FilterChip) => React.ReactNode;
  className?: string;
}

const OP_LABEL: Record<FilterOperator, string> = {
  eq: "=",
  neq: "≠",
  gt: ">",
  gte: "≥",
  lt: "<",
  lte: "≤",
  in: "in",
  nin: "not in",
  contains: "contains",
  startswith: "starts with",
  endswith: "ends with",
  exists: "exists",
};

export function FilterChipBar({
  chips,
  onRemove,
  onClear,
  onAdd,
  format,
  className,
}: FilterChipBarProps) {
  return (
    <div
      role="group"
      aria-label="Active filters"
      className={cn("flex items-center gap-1.5 flex-wrap", className)}
    >
      {chips.length > 0 ? (
        <>
          {chips.map((c, i) => (
            <span
              key={`${c.field}-${c.op}-${c.value}-${i}`}
              className="inline-flex items-center gap-1 rounded-full bg-info-soft text-info-strong px-2 py-0.5 text-xs font-medium border border-info/30"
            >
              {format ? format(c) : (
                <>
                  <span className="font-semibold">{c.field}</span>
                  <span className="text-info-strong/70">{OP_LABEL[c.op]}</span>
                  <span>{c.value}</span>
                </>
              )}
              <button
                type="button"
                aria-label={`Remove filter ${c.field}`}
                onClick={() =>
                  onRemove(
                    (x) => x.field === c.field && x.op === c.op && x.value === c.value,
                  )
                }
                className="ml-0.5 hover:bg-info/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" aria-hidden />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-text-muted hover:text-text-primary"
          >
            Clear all
          </button>
        </>
      ) : (
        <span className="text-xs text-text-muted flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" aria-hidden /> No filters
        </span>
      )}
      {onAdd && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onAdd}
          className="ml-1 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" aria-hidden />
          Add filter
        </Button>
      )}
    </div>
  );
}
