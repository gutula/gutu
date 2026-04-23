import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { pick } from "./_factory/seeds";

export const rolePolicyPlugin = buildDomainPlugin({
  id: "role-policy",
  label: "Roles & Policies",
  icon: "Shield",
  section: SECTIONS.people,
  order: 3,
  resources: [
    {
      id: "role",
      singular: "Role",
      plural: "Roles",
      icon: "Shield",
      path: "/roles",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "description", kind: "text" },
        { name: "members", kind: "number", align: "right", sortable: true },
      ],
      seedCount: 6,
      seed: (i) => ({
        name: pick(["Admin", "Manager", "Engineer", "Sales Rep", "Support", "Finance"], i),
        description: pick([
          "Full access",
          "Team-level controls",
          "Read+write code resources",
          "CRM and orders",
          "Tickets and KB",
          "Invoices + payments",
        ], i),
        members: 1 + ((i * 11) % 40),
      }),
    },
    {
      id: "policy",
      singular: "Policy",
      plural: "Policies",
      icon: "FileLock",
      path: "/policies",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "resource", kind: "text", sortable: true },
        { name: "effect", kind: "enum", options: [
          { value: "allow", label: "Allow", intent: "success" },
          { value: "deny", label: "Deny", intent: "danger" },
        ] },
      ],
      seedCount: 10,
      seed: (i) => ({
        name: pick(["Read invoices", "Export contacts", "Delete records", "Manage users", "Audit access"], i),
        resource: pick(["accounting.invoice", "crm.contact", "*", "auth.user", "audit.event"], i),
        effect: pick(["allow", "allow", "deny"], i),
      }),
    },
  ],
});
