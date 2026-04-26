import * as React from "react";
import { Page } from "../slots/Page";
import { PageHeaderSlot } from "../slots/PageHeaderSlot";
import { ArchetypeToolbar } from "../slots/Toolbar";
import { BodyLayout } from "../slots/Layout";
import { MainCanvas } from "../slots/MainCanvas";
import { Rail } from "../slots/Rail";
import type { Density } from "../types";

export interface CalendarScheduleProps {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  toolbarStart?: React.ReactNode;
  toolbarEnd?: React.ReactNode;
  /** Calendar / schedule canvas (e.g., the existing Calendar primitive). */
  children: React.ReactNode;
  /** Right rail — selection details, capacity, conflict. */
  rail?: React.ReactNode;
  density?: Density;
  className?: string;
}

/** Archetype #5 — Calendar / Schedule. The dispatcher. */
export function CalendarSchedule({
  id,
  title,
  subtitle,
  actions,
  toolbarStart,
  toolbarEnd,
  children,
  rail,
  density = "comfortable",
  className,
}: CalendarScheduleProps) {
  return (
    <Page archetype="calendar" id={id} density={density} className={className}>
      <PageHeaderSlot title={title} subtitle={subtitle} actions={actions} />
      {(toolbarStart || toolbarEnd) && (
        <ArchetypeToolbar start={toolbarStart} end={toolbarEnd} />
      )}
      <BodyLayout
        main={<MainCanvas className="overflow-auto">{children}</MainCanvas>}
        rail={rail ? <Rail>{rail}</Rail> : undefined}
        railWidth={320}
      />
    </Page>
  );
}
