import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { code, daysAgo, pick } from "./_factory/seeds";

export const traceabilityPlugin = buildDomainPlugin({
  id: "traceability",
  label: "Traceability",
  icon: "Footprints",
  section: SECTIONS.supplyChain,
  order: 8,
  resources: [
    {
      id: "lot",
      singular: "Lot",
      plural: "Lots",
      icon: "Barcode",
      path: "/traceability/lots",
      displayField: "code",
      fields: [
        { name: "code", kind: "text", required: true, sortable: true, width: 140 },
        { name: "product", kind: "text", sortable: true },
        { name: "origin", kind: "text", sortable: true },
        { name: "producedAt", kind: "date", sortable: true },
      ],
      seedCount: 14,
      seed: (i) => ({
        code: code("LOT", i, 8),
        product: pick(["Widget A", "Gizmo B", "Part C"], i),
        origin: pick(["SFO Plant", "Tokyo Plant", "Berlin Plant"], i),
        producedAt: daysAgo(i * 3),
      }),
    },
  ],
});
