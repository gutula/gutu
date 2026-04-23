import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE } from "./_factory/options";
import { daysAgo, pick } from "./_factory/seeds";
import { integrationsStatusView } from "./integration-pages";

export const integrationPlugin = buildDomainPlugin({
  id: "integration",
  label: "Integrations",
  icon: "Plug",
  section: SECTIONS.automation,
  order: 5,
  resources: [
    {
      id: "connection",
      singular: "Connection",
      plural: "Connections",
      icon: "Plug",
      path: "/automation/integrations",
      fields: [
        { name: "provider", kind: "enum", required: true, options: [
          { value: "slack", label: "Slack" },
          { value: "stripe", label: "Stripe" },
          { value: "hubspot", label: "HubSpot" },
          { value: "github", label: "GitHub" },
          { value: "salesforce", label: "Salesforce" },
        ], sortable: true },
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "status", kind: "enum", options: STATUS_ACTIVE, sortable: true },
        { name: "lastSync", kind: "datetime", sortable: true },
      ],
      seedCount: 10,
      seed: (i) => ({
        provider: pick(["slack", "stripe", "hubspot", "github", "salesforce"], i),
        name: pick(["Primary", "Ops", "Revenue", "Engineering"], i),
        status: pick(["active", "active", "inactive"], i),
        lastSync: daysAgo(i * 0.3),
      }),
    },
  ],
  extraNav: [
    { id: "integration.status.nav", label: "Status", icon: "Activity", path: "/automation/integrations/status", view: "integration.status.view" },
  ],
  extraViews: [integrationsStatusView],
});
