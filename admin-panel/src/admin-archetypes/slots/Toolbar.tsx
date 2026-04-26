import * as React from "react";
import { cn } from "@/lib/cn";

export interface ArchetypeToolbarProps {
  /** Left side: filters, saved-view switcher, group-by, sort. */
  start?: React.ReactNode;
  /** Center: tab strip / view switcher (e.g., Board / Calendar / List). */
  center?: React.ReactNode;
  /** Right side: search, density toggle, columns, export. */
  end?: React.ReactNode;
  /** When true, toolbar sticks just below the header on scroll. */
  sticky?: boolean;
  className?: string;
}

/** S3 — the toolbar / tab strip. Used by Smart List, Kanban, Calendar, Tree,
 *  Graph, Split Inbox, Timeline, Map. */
export function ArchetypeToolbar({
  start,
  center,
  end,
  sticky = false,
  className,
}: ArchetypeToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Page controls"
      data-slot="toolbar"
      className={cn(
        "flex items-center gap-2 flex-wrap text-sm",
        sticky && "sticky top-12 z-10 bg-surface-canvas/80 py-2 backdrop-blur",
        className,
      )}
    >
      {start && <div className="flex items-center gap-2 flex-wrap">{start}</div>}
      {center && (
        <div className="flex items-center gap-2 flex-wrap mx-auto">{center}</div>
      )}
      {end && (
        <div className="flex items-center gap-2 ml-auto flex-wrap">{end}</div>
      )}
    </div>
  );
}
