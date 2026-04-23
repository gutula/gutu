import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { daysAgo, pick } from "./_factory/seeds";

export const documentPlugin = buildDomainPlugin({
  id: "document",
  label: "Documents",
  icon: "FileText",
  section: SECTIONS.workspace,
  order: 2,
  resources: [
    {
      id: "doc",
      singular: "Document",
      plural: "Documents",
      icon: "FileText",
      path: "/documents",
      displayField: "title",
      fields: [
        { name: "title", kind: "text", required: true, sortable: true },
        { name: "type", kind: "enum", options: [
          { value: "md", label: "Markdown" },
          { value: "rich", label: "Rich text" },
          { value: "docx", label: "Word" },
          { value: "pdf", label: "PDF" },
        ] },
        { name: "owner", kind: "text", sortable: true },
        { name: "updatedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 16,
      seed: (i) => ({
        title: pick(["Onboarding handbook", "2026 plan", "Q1 review", "Policy v3", "Release notes"], i),
        type: pick(["md", "rich", "docx", "pdf"], i),
        owner: pick(["sam@gutu.dev", "alex@gutu.dev"], i),
        updatedAt: daysAgo(i),
      }),
    },
  ],
});
