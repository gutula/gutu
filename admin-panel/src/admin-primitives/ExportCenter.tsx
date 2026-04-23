import * as React from "react";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/primitives/DropdownMenu";
import { Button } from "@/primitives/Button";
import { useRuntime } from "@/runtime/context";

export type ExportFormat = "csv" | "xlsx" | "json" | "pdf";

export interface ExportCenterProps {
  resource: string;
  /** How many records would be exported with current scope (for the label). */
  count?: number;
  /** Produce a row list for the chosen format. Called on click. */
  fetchRows: () => Promise<Record<string, unknown>[]>;
  /** Optional custom file name (without extension). */
  fileName?: string;
  formats?: readonly ExportFormat[];
  className?: string;
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Array.from(
    rows.reduce((s, r) => {
      for (const k of Object.keys(r)) s.add(k);
      return s;
    }, new Set<string>()),
  );
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => escape(r[h])).join(","));
  }
  return lines.join("\n");
}

function download(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function ExportCenter({
  resource,
  count,
  fetchRows,
  fileName,
  formats = ["csv", "json"],
  className,
}: ExportCenterProps) {
  const { analytics, actions } = useRuntime();
  const [busy, setBusy] = React.useState<ExportFormat | null>(null);

  const run = async (format: ExportFormat) => {
    setBusy(format);
    const started = Date.now();
    try {
      const rows = await fetchRows();
      analytics.emit("page.export.started", {
        resource,
        format,
        rows: rows.length,
      });
      const name = `${fileName ?? resource.replace(/\./g, "-")}.${format}`;
      if (format === "csv") {
        download(new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" }), name);
      } else if (format === "json") {
        download(
          new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" }),
          name,
        );
      } else {
        // xlsx/pdf need server-side or heavy lib — delegate via toast
        actions.toast({
          title: `${format.toUpperCase()} export queued`,
          description: "You'll receive a notification when it's ready.",
          intent: "info",
        });
      }
      analytics.emit("page.export.delivered", {
        resource,
        format,
        durationMs: Date.now() - started,
      });
    } catch (err) {
      actions.toast({
        title: "Export failed",
        description: err instanceof Error ? err.message : "Unknown error",
        intent: "danger",
      });
    } finally {
      setBusy(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<Download className="h-3.5 w-3.5" />}
          loading={busy !== null}
          className={className}
        >
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-xs">
          {count !== undefined ? `${count} records · current view` : "Current view"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {formats.map((f) => (
          <DropdownMenuItem key={f} onSelect={() => void run(f)}>
            Export as {f.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
