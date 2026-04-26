import * as React from "react";
import * as Lucide from "lucide-react";
import { Link2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { RelatedEntityGroup, Severity } from "../types";

export interface RailRelatedEntitiesProps {
  title?: React.ReactNode;
  groups: readonly RelatedEntityGroup[];
  emptyText?: React.ReactNode;
  className?: string;
}

const SEVERITY_TINT: Record<Severity, string> = {
  info: "text-info-strong",
  success: "text-success-strong",
  warning: "text-warning-strong",
  danger: "text-danger-strong",
  neutral: "text-text-muted",
};

export function RailRelatedEntities({
  title = "Linked",
  groups,
  emptyText = "No linked records yet.",
  className,
}: RailRelatedEntitiesProps) {
  if (groups.length === 0) {
    return (
      <div
        data-archetype-widget="rail-related-entities"
        className={cn(
          "rounded-lg border border-border bg-surface-0 p-3 text-xs text-text-muted",
          className,
        )}
      >
        <div className="text-[10px] font-semibold uppercase tracking-wide text-text-muted mb-1.5 flex items-center gap-1">
          <Link2 className="h-3 w-3" aria-hidden /> {title}
        </div>
        {emptyText}
      </div>
    );
  }
  return (
    <div
      data-archetype-widget="rail-related-entities"
      className={cn(
        "rounded-lg border border-border bg-surface-0",
        className,
      )}
    >
      <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted border-b border-border-subtle flex items-center gap-1">
        <Link2 className="h-3 w-3" aria-hidden /> {title}
      </div>
      <ul role="list" className="divide-y divide-border-subtle">
        {groups.map((g, i) => {
          const Icon = g.icon
            ? (Lucide as unknown as Record<
                string,
                React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
              >)[g.icon] ?? Link2
            : Link2;
          const interactive = !!g.drillTo;
          const Tag = interactive ? "button" : "div";
          const onActivate = () => {
            const t = g.drillTo;
            if (!t) return;
            if (t.kind === "hash") window.location.hash = t.hash;
            else if (t.kind === "url") window.location.href = t.url;
            else t.run();
          };
          return (
            <li key={i}>
              <Tag
                type={interactive ? "button" : undefined}
                onClick={interactive ? onActivate : undefined}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-left",
                  interactive && "hover:bg-surface-1",
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    g.severity ? SEVERITY_TINT[g.severity] : "text-text-muted",
                  )}
                  aria-hidden
                />
                <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                  <span className="text-sm text-text-primary truncate">
                    {g.label}
                  </span>
                  <span className="text-xs text-text-muted tabular-nums shrink-0">
                    {g.summary ?? g.count}
                  </span>
                </div>
                {interactive && (
                  <ArrowRight
                    className="h-3.5 w-3.5 text-text-muted shrink-0"
                    aria-hidden
                  />
                )}
              </Tag>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
