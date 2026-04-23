import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE } from "./_factory/options";
import { daysAgo, pick } from "./_factory/seeds";

export const orgTenantPlugin = buildDomainPlugin({
  id: "org-tenant",
  label: "Tenants",
  icon: "Building2",
  section: SECTIONS.platform,
  order: 3,
  resources: [
    {
      id: "tenant",
      singular: "Tenant",
      plural: "Tenants",
      icon: "Building2",
      path: "/platform/tenants",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "plan", kind: "enum", options: [
          { value: "free", label: "Free" },
          { value: "pro", label: "Pro" },
          { value: "enterprise", label: "Enterprise" },
        ], sortable: true },
        { name: "status", kind: "enum", options: STATUS_ACTIVE },
        { name: "seats", kind: "number", align: "right", sortable: true },
        { name: "createdAt", kind: "date", sortable: true },
      ],
      seedCount: 10,
      seed: (i) => ({
        name: pick(["Gutu", "Acme", "Globex", "Initech", "Hooli"], i),
        plan: pick(["free", "pro", "enterprise"], i),
        status: pick(["active", "active", "inactive"], i),
        seats: 5 + ((i * 17) % 200),
        createdAt: daysAgo(i * 30),
      }),
    },
  ],
});
