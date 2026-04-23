import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_LIFECYCLE } from "./_factory/options";
import { COMPANIES, code, daysAgo, money, pick } from "./_factory/seeds";

export const eInvoicingPlugin = buildDomainPlugin({
  id: "e-invoicing",
  label: "E-Invoicing",
  icon: "ScrollText",
  section: SECTIONS.finance,
  order: 3,
  resources: [
    {
      id: "document",
      singular: "E-Invoice",
      plural: "E-Invoices",
      icon: "ScrollText",
      path: "/finance/e-invoices",
      displayField: "irn",
      fields: [
        { name: "irn", label: "IRN", kind: "text", required: true, sortable: true, width: 200 },
        { name: "country", kind: "enum", options: [
          { value: "IN", label: "India" },
          { value: "MX", label: "Mexico" },
          { value: "IT", label: "Italy" },
          { value: "AE", label: "UAE" },
        ] },
        { name: "counterparty", kind: "text", sortable: true },
        { name: "amount", kind: "currency", align: "right", sortable: true },
        { name: "status", kind: "enum", options: STATUS_LIFECYCLE, sortable: true },
        { name: "issuedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 14,
      seed: (i) => ({
        irn: code("IRN", i, 8),
        country: pick(["IN", "MX", "IT", "AE"], i),
        counterparty: pick(COMPANIES, i),
        amount: money(i, 200, 15000),
        status: pick(["pending", "approved", "published"], i),
        issuedAt: daysAgo(i),
      }),
    },
  ],
});
