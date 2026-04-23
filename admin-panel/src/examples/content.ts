import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_LIFECYCLE } from "./_factory/options";
import { daysAgo, pick } from "./_factory/seeds";

export const contentPlugin = buildDomainPlugin({
  id: "content",
  label: "Content",
  icon: "FileText",
  section: SECTIONS.workspace,
  order: 1,
  resources: [
    {
      id: "article",
      singular: "Article",
      plural: "Articles",
      icon: "FileText",
      path: "/content/articles",
      displayField: "title",
      fields: [
        { name: "title", kind: "text", required: true, sortable: true },
        { name: "slug", kind: "text" },
        { name: "status", kind: "enum", options: STATUS_LIFECYCLE, sortable: true },
        { name: "author", kind: "text", sortable: true },
        { name: "updatedAt", kind: "datetime", sortable: true },
        { name: "body", kind: "textarea", formSection: "Content", required: true },
      ],
      seedCount: 18,
      seed: (i) => ({
        title: pick(["Getting started", "API reference", "Pricing update", "Changelog v1.2", "Security policy"], i),
        slug: pick(["getting-started", "api", "pricing", "changelog-1-2", "security"], i),
        status: pick(["draft", "approved", "published", "published"], i),
        author: pick(["sam@gutu.dev", "alex@gutu.dev", "taylor@gutu.dev"], i),
        updatedAt: daysAgo(i),
        body: "Lorem ipsum…",
      }),
    },
  ],
});
