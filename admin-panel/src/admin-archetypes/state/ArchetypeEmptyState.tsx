import * as React from "react";
import { Inbox, Plus, Sparkles } from "lucide-react";
import { Button } from "@/primitives/Button";
import { cn } from "@/lib/cn";

export interface ArchetypeEmptyStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  /** Primary call-to-action. */
  action?: { label: React.ReactNode; onAction: () => void; icon?: React.ReactNode };
  /** Secondary call-to-action — typically "Import sample data" in dev. */
  secondaryAction?: { label: React.ReactNode; onAction: () => void };
  /** Render a sample-data hint (only shown when window.location.hostname === "localhost"
   *  or when the host explicitly passes `showSample=true`). */
  showSample?: boolean;
  className?: string;
}

/** First-class empty state. Always offers the highest-leverage next action. */
export function ArchetypeEmptyState({
  title,
  description,
  icon,
  action,
  secondaryAction,
  showSample,
  className,
}: ArchetypeEmptyStateProps) {
  const isDev =
    typeof window !== "undefined" && window.location.hostname === "localhost";
  const sample = (showSample ?? isDev) && secondaryAction;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 px-6 text-center rounded-lg border border-dashed border-border bg-surface-0/40",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-text-muted">
        {icon ?? <Inbox className="h-6 w-6" aria-hidden />}
      </div>
      <div className="max-w-md">
        <div className="text-base font-semibold text-text-primary">{title}</div>
        {description && (
          <div className="text-sm text-text-muted mt-1">{description}</div>
        )}
      </div>
      {(action || sample) && (
        <div className="flex items-center gap-2">
          {action && (
            <Button onClick={action.onAction}>
              {action.icon ?? <Plus className="h-4 w-4 mr-1" aria-hidden />}
              {action.label}
            </Button>
          )}
          {sample && (
            <Button variant="outline" onClick={secondaryAction.onAction}>
              <Sparkles className="h-4 w-4 mr-1" aria-hidden />
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
