import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { daysAgo, pick } from "./_factory/seeds";

export const executionWorkspacesPlugin = buildDomainPlugin({
  id: "execution-workspaces",
  label: "Execution Workspaces",
  icon: "Briefcase",
  section: SECTIONS.platform,
  order: 6,
  resources: [
    {
      id: "workspace",
      singular: "Workspace",
      plural: "Workspaces",
      icon: "Briefcase",
      path: "/platform/exec-workspaces",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "owner", kind: "text", sortable: true },
        { name: "kind", kind: "enum", options: [
          { value: "claude", label: "Claude Code" },
          { value: "cli", label: "CLI" },
          { value: "notebook", label: "Notebook" },
        ] },
        { name: "lastActive", kind: "datetime", sortable: true },
      ],
      seedCount: 9,
      seed: (i) => ({
        name: pick(["quizzical-lamport", "witty-hopper", "noble-turing", "eager-ada", "happy-ritchie"], i),
        owner: pick(["sam@gutu.dev", "alex@gutu.dev"], i),
        kind: pick(["claude", "cli", "notebook"], i),
        lastActive: daysAgo(i * 0.5),
      }),
    },
  ],
});
