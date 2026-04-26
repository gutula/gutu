import * as React from "react";
import { cn } from "@/lib/cn";

export interface ActionBarProps {
  /** When true, the bar slides up from the bottom. */
  open: boolean;
  /** Left-aligned content (selection summary, dirty-state info). */
  start?: React.ReactNode;
  /** Right-aligned actions (Save / Cancel / bulk action buttons). */
  end?: React.ReactNode;
  /** Keyboard hints rendered subtly bottom-right (e.g. ⌘S). */
  hints?: React.ReactNode;
  className?: string;
}

/** S7 — slides up from the bottom of the page when bulk selection or unsaved
 *  changes are active. Never overlaps main visually because it animates from
 *  outside the layout flow. */
export function ActionBar({ open, start, end, hints, className }: ActionBarProps) {
  return (
    <div
      role="region"
      aria-label="Action bar"
      data-slot="action-bar"
      data-open={open ? "true" : "false"}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 transition-transform duration-200 will-change-transform",
        "bg-surface-raised border-t border-border shadow-md",
        open ? "translate-y-0" : "translate-y-full pointer-events-none",
        className,
      )}
      aria-hidden={!open}
    >
      <div className="max-w-[1400px] mx-auto px-4 py-2.5 flex items-center gap-3">
        {start && <div className="text-sm text-text-muted">{start}</div>}
        <div className="flex items-center gap-2 ml-auto">{end}</div>
        {hints && (
          <div className="hidden md:flex items-center gap-1.5 text-xs text-text-muted ml-3 border-l border-border pl-3">
            {hints}
          </div>
        )}
      </div>
    </div>
  );
}
