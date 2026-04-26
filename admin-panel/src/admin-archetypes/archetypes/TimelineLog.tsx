import * as React from "react";
import { Page } from "../slots/Page";
import { PageHeaderSlot } from "../slots/PageHeaderSlot";
import { ArchetypeToolbar } from "../slots/Toolbar";
import { MainCanvas } from "../slots/MainCanvas";
import type { Density } from "../types";

export interface TimelineLogProps {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  toolbarStart?: React.ReactNode;
  toolbarEnd?: React.ReactNode;
  /** The timeline body — typically existing Timeline / TimelineFeed primitive. */
  children: React.ReactNode;
  density?: Density;
  className?: string;
}

/** Archetype #9 — Timeline / Log. The flight recorder. */
export function TimelineLog({
  id,
  title,
  subtitle,
  actions,
  toolbarStart,
  toolbarEnd,
  children,
  density = "compact",
  className,
}: TimelineLogProps) {
  return (
    <Page archetype="timeline" id={id} density={density} className={className}>
      <PageHeaderSlot title={title} subtitle={subtitle} actions={actions} />
      {(toolbarStart || toolbarEnd) && (
        <ArchetypeToolbar start={toolbarStart} end={toolbarEnd} />
      )}
      <MainCanvas>{children}</MainCanvas>
    </Page>
  );
}
