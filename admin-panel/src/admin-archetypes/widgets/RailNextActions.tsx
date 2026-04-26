import * as React from "react";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { DrillTarget } from "../types";

export interface NextAction {
  id: string;
  label: React.ReactNode;
  /** Optional helper line. */
  rationale?: React.ReactNode;
  /** AI-suggested vs rule-based. */
  source?: "ai" | "rule" | "user";
  /** Where clicking goes. */
  drillTo?: DrillTarget;
  /** A direct one-click action; when present, overrides drillTo. */
  onAction?: () => void | Promise<void>;
}

export interface RailNextActionsProps {
  title?: React.ReactNode;
  actions: readonly NextAction[];
  emptyText?: React.ReactNode;
  className?: string;
}

/** Suggested next actions in the rail — mix of rule-based and AI-suggested.
 *  Each is a one-click execution. */
export function RailNextActions({
  title = "Next actions",
  actions,
  emptyText = "No suggestions right now.",
  className,
}: RailNextActionsProps) {
  if (actions.length === 0) {
    return (
      <div
        data-archetype-widget="rail-next-actions"
        className={cn(
          "rounded-lg border border-border bg-surface-0 p-3 text-xs text-text-muted",
          className,
        )}
      >
        <div className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-1.5">
          {title}
        </div>
        {emptyText}
      </div>
    );
  }
  return (
    <div
      data-archetype-widget="rail-next-actions"
      className={cn(
        "rounded-lg border border-border bg-surface-0",
        className,
      )}
    >
      <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted border-b border-border-subtle">
        {title}
      </div>
      <ul role="list" className="divide-y divide-border-subtle">
        {actions.map((a) => (
          <NextActionRow key={a.id} action={a} />
        ))}
      </ul>
    </div>
  );
}

function NextActionRow({ action }: { action: NextAction }) {
  const [busy, setBusy] = React.useState(false);
  const onClick = async () => {
    if (busy) return;
    if (action.onAction) {
      setBusy(true);
      try {
        await action.onAction();
      } finally {
        setBusy(false);
      }
      return;
    }
    if (!action.drillTo) return;
    if (action.drillTo.kind === "hash") window.location.hash = action.drillTo.hash;
    else if (action.drillTo.kind === "url") window.location.href = action.drillTo.url;
    else action.drillTo.run();
  };
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className="w-full flex items-start gap-2 px-3 py-2 text-left hover:bg-surface-1 disabled:opacity-50"
      >
        {action.source === "ai" ? (
          <Sparkles className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" aria-hidden />
        ) : (
          <ArrowUpRight
            className="h-3.5 w-3.5 text-text-muted shrink-0 mt-0.5"
            aria-hidden
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="text-sm text-text-primary truncate">
            {action.label}
          </div>
          {action.rationale && (
            <div className="text-xs text-text-muted truncate">
              {action.rationale}
            </div>
          )}
        </div>
      </button>
    </li>
  );
}
