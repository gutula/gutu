import * as React from "react";
import { Page } from "../slots/Page";
import { PageHeaderSlot } from "../slots/PageHeaderSlot";
import { HeroStrip } from "../slots/HeroStrip";
import { BodyLayout } from "../slots/Layout";
import { MainCanvas } from "../slots/MainCanvas";
import { Rail } from "../slots/Rail";
import type { Density } from "../types";

export interface IntelligentDashboardProps {
  /** Stable id for telemetry. */
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right-side header actions (period selector, refresh, etc.). */
  actions?: React.ReactNode;
  /** Tab strip (optional). */
  tabs?: React.ReactNode;
  /** Hero KPI tiles — typically 4–6 KpiTile / KpiRing / AnomalyTile / ForecastTile. */
  kpis?: React.ReactNode;
  /** Main content (charts, attention queue, etc.). */
  main: React.ReactNode;
  /** Right rail (anomalies, next actions, AI assistant). */
  rail?: React.ReactNode;
  density?: Density;
  fullBleed?: boolean;
  className?: string;
}

/** Archetype #1 — Intelligent Dashboard. Anchor metaphor: the control tower. */
export function IntelligentDashboard({
  id,
  title,
  subtitle,
  actions,
  tabs,
  kpis,
  main,
  rail,
  density = "comfortable",
  fullBleed = false,
  className,
}: IntelligentDashboardProps) {
  return (
    <Page archetype="dashboard" id={id} density={density} fullBleed={fullBleed} className={className}>
      <PageHeaderSlot
        title={title}
        subtitle={subtitle}
        actions={actions}
        tabs={tabs}
      />
      {kpis && <HeroStrip>{kpis}</HeroStrip>}
      <BodyLayout
        main={<MainCanvas>{main}</MainCanvas>}
        rail={rail ? <Rail>{rail}</Rail> : undefined}
      />
    </Page>
  );
}
