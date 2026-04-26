import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type PeriodKey = "today" | "7d" | "30d" | "qtd" | "ytd" | "custom";

export interface PeriodSelectorProps {
  value: PeriodKey;
  onChange: (next: PeriodKey) => void;
  /** When true, shows a "Compare" toggle (period vs prev). */
  withCompare?: boolean;
  compare?: boolean;
  onCompareChange?: (next: boolean) => void;
  className?: string;
}

const LABEL: Record<PeriodKey, string> = {
  today: "Today",
  "7d": "7d",
  "30d": "30d",
  qtd: "QTD",
  ytd: "YTD",
  custom: "Custom",
};

const ORDER: PeriodKey[] = ["today", "7d", "30d", "qtd", "ytd", "custom"];

/** Period chip strip used on dashboards. URL-friendly. */
export function PeriodSelector({
  value,
  onChange,
  withCompare,
  compare,
  onCompareChange,
  className,
}: PeriodSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Period"
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-border bg-surface-1 p-0.5 text-xs",
        className,
      )}
    >
      {ORDER.map((p) => (
        <button
          key={p}
          type="button"
          role="radio"
          aria-checked={p === value}
          onClick={() => onChange(p)}
          className={cn(
            "px-2 py-1 rounded-md font-medium transition",
            p === value
              ? "bg-surface-raised text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-primary",
          )}
        >
          {LABEL[p]}
          {p === "custom" && <ChevronDown className="inline h-3 w-3 ml-0.5" aria-hidden />}
        </button>
      ))}
      {withCompare && (
        <label className="flex items-center gap-1.5 ml-1 pl-2 border-l border-border text-text-muted">
          <input
            type="checkbox"
            checked={!!compare}
            onChange={(e) => onCompareChange?.(e.target.checked)}
            className="h-3 w-3 accent-accent"
          />
          Compare
        </label>
      )}
    </div>
  );
}
