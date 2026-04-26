/** Reference Intelligent Dashboard for CRM, using the new
 *  `@/admin-archetypes` runtime end-to-end.
 *
 *  This file is a worked example showing every part of the design system
 *  composed together: the IntelligentDashboard archetype, the slot grid,
 *  KPI / Anomaly / Forecast / Ring tiles, the AttentionQueue main
 *  surface, the rail (RailEntityCard / NextActions / RiskFlags / Health),
 *  the keyboard contract, the URL-state contract, and per-widget error
 *  boundaries with skeleton states. */

import * as React from "react";
import { Plus, RefreshCw, ListFilter } from "lucide-react";

import { Button } from "@/primitives/Button";
import {
  IntelligentDashboard,
  KpiTile,
  KpiRing,
  AnomalyTile,
  ForecastTile,
  AttentionQueue,
  PeriodSelector,
  type PeriodKey,
  RailNextActions,
  RailRiskFlags,
  RailRecordHealth,
  CommandHints,
  WidgetShell,
  useUrlState,
  useArchetypeKeyboard,
  useSwr,
  type DriftPoint,
  type AttentionItem,
  type DrillTarget,
} from "@/admin-archetypes";

const REFRESH_HINTS = [
  { keys: "R", label: "Refresh" },
  { keys: "?", label: "Help" },
  { keys: "/", label: "Search" },
];

/** Shape of the data the dashboard reads — typed up front so adapters can
 *  swap (REST, GraphQL, websocket) without changing the page. */
interface CrmKpis {
  newLeads: { value: number; deltaPct: number; series: DriftPoint[] };
  pipelineOpen: { value: number; deltaPct: number; series: DriftPoint[] };
  winRate: { current: number; target: number };
  cycleDays: { value: number; deltaPct: number; series: DriftPoint[] };
  stalled: { value: number; reason: string };
  forecast30: { current: number; p10: number; p50: number; p90: number };
}

interface CrmAttention {
  items: AttentionItem[];
}

/** Adapter — tries the plugin API first; falls back to a deterministic
 *  in-memory dataset so the reference dashboard renders even without a
 *  backend. Real plugins replace this layer with their own data hooks. */
async function fetchKpis(period: string, signal?: AbortSignal): Promise<CrmKpis> {
  try {
    const res = await fetch(`/api/crm/dashboard/kpis?period=${period}`, { signal });
    if (res.ok) return (await res.json()) as CrmKpis;
  } catch {
    /* fall through to mock */
  }
  return mockKpis(period);
}

async function fetchAttention(signal?: AbortSignal): Promise<CrmAttention> {
  try {
    const res = await fetch("/api/crm/dashboard/attention", { signal });
    if (res.ok) return (await res.json()) as CrmAttention;
  } catch {
    /* fall through */
  }
  return mockAttention();
}

function mockSeries(
  base: number,
  amplitude: number,
  count: number,
): DriftPoint[] {
  const out: DriftPoint[] = [];
  for (let i = 0; i < count; i++) {
    const phase = (i / count) * Math.PI * 2;
    out.push({ x: i, y: Math.round(base + Math.sin(phase) * amplitude) });
  }
  return out;
}

function mockKpis(period: string): CrmKpis {
  const scale = period === "7d" ? 0.25 : period === "30d" ? 1 : period === "qtd" ? 3 : 12;
  return {
    newLeads: {
      value: Math.round(214 * scale),
      deltaPct: 8.2,
      series: mockSeries(48, 6, 14),
    },
    pipelineOpen: {
      value: Math.round(320_000 * scale),
      deltaPct: 18.4,
      series: mockSeries(280_000, 24_000, 14),
    },
    winRate: { current: 0.34, target: 0.4 },
    cycleDays: {
      value: 42,
      deltaPct: -3.1,
      series: mockSeries(45, 3, 14),
    },
    stalled: { value: 7, reason: "Avg dwell 18d in Negotiate" },
    forecast30: {
      current: 92_000,
      p10: 70_000,
      p50: 92_000,
      p90: 124_000,
    },
  };
}

function mockAttention(): CrmAttention {
  return {
    items: [
      {
        id: "stalled-1",
        icon: "AlertTriangle",
        severity: "warning",
        title: "3 stalled deals over 14 days",
        description: "Acme · Globex · Initech",
        drillTo: { kind: "hash", hash: "/crm/deals?filter=stalled:eq:true" },
      },
      {
        id: "overdue-1",
        icon: "Clock",
        severity: "danger",
        title: "8 invoices overdue 7+ days",
        description: "Total $42,800",
        drillTo: { kind: "hash", hash: "/accounting/ar?filter=overdue:eq:true" },
      },
      {
        id: "hot-lead-1",
        icon: "Flame",
        severity: "info",
        title: "Hot lead: Acme Corp",
        description: "No follow-up in 3 days",
        drillTo: { kind: "hash", hash: "/crm/people?filter=tag:eq:hot-lead" },
      },
    ],
  };
}

/** The page. Roughly 200 lines of business code; the design system carries
 *  the rest of the chrome. */
export default function CrmArchetypeDashboard() {
  const [params, setParams] = useUrlState(["period"] as const);
  const period = (params.period as PeriodKey | undefined) ?? "30d";

  const kpis = useSwr<CrmKpis>(
    `crm.dashboard.kpis?period=${period}`,
    () => fetchKpis(period),
    { ttlMs: 30_000 },
  );
  const attention = useSwr<CrmAttention>(
    `crm.dashboard.attention`,
    () => fetchAttention(),
    { ttlMs: 30_000 },
  );

  const refresh = React.useCallback(() => {
    void kpis.refetch();
    void attention.refetch();
  }, [kpis, attention]);

  useArchetypeKeyboard([
    {
      label: "Refresh",
      combo: "r",
      run: () => refresh(),
    },
    {
      label: "Search",
      combo: "/",
      run: () => {
        document.getElementById("global-search")?.focus();
      },
    },
  ]);

  return (
    <IntelligentDashboard
      id="crm.dashboard"
      title="Sales overview"
      subtitle="Pipeline health, attention, and the forecast — all in one place."
      actions={
        <>
          <PeriodSelector
            value={period}
            onChange={(p) => setParams({ period: p })}
            withCompare
          />
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw className="h-4 w-4 mr-1" aria-hidden /> Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" aria-hidden /> New deal
          </Button>
        </>
      }
      kpis={
        <>
          <WidgetShell label="New leads" state={kpis.state} skeleton="kpi" onRetry={kpis.refetch}>
            <KpiTile
              label="New leads"
              value={fmt(kpis.data?.newLeads.value ?? 0)}
              period={period}
              trend={{
                deltaPct: kpis.data?.newLeads.deltaPct,
                series: kpis.data?.newLeads.series,
                positiveIsGood: true,
              }}
              drillTo={hashDrill(`/crm/people?filter=status:eq:new&period=${period}`)}
            />
          </WidgetShell>
          <WidgetShell label="Open pipeline" state={kpis.state} skeleton="kpi" onRetry={kpis.refetch}>
            <KpiTile
              label="Open pipeline"
              value={fmtCurrency(kpis.data?.pipelineOpen.value ?? 0)}
              period={period}
              trend={{
                deltaPct: kpis.data?.pipelineOpen.deltaPct,
                series: kpis.data?.pipelineOpen.series,
                positiveIsGood: true,
              }}
              drillTo={hashDrill(`/crm/deals`)}
            />
          </WidgetShell>
          <WidgetShell label="Win rate" state={kpis.state} skeleton="kpi" onRetry={kpis.refetch}>
            <KpiRing
              label="Win rate"
              current={kpis.data?.winRate.current ?? 0}
              target={kpis.data?.winRate.target ?? 1}
              period={period}
              format={(n) => `${(n * 100).toFixed(0)}%`}
            />
          </WidgetShell>
          <WidgetShell label="Cycle days" state={kpis.state} skeleton="kpi" onRetry={kpis.refetch}>
            <KpiTile
              label="Avg cycle"
              value={`${kpis.data?.cycleDays.value ?? 0}d`}
              period={period}
              trend={{
                deltaPct: kpis.data?.cycleDays.deltaPct,
                series: kpis.data?.cycleDays.series,
                positiveIsGood: false,
              }}
            />
          </WidgetShell>
          <WidgetShell label="Stalled" state={kpis.state} skeleton="kpi" onRetry={kpis.refetch}>
            <AnomalyTile
              label="Stalled deals"
              value={kpis.data?.stalled.value ?? 0}
              anomaly={{
                score: 0.7,
                reason: kpis.data?.stalled.reason ?? "More than 14d in stage",
                since: new Date().toISOString(),
              }}
              drillTo={hashDrill(`/crm/deals?filter=stalled:eq:true`)}
            />
          </WidgetShell>
          <WidgetShell label="Forecast" state={kpis.state} skeleton="kpi" onRetry={kpis.refetch}>
            <ForecastTile
              label="Forecast"
              current={fmtCurrency(kpis.data?.forecast30.current ?? 0)}
              forecast={{
                p10: kpis.data?.forecast30.p10 ?? 0,
                p50: kpis.data?.forecast30.p50 ?? 0,
                p90: kpis.data?.forecast30.p90 ?? 0,
                horizon: "30d",
              }}
              format={(n) => fmtCurrency(n)}
            />
          </WidgetShell>
        </>
      }
      main={
        <>
          <WidgetShell
            label="Attention queue"
            state={attention.state}
            skeleton="list"
            onRetry={attention.refetch}
            empty={{
              title: "Nothing's stuck",
              description: "Pipeline is moving; no overdue follow-ups today.",
              icon: <ListFilter className="h-6 w-6" aria-hidden />,
            }}
          >
            <AttentionQueue
              items={attention.data?.items ?? []}
              title="Attention queue"
            />
          </WidgetShell>
          <CommandHints hints={REFRESH_HINTS} className="pt-1" />
        </>
      }
      rail={
        <>
          <RailRecordHealth
            score={{
              score: 84,
              tier: "success",
              factors: [
                { label: "Velocity", weight: 22 },
                { label: "Coverage", weight: 18 },
                { label: "Forecast confidence", weight: 14 },
                { label: "Stalled deals", weight: -10 },
              ],
            }}
          />
          <RailNextActions
            actions={[
              {
                id: "nudge-stalled",
                label: "Send nudge to 3 stalled deals",
                source: "ai",
                rationale: "Average dwell 18d in Negotiate.",
                drillTo: hashDrill("/crm/deals?filter=stalled:eq:true"),
              },
              {
                id: "renewal-prep",
                label: "Prep Q3 renewal pack for top 5 customers",
                source: "rule",
                drillTo: hashDrill("/crm/companies?filter=tier:eq:enterprise"),
              },
            ]}
          />
          <RailRiskFlags
            flags={[
              {
                id: "outreach-drop",
                label: "Outreach drop on Tuesdays",
                detail: "Calls down 18% w/w",
                severity: "warning",
              },
              {
                id: "acme-silent",
                label: "Acme silent 11d",
                detail: "Was high-engagement",
                severity: "danger",
              },
            ]}
          />
        </>
      }
    />
  );
}

function hashDrill(hash: string): DrillTarget {
  return { kind: "hash", hash };
}

function fmt(n: number): string {
  return new Intl.NumberFormat(undefined).format(n);
}

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
