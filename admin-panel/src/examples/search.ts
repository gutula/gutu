import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE } from "./_factory/options";
import { daysAgo, pick } from "./_factory/seeds";

export const searchPlugin = buildDomainPlugin({
  id: "search",
  label: "Search",
  icon: "Search",
  section: SECTIONS.platform,
  order: 7,
  resources: [
    {
      id: "index",
      singular: "Index",
      plural: "Indexes",
      icon: "Search",
      path: "/platform/search-indexes",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "resource", kind: "text", sortable: true },
        { name: "documents", kind: "number", align: "right", sortable: true },
        { name: "status", kind: "enum", options: STATUS_ACTIVE },
        { name: "updatedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 9,
      seed: (i) => ({
        name: pick(["contacts", "products", "invoices", "tickets", "pages"], i),
        resource: pick(["crm.contact", "product-catalog.product", "accounting.invoice", "issues.issue", "page-builder.page"], i),
        documents: 1000 + ((i * 7919) % 50000),
        status: pick(["active", "active", "inactive"], i),
        updatedAt: daysAgo(i),
      }),
    },
  ],
});
