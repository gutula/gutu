import * as React from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import { Sparkline } from "./Sparkline";
import type { KpiTrend, DrillTarget, Severity } from "../types";

export interface KpiTileProps {
  label: string;
  value: React.ReactNode;
  /** Sub-label (e.g. "$12,840 of $20k goal"). */
  helper?: React.ReactNode;
  trend?: KpiTrend;
  /** Period chip label (e.g. "30d"). */
  period?: string;
  /** Drill destination on click / Enter / Space. */
  drillTo?: DrillTarget;
  /** Optional severity outline tint. */
  severity?: Severity;
  /** Hides the trend chip even when trend is provided. */
  hideTrend?: boolean;
  className?: string;
}

const SEVERITY_BORDER: Record<Severity, string> = {
  info: "border-info/40",
  success: "border-success/40",
  warning: "border-warning/40",
  danger: "border-danger/40",
  neutral: "border-border",
};

/** S2 hero tile. The single most-used widget on Intelligent Dashboard
 *  and Workspace Hub. Click to drill; keyboard-accessible. */
export function KpiTile({
  label,
  value,
  helper,
  trend,
  period,
  drillTo,
  severity = "neutral",
  hideTrend,
  className,
}: KpiTileProps) {
  const handleActivate = React.useCallback(() => {
    if (!drillTo) return;
    if (drillTo.kind === "hash") window.location.hash = drillTo.hash;
    else if (drillTo.kind === "url") window.location.href = drillTo.url;
    else drillTo.run();
  }, [drillTo]);

  const interactive = !!drillTo;
  const Tag = (interactive ? "button" : "div") as React.ElementType;
  const onKeyDown = interactive
    ? (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }
    : undefined;

  return (
    <Tag
      type={interactive ? "button" : undefined}
      onClick={interactive ? handleActivate : undefined}
      onKeyDown={onKeyDown}
      data-archetype-widget="kpi-tile"
      aria-label={typeof value === "string" ? `${label}: ${value}` : label}
      className={cn(
        "rounded-lg border bg-surface-0 p-4 flex flex-col gap-1.5 text-left transition focus-visible:outline-none",
        SEVERITY_BORDER[severity],
        interactive &&
          "hover:bg-surface-1 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 cursor-pointer",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wide truncate">
          {label}
        </span>
        {period && (
          <span className="text-[10px] font-medium uppercase tracking-wide text-text-muted bg-surface-2 px-1.5 py-0.5 rounded">
            {period}
          </span>
        )}
      </div>
      <div className="text-2xl font-semibold text-text-primary leading-tight tabular-nums">
        {value}
      </div>
      {(helper || trend) && (
        <div className="flex items-center gap-2">
          {!hideTrend && trend && <KpiTrendChip trend={trend} />}
          {trend?.series && trend.series.length > 1 && (
            <Sparkline
              data={trend.series}
              width={56}
              height={16}
              stroke="currentColor"
              className="text-text-muted"
            />
          )}
          {helper && (
            <span className="text-xs text-text-muted truncate">{helper}</span>
          )}
        </div>
      )}
    </Tag>
  );
}

function KpiTrendChip({ trend }: { trend: KpiTrend }) {
  const delta = trend.deltaPct;
  if (delta === undefined) return null;
  const positiveIsGood = trend.positiveIsGood ?? true;
  const isUp = delta > 0;
  const isFlat = delta === 0;
  const goodTone =
    isFlat ? "neutral" : isUp === positiveIsGood ? "success" : "danger";
  const Icon = isFlat ? Minus : isUp ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium rounded-full px-1.5 py-0.5",
        goodTone === "success" && "text-success-strong bg-success-soft",
        goodTone === "danger" && "text-danger-strong bg-danger-soft",
        goodTone === "neutral" && "text-text-muted bg-surface-2",
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {Math.abs(delta).toFixed(1)}%
    </span>
  );
}
