import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { daysAgo, pick } from "./_factory/seeds";
import { aiEvalsRunView } from "./ai-evals-pages";

export const aiEvalsPlugin = buildDomainPlugin({
  id: "ai-evals",
  label: "AI Evals",
  icon: "FlaskConical",
  section: SECTIONS.ai,
  order: 2,
  resources: [
    {
      id: "suite",
      singular: "Eval Suite",
      plural: "Eval Suites",
      icon: "TestTube",
      path: "/ai/evals/suites",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "cases", kind: "number", align: "right", sortable: true },
        { name: "passRate", label: "Pass %", kind: "number", align: "right", sortable: true },
        { name: "lastRun", kind: "datetime", sortable: true },
      ],
      seedCount: 8,
      seed: (i) => ({
        name: pick(["regression-core", "tone-check", "refusal-rate", "fact-recall", "instruction-follow"], i),
        cases: 40 + ((i * 7) % 120),
        passRate: 72 + ((i * 13) % 27),
        lastRun: daysAgo(i),
      }),
    },
    {
      id: "run",
      singular: "Run",
      plural: "Runs",
      icon: "PlayCircle",
      path: "/ai/evals/runs",
      displayField: "id",
      readOnly: true,
      fields: [
        { name: "suite", kind: "text", sortable: true },
        { name: "model", kind: "text", sortable: true },
        { name: "startedAt", kind: "datetime", sortable: true },
        { name: "passRate", label: "Pass %", kind: "number", align: "right", sortable: true },
        { name: "durationSec", label: "Duration (s)", kind: "number", align: "right" },
      ],
      seedCount: 20,
      seed: (i) => ({
        suite: pick(["regression-core", "tone-check", "refusal-rate"], i),
        model: pick(["claude-opus-4-7", "claude-sonnet-4-6", "gpt-4o"], i),
        startedAt: daysAgo(i),
        passRate: 72 + ((i * 11) % 28),
        durationSec: 90 + ((i * 29) % 600),
      }),
    },
  ],
  extraNav: [
    { id: "ai-evals.run-detail.nav", label: "Latest run", icon: "FlaskConical", path: "/ai/evals/latest", view: "ai-evals.run-detail.view" },
  ],
  extraViews: [aiEvalsRunView],
});
