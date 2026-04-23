import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE } from "./_factory/options";
import { daysAgo, pick } from "./_factory/seeds";

export const formsPlugin = buildDomainPlugin({
  id: "forms",
  label: "Forms",
  icon: "ClipboardList",
  section: SECTIONS.workspace,
  order: 5,
  resources: [
    {
      id: "form",
      singular: "Form",
      plural: "Forms",
      icon: "ClipboardList",
      path: "/forms",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "slug", kind: "text" },
        { name: "submissions", kind: "number", align: "right", sortable: true },
        { name: "status", kind: "enum", options: STATUS_ACTIVE },
        { name: "updatedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 10,
      seed: (i) => ({
        name: pick(["Contact us", "Support request", "NPS survey", "Demo request", "Waitlist"], i),
        slug: pick(["contact", "support", "nps", "demo", "waitlist"], i),
        submissions: (i * 37) % 500,
        status: pick(["active", "active", "inactive"], i),
        updatedAt: daysAgo(i),
      }),
    },
  ],
});
