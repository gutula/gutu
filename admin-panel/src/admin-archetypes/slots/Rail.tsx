import * as React from "react";
import { cn } from "@/lib/cn";

export interface RailProps {
  children: React.ReactNode;
  /** Top section of the rail (S4) — typically the focus card. */
  topSlot?: React.ReactNode;
  className?: string;
}

/** S4+S6 wrapper. Rail width is set by parent BodyLayout. */
export function Rail({ children, topSlot, className }: RailProps) {
  return (
    <div data-slot="rail" className={cn("flex flex-col gap-3", className)}>
      {topSlot && <div data-slot="rail-top">{topSlot}</div>}
      <div data-slot="rail-body" className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
}
