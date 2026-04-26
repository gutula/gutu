import * as React from "react";
import { Page } from "../slots/Page";
import { PageHeaderSlot } from "../slots/PageHeaderSlot";
import { HeroStrip } from "../slots/HeroStrip";
import { BodyLayout } from "../slots/Layout";
import { MainCanvas } from "../slots/MainCanvas";
import { Rail } from "../slots/Rail";
import type { Density } from "../types";

export interface WorkspaceHubProps {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Status pill rendered next to the title. */
  badge?: React.ReactNode;
  /** Right-side header actions. */
  actions?: React.ReactNode;
  /** Tab strip — every workspace hub uses tabs. */
  tabs: React.ReactNode;
  /** KPI tiles scoped to the entity. Optional but recommended. */
  kpis?: React.ReactNode;
  /** Main content (currently active tab). */
  main: React.ReactNode;
  /** Rail entity card on top + linked / activity / AI below. */
  rail?: React.ReactNode;
  /** Top section of the rail (RailEntityCard typically). */
  railTop?: React.ReactNode;
  density?: Density;
  className?: string;
}

/** Archetype #2 — Workspace Hub (entity 360). The cockpit. */
export function WorkspaceHub({
  id,
  title,
  subtitle,
  badge,
  actions,
  tabs,
  kpis,
  main,
  rail,
  railTop,
  density = "comfortable",
  className,
}: WorkspaceHubProps) {
  return (
    <Page archetype="workspace-hub" id={id} density={density} className={className}>
      <PageHeaderSlot
        title={title}
        subtitle={subtitle}
        badge={badge}
        actions={actions}
        tabs={tabs}
      />
      {kpis && <HeroStrip>{kpis}</HeroStrip>}
      <BodyLayout
        main={<MainCanvas>{main}</MainCanvas>}
        rail={
          rail || railTop ? (
            <Rail topSlot={railTop}>{rail}</Rail>
          ) : undefined
        }
      />
    </Page>
  );
}
