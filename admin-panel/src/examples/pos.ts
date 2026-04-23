import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { code, daysAgo, money, pick } from "./_factory/seeds";
import { posShiftSummaryView } from "./pos-pages";

export const posPlugin = buildDomainPlugin({
  id: "pos",
  label: "Point of Sale",
  icon: "Store",
  section: SECTIONS.commerce,
  order: 3,
  resources: [
    {
      id: "terminal",
      singular: "Terminal",
      plural: "Terminals",
      icon: "Monitor",
      path: "/pos/terminals",
      fields: [
        { name: "code", kind: "text", required: true, sortable: true, width: 110 },
        { name: "location", kind: "text", sortable: true },
        { name: "status", kind: "enum", options: [
          { value: "online", label: "Online", intent: "success" },
          { value: "offline", label: "Offline", intent: "danger" },
        ] },
        { name: "lastCheckin", kind: "datetime", sortable: true },
      ],
      seedCount: 8,
      seed: (i) => ({
        code: code("POS", i, 4),
        location: pick(["Downtown", "Airport", "Mall", "Outlet"], i),
        status: pick(["online", "online", "offline"], i),
        lastCheckin: daysAgo(i * 0.2),
      }),
    },
    {
      id: "sale",
      singular: "Sale",
      plural: "Sales",
      icon: "ShoppingBag",
      path: "/pos/sales",
      readOnly: true,
      displayField: "ref",
      fields: [
        { name: "ref", label: "Ref", kind: "text", sortable: true, width: 130 },
        { name: "terminal", kind: "text", sortable: true },
        { name: "items", kind: "number", align: "right" },
        { name: "total", kind: "currency", align: "right", sortable: true },
        { name: "occurredAt", kind: "datetime", sortable: true },
      ],
      seedCount: 26,
      seed: (i) => ({
        ref: code("SALE", i, 6),
        terminal: code("POS", i % 4, 4),
        items: 1 + (i % 8),
        total: money(i, 5, 500),
        occurredAt: daysAgo(i * 0.5),
      }),
    },
  ],
  extraNav: [
    { id: "pos.shift.nav", label: "Shift summary", icon: "Receipt", path: "/pos/shift", view: "pos.shift-summary.view" },
  ],
  extraViews: [posShiftSummaryView],
});
