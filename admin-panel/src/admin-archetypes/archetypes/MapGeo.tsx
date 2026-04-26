import * as React from "react";
import { Page } from "../slots/Page";
import { PageHeaderSlot } from "../slots/PageHeaderSlot";
import { ArchetypeToolbar } from "../slots/Toolbar";
import { BodyLayout } from "../slots/Layout";
import { MainCanvas } from "../slots/MainCanvas";
import { Rail } from "../slots/Rail";
import type { Density } from "../types";

export interface MapGeoProps {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  toolbarStart?: React.ReactNode;
  toolbarEnd?: React.ReactNode;
  /** Map canvas (tile + markers + clusters + routes). */
  children: React.ReactNode;
  /** Right rail: legend, selected marker, status. */
  rail?: React.ReactNode;
  density?: Density;
  fullBleed?: boolean;
  className?: string;
}

/** Archetype #10 — Map / Geo. The dispatch map. */
export function MapGeo({
  id,
  title,
  subtitle,
  actions,
  toolbarStart,
  toolbarEnd,
  children,
  rail,
  density = "comfortable",
  fullBleed = false,
  className,
}: MapGeoProps) {
  return (
    <Page archetype="map" id={id} density={density} fullBleed={fullBleed} className={className}>
      <PageHeaderSlot title={title} subtitle={subtitle} actions={actions} />
      {(toolbarStart || toolbarEnd) && (
        <ArchetypeToolbar start={toolbarStart} end={toolbarEnd} />
      )}
      <BodyLayout
        main={<MainCanvas className="min-h-[60vh]">{children}</MainCanvas>}
        rail={rail ? <Rail>{rail}</Rail> : undefined}
        railWidth={320}
      />
    </Page>
  );
}
