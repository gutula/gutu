import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_TICKET, PRIORITY } from "./_factory/options";
import { code, daysAgo, personName, pick } from "./_factory/seeds";
import { supportKanbanView, supportAnalyticsView } from "./support-service-pages";

export const supportServicePlugin = buildDomainPlugin({
  id: "support-service",
  label: "Support",
  icon: "LifeBuoy",
  section: SECTIONS.operations,
  order: 2,
  resources: [
    {
      id: "ticket",
      singular: "Ticket",
      plural: "Tickets",
      icon: "LifeBuoy",
      path: "/support/tickets",
      displayField: "code",
      fields: [
        { name: "code", kind: "text", required: true, sortable: true, width: 110 },
        { name: "subject", kind: "text", required: true, sortable: true },
        { name: "requester", kind: "text", sortable: true },
        { name: "assignee", kind: "text", sortable: true },
        { name: "priority", kind: "enum", options: PRIORITY, sortable: true },
        { name: "status", kind: "enum", options: STATUS_TICKET, sortable: true },
        { name: "updatedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 26,
      seed: (i) => ({
        code: code("SUP", i),
        subject: pick(["Cannot log in", "Missing invoice", "Feature request", "Slow report", "Billing question"], i),
        requester: personName(i),
        assignee: pick(["Sam", "Alex", "Taylor"], i),
        priority: pick(["low", "normal", "high", "urgent"], i),
        status: pick(["open", "in_progress", "resolved", "closed"], i),
        updatedAt: daysAgo(i * 0.5),
      }),
    },
  ],
  extraNav: [
    { id: "support.board.nav", label: "Board", icon: "LayoutGrid", path: "/support/board", view: "support-service.kanban.view" },
    { id: "support.analytics.nav", label: "Analytics", icon: "BarChart3", path: "/support/analytics", view: "support-service.analytics.view" },
  ],
  extraViews: [supportKanbanView, supportAnalyticsView],
});
