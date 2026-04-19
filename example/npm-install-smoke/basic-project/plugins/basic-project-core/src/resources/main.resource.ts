import { defineResource } from "@platform/schema";
import { z } from "zod";

export const BasicProjectCoreRecordResource = defineResource({
  id: "basic-project-core.records",
  description: "Primary tenant-scoped record used by the Basic Project Core product module.",
  businessPurpose: "Gives the team one canonical business record to extend without inventing structure from scratch.",
  invariants: [
    "Every record belongs to exactly one tenant.",
    "Archived records remain visible in audit history."
  ],
  actors: ["operator", "manager", "automation"],
  table: { name: "basic_project_core_records" },
  contract: z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    label: z.string().min(2),
    status: z.enum(["draft", "active", "archived"]),
    createdAt: z.string()
  }),
  fields: {
    label: {
      label: "Label",
      searchable: true,
      sortable: true,
      description: "Short operator-facing title for the record.",
      businessMeaning: "The primary display value used in list views, reports, and approvals.",
      sourceOfTruth: true
    },
    status: {
      label: "Status",
      filter: "select",
      description: "Operational lifecycle stage for the record.",
      requiredForFlows: ["activation", "archival"]
    },
    createdAt: {
      label: "Created",
      sortable: true,
      description: "When the record was first created."
    }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["label", "status", "createdAt"]
  },
  portal: {
    enabled: false
  }
});
