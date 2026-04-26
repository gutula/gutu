import * as React from "react";
import { Page } from "../slots/Page";
import { PageHeaderSlot } from "../slots/PageHeaderSlot";
import { BodyLayout } from "../slots/Layout";
import { MainCanvas } from "../slots/MainCanvas";
import { Rail } from "../slots/Rail";
import { ArchetypeToolbar } from "../slots/Toolbar";
import type { Density } from "../types";

export interface TreeExplorerProps {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  toolbarStart?: React.ReactNode;
  toolbarEnd?: React.ReactNode;
  /** The tree itself. */
  tree: React.ReactNode;
  /** Right pane — selected-node detail. */
  rail?: React.ReactNode;
  density?: Density;
  className?: string;
}

/** Archetype #6 — Tree Explorer. */
export function TreeExplorer({
  id,
  title,
  subtitle,
  actions,
  toolbarStart,
  toolbarEnd,
  tree,
  rail,
  density = "comfortable",
  className,
}: TreeExplorerProps) {
  return (
    <Page archetype="tree" id={id} density={density} className={className}>
      <PageHeaderSlot title={title} subtitle={subtitle} actions={actions} />
      {(toolbarStart || toolbarEnd) && (
        <ArchetypeToolbar start={toolbarStart} end={toolbarEnd} />
      )}
      <BodyLayout
        main={<MainCanvas>{tree}</MainCanvas>}
        rail={rail ? <Rail>{rail}</Rail> : undefined}
        railWidth={400}
        collapseAt={1100}
      />
    </Page>
  );
}
