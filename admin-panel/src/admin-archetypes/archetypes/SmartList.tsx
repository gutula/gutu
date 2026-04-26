import * as React from "react";
import { Page } from "../slots/Page";
import { PageHeaderSlot } from "../slots/PageHeaderSlot";
import { ArchetypeToolbar } from "../slots/Toolbar";
import { MainCanvas } from "../slots/MainCanvas";
import { ActionBar } from "../slots/ActionBar";
import { BulkActionBar, type BulkAction } from "../widgets/BulkActionBar";
import type { Density } from "../types";

export interface SmartListProps<Id extends string | number = string> {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right-side header actions ("+ New", "Export", etc.). */
  actions?: React.ReactNode;
  /** Saved-view switcher / period chips. */
  toolbarStart?: React.ReactNode;
  /** Search / density / column manager. */
  toolbarEnd?: React.ReactNode;
  /** The data grid itself — typically the existing DataTable / AdvancedDataTable. */
  children: React.ReactNode;
  /** Selected row ids; when non-empty, ActionBar appears. */
  selected?: ReadonlySet<Id>;
  /** Bulk actions surfaced in the action bar. */
  bulkActions?: readonly BulkAction[];
  /** Clears selection (called on action-bar close). */
  onClearSelection?: () => void;
  /** Optional keyboard hints (rendered in the action bar). */
  keyboardHints?: React.ReactNode;
  density?: Density;
  className?: string;
}

/** Archetype #3 — Smart List. Browse / filter / group / save / bulk-act. */
export function SmartList<Id extends string | number = string>({
  id,
  title,
  subtitle,
  actions,
  toolbarStart,
  toolbarEnd,
  children,
  selected,
  bulkActions,
  onClearSelection,
  keyboardHints,
  density = "comfortable",
  className,
}: SmartListProps<Id>) {
  const selectedCount = selected?.size ?? 0;
  const open = selectedCount > 0 && (bulkActions?.length ?? 0) > 0;
  return (
    <Page archetype="smart-list" id={id} density={density} className={className}>
      <PageHeaderSlot title={title} subtitle={subtitle} actions={actions} />
      {(toolbarStart || toolbarEnd) && (
        <ArchetypeToolbar start={toolbarStart} end={toolbarEnd} />
      )}
      <MainCanvas>{children}</MainCanvas>
      <ActionBar
        open={open}
        start={
          <BulkActionBar
            selectedCount={selectedCount}
            onClear={() => onClearSelection?.()}
            actions={bulkActions ?? []}
          />
        }
        hints={keyboardHints}
      />
    </Page>
  );
}
