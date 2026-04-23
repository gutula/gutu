import * as React from "react";
import { Plus, RefreshCw } from "lucide-react";
import type { ListView as ListViewDef } from "@/contracts/views";
import { PageHeader } from "@/admin-primitives/PageHeader";
import { Toolbar, ToolbarSeparator } from "@/admin-primitives/Toolbar";
import { FilterBar } from "@/admin-primitives/FilterBar";
import { DataTable, type DataTableColumn } from "@/admin-primitives/DataTable";
import { ErrorState } from "@/admin-primitives/ErrorState";
import { EmptyState } from "@/admin-primitives/EmptyState";
import { Button } from "@/primitives/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/primitives/DropdownMenu";
import { Spinner } from "@/primitives/Spinner";
import { useList } from "@/runtime/hooks";
import { useRuntime } from "@/runtime/context";
import { renderCellValue, getPath } from "./renderCellValue";
import { navigateTo } from "./useRoute";
import type { ActionDescriptor } from "@/contracts/actions";

export interface ListViewRendererProps {
  view: ListViewDef;
  basePath: string;
}

export function ListViewRenderer({ view, basePath }: ListViewRendererProps) {
  const runtime = useRuntime();
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState(view.defaultSort ?? null);
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, unknown>>({});
  const [selection, setSelection] = React.useState<Set<string>>(new Set());

  const query = React.useMemo(
    () => ({
      page,
      pageSize: view.pageSize ?? 25,
      sort: sort ?? undefined,
      search: search || undefined,
      filters,
    }),
    [page, sort, search, filters, view.pageSize],
  );

  const { data, loading, error, refetch } = useList(view.resource, query);

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [search, filters]);

  const rowActions =
    view.actions?.filter(
      (a) => a.placement?.includes("row") || !a.placement,
    ) ?? [];
  const bulkActions = view.actions?.filter((a) => a.placement?.includes("bulk")) ?? [];
  const pageActions = view.actions?.filter((a) => a.placement?.includes("page")) ?? [];

  const columns: DataTableColumn<Record<string, unknown>>[] = view.columns.map((c) => ({
    id: c.field,
    header: c.label ?? humanize(c.field),
    width: c.width,
    align: c.align,
    sortable: c.sortable,
    sortKey: c.field,
    cell: (row) => {
      const v = getPath(row, c.field);
      if (c.render) return c.render(v, row);
      return renderCellValue(c, v);
    },
  }));

  if (rowActions.length > 0) {
    columns.push({
      id: "__actions",
      header: "",
      width: 44,
      align: "right",
      cell: (row) => (
        <RowActionMenu actions={rowActions} row={row} resource={view.resource} runtime={runtime} />
      ),
    });
  }

  const selectedRows = data?.rows.filter((r) => selection.has(String(r.id))) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={view.title}
        description={view.description}
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => runtime.resources.refresh(view.resource)}
              iconLeft={loading ? <Spinner size={12} /> : <RefreshCw className="h-3.5 w-3.5" />}
            >
              Refresh
            </Button>
            {pageActions.map((a) => (
              <ActionButton
                key={a.id}
                action={a}
                records={[]}
                resource={view.resource}
                runtime={runtime}
              />
            ))}
          </>
        }
      />

      <Toolbar>
        <FilterBar
          search={view.search !== false}
          searchValue={search}
          onSearchChange={setSearch}
          filters={view.filters}
          filterValues={filters}
          onFilterChange={setFilters}
          trailing={
            selection.size > 0 && bulkActions.length > 0 ? (
              <>
                <span className="text-sm text-text-muted">
                  {selection.size} selected
                </span>
                <ToolbarSeparator />
                {bulkActions.map((a) => (
                  <ActionButton
                    key={a.id}
                    action={a}
                    records={selectedRows}
                    resource={view.resource}
                    runtime={runtime}
                  />
                ))}
              </>
            ) : null
          }
        />
      </Toolbar>

      {error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : !loading && (data?.total ?? 0) === 0 && !search && Object.keys(filters).length === 0 ? (
        <EmptyState
          title={`No ${view.title.toLowerCase()} yet`}
          description={view.description ?? "Create the first record to get started."}
          action={
            pageActions[0] ? (
              <ActionButton
                action={pageActions[0]}
                records={[]}
                resource={view.resource}
                runtime={runtime}
              />
            ) : (
              <Button
                variant="primary"
                iconLeft={<Plus className="h-3.5 w-3.5" />}
                onClick={() => navigateTo(`${basePath}/new`)}
              >
                New
              </Button>
            )
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={data?.rows ?? []}
          total={data?.total}
          page={page}
          pageSize={view.pageSize ?? 25}
          loading={loading}
          sort={sort ?? undefined}
          onSortChange={setSort}
          onPageChange={setPage}
          selection={bulkActions.length > 0 ? { selected: selection, onChange: setSelection } : undefined}
          rowKey={(row) => String(row.id)}
          onRowClick={(row) =>
            navigateTo(
              view.detailPath
                ? `${basePath}/${view.detailPath(row)}`
                : `${basePath}/${row.id}`,
            )
          }
        />
      )}
    </div>
  );
}

function RowActionMenu({
  actions,
  row,
  resource,
  runtime,
}: {
  actions: readonly ActionDescriptor[];
  row: Record<string, unknown>;
  resource: string;
  runtime: ReturnType<typeof useRuntime>;
}) {
  const visible = actions.filter(
    (a) => !a.guard || a.guard({ records: [row], resource, runtime: runtime.actions }),
  );
  if (visible.length === 0) return null;

  return (
    <div data-stop-row>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Row actions">
            <span className="text-text-muted">⋯</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {visible.map((a) => (
            <DropdownMenuItem
              key={a.id}
              intent={a.intent === "danger" ? "danger" : "default"}
              onSelect={async () => {
                if (a.confirm) {
                  const ok = await runtime.actions.confirm({
                    title: a.confirm.title,
                    description: a.confirm.description,
                    destructive: a.confirm.destructive,
                  });
                  if (!ok) return;
                }
                await a.run({
                  records: [row],
                  resource,
                  runtime: runtime.actions,
                });
              }}
            >
              {a.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function ActionButton({
  action,
  records,
  resource,
  runtime,
  size = "sm",
}: {
  action: ActionDescriptor;
  records: readonly Record<string, unknown>[];
  resource: string;
  runtime: ReturnType<typeof useRuntime>;
  size?: "xs" | "sm" | "md";
}) {
  const [busy, setBusy] = React.useState(false);
  const hidden =
    action.guard &&
    !action.guard({ records, resource, runtime: runtime.actions });
  if (hidden) return null;

  return (
    <Button
      variant={action.intent === "danger" ? "danger" : "primary"}
      size={size}
      loading={busy}
      onClick={async () => {
        if (action.confirm) {
          const ok = await runtime.actions.confirm({
            title: action.confirm.title,
            description: action.confirm.description,
            destructive: action.confirm.destructive,
          });
          if (!ok) return;
        }
        setBusy(true);
        try {
          await action.run({ records, resource, runtime: runtime.actions });
        } finally {
          setBusy(false);
        }
      }}
    >
      {action.label}
    </Button>
  );
}

function humanize(field: string): string {
  const last = field.split(".").pop() ?? field;
  return last
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/_/g, " ")
    .trim();
}
