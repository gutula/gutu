import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE, SEVERITY } from "./_factory/options";
import { daysAgo, hoursAgo, pick } from "./_factory/seeds";
import { automationRunDetailView } from "./automation-pages";

export const automationPlugin = buildDomainPlugin({
  id: "automation",
  label: "Automation",
  icon: "Zap",
  section: SECTIONS.automation,
  order: 1,
  resources: [
    {
      id: "trigger",
      singular: "Trigger",
      plural: "Triggers",
      icon: "Play",
      path: "/automation/triggers",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "event", kind: "text", sortable: true },
        { name: "status", kind: "enum", options: STATUS_ACTIVE, sortable: true },
        { name: "lastFired", kind: "datetime", sortable: true },
      ],
      seedCount: 12,
      seed: (i) => ({
        name: pick(["Notify on new contact", "Send invoice reminder", "Escalate stale issue", "Sync inventory"], i),
        event: pick(["contact.created", "invoice.overdue", "issue.stale", "inventory.low"], i),
        status: pick(["active", "active", "inactive"], i),
        lastFired: hoursAgo(i),
      }),
    },
    {
      id: "run",
      singular: "Run",
      plural: "Runs",
      icon: "History",
      path: "/automation/runs",
      readOnly: true,
      displayField: "id",
      fields: [
        { name: "trigger", kind: "text", sortable: true },
        { name: "severity", kind: "enum", options: SEVERITY },
        { name: "startedAt", kind: "datetime", sortable: true },
        { name: "durationMs", label: "Duration (ms)", kind: "number", align: "right" },
      ],
      seedCount: 30,
      seed: (i) => ({
        trigger: pick(["Notify on new contact", "Send invoice reminder", "Sync inventory"], i),
        severity: pick(["info", "info", "warn", "error"], i),
        startedAt: daysAgo(i * 0.3),
        durationMs: 80 + ((i * 193) % 2400),
      }),
    },
  ],
  extraNav: [
    { id: "automation.run-detail.nav", label: "Sample run", icon: "PlayCircle", path: "/automation/run-detail", view: "automation.run-detail.view" },
  ],
  extraViews: [automationRunDetailView],
});
