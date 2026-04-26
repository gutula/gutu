import * as React from "react";
import { cn } from "@/lib/cn";
import type { RailHealthScore, Severity } from "../types";

export interface RailRecordHealthProps {
  title?: React.ReactNode;
  score: RailHealthScore;
  className?: string;
}

const TIER_BG: Record<Severity, string> = {
  info: "bg-info-soft text-info-strong border-info/30",
  success: "bg-success-soft text-success-strong border-success/30",
  warning: "bg-warning-soft text-warning-strong border-warning/30",
  danger: "bg-danger-soft text-danger-strong border-danger/30",
  neutral: "bg-surface-2 text-text-muted border-border",
};

/** Composite "score" rail card (completeness + freshness + risk). */
export function RailRecordHealth({
  title = "Health",
  score,
  className,
}: RailRecordHealthProps) {
  return (
    <div
      data-archetype-widget="rail-record-health"
      className={cn(
        "rounded-lg border bg-surface-0 p-3 flex flex-col gap-2",
        TIER_BG[score.tier],
        className,
      )}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
        {title}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold tabular-nums leading-none">
          {Math.round(score.score)}
        </span>
        <span className="text-sm opacity-80">/ 100</span>
      </div>
      {score.factors && score.factors.length > 0 && (
        <ul role="list" className="text-xs space-y-1 mt-1">
          {score.factors.slice(0, 5).map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <span
                className={cn(
                  "h-1.5 rounded-full bg-current/30 grow opacity-50",
                )}
                aria-hidden
                style={{
                  flexBasis: `${Math.min(100, Math.abs(f.weight))}%`,
                }}
              />
              <span className="tabular-nums shrink-0">
                {f.weight > 0 ? "+" : ""}
                {f.weight}
              </span>
              <span className="truncate">{f.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
