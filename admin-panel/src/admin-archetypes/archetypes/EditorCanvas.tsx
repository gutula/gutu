import * as React from "react";
import { Page } from "../slots/Page";
import { cn } from "@/lib/cn";
import type { Density } from "../types";

export interface EditorCanvasProps {
  id: string;
  /** Slim top-bar contents. */
  topBar?: React.ReactNode;
  /** Floating toolbar (e.g. format strip). */
  floatingToolbar?: React.ReactNode;
  /** Right-side rail (collapsible). */
  rail?: React.ReactNode;
  /** Main canvas (slides / doc / whiteboard / spreadsheet). */
  children: React.ReactNode;
  /** When true, rail is collapsed to icons. */
  railCollapsed?: boolean;
  density?: Density;
  className?: string;
}

/** Archetype #11 — Editor Canvas. The workshop. Always full-bleed; thin
 *  32px top bar; collapsible rail; floating toolbar. */
export function EditorCanvas({
  id,
  topBar,
  floatingToolbar,
  rail,
  children,
  railCollapsed = false,
  density = "comfortable",
  className,
}: EditorCanvasProps) {
  return (
    <Page
      archetype="editor-canvas"
      id={id}
      fullBleed
      density={density}
      className={cn("h-screen", className)}
    >
      {topBar && (
        <div
          role="banner"
          className="flex items-center justify-between gap-2 h-10 px-3 border-b border-border bg-surface-canvas/95 backdrop-blur"
        >
          {topBar}
        </div>
      )}
      <div className="flex-1 min-h-0 grid" style={{
        gridTemplateColumns: rail ? (railCollapsed ? "minmax(0,1fr) 56px" : "minmax(0,1fr) 320px") : "minmax(0,1fr)",
      }}>
        <div className="relative min-h-0 overflow-auto">
          {floatingToolbar && (
            <div className="sticky top-2 z-10 mx-auto w-fit shadow-md rounded-full border border-border bg-surface-raised px-2 py-1">
              {floatingToolbar}
            </div>
          )}
          {children}
        </div>
        {rail && (
          <aside
            role="complementary"
            aria-label="Editor rail"
            className={cn(
              "border-l border-border bg-surface-1 overflow-auto",
              railCollapsed && "px-2",
            )}
          >
            {rail}
          </aside>
        )}
      </div>
    </Page>
  );
}
