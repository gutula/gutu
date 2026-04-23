import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE } from "./_factory/options";
import { daysAgo, pick } from "./_factory/seeds";

export const aiRagPlugin = buildDomainPlugin({
  id: "ai-rag",
  label: "AI RAG",
  icon: "Database",
  section: SECTIONS.ai,
  order: 3,
  resources: [
    {
      id: "collection",
      singular: "Collection",
      plural: "Collections",
      icon: "FolderArchive",
      path: "/ai/rag/collections",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "embedder", kind: "text", sortable: true },
        { name: "chunks", kind: "number", align: "right", sortable: true },
        { name: "status", kind: "enum", options: STATUS_ACTIVE },
        { name: "updatedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 9,
      seed: (i) => ({
        name: pick(["docs-v2", "support-kb", "sales-playbook", "onboarding", "policies"], i),
        embedder: pick(["text-embedding-3-large", "voyage-2", "cohere-v3"], i),
        chunks: 500 + ((i * 97) % 5000),
        status: pick(["active", "active", "inactive"], i),
        updatedAt: daysAgo(i),
      }),
    },
  ],
});
