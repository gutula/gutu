import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_TICKET, PRIORITY } from "./_factory/options";
import { code, daysAgo, personName, pick } from "./_factory/seeds";
import { projectsBoardView } from "./projects-pages";

export const projectsPlugin = buildDomainPlugin({
  id: "projects",
  label: "Projects",
  icon: "FolderKanban",
  section: SECTIONS.operations,
  order: 4,
  resources: [
    {
      id: "project",
      singular: "Project",
      plural: "Projects",
      icon: "FolderKanban",
      path: "/projects",
      fields: [
        { name: "code", kind: "text", required: true, sortable: true, width: 100 },
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "owner", kind: "text", sortable: true },
        { name: "status", kind: "enum", options: STATUS_TICKET, sortable: true },
        { name: "priority", kind: "enum", options: PRIORITY },
        { name: "dueAt", kind: "date", sortable: true },
      ],
      seedCount: 12,
      seed: (i) => ({
        code: code("PRJ", i),
        name: pick(["Migrate to v2", "Redesign billing", "Launch EU", "Mobile app", "Data warehouse"], i),
        owner: personName(i),
        status: pick(["open", "in_progress", "resolved"], i),
        priority: pick(["normal", "high", "urgent"], i),
        dueAt: daysAgo(-i * 15),
      }),
    },
  ],
  extraNav: [
    { id: "projects.board.nav", label: "Board", icon: "LayoutGrid", path: "/projects/board", view: "projects.board.view" },
  ],
  extraViews: [projectsBoardView],
});
