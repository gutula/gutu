import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE } from "./_factory/options";
import { daysAgo, pick } from "./_factory/seeds";

export const workflowPlugin = buildDomainPlugin({
  id: "workflow",
  label: "Workflows",
  icon: "GitBranch",
  section: SECTIONS.automation,
  order: 2,
  resources: [
    {
      id: "workflow",
      singular: "Workflow",
      plural: "Workflows",
      icon: "GitBranch",
      path: "/automation/workflows",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "steps", kind: "number", align: "right" },
        { name: "status", kind: "enum", options: STATUS_ACTIVE, sortable: true },
        { name: "lastRun", kind: "datetime", sortable: true },
      ],
      seedCount: 10,
      seed: (i) => ({
        name: pick(["Onboard customer", "Close month-end", "Ship order", "Process refund", "Approve expense"], i),
        steps: 3 + (i % 6),
        status: pick(["active", "active", "inactive"], i),
        lastRun: daysAgo(i),
      }),
    },
  ],
});
