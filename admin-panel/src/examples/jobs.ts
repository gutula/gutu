import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { SEVERITY } from "./_factory/options";
import { daysAgo, pick } from "./_factory/seeds";

export const jobsPlugin = buildDomainPlugin({
  id: "jobs",
  label: "Jobs",
  icon: "Timer",
  section: SECTIONS.automation,
  order: 3,
  resources: [
    {
      id: "job",
      singular: "Job",
      plural: "Jobs",
      icon: "Timer",
      path: "/automation/jobs",
      displayField: "name",
      readOnly: true,
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "queue", kind: "text", sortable: true },
        { name: "severity", kind: "enum", options: SEVERITY },
        { name: "attempts", kind: "number", align: "right" },
        { name: "runAt", kind: "datetime", sortable: true },
      ],
      seedCount: 24,
      seed: (i) => ({
        name: pick(["nightly-invoice", "sync-inventory", "send-digests", "reindex-search", "expire-tokens"], i),
        queue: pick(["default", "critical", "low"], i),
        severity: pick(["info", "info", "warn", "error"], i),
        attempts: 1 + (i % 4),
        runAt: daysAgo(i * 0.2),
      }),
    },
  ],
});
