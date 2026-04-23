import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_LIFECYCLE } from "./_factory/options";
import { daysAgo, pick } from "./_factory/seeds";

export const knowledgePlugin = buildDomainPlugin({
  id: "knowledge",
  label: "Knowledge Base",
  icon: "BookOpenText",
  section: SECTIONS.workspace,
  order: 6,
  resources: [
    {
      id: "article",
      singular: "KB Article",
      plural: "KB Articles",
      icon: "BookOpenText",
      path: "/knowledge/articles",
      displayField: "title",
      fields: [
        { name: "title", kind: "text", required: true, sortable: true },
        { name: "category", kind: "enum", options: [
          { value: "getting-started", label: "Getting started" },
          { value: "troubleshooting", label: "Troubleshooting" },
          { value: "api", label: "API" },
          { value: "billing", label: "Billing" },
        ], sortable: true },
        { name: "status", kind: "enum", options: STATUS_LIFECYCLE },
        { name: "views", kind: "number", align: "right", sortable: true },
        { name: "updatedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 14,
      seed: (i) => ({
        title: pick(["Resetting your password", "Setting up SSO", "Importing CSV", "Understanding invoices", "API limits"], i),
        category: pick(["getting-started", "troubleshooting", "api", "billing"], i),
        status: pick(["draft", "published", "published"], i),
        views: (i * 131) % 5000,
        updatedAt: daysAgo(i),
      }),
    },
  ],
});
