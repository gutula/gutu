import * as React from "react";
import { BarChart3, RotateCw } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./Card";
import { Button } from "@/primitives/Button";
import { Input } from "@/primitives/Input";
import { Checkbox } from "@/primitives/Checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/primitives/Select";
import { Spinner } from "@/primitives/Spinner";
import { Badge } from "@/primitives/Badge";
import { EmptyStateFramework } from "./EmptyStateFramework";
import { ErrorRecoveryFramework } from "./ErrorRecoveryFramework";
import { FreshnessIndicator } from "./FreshnessIndicator";
import { LineChart } from "./charts/LineChart";
import { BarChart } from "./charts/BarChart";
import { Donut } from "./charts/Donut";
import { Funnel } from "./charts/Funnel";
import { ExportCenter } from "./ExportCenter";
import { formatValue } from "./widgets/formatters";
import { useReport } from "@/runtime/useReport";
import { cn } from "@/lib/cn";
import type { ReportChartSpec, ReportColumn, ReportDefinition, ReportFilterDef } from "@/contracts/widgets";

export interface ReportBuilderProps {
  definition: ReportDefinition;
}

export function ReportBuilder({ definition }: ReportBuilderProps) {
  const initial = React.useMemo(() => {
    const out: Record<string, unknown> = {};
    for (const f of definition.filters) {
      if (f.defaultValue !== undefined) out[f.field] = f.defaultValue;
    }
    return out;
  }, [definition]);

  const [filters, setFilters] = React.useState<Record<string, unknown>>(initial);
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date());
  const { data, loading, error, refetch } = useReport(definition, filters);

  React.useEffect(() => {
    if (!loading && data) setLastUpdated(new Date());
  }, [data, loading]);

  const updateFilter = (field: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={definition.label}
        description={definition.description}
        actions={
          <div className="flex items-center gap-2">
            <FreshnessIndicator lastUpdatedAt={lastUpdated} />
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              iconLeft={<RotateCw className="h-3.5 w-3.5" />}
            >
              Refresh
            </Button>
            <ExportCenter
              resource={definition.id}
              count={data?.rows.length}
              fetchRows={async () => data?.rows ?? []}
            />
          </div>
        }
      />

      {definition.filters.length > 0 && (
        <Card>
          <CardContent className="py-3">
            <div className="flex flex-wrap items-center gap-3">
              {definition.filters.map((f) => (
                <FilterField
                  key={f.field}
                  def={f}
                  value={filters[f.field]}
                  onChange={(v) => updateFilter(f.field, v)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {error ? (
        <ErrorRecoveryFramework
          message={error.message}
          onRetry={refetch}
        />
      ) : loading && !data ? (
        <Card>
          <CardContent className="py-10 flex items-center justify-center gap-2 text-sm text-text-muted">
            <Spinner size={14} /> Running report…
          </CardContent>
        </Card>
      ) : !data || data.rows.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyStateFramework
              kind="no-results"
              title="No data for this report"
              description="Try broadening the filters or picking a different period."
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {data.chart && <ReportChartBlock chart={data.chart} rows={data.rows} />}
          {data.message && (
            <div className="text-xs text-text-muted">{data.message}</div>
          )}
          <Card>
            <CardContent className="p-0">
              <ReportTable
                columns={data.columns}
                rows={data.rows}
                totals={data.totals}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/* Filter field                                                          */
/* -------------------------------------------------------------------- */

function FilterField({
  def,
  value,
  onChange,
}: {
  def: ReportFilterDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (def.kind === "enum") {
    return (
      <label className="flex flex-col gap-1">
        <span className="text-xs text-text-muted">{def.label}</span>
        <Select
          value={value !== undefined && value !== null ? String(value) : ""}
          onValueChange={(v) => onChange(v === "__all__" ? undefined : v)}
        >
          <SelectTrigger className="h-8 min-w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All</SelectItem>
            {(def.options ?? []).map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
    );
  }
  if (def.kind === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 text-xs text-text-muted">
        <Checkbox
          checked={Boolean(value)}
          onCheckedChange={(v) => onChange(Boolean(v))}
        />
        {def.label}
      </label>
    );
  }
  if (def.kind === "date" || def.kind === "date_range") {
    return (
      <label className="flex flex-col gap-1">
        <span className="text-xs text-text-muted">{def.label}</span>
        <Input
          type="date"
          className="h-8 w-36"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value || undefined)}
        />
      </label>
    );
  }
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-text-muted">{def.label}</span>
      <Input
        type={def.kind === "number" ? "number" : "text"}
        className="h-8 w-40"
        value={value !== undefined && value !== null ? String(value) : ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        placeholder={def.label}
      />
    </label>
  );
}

/* -------------------------------------------------------------------- */
/* Chart                                                                 */
/* -------------------------------------------------------------------- */

function ReportChartBlock({
  chart,
  rows,
}: {
  chart: ReportChartSpec;
  rows: readonly Record<string, unknown>[];
}) {
  const dataset = React.useMemo(() => chart.from(rows), [chart, rows]);
  const fmt = (v: number) => formatValue(v, chart.format, chart.currency);
  const height = chart.height ?? 220;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{chart.label}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {"series" in dataset ? (
          <LineChart
            xLabels={dataset.xLabels}
            series={dataset.series}
            height={height}
            valueFormatter={fmt}
            area={chart.kind === "area"}
          />
        ) : chart.kind === "line" || chart.kind === "area" ? (
          <LineChart
            xLabels={dataset.map((d) => d.label)}
            series={[{ label: chart.label, data: dataset.map((d) => d.value) }]}
            height={height}
            valueFormatter={fmt}
            area={chart.kind === "area"}
          />
        ) : chart.kind === "bar" ? (
          <BarChart data={dataset} height={height} valueFormatter={fmt} />
        ) : chart.kind === "donut" ? (
          <Donut data={dataset} />
        ) : (
          <Funnel data={dataset} />
        )}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------- */
/* Table                                                                 */
/* -------------------------------------------------------------------- */

function ReportTable({
  columns,
  rows,
  totals,
}: {
  columns: readonly ReportColumn[];
  rows: Record<string, unknown>[];
  totals?: Record<string, number>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wider text-text-muted">
            {columns.map((c) => (
              <th
                key={c.field}
                className={cn(
                  "px-3 py-2 font-medium",
                  c.align === "right" && "text-right",
                  c.align === "center" && "text-center",
                  !c.align && "text-left",
                )}
                style={{ width: c.width }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border-subtle last:border-b-0 hover:bg-surface-1"
            >
              {columns.map((c) => (
                <td
                  key={c.field}
                  className={cn(
                    "px-3 py-2",
                    c.align === "right" && "text-right tabular-nums",
                    c.align === "center" && "text-center",
                    !c.align && "text-left",
                  )}
                >
                  <CellRenderer column={c} value={row[c.field]} row={row} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {totals && Object.keys(totals).length > 0 && (
          <tfoot>
            <tr className="border-t-2 border-border font-semibold bg-surface-1">
              {columns.map((c, i) => (
                <td
                  key={c.field}
                  className={cn(
                    "px-3 py-2",
                    c.align === "right" && "text-right tabular-nums",
                    c.align === "center" && "text-center",
                    !c.align && "text-left",
                  )}
                >
                  {i === 0 && "Total"}
                  {totals[c.field] !== undefined &&
                    formatCell(c, totals[c.field])}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

function formatCell(column: ReportColumn, value: unknown): React.ReactNode {
  if (value === null || value === undefined || value === "") return "—";
  switch (column.fieldtype) {
    case "currency":
      return typeof value === "number"
        ? formatValue(value, "currency", column.options ?? "USD")
        : String(value);
    case "number":
      return typeof value === "number" ? formatValue(value, "number") : String(value);
    case "percent":
      return typeof value === "number" ? formatValue(value, "percent") : String(value);
    case "date":
    case "datetime":
      return typeof value === "string" ? new Date(value).toLocaleString() : String(value);
    case "enum":
      return <Badge intent="neutral">{String(value)}</Badge>;
    case "ref":
      return <code className="font-mono text-xs text-text-secondary">{String(value)}</code>;
    case "text":
    default:
      return String(value);
  }
}

function CellRenderer({
  column,
  value,
  row,
}: {
  column: ReportColumn;
  value: unknown;
  row: Record<string, unknown>;
}) {
  if (column.format) return <>{column.format(value, row)}</>;
  return <>{formatCell(column, value)}</>;
}
