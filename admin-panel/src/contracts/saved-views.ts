/** Saved view contract — filters + sort + columns + grouping per user/team/tenant. */

export type SavedViewScope = "personal" | "team" | "tenant";

export interface SortSpec {
  field: string;
  dir: "asc" | "desc";
}

export interface FilterLeaf {
  field: string;
  op:
    | "eq"
    | "neq"
    | "lt"
    | "lte"
    | "gt"
    | "gte"
    | "in"
    | "nin"
    | "contains"
    | "starts_with"
    | "between"
    | "null"
    | "not_null";
  value?: unknown;
}

export type FilterTree =
  | FilterLeaf
  | { and: FilterTree[] }
  | { or: FilterTree[] };

export interface SavedView {
  id: string;
  resource: string;
  label: string;
  scope: SavedViewScope;
  ownerUserId?: string;
  teamId?: string;
  tenantId?: string;
  filter?: FilterTree;
  sort?: SortSpec[];
  columns?: readonly string[];
  grouping?: string;
  density?: "comfortable" | "compact" | "dense";
  pageSize?: number;
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

export interface SavedViewStore {
  list(resource: string): readonly SavedView[];
  get(id: string): SavedView | null;
  save(view: Omit<SavedView, "id" | "createdAt" | "updatedAt"> & { id?: string }): SavedView;
  delete(id: string): void;
  setDefault(resource: string, id: string | null): void;
  getDefault(resource: string): SavedView | null;
  subscribe(listener: () => void): () => void;
}
