import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE } from "./_factory/options";
import { daysAgo, pick } from "./_factory/seeds";

export const portalPlugin = buildDomainPlugin({
  id: "portal",
  label: "Customer Portal",
  icon: "UserCheck",
  section: SECTIONS.portals,
  order: 2,
  resources: [
    {
      id: "session",
      singular: "Portal Session",
      plural: "Portal Sessions",
      icon: "Key",
      path: "/portals/customer",
      readOnly: true,
      displayField: "user",
      fields: [
        { name: "user", kind: "text", sortable: true },
        { name: "status", kind: "enum", options: STATUS_ACTIVE },
        { name: "startedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 14,
      seed: (i) => ({
        user: `customer+${i}@example.com`,
        status: pick(["active", "inactive"], i),
        startedAt: daysAgo(i),
      }),
    },
  ],
});
