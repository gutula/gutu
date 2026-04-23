import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_LIFECYCLE } from "./_factory/options";
import { COMPANIES, code, daysAgo, money, pick } from "./_factory/seeds";

export const procurementPlugin = buildDomainPlugin({
  id: "procurement",
  label: "Procurement",
  icon: "ShoppingCart",
  section: SECTIONS.supplyChain,
  order: 3,
  resources: [
    {
      id: "purchase-order",
      singular: "Purchase Order",
      plural: "Purchase Orders",
      icon: "ShoppingCart",
      path: "/procurement/pos",
      displayField: "number",
      fields: [
        { name: "number", kind: "text", required: true, sortable: true, width: 130 },
        { name: "vendor", kind: "text", required: true, sortable: true },
        { name: "status", kind: "enum", options: STATUS_LIFECYCLE, sortable: true },
        { name: "total", kind: "currency", align: "right", sortable: true },
        { name: "expectedAt", kind: "date", sortable: true },
      ],
      seedCount: 14,
      seed: (i) => ({
        number: code("PO", i),
        vendor: pick(COMPANIES, i + 2),
        status: pick(["draft", "pending", "approved", "published"], i),
        total: money(i, 500, 50000),
        expectedAt: daysAgo(-i * 3),
      }),
    },
  ],
});
