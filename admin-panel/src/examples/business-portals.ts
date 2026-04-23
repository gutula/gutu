import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE } from "./_factory/options";
import { COMPANIES, daysAgo, pick } from "./_factory/seeds";

export const businessPortalsPlugin = buildDomainPlugin({
  id: "business-portals",
  label: "Business Portals",
  icon: "Globe",
  section: SECTIONS.portals,
  order: 1,
  resources: [
    {
      id: "portal",
      singular: "Portal",
      plural: "Portals",
      icon: "Globe",
      path: "/portals/business",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "tenant", kind: "text", sortable: true },
        { name: "domain", kind: "url" },
        { name: "status", kind: "enum", options: STATUS_ACTIVE },
        { name: "updatedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 8,
      seed: (i) => ({
        name: pick(["Customer Portal", "Partner Hub", "Vendor Desk", "Supplier Board"], i),
        tenant: pick(COMPANIES, i),
        domain: `https://portal.${pick(COMPANIES, i).toLowerCase().replace(/\s+/g, "")}.com`,
        status: pick(["active", "active", "inactive"], i),
        updatedAt: daysAgo(i),
      }),
    },
  ],
});
