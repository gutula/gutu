import * as React from "react";
import { Shield, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Severity } from "../types";

export interface RiskFlag {
  id: string;
  label: React.ReactNode;
  /** Detail line (e.g. "SLA breach in 3h"). */
  detail?: React.ReactNode;
  severity: Severity;
  /** ISO timestamp; renders as relative time when present. */
  since?: string;
}

export interface RailRiskFlagsProps {
  title?: React.ReactNode;
  flags: readonly RiskFlag[];
  emptyText?: React.ReactNode;
  className?: string;
}

type IconCmp = React.ComponentType<React.SVGProps<SVGSVGElement>>;
const FLAG_ICON: Record<string, IconCmp> = {
  sla: Clock as unknown as IconCmp,
  compliance: Shield as unknown as IconCmp,
  generic: AlertTriangle as unknown as IconCmp,
};

const SEVERITY_BG: Record<Severity, string> = {
  info: "bg-info-soft text-info-strong",
  success: "bg-success-soft text-success-strong",
  warning: "bg-warning-soft text-warning-strong",
  danger: "bg-danger-soft text-danger-strong",
  neutral: "bg-surface-2 text-text-muted",
};

export function RailRiskFlags({
  title = "Risk flags",
  flags,
  emptyText = "No active flags.",
  className,
}: RailRiskFlagsProps) {
  if (flags.length === 0) {
    return (
      <div
        data-archetype-widget="rail-risk-flags"
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
      data-archetype-widget="rail-risk-flags"
      className={cn(
        "rounded-lg border border-border bg-surface-0",
        className,
      )}
    >
      <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted border-b border-border-subtle">
        {title}
      </div>
      <ul role="list" className="divide-y divide-border-subtle">
        {flags.map((f) => {
          const Icon = FLAG_ICON.generic;
          return (
            <li
              key={f.id}
              className="flex items-start gap-2 px-3 py-2"
            >
              <span
                className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center shrink-0",
                  SEVERITY_BG[f.severity],
                )}
              >
                <Icon className="h-3 w-3" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-text-primary truncate">
                  {f.label}
                </div>
                {f.detail && (
                  <div className="text-xs text-text-muted truncate">
                    {f.detail}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
