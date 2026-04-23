import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { code, money, pick } from "./_factory/seeds";

export const pricingTaxPlugin = buildDomainPlugin({
  id: "pricing-tax",
  label: "Pricing & Tax",
  icon: "Percent",
  section: SECTIONS.commerce,
  order: 2,
  resources: [
    {
      id: "price",
      singular: "Price",
      plural: "Prices",
      icon: "Tag",
      path: "/pricing/prices",
      displayField: "sku",
      fields: [
        { name: "sku", kind: "text", required: true, sortable: true, width: 120 },
        { name: "name", kind: "text" },
        { name: "amount", kind: "currency", align: "right", required: true, sortable: true },
        { name: "currency", kind: "enum", options: [
          { value: "USD", label: "USD" },
          { value: "EUR", label: "EUR" },
        ] },
      ],
      seedCount: 18,
      seed: (i) => ({
        sku: code("PR", i, 5),
        name: pick(["Widget A", "Gizmo B", "Part C"], i),
        amount: money(i, 5, 500),
        currency: pick(["USD", "EUR"], i),
      }),
    },
    {
      id: "tax-rule",
      singular: "Tax Rule",
      plural: "Tax Rules",
      icon: "ScrollText",
      path: "/pricing/tax",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "region", kind: "text", sortable: true },
        { name: "rate", kind: "number", align: "right", sortable: true },
      ],
      seedCount: 9,
      seed: (i) => ({
        name: pick(["US sales tax", "EU VAT", "UK VAT", "CA GST", "IN GST"], i),
        region: pick(["US-CA", "EU-DE", "UK", "CA-ON", "IN-MH"], i),
        rate: 0.05 + (i * 0.02),
      }),
    },
  ],
});
