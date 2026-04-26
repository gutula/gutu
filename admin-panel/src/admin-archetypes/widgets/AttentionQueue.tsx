import * as React from "react";
import * as Lucide from "lucide-react";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { AttentionItem, Severity } from "../types";

export interface AttentionQueueProps {
  title?: React.ReactNode;
  items: readonly AttentionItem[];
  emptyText?: React.ReactNode;
  className?: string;
}

const SEVERITY_DOT: Record<Severity, string> = {
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-text-muted",
};

/** Surfaces the items that need attention. The "what should I do today"
 *  list. Used on Intelligent Dashboard and Workspace Hub. */
export function AttentionQueue({
  title = "Attention",
  items,
  emptyText = "Nothing needs attention right now.",
  className,
}: AttentionQueueProps) {
  const [hovered, setHovered] = React.useState<string | null>(null);
  if (items.length === 0) {
    return (
      <div
        data-archetype-widget="attention-queue"
        className={cn(
          "rounded-lg border border-border bg-surface-0 p-4 text-sm text-text-muted",
          className,
        )}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {title}
          </span>
        </div>
        <div className="py-4 text-center">
          <Lucide.Sparkles
            className="h-5 w-5 mx-auto mb-1 text-success"
            aria-hidden
          />
          {emptyText}
        </div>
      </div>
    );
  }
  return (
    <div
      data-archetype-widget="attention-queue"
      className={cn(
        "rounded-lg border border-border bg-surface-0",
        className,
      )}
    >
      <div className="px-3 py-2 flex items-center justify-between border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          {title}
        </span>
        <span className="text-xs text-text-muted tabular-nums">
          {items.length}
        </span>
      </div>
      <ul role="list" className="divide-y divide-border">
        {items.map((item) => {
          const Icon = item.icon
            ? (Lucide as unknown as Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>>)[
                item.icon
              ] ?? AlertTriangle
            : AlertTriangle;
          const interactive = !!item.drillTo;
          const Tag = interactive ? "button" : "div";
          const onActivate = () => {
            const t = item.drillTo;
            if (!t) return;
            if (t.kind === "hash") window.location.hash = t.hash;
            else if (t.kind === "url") window.location.href = t.url;
            else t.run();
          };
          return (
            <li key={item.id}>
              <Tag
                type={interactive ? "button" : undefined}
                onClick={interactive ? onActivate : undefined}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  "flex items-start gap-2.5 px-3 py-2.5 w-full text-left",
                  interactive && "hover:bg-surface-1 cursor-pointer",
                )}
              >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 shrink-0">
                  <Icon className="h-4 w-4 text-text-muted" aria-hidden />
                  {item.severity && (
                    <span
                      className={cn(
                        "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-surface-0",
                        SEVERITY_DOT[item.severity],
                      )}
                      aria-hidden
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-text-primary truncate">
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-xs text-text-muted truncate">
                      {item.description}
                    </div>
                  )}
                </div>
                {interactive && (
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 text-text-muted shrink-0 mt-1.5 transition",
                      hovered === item.id && "translate-x-0.5 text-text-primary",
                    )}
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
