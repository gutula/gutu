import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_TICKET, PRIORITY } from "./_factory/options";
import { code, daysAgo, personName, pick } from "./_factory/seeds";
import { issuesKanbanView } from "./issues-pages";

export const issuesPlugin = buildDomainPlugin({
  id: "issues",
  label: "Issues",
  icon: "AlertCircle",
  section: SECTIONS.operations,
  order: 5,
  resources: [
    {
      id: "issue",
      singular: "Issue",
      plural: "Issues",
      icon: "AlertCircle",
      path: "/issues",
      fields: [
        { name: "code", kind: "text", required: true, sortable: true, width: 120 },
        { name: "title", kind: "text", required: true, sortable: true },
        { name: "assignee", kind: "text", sortable: true },
        { name: "priority", kind: "enum", options: PRIORITY, sortable: true },
        { name: "status", kind: "enum", options: STATUS_TICKET, sortable: true },
        { name: "updatedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 20,
      seed: (i) => ({
        code: code("ISS", i),
        title: pick(["Login fails in Safari", "Slow dashboard", "Typo in settings", "Export broken", "Email bounces"], i),
        assignee: personName(i),
        priority: pick(["low", "normal", "high", "urgent"], i),
        status: pick(["open", "in_progress", "resolved", "closed"], i),
        updatedAt: daysAgo(i),
      }),
    },
  ],
  extraNav: [
    { id: "issues.board.nav", label: "Board", icon: "LayoutGrid", path: "/issues/board", view: "issues.kanban.view" },
  ],
  extraViews: [issuesKanbanView],
});
