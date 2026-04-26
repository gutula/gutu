/** Shared types for the admin-archetypes runtime.
 *  See docs/PAGE-DESIGN-SYSTEM.md for the full contract. */

import type { ReactNode } from "react";

export type ArchetypeId =
  | "dashboard"
  | "workspace-hub"
  | "smart-list"
  | "kanban"
  | "calendar"
  | "tree"
  | "graph"
  | "split-inbox"
  | "timeline"
  | "map"
  | "editor-canvas"
  | "detail-rich";

export type Density = "comfortable" | "cozy" | "compact";

export type Severity = "info" | "success" | "warning" | "danger" | "neutral";

export interface DriftPoint {
  /** ISO timestamp or ordinal value. */
  x: string | number;
  /** Numeric value for the trend point. */
  y: number;
}

export interface KpiTrend {
  /** Percent delta vs comparison period (e.g. -3.2 for −3.2%). */
  deltaPct?: number;
  /** True when an increase is "good" (revenue ↑) — used to colour the chip. */
  positiveIsGood?: boolean;
  /** Sparkline series. */
  series?: DriftPoint[];
}

export interface AnomalyMeta {
  /** 0–1 anomaly score; ≥0.85 is danger, ≥0.6 warning. */
  score: number;
  /** Plain-language reason. */
  reason: string;
  /** ISO timestamp the anomaly was first detected. */
  since: string;
}

export interface ForecastBand {
  p10: number;
  p50: number;
  p90: number;
  /** Time horizon, e.g. "next 30d". */
  horizon: string;
}

export type DrillTarget =
  | { kind: "hash"; hash: string }
  | { kind: "url"; url: string }
  | { kind: "fn"; run: () => void };

export interface AttentionItem {
  id: string;
  /** Lucide icon name. */
  icon?: string;
  severity?: Severity;
  title: ReactNode;
  description?: ReactNode;
  /** Click target. */
  drillTo?: DrillTarget;
  /** ISO timestamp; renders as "3d ago". */
  since?: string;
}

export interface RelatedEntityGroup {
  /** Display label. */
  label: ReactNode;
  /** Total count in the group. */
  count: number;
  /** Optional summary value (e.g. "$320k"). */
  summary?: ReactNode;
  /** Lucide icon name. */
  icon?: string;
  /** Drill destination. */
  drillTo?: DrillTarget;
  /** Severity for tinting. */
  severity?: Severity;
}

export interface RailHealthFactor {
  label: string;
  /** -100..100; positive contributes, negative drags. */
  weight: number;
}

export interface RailHealthScore {
  /** 0–100 composite score. */
  score: number;
  /** Severity tier for the badge color. */
  tier: Severity;
  factors?: RailHealthFactor[];
}

export type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; error: unknown }
  | { status: "empty" };
