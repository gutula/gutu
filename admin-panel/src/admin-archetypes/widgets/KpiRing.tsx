import * as React from "react";
import { cn } from "@/lib/cn";
import type { DrillTarget, Severity } from "../types";

export interface KpiRingProps {
  label: string;
  current: number;
  target: number;
  /** Period label (e.g. "30d"). */
  period?: string;
  /** Optional helper line under the ring. */
  helper?: React.ReactNode;
  /** Format helper for the centre value. */
  format?: (n: number) => string;
  drillTo?: DrillTarget;
  severity?: Severity;
  className?: string;
}

const SEVERITY_STROKE: Record<Severity, string> = {
  info: "stroke-info",
  success: "stroke-success",
  warning: "stroke-warning",
  danger: "stroke-danger",
  neutral: "stroke-text-primary",
};

const SIZE = 72;
const RADIUS = 30;
const CIRC = 2 * Math.PI * RADIUS;

/** Donut showing progress to a goal. */
export function KpiRing({
  label,
  current,
  target,
  period,
  helper,
  format,
  drillTo,
  severity,
  className,
}: KpiRingProps) {
  const ratio = Math.max(0, Math.min(1, target === 0 ? 0 : current / target));
  const dash = CIRC * ratio;
  const tone =
    severity ?? (ratio >= 1 ? "success" : ratio >= 0.7 ? "info" : "warning");

  const interactive = !!drillTo;
  const Tag = interactive ? "button" : "div";

  const onActivate = () => {
    if (!drillTo) return;
    if (drillTo.kind === "hash") window.location.hash = drillTo.hash;
    else if (drillTo.kind === "url") window.location.href = drillTo.url;
    else drillTo.run();
  };

  return (
    <Tag
      type={interactive ? "button" : undefined}
      onClick={interactive ? onActivate : undefined}
      data-archetype-widget="kpi-ring"
      className={cn(
        "rounded-lg border border-border bg-surface-0 p-4 flex items-center gap-3 text-left",
        interactive &&
          "hover:bg-surface-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
        className,
      )}
      aria-label={`${label}: ${format ? format(current) : current} of ${
        format ? format(target) : target
      }`}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden
        className="shrink-0"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={6}
          className="stroke-surface-2"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={6}
          className={SEVERITY_STROKE[tone]}
          strokeDasharray={`${dash} ${CIRC}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{ transition: "stroke-dasharray 240ms ease" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-text-primary text-[14px] font-semibold tabular-nums"
        >
          {Math.round(ratio * 100)}%
        </text>
      </svg>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-muted uppercase tracking-wide truncate">
            {label}
          </span>
          {period && (
            <span className="text-[10px] font-medium uppercase tracking-wide text-text-muted bg-surface-2 px-1.5 py-0.5 rounded">
              {period}
            </span>
          )}
        </div>
        <div className="text-base font-semibold text-text-primary tabular-nums">
          {format ? format(current) : current}{" "}
          <span className="text-text-muted text-sm">
            / {format ? format(target) : target}
          </span>
        </div>
        {helper && <div className="text-xs text-text-muted">{helper}</div>}
      </div>
    </Tag>
  );
}
