import * as React from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ForecastBand, DrillTarget } from "../types";

export interface ForecastTileProps {
  label: string;
  current: React.ReactNode;
  forecast: ForecastBand;
  /** Format helper for the band values. */
  format?: (n: number) => string;
  drillTo?: DrillTarget;
  className?: string;
}

/** A KPI tile that gives the user a forecast band rather than a single point.
 *  Shows current value + p10/p50/p90 bar with horizon label. */
export function ForecastTile({
  label,
  current,
  forecast,
  format = (n) => Math.round(n).toString(),
  drillTo,
  className,
}: ForecastTileProps) {
  const interactive = !!drillTo;
  const Tag = interactive ? "button" : "div";
  const range = Math.max(1, forecast.p90 - forecast.p10);
  const median = ((forecast.p50 - forecast.p10) / range) * 100;
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
      data-archetype-widget="forecast-tile"
      className={cn(
        "rounded-lg border border-info/30 bg-surface-0 p-4 flex flex-col gap-1.5 text-left",
        interactive && "hover:bg-surface-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
      aria-label={`${label}: forecast ${forecast.horizon} — p50 ${format(forecast.p50)}`}
    >
      <div className="flex items-center gap-1.5">
        <TrendingUp className="h-3.5 w-3.5 text-info" aria-hidden />
        <span className="text-xs font-medium text-text-muted uppercase tracking-wide truncate">
          {label}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-muted bg-surface-2 px-1.5 py-0.5 rounded ml-auto">
          {forecast.horizon}
        </span>
      </div>
      <div className="text-2xl font-semibold text-text-primary leading-tight tabular-nums">
        {current}
      </div>
      <div className="space-y-1">
        <div className="relative h-1.5 rounded-full bg-surface-2 overflow-hidden">
          <div className="absolute inset-y-0 left-0 right-0 bg-info-soft" />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-info"
            style={{ left: `${median}%` }}
            aria-hidden
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-text-muted tabular-nums">
          <span>p10 {format(forecast.p10)}</span>
          <span className="font-medium text-text-primary">
            p50 {format(forecast.p50)}
          </span>
          <span>p90 {format(forecast.p90)}</span>
        </div>
      </div>
    </Tag>
  );
}
