import * as React from "react";
import { WidgetErrorBoundary } from "./WidgetErrorBoundary";
import { WidgetSkeleton, type WidgetSkeletonProps } from "./WidgetSkeleton";
import { ArchetypeEmptyState, type ArchetypeEmptyStateProps } from "./ArchetypeEmptyState";
import type { LoadState } from "../types";

export interface WidgetShellProps {
  /** Load state — drives which surface is shown. */
  state?: LoadState;
  /** Widget label used by the error boundary. */
  label?: string;
  /** Skeleton shape when loading. */
  skeleton?: WidgetSkeletonProps["variant"];
  /** Empty-state props when state.status === "empty". */
  empty?: ArchetypeEmptyStateProps;
  /** Retry handler — wired into both error boundary and explicit error state. */
  onRetry?: () => void;
  /** Forwarded children rendered on success. */
  children: React.ReactNode;
  className?: string;
}

/** Wraps a widget with error boundary + per-state surfaces. The default
 *  pattern for every Tier-1 widget on every archetype. */
export function WidgetShell({
  state,
  label,
  skeleton = "kpi",
  empty,
  onRetry,
  children,
  className,
}: WidgetShellProps) {
  const status = state?.status ?? "ready";
  return (
    <WidgetErrorBoundary label={label} onRetry={onRetry} className={className}>
      {status === "loading" || status === "idle" ? (
        <WidgetSkeleton variant={skeleton} className={className} />
      ) : status === "error" ? (
        <ArchetypeErrorInline
          label={label}
          error={(state as Extract<LoadState, { status: "error" }>).error}
          onRetry={onRetry}
        />
      ) : status === "empty" && empty ? (
        <ArchetypeEmptyState {...empty} />
      ) : (
        children
      )}
    </WidgetErrorBoundary>
  );
}

function ArchetypeErrorInline({
  label,
  error,
  onRetry,
}: {
  label?: string;
  error: unknown;
  onRetry?: () => void;
}) {
  const msg =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Failed to load.";
  return (
    <div
      role="alert"
      className="rounded-md border border-danger/30 bg-danger-soft/20 px-3 py-3 text-sm flex items-start gap-2"
    >
      <div className="min-w-0 flex-1">
        <div className="font-medium text-text-primary">{label ?? "Failed"}</div>
        <div className="text-text-muted truncate" title={msg}>
          {msg}
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-text-primary hover:underline shrink-0"
        >
          Retry
        </button>
      )}
    </div>
  );
}
