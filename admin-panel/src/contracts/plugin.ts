import type { NavItem, NavSection } from "./nav";
import type { ResourceDefinition } from "./resources";
import type { View, DashboardWidget } from "./views";
import type { ActionDescriptor } from "./actions";
import type { CommandDescriptor } from "./commands";

/** A plugin's admin contribution surface — the entire payload handed to the host. */
export interface AdminContribution {
  readonly nav?: readonly NavItem[];
  readonly navSections?: readonly NavSection[];
  readonly resources?: readonly ResourceDefinition[];
  readonly views?: readonly View[];
  /** Widgets that contribute to global dashboards (outside their own view). */
  readonly widgets?: readonly DashboardWidget[];
  /** Page-level actions surfaced globally (e.g. "New customer" from topbar). */
  readonly globalActions?: readonly ActionDescriptor[];
  readonly commands?: readonly CommandDescriptor[];
}

export interface PluginMeta {
  readonly id: string;
  readonly label: string;
  readonly version?: string;
  readonly description?: string;
  readonly vendor?: string;
  readonly icon?: string;
}

export interface Plugin extends PluginMeta {
  readonly admin?: AdminContribution;
  /** Optional lifecycle hooks. */
  readonly onActivate?: () => void | Promise<void>;
  readonly onDeactivate?: () => void | Promise<void>;
}
