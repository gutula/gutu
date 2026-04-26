import * as React from "react";
import { Page } from "../slots/Page";
import { PageHeaderSlot } from "../slots/PageHeaderSlot";
import { ArchetypeToolbar } from "../slots/Toolbar";
import { MainCanvas } from "../slots/MainCanvas";
import type { Density } from "../types";

export interface KanbanArchetypeProps {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  toolbarStart?: React.ReactNode;
  toolbarEnd?: React.ReactNode;
  /** The board itself — typically the existing DnDKanban / LiveDnDKanban. */
  children: React.ReactNode;
  density?: Density;
  fullBleed?: boolean;
  className?: string;
}

/** Archetype #4 — Kanban / Pipeline. */
export function KanbanArchetype({
  id,
  title,
  subtitle,
  actions,
  toolbarStart,
  toolbarEnd,
  children,
  density = "comfortable",
  fullBleed = false,
  className,
}: KanbanArchetypeProps) {
  return (
    <Page archetype="kanban" id={id} density={density} fullBleed={fullBleed} className={className}>
      <PageHeaderSlot title={title} subtitle={subtitle} actions={actions} />
      {(toolbarStart || toolbarEnd) && (
        <ArchetypeToolbar start={toolbarStart} end={toolbarEnd} />
      )}
      <MainCanvas className="flex-1 min-h-0 overflow-x-auto">
        {children}
      </MainCanvas>
    </Page>
  );
}
