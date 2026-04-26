import * as React from "react";
import { cn } from "@/lib/cn";

export interface CommandHint {
  /** Combo string (e.g. "⌘K", "?", "j/k"). */
  keys: string;
  label: React.ReactNode;
}

export interface CommandHintsProps {
  hints: readonly CommandHint[];
  className?: string;
}

/** Bottom-right chip strip showing key bindings on this archetype.
 *  Hidden on small screens. */
export function CommandHints({ hints, className }: CommandHintsProps) {
  if (hints.length === 0) return null;
  return (
    <div
      role="note"
      aria-label="Keyboard shortcuts"
      className={cn(
        "hidden md:flex items-center gap-2 text-[11px] text-text-muted",
        className,
      )}
    >
      {hints.map((h, i) => (
        <span key={i} className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-text-primary font-mono text-[10px]">
            {h.keys}
          </kbd>
          {h.label}
        </span>
      ))}
    </div>
  );
}
