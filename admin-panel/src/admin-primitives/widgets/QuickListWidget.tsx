import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import { EmptyStateFramework } from "../EmptyStateFramework";
import { Spinner } from "@/primitives/Spinner";
import { useList } from "@/runtime/hooks";
import type { QuickListWidget as QuickListSpec } from "@/contracts/widgets";

export function QuickListWidget({ widget }: { widget: QuickListSpec }) {
  const { data, loading } = useList(widget.resource, {
    page: 1,
    pageSize: widget.limit ?? 10,
    sort: widget.sort,
  });
  const records = (data?.rows ?? []) as Record<string, unknown>[];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{widget.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        {loading && records.length === 0 ? (
          <div className="flex-1 flex items-center justify-center gap-2 py-6 text-xs text-text-muted">
            <Spinner size={12} /> Loading…
          </div>
        ) : records.length === 0 ? (
          <EmptyStateFramework kind="cleared" />
        ) : (
          <ul className="divide-y divide-border-subtle">
            {records.map((record) => {
              const primary = String(record[widget.primary] ?? "—");
              const secondary = widget.secondary
                ? String(record[widget.secondary] ?? "")
                : null;
              const href = widget.href?.(record);
              const inner = (
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-surface-1 group">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate">
                      {primary}
                    </div>
                    {secondary && (
                      <div className="text-xs text-text-muted truncate">{secondary}</div>
                    )}
                  </div>
                  {href && (
                    <ArrowUpRight className="h-3.5 w-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              );
              return (
                <li key={String(record.id ?? primary)}>
                  {href ? (
                    <a href={`#${href}`} className="block">
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
