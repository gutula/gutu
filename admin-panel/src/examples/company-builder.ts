import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_LIFECYCLE } from "./_factory/options";
import { COMPANIES, daysAgo, pick } from "./_factory/seeds";

export const companyBuilderPlugin = buildDomainPlugin({
  id: "company-builder",
  label: "Company Builder",
  icon: "Building2",
  section: SECTIONS.portals,
  order: 4,
  resources: [
    {
      id: "company",
      singular: "Company",
      plural: "Companies",
      icon: "Building",
      path: "/company-builder/companies",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "domain", kind: "url" },
        { name: "industry", kind: "enum", options: [
          { value: "saas", label: "SaaS" },
          { value: "retail", label: "Retail" },
          { value: "manufacturing", label: "Manufacturing" },
          { value: "services", label: "Services" },
        ] },
        { name: "status", kind: "enum", options: STATUS_LIFECYCLE },
        { name: "createdAt", kind: "date", sortable: true },
      ],
      seedCount: 12,
      seed: (i) => ({
        name: pick(COMPANIES, i),
        domain: `https://${pick(COMPANIES, i).toLowerCase().replace(/\s+/g, "")}.com`,
        industry: pick(["saas", "retail", "manufacturing", "services"], i),
        status: pick(["draft", "approved", "published"], i),
        createdAt: daysAgo(i * 4),
      }),
    },
  ],
});
