import * as React from "react";
import { Page } from "../slots/Page";
import { PageHeaderSlot } from "../slots/PageHeaderSlot";
import { ArchetypeToolbar } from "../slots/Toolbar";
import { MainCanvas } from "../slots/MainCanvas";
import { cn } from "@/lib/cn";
import type { Density } from "../types";

export interface SplitInboxProps {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  toolbarStart?: React.ReactNode;
  toolbarEnd?: React.ReactNode;
  /** The list pane (left). */
  list: React.ReactNode;
  /** The preview pane (right). */
  preview: React.ReactNode;
  /** Width of the list pane in px on desktop. */
  listWidth?: 320 | 360 | 400;
  /** Below this width, the list and preview stack (preview behind a "back" button). */
  collapseAt?: number;
  /** When stacked, true means we're showing the preview pane (mobile). */
  showingPreview?: boolean;
  /** Mobile: invoked when the user wants to dismiss the preview. */
  onBack?: () => void;
  density?: Density;
  className?: string;
}

/** Archetype #8 — Split Inbox. The triage desk. */
export function SplitInbox({
  id,
  title,
  subtitle,
  actions,
  toolbarStart,
  toolbarEnd,
  list,
  preview,
  listWidth = 360,
  collapseAt = 900,
  showingPreview = false,
  onBack,
  density = "compact",
  className,
}: SplitInboxProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [stacked, setStacked] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setStacked(entry.contentRect.width < collapseAt);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [collapseAt]);

  return (
    <Page archetype="split-inbox" id={id} density={density} className={className}>
      <PageHeaderSlot title={title} subtitle={subtitle} actions={actions} />
      {(toolbarStart || toolbarEnd) && (
        <ArchetypeToolbar start={toolbarStart} end={toolbarEnd} />
      )}
      <MainCanvas className="flex-1 min-h-0">
        <div
          ref={containerRef}
          className={cn(
            "h-full min-h-0 grid gap-3",
            stacked
              ? "grid-cols-1"
              : listWidth === 320
                ? "grid-cols-[320px_minmax(0,1fr)]"
                : listWidth === 400
                  ? "grid-cols-[400px_minmax(0,1fr)]"
                  : "grid-cols-[360px_minmax(0,1fr)]",
          )}
        >
          {(!stacked || !showingPreview) && (
            <div
              role="region"
              aria-label="List"
              className="rounded-lg border border-border bg-surface-0 overflow-auto min-h-0"
            >
              {list}
            </div>
          )}
          {(!stacked || showingPreview) && (
            <div
              role="region"
              aria-label="Preview"
              className="rounded-lg border border-border bg-surface-0 overflow-auto min-h-0 flex flex-col"
            >
              {stacked && onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="text-xs text-text-muted hover:text-text-primary p-2 border-b border-border-subtle text-left"
                >
                  ← Back to list
                </button>
              )}
              <div className="flex-1 min-h-0">{preview}</div>
            </div>
          )}
        </div>
      </MainCanvas>
    </Page>
  );
}
