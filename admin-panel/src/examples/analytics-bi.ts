import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { daysAgo, pick } from "./_factory/seeds";
import { analyticsDashboardView } from "./analytics-bi-pages";

export const analyticsBiPlugin = buildDomainPlugin({
  id: "analytics-bi",
  label: "Analytics & BI",
  icon: "BarChart3",
  section: SECTIONS.analytics,
  order: 1,
  resources: [
    {
      id: "report",
      singular: "Report",
      plural: "Reports",
      icon: "BarChart3",
      path: "/analytics/reports",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "dataset", kind: "text", sortable: true },
        { name: "owner", kind: "text", sortable: true },
        { name: "updatedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 12,
      seed: (i) => ({
        name: pick(["Weekly MRR", "Pipeline snapshot", "Ticket aging", "Inventory turns", "NPS by segment"], i),
        dataset: pick(["subscriptions", "sales", "support", "inventory", "community"], i),
        owner: pick(["sam@gutu.dev", "alex@gutu.dev"], i),
        updatedAt: daysAgo(i),
      }),
    },
    {
      id: "dashboard",
      singular: "BI Dashboard",
      plural: "BI Dashboards",
      icon: "PieChart",
      path: "/analytics/dashboards",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "owner", kind: "text", sortable: true },
        { name: "widgets", kind: "number", align: "right" },
        { name: "updatedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 6,
      seed: (i) => ({
        name: pick(["Exec overview", "Finance", "Ops", "Product", "Customer"], i),
        owner: pick(["sam@gutu.dev", "alex@gutu.dev"], i),
        widgets: 6 + (i % 8),
        updatedAt: daysAgo(i),
      }),
    },
  ],
  extraNav: [
    { id: "analytics.executive.nav", label: "Executive", icon: "LineChart", path: "/analytics/executive", view: "analytics-bi.dashboard.view" },
  ],
  extraViews: [analyticsDashboardView],
});
