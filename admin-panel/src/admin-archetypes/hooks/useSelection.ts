import * as React from "react";

/** Mutable, ordered set of selected row ids. Used by Smart List, Kanban,
 *  Timeline, Split Inbox — anywhere bulk selection is meaningful. */
export function useSelection<Id extends string | number = string>(): {
  ids: ReadonlySet<Id>;
  size: number;
  has: (id: Id) => boolean;
  toggle: (id: Id) => void;
  add: (id: Id | Id[]) => void;
  remove: (id: Id | Id[]) => void;
  clear: () => void;
  setAll: (ids: Iterable<Id>) => void;
} {
  const [ids, setIds] = React.useState<Set<Id>>(() => new Set<Id>());

  const has = React.useCallback((id: Id) => ids.has(id), [ids]);
  const toggle = React.useCallback((id: Id) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const add = React.useCallback((id: Id | Id[]) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (Array.isArray(id)) {
        for (const i of id) next.add(i);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);
  const remove = React.useCallback((id: Id | Id[]) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (Array.isArray(id)) {
        for (const i of id) next.delete(i);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);
  const clear = React.useCallback(() => setIds(new Set<Id>()), []);
  const setAll = React.useCallback((next: Iterable<Id>) => setIds(new Set(next)), []);

  return { ids, size: ids.size, has, toggle, add, remove, clear, setAll };
}
