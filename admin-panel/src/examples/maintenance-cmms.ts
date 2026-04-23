import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_TICKET, PRIORITY } from "./_factory/options";
import { code, daysAgo, pick } from "./_factory/seeds";

export const maintenanceCmmsPlugin = buildDomainPlugin({
  id: "maintenance-cmms",
  label: "Maintenance (CMMS)",
  icon: "Hammer",
  section: SECTIONS.supplyChain,
  order: 6,
  resources: [
    {
      id: "work-order",
      singular: "Work Order",
      plural: "Work Orders",
      icon: "ClipboardCheck",
      path: "/cmms/work-orders",
      displayField: "code",
      fields: [
        { name: "code", kind: "text", required: true, sortable: true, width: 120 },
        { name: "asset", kind: "text", sortable: true },
        { name: "task", kind: "text" },
        { name: "priority", kind: "enum", options: PRIORITY, sortable: true },
        { name: "status", kind: "enum", options: STATUS_TICKET, sortable: true },
        { name: "dueAt", kind: "date", sortable: true },
      ],
      seedCount: 14,
      seed: (i) => ({
        code: code("WO", i),
        asset: pick(["Forklift #2", "HVAC-North", "Press A", "Conveyor 1"], i),
        task: pick(["Inspect", "Replace filter", "Lubricate", "Calibrate"], i),
        priority: pick(["low", "normal", "high"], i),
        status: pick(["open", "in_progress", "resolved"], i),
        dueAt: daysAgo(-i * 2),
      }),
    },
  ],
});
