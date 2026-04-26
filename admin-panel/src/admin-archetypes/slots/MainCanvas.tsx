import * as React from "react";
import { cn } from "@/lib/cn";

export interface MainCanvasProps {
  children: React.ReactNode;
  className?: string;
  /** ARIA label for assistive tech. */
  ariaLabel?: string;
}

/** S5 — main canvas. Just a semantic wrapper; archetype-specific content
 *  (DataGrid, Kanban, Calendar, etc.) renders inside. */
export function MainCanvas({
  children,
  className,
  ariaLabel = "Main content",
}: MainCanvasProps) {
  return (
    <section
      role="region"
      aria-label={ariaLabel}
      data-slot="main-canvas"
      className={cn("min-w-0 flex flex-col gap-3", className)}
    >
      {children}
    </section>
  );
}
