import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE } from "./_factory/options";
import { pick } from "./_factory/seeds";

export const aiSkillsPlugin = buildDomainPlugin({
  id: "ai-skills",
  label: "AI Skills",
  icon: "Puzzle",
  section: SECTIONS.ai,
  order: 4,
  resources: [
    {
      id: "skill",
      singular: "Skill",
      plural: "Skills",
      icon: "Zap",
      path: "/ai/skills",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "trigger", kind: "text" },
        { name: "version", kind: "text", width: 90 },
        { name: "status", kind: "enum", options: STATUS_ACTIVE, sortable: true },
      ],
      seedCount: 14,
      seed: (i) => ({
        name: pick(
          ["pptx", "docx", "xlsx", "pdf", "setup-cowork", "skill-creator", "design-critique", "code-review", "debug"],
          i,
        ),
        trigger: pick(["manual", "automatic", "on-mention"], i),
        version: `0.${i + 1}`,
        status: pick(["active", "active", "inactive"], i),
      }),
    },
  ],
});
