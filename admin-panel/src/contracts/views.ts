import type { ReactNode } from "react";
import type { FieldDescriptor } from "./fields";
import type { ActionDescriptor } from "./actions";

export type ViewId = string;

export interface ViewBase {
  readonly id: ViewId;
  readonly title: string;
  readonly description?: string;
  readonly resource: string;
  readonly icon?: string;
}

export interface ColumnDescriptor {
  /** Field name on the record (dot paths allowed: "customer.name"). */
  readonly field: string;
  readonly label?: string;
  readonly sortable?: boolean;
  readonly width?: number | string;
  readonly align?: "left" | "right" | "center";
  /** Custom renderer — receives record and returns ReactNode. */
  readonly render?: (value: unknown, record: Record<string, unknown>) => ReactNode;
  readonly kind?: FieldDescriptor["kind"];
  readonly options?: FieldDescriptor["options"];
}

export interface FilterDescriptor {
  readonly field: string;
  readonly label?: string;
  readonly kind: "text" | "enum" | "boolean" | "date-range";
  readonly options?: FieldDescriptor["options"];
}

export interface ListView extends ViewBase {
  readonly type: "list";
  readonly columns: readonly ColumnDescriptor[];
  readonly filters?: readonly FilterDescriptor[];
  readonly pageSize?: number;
  readonly defaultSort?: { field: string; dir: "asc" | "desc" };
  /** Actions that apply per-row, to bulk selections, or to the page. */
  readonly actions?: readonly ActionDescriptor[];
  readonly search?: boolean;
  /** Path of the detail route relative to `/<plugin>/<resource>/`. */
  readonly detailPath?: (record: Record<string, unknown>) => string;
}

export interface FormSection {
  readonly id: string;
  readonly title?: string;
  readonly description?: string;
  readonly columns?: 1 | 2 | 3;
  readonly fields: readonly FieldDescriptor[];
}

export interface FormView extends ViewBase {
  readonly type: "form";
  readonly sections: readonly FormSection[];
  /** Default values when creating a new record. */
  readonly defaults?: Record<string, unknown>;
  readonly actions?: readonly ActionDescriptor[];
}

export interface DetailView extends ViewBase {
  readonly type: "detail";
  readonly header?: (record: Record<string, unknown>) => ReactNode;
  readonly tabs: readonly {
    readonly id: string;
    readonly label: string;
    readonly render: (record: Record<string, unknown>) => ReactNode;
  }[];
  readonly actions?: readonly ActionDescriptor[];
}

export interface DashboardWidget {
  readonly id: string;
  readonly title: string;
  readonly size?: "sm" | "md" | "lg" | "xl";
  readonly render: () => ReactNode;
}

export interface DashboardView extends ViewBase {
  readonly type: "dashboard";
  readonly widgets: readonly DashboardWidget[];
}

export interface CustomView extends ViewBase {
  readonly type: "custom";
  readonly render: () => ReactNode;
}

export type View =
  | ListView
  | FormView
  | DetailView
  | DashboardView
  | CustomView;
