import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE } from "./_factory/options";
import { daysAgo, pick } from "./_factory/seeds";

export const templatePlugin = buildDomainPlugin({
  id: "template",
  label: "Templates",
  icon: "Copy",
  section: SECTIONS.workspace,
  order: 7,
  resources: [
    {
      id: "template",
      singular: "Template",
      plural: "Templates",
      icon: "Copy",
      path: "/templates",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "kind", kind: "enum", options: [
          { value: "email", label: "Email" },
          { value: "document", label: "Document" },
          { value: "page", label: "Page" },
        ] },
        { name: "status", kind: "enum", options: STATUS_ACTIVE },
        { name: "updatedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 10,
      seed: (i) => ({
        name: pick(["Welcome email", "Invoice document", "Landing page", "NDA template", "Offer letter"], i),
        kind: pick(["email", "document", "page"], i),
        status: pick(["active", "active", "inactive"], i),
        updatedAt: daysAgo(i),
      }),
    },
  ],
});
