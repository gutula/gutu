import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { CITIES, code, daysAgo, pick } from "./_factory/seeds";

export const assetsPlugin = buildDomainPlugin({
  id: "assets",
  label: "Assets",
  icon: "Package",
  section: SECTIONS.supplyChain,
  order: 5,
  resources: [
    {
      id: "asset",
      singular: "Asset",
      plural: "Assets",
      icon: "Package",
      path: "/assets",
      fields: [
        { name: "tag", kind: "text", required: true, sortable: true, width: 120 },
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "category", kind: "enum", options: [
          { value: "laptop", label: "Laptop" },
          { value: "vehicle", label: "Vehicle" },
          { value: "equipment", label: "Equipment" },
          { value: "machinery", label: "Machinery" },
        ] },
        { name: "location", kind: "text" },
        { name: "status", kind: "enum", options: [
          { value: "deployed", label: "Deployed", intent: "success" },
          { value: "in_storage", label: "In storage", intent: "neutral" },
          { value: "maintenance", label: "Maintenance", intent: "warning" },
          { value: "retired", label: "Retired", intent: "danger" },
        ], sortable: true },
        { name: "purchasedAt", kind: "date", sortable: true },
        { name: "cost", kind: "currency", align: "right", sortable: true },
      ],
      seedCount: 24,
      seed: (i) => ({
        tag: code("AST", i, 5),
        name: pick(["MacBook Pro", "Dell XPS", "Ford Transit", "Forklift", "Scanner"], i),
        category: pick(["laptop", "vehicle", "equipment", "machinery"], i),
        location: pick(CITIES, i),
        status: pick(["deployed", "deployed", "in_storage", "maintenance"], i),
        purchasedAt: daysAgo(i * 30),
        cost: 500 + ((i * 1097) % 40000),
      }),
    },
  ],
});
