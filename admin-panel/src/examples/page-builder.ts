import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_LIFECYCLE } from "./_factory/options";
import { daysAgo, pick } from "./_factory/seeds";

export const pageBuilderPlugin = buildDomainPlugin({
  id: "page-builder",
  label: "Page Builder",
  icon: "LayoutTemplate",
  section: SECTIONS.portals,
  order: 3,
  resources: [
    {
      id: "page",
      singular: "Page",
      plural: "Pages",
      icon: "LayoutTemplate",
      path: "/pages",
      displayField: "title",
      fields: [
        { name: "title", kind: "text", required: true, sortable: true },
        { name: "slug", kind: "text" },
        { name: "status", kind: "enum", options: STATUS_LIFECYCLE, sortable: true },
        { name: "updatedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 12,
      seed: (i) => ({
        title: pick(["Home", "Pricing", "About", "Careers", "Changelog"], i),
        slug: pick(["", "pricing", "about", "careers", "changelog"], i),
        status: pick(["draft", "published", "published"], i),
        updatedAt: daysAgo(i),
      }),
    },
  ],
});
