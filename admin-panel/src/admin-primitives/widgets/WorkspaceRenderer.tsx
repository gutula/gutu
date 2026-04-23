import * as React from "react";
import type { Widget, WorkspaceDescriptor } from "@/contracts/widgets";
import { WidgetGrid } from "./WidgetGrid";

const STORAGE_PREFIX = "gutu-workspace-";

interface WorkspacePersonalization {
  hidden?: string[];
  order?: string[];
}

function loadPersonalization(key: string): WorkspacePersonalization {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return raw ? (JSON.parse(raw) as WorkspacePersonalization) : {};
  } catch {
    return {};
  }
}

function applyPersonalization(
  widgets: readonly Widget[],
  p: WorkspacePersonalization,
): Widget[] {
  let out = [...widgets];
  if (p.hidden) out = out.filter((w) => !p.hidden!.includes(w.id));
  if (p.order) {
    const idx = new Map(p.order.map((id, i) => [id, i]));
    out.sort((a, b) => {
      const ai = idx.has(a.id) ? idx.get(a.id)! : out.length;
      const bi = idx.has(b.id) ? idx.get(b.id)! : out.length;
      return ai - bi;
    });
  }
  return out;
}

export function WorkspaceRenderer({
  workspace,
}: {
  workspace: WorkspaceDescriptor;
}) {
  const key = workspace.storageKey ?? workspace.id;
  const [personalization] = React.useState(() => loadPersonalization(key));

  const widgets = React.useMemo(
    () =>
      workspace.personalizable === false
        ? [...workspace.widgets]
        : applyPersonalization(workspace.widgets, personalization),
    [workspace, personalization],
  );

  return <WidgetGrid widgets={widgets} />;
}
