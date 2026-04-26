import * as React from "react";
import { cn } from "@/lib/cn";

export interface HeroStripProps {
  /** KPI tiles, period selector, etc. */
  children: React.ReactNode;
  /** Optional aria-label for the region. */
  ariaLabel?: string;
  className?: string;
}

/** S2 — the KPI hero strip. Used by Intelligent Dashboard and Workspace Hub.
 *  Always 6-column at desktop, collapses to 3 then 2. */
export function HeroStrip({
  children,
  ariaLabel = "Key metrics",
  className,
}: HeroStripProps) {
  return (
    <section
      role="region"
      aria-label={ariaLabel}
      data-slot="hero-strip"
      className={cn(
        "grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
        className,
      )}
    >
      {children}
    </section>
  );
}
