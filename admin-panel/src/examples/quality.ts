import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_TICKET, SEVERITY } from "./_factory/options";
import { code, daysAgo, pick } from "./_factory/seeds";

export const qualityPlugin = buildDomainPlugin({
  id: "quality",
  label: "Quality",
  icon: "ShieldCheck",
  section: SECTIONS.supplyChain,
  order: 7,
  resources: [
    {
      id: "inspection",
      singular: "Inspection",
      plural: "Inspections",
      icon: "Microscope",
      path: "/quality/inspections",
      displayField: "code",
      fields: [
        { name: "code", kind: "text", required: true, sortable: true, width: 110 },
        { name: "product", kind: "text", sortable: true },
        { name: "inspector", kind: "text" },
        { name: "severity", kind: "enum", options: SEVERITY, sortable: true },
        { name: "status", kind: "enum", options: STATUS_TICKET, sortable: true },
        { name: "inspectedAt", kind: "date", sortable: true },
      ],
      seedCount: 14,
      seed: (i) => ({
        code: code("QA", i),
        product: pick(["Widget A", "Gizmo B", "Part C"], i),
        inspector: pick(["Taylor", "Sam"], i),
        severity: pick(["info", "warn", "error"], i),
        status: pick(["open", "resolved"], i),
        inspectedAt: daysAgo(i),
      }),
    },
  ],
});
