import * as React from "react";
import { CloudOff, Wifi } from "lucide-react";
import { cn } from "@/lib/cn";

export interface OfflineChipProps {
  /** When true, show offline badge. */
  offline: boolean;
  /** Number of writes queued locally. */
  queuedWrites?: number;
  className?: string;
}

/** Inline chip used in S1 of any realtime/collab page. */
export function OfflineChip({
  offline,
  queuedWrites = 0,
  className,
}: OfflineChipProps) {
  if (!offline && queuedWrites === 0) return null;
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        offline
          ? "bg-warning-soft text-warning-strong"
          : "bg-info-soft text-info-strong",
        className,
      )}
    >
      {offline ? (
        <CloudOff className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <Wifi className="h-3.5 w-3.5" aria-hidden />
      )}
      {offline ? "Offline" : "Syncing"}
      {queuedWrites > 0 && (
        <span aria-label={`${queuedWrites} queued`}>
          · {queuedWrites} queued
        </span>
      )}
    </span>
  );
}
