import { z } from "zod";
import { definePlugin, defineResource } from "@/builders";
import {
  crmActivityView,
  crmContactDetailView,
  crmContactsView,
  crmOverviewView,
  crmPipelineView,
  crmSegmentsView,
} from "./crm-pages";
import { CONTACTS } from "./data";

const ContactSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  title: z.string(),
  company: z.string(),
  stage: z.enum(["lead", "prospect", "customer", "churned"]),
  owner: z.string(),
  vip: z.boolean(),
  lifetimeValue: z.number(),
  createdAt: z.string(),
  lastActivityAt: z.string(),
  tags: z.array(z.string()),
});

const contactResource = defineResource({
  id: "crm.contact",
  singular: "Contact",
  plural: "Contacts",
  schema: ContactSchema,
  displayField: "name",
  searchable: ["name", "email", "company"],
  icon: "Users",
});
(contactResource as unknown as {
  __seed: Record<string, unknown>[];
}).__seed = CONTACTS.map(({ activityTrend: _t, ...rest }) => rest);

export const crmPlugin = definePlugin({
  id: "crm",
  label: "CRM",
  icon: "Users",
  description: "Contacts, activity, and pipeline.",
  version: "0.2.0",
  admin: {
    navSections: [{ id: "sales", label: "Sales & CRM", order: 10 }],
    nav: [
      { id: "crm.overview", label: "Overview", icon: "LayoutDashboard", path: "/contacts/overview", view: "crm.overview.view", section: "sales", order: 10 },
      { id: "crm.contacts", label: "Contacts", icon: "Users", path: "/contacts", view: "crm.contacts.view", section: "sales", order: 11 },
      { id: "crm.pipeline", label: "Pipeline", icon: "Layers", path: "/contacts/pipeline", view: "crm.pipeline.view", section: "sales", order: 12 },
      { id: "crm.activity", label: "Activity", icon: "Activity", path: "/contacts/activity", view: "crm.activity.view", section: "sales", order: 13 },
      { id: "crm.segments", label: "Segments", icon: "LayoutGrid", path: "/contacts/segments", view: "crm.segments.view", section: "sales", order: 14 },
    ],
    resources: [contactResource],
    views: [
      crmOverviewView,
      crmContactsView,
      crmPipelineView,
      crmActivityView,
      crmSegmentsView,
      crmContactDetailView,
    ],
    commands: [
      { id: "crm.go.overview", label: "CRM: Overview", icon: "LayoutDashboard", run: () => { window.location.hash = "/contacts/overview"; } },
      { id: "crm.new", label: "New contact", icon: "UserPlus", shortcut: "N", run: () => { window.location.hash = "/contacts/new"; } },
    ],
  },
});
