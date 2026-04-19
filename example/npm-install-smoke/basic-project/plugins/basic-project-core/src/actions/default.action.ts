import { defineAction } from "@platform/schema";
import { z } from "zod";

export const publishBasicProjectCoreRecordAction = defineAction({
  id: "basic-project-core.records.publish",
  description: "Moves a record into the active state with audit visibility.",
  businessPurpose: "Provides a safe, explicit command for promoting a draft record into active operations.",
  permission: "basic-project-core.records.publish",
  idempotent: true,
  audit: true,
  input: z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    reason: z.string().min(3).optional()
  }),
  output: z.object({
    ok: z.literal(true),
    nextStatus: z.literal("active")
  }),
  preconditions: [
    "The caller must have publish permission for the current tenant.",
    "The record must already exist."
  ],
  mandatorySteps: [
    "Capture why the record is being activated.",
    "Emit an audit event for the status transition."
  ],
  sideEffects: [
    "The record appears in active default views."
  ],
  postconditions: [
    "Operators can discover the record through the admin workbench."
  ],
  failureModes: [
    "Permission denied.",
    "Unknown record."
  ],
  forbiddenShortcuts: [
    "Do not update the status directly without going through the action."
  ],
  handler: async () => ({
    ok: true as const,
    nextStatus: "active" as const
  })
});
