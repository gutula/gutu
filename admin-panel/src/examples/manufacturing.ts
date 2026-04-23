import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_TICKET } from "./_factory/options";
import { code, daysAgo, pick } from "./_factory/seeds";

export const manufacturingPlugin = buildDomainPlugin({
  id: "manufacturing",
  label: "Manufacturing",
  icon: "Factory",
  section: SECTIONS.supplyChain,
  order: 2,
  resources: [
    {
      id: "order",
      singular: "Production Order",
      plural: "Production Orders",
      icon: "Factory",
      path: "/manufacturing/orders",
      displayField: "code",
      fields: [
        { name: "code", kind: "text", required: true, sortable: true, width: 120 },
        { name: "product", kind: "text", sortable: true },
        { name: "quantity", kind: "number", align: "right", sortable: true },
        { name: "status", kind: "enum", options: STATUS_TICKET, sortable: true },
        { name: "dueAt", kind: "date", sortable: true },
      ],
      seedCount: 14,
      seed: (i) => ({
        code: code("MO", i),
        product: pick(["Widget A", "Gizmo B", "Part C"], i),
        quantity: 100 + ((i * 43) % 900),
        status: pick(["open", "in_progress", "resolved"], i),
        dueAt: daysAgo(-i * 2),
      }),
    },
  ],
});
