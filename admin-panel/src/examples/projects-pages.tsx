import { defineCustomView } from "@/builders";
import { PageHeader } from "@/admin-primitives/PageHeader";
import { Kanban } from "@/admin-primitives/Kanban";
import { Badge } from "@/primitives/Badge";
import { code, personName, pick } from "./_factory/seeds";

const TICKET_COLS = [
  { id: "open", title: "Open", intent: "info" as const },
  { id: "in_progress", title: "In progress", intent: "warning" as const },
  { id: "resolved", title: "Resolved", intent: "success" as const },
  { id: "closed", title: "Closed", intent: "neutral" as const },
];
const PRIORITY_INTENT: Record<string, "neutral" | "info" | "warning" | "danger"> = {
  low: "neutral",
  normal: "info",
  high: "warning",
  urgent: "danger",
};

export const projectsBoardView = defineCustomView({
  id: "projects.board.view",
  title: "Board",
  description: "Projects grouped by status.",
  resource: "projects.project",
  render: () => {
    const columns = TICKET_COLS.map((c, ci) => ({
      ...c,
      items: Array.from({ length: 2 + (ci % 3) }, (_, i) => {
        const idx = ci * 5 + i;
        return {
          id: `prj-${c.id}-${i}`,
          code: code("PRJ", idx),
          name: pick(
            ["Migrate to v2", "Redesign billing", "Launch EU", "Mobile app", "Data warehouse"],
            idx,
          ),
          owner: personName(idx),
          priority: pick(["normal", "high", "urgent"], idx),
        };
      }),
    }));
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Project board" description="Every active project." />
        <Kanban
          columns={columns}
          rowKey={(i) => i.id}
          renderItem={(i) => (
            <div>
              <div className="flex items-center justify-between">
                <code className="text-xs font-mono text-text-muted">{i.code}</code>
                <Badge intent={PRIORITY_INTENT[i.priority]}>{i.priority}</Badge>
              </div>
              <div className="text-sm text-text-primary mt-1">{i.name}</div>
              <div className="text-xs text-text-muted mt-1">{i.owner}</div>
            </div>
          )}
        />
      </div>
    );
  },
});
