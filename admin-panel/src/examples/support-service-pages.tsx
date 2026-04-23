import { defineCustomView } from "@/builders";
import { PageHeader } from "@/admin-primitives/PageHeader";
import { Kanban } from "@/admin-primitives/Kanban";
import { Card, CardContent, CardHeader, CardTitle } from "@/admin-primitives/Card";
import { MetricGrid } from "@/admin-primitives/MetricGrid";
import { Badge } from "@/primitives/Badge";
import { BarChart } from "@/admin-primitives/charts/BarChart";
import { Donut } from "@/admin-primitives/charts/Donut";
import { code, personName, pick } from "./_factory/seeds";

const TICKET_COLS = [
  { id: "open", title: "Open", intent: "info" as const },
  { id: "in_progress", title: "In progress", intent: "warning" as const },
  { id: "resolved", title: "Resolved", intent: "success" as const },
  { id: "closed", title: "Closed", intent: "neutral" as const },
];
const PRIORITY_INTENT: Record<string, "neutral" | "info" | "warning" | "danger"> = {
  low: "neutral",
  normal: "info",
  high: "warning",
  urgent: "danger",
};

export const supportKanbanView = defineCustomView({
  id: "support-service.kanban.view",
  title: "Ticket Board",
  description: "Tickets grouped by status.",
  resource: "support-service.ticket",
  render: () => {
    const columns = TICKET_COLS.map((c, ci) => ({
      ...c,
      items: Array.from({ length: 3 + (ci + 2) }, (_, i) => {
        const idx = ci * 10 + i;
        return {
          id: `sup-${c.id}-${i}`,
          code: code("SUP", idx),
          subject: pick(
            ["Cannot log in", "Slow report", "Missing invoice", "Crash on export", "Feature request"],
            idx,
          ),
          priority: pick(["low", "normal", "high", "urgent"], idx),
          requester: personName(idx),
        };
      }),
    }));
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Ticket board" description="Tickets grouped by status." />
        <Kanban
          columns={columns}
          rowKey={(i) => i.id}
          renderItem={(i) => (
            <div>
              <div className="flex items-center justify-between">
                <code className="text-xs font-mono text-text-muted">{i.code}</code>
                <Badge intent={PRIORITY_INTENT[i.priority]}>{i.priority}</Badge>
              </div>
              <div className="text-sm text-text-primary mt-1">{i.subject}</div>
              <div className="text-xs text-text-muted mt-1">{i.requester}</div>
            </div>
          )}
        />
      </div>
    );
  },
});

export const supportAnalyticsView = defineCustomView({
  id: "support-service.analytics.view",
  title: "Analytics",
  description: "Ticket volume and resolution health.",
  resource: "support-service.ticket",
  render: () => (
    <div className="flex flex-col gap-4">
      <PageHeader title="Support analytics" description="Trends and SLA health." />
      <MetricGrid
        columns={4}
        metrics={[
          { label: "CSAT", value: "4.6 / 5" },
          { label: "First response", value: "18 m", trend: { value: 2, positive: true } },
          { label: "Time to resolution", value: "6.2 h" },
          { label: "SLA miss", value: "3.8%", trend: { value: 1, positive: true } },
        ]}
      />
      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Volume by day</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart
              data={"Mon Tue Wed Thu Fri Sat Sun"
                .split(" ")
                .map((l, i) => ({ label: l, value: 20 + (i * 13) % 38 }))}
              height={180}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>By category</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Donut
              data={[
                { label: "Account", value: 42 },
                { label: "Billing", value: 28 },
                { label: "Integrations", value: 19 },
                { label: "Product", value: 24 },
                { label: "Other", value: 9 },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  ),
});
