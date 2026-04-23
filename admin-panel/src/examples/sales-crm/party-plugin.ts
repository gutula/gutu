import { z } from "zod";
import { definePlugin, defineResource } from "@/builders";
import {
  partyEntityDetailView,
  partyGraphView,
  partyListView,
} from "./party-pages";
import { ENTITIES, EDGES } from "./data";

const EntitySchema = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.enum(["company", "person", "vendor", "partner"]),
});
const entityResource = defineResource({
  id: "party-relationships.entity",
  singular: "Entity",
  plural: "Entities",
  schema: EntitySchema,
  displayField: "label",
  icon: "Network",
});
(entityResource as unknown as { __seed: Record<string, unknown>[] }).__seed =
  ENTITIES as unknown as Record<string, unknown>[];

const EdgeSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  kind: z.enum(["employs", "partner", "vendor", "customer", "subsidiary"]),
  strength: z.number(),
});
const edgeResource = defineResource({
  id: "party-relationships.relationship",
  singular: "Relationship",
  plural: "Relationships",
  schema: EdgeSchema,
  displayField: "id",
  icon: "Share2",
});
(edgeResource as unknown as { __seed: Record<string, unknown>[] }).__seed =
  EDGES as unknown as Record<string, unknown>[];

export const partyRelationshipsPlugin = definePlugin({
  id: "party-relationships",
  label: "Relationships",
  icon: "Network",
  description: "Companies, people, and connections.",
  version: "0.2.0",
  admin: {
    navSections: [{ id: "sales", label: "Sales & CRM", order: 10 }],
    nav: [
      { id: "party.graph", label: "Graph", icon: "Network", path: "/party-relationships/graph", view: "party-relationships.graph.view", section: "sales", order: 50 },
      { id: "party.list", label: "Relationships", icon: "Share2", path: "/party-relationships", view: "party-relationships.list.view", section: "sales", order: 51 },
    ],
    resources: [entityResource, edgeResource],
    views: [partyGraphView, partyListView, partyEntityDetailView],
    commands: [
      { id: "party.go.graph", label: "Relationships: Graph", icon: "Network", run: () => { window.location.hash = "/party-relationships/graph"; } },
    ],
  },
});
