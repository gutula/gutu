import * as React from "react";
import { Skeleton } from "@/admin-primitives/Skeleton";
import { cn } from "@/lib/cn";

export interface WidgetSkeletonProps {
  /** Visual shape mirrors the eventual widget. */
  variant?: "kpi" | "chart" | "list" | "rail-card" | "tile-grid" | "table";
  /** Number of rows / cells, when applicable. */
  rows?: number;
  className?: string;
  /** Aria label, defaulted by variant. */
  ariaLabel?: string;
}

const A11Y: Record<NonNullable<WidgetSkeletonProps["variant"]>, string> = {
  kpi: "Loading KPI",
  chart: "Loading chart",
  list: "Loading list",
  "rail-card": "Loading rail card",
  "tile-grid": "Loading tiles",
  table: "Loading table",
};

/** Skeleton whose shape matches the real widget so layout doesn't jolt. */
export function WidgetSkeleton({
  variant = "kpi",
  rows = 5,
  className,
  ariaLabel,
}: WidgetSkeletonProps) {
  const label = ariaLabel ?? A11Y[variant];
  const aria = {
    role: "status" as const,
    "aria-label": label,
    "aria-live": "polite" as const,
  };

  if (variant === "kpi") {
    return (
      <div
        {...aria}
        className={cn(
          "rounded-lg border border-border bg-surface-0 p-4 flex flex-col gap-2",
          className,
        )}
      >
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div
        {...aria}
        className={cn(
          "rounded-lg border border-border bg-surface-0 p-4",
          className,
        )}
      >
        <Skeleton className="h-3 w-32 mb-3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div
        {...aria}
        className={cn(
          "rounded-lg border border-border bg-surface-0 p-3 flex flex-col gap-2",
          className,
        )}
      >
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (variant === "rail-card") {
    return (
      <div
        {...aria}
        className={cn(
          "rounded-lg border border-border bg-surface-0 p-3 flex flex-col gap-2",
          className,
        )}
      >
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (variant === "tile-grid") {
    return (
      <div
        {...aria}
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3",
          className,
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  // table
  return (
    <div
      {...aria}
      className={cn("rounded-lg border border-border overflow-hidden", className)}
    >
      <Skeleton className="h-9 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full mt-px" />
      ))}
    </div>
  );
}
