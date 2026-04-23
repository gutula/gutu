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

export const issuesKanbanView = defineCustomView({
  id: "issues.kanban.view",
  title: "Board",
  description: "Issues grouped by status.",
  resource: "issues.issue",
  render: () => {
    const columns = TICKET_COLS.map((c, ci) => ({
      ...c,
      items: Array.from({ length: 2 + (ci % 4) + 1 }, (_, i) => {
        const idx = ci * 7 + i;
        return {
          id: `iss-${c.id}-${i}`,
          code: code("ISS", idx),
          title: pick(
            ["Login fails in Safari", "Typo in settings", "Export broken", "Email bounces", "Slow dashboard"],
            idx,
          ),
          assignee: personName(idx),
          priority: pick(["low", "normal", "high", "urgent"], idx),
        };
      }),
    }));
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Issues board" description="Every open engineering issue." />
        <Kanban
          columns={columns}
          rowKey={(i) => i.id}
          renderItem={(i) => (
            <div>
              <div className="flex items-center justify-between">
                <code className="text-xs font-mono text-text-muted">{i.code}</code>
                <Badge intent={PRIORITY_INTENT[i.priority]}>{i.priority}</Badge>
              </div>
              <div className="text-sm text-text-primary mt-1">{i.title}</div>
              <div className="text-xs text-text-muted mt-1">{i.assignee}</div>
            </div>
          )}
        />
      </div>
    );
  },
});
