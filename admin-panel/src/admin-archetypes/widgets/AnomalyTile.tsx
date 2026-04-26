import * as React from "react";
import { AlertTriangle, Flame } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AnomalyMeta, DrillTarget } from "../types";

export interface AnomalyTileProps {
  label: string;
  value: React.ReactNode;
  anomaly: AnomalyMeta;
  drillTo?: DrillTarget;
  className?: string;
}

/** Outlines a KPI tile in red/amber and explains the anomaly. */
export function AnomalyTile({
  label,
  value,
  anomaly,
  drillTo,
  className,
}: AnomalyTileProps) {
  const tier = anomaly.score >= 0.85 ? "danger" : anomaly.score >= 0.6 ? "warning" : "info";
  const Icon = tier === "danger" ? Flame : AlertTriangle;
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
      data-archetype-widget="anomaly-tile"
      className={cn(
        "rounded-lg border-2 bg-surface-0 p-4 flex flex-col gap-1.5 text-left",
        tier === "danger" && "border-danger/60 bg-danger-soft/10",
        tier === "warning" && "border-warning/60 bg-warning-soft/10",
        tier === "info" && "border-info/40 bg-info-soft/10",
        interactive && "hover:bg-surface-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
      aria-label={`${label}: anomaly — ${anomaly.reason}`}
    >
      <div className="flex items-center gap-1.5">
        <Icon
          className={cn(
            "h-3.5 w-3.5",
            tier === "danger" && "text-danger",
            tier === "warning" && "text-warning",
            tier === "info" && "text-info",
          )}
          aria-hidden
        />
        <span className="text-xs font-medium text-text-muted uppercase tracking-wide truncate">
          {label}
        </span>
      </div>
      <div className="text-2xl font-semibold text-text-primary leading-tight tabular-nums">
        {value}
      </div>
      <div className="text-xs text-text-muted line-clamp-2">
        {anomaly.reason}
      </div>
    </Tag>
  );
}
