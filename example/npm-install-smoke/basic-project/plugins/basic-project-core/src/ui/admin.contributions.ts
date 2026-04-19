import {
  defineAdminNav,
  defineCommand,
  definePage,
  defineSearchProvider,
  defineWidget,
  defineWorkspace,
  type AdminContributionRegistry,
  type SearchResultItem
} from "@platform/admin-contracts";

import { BasicProjectCoreAdminPage } from "./admin/main.page";

export const adminContributions: Pick<
  AdminContributionRegistry,
  "workspaces" | "nav" | "pages" | "widgets" | "commands" | "searchProviders"
> = {
  workspaces: [
    defineWorkspace({
      id: "basic-project-core",
      label: "Basic Project Core",
      icon: "sparkles",
      description: "Starter workspace for the Basic Project Core module.",
      permission: "basic-project-core.records.read",
      homePath: "/admin/workspace/basic-project-core",
      cards: ["basic-project-core.records.status"],
      quickActions: ["basic-project-core.open.home"]
    })
  ],
  nav: [
    defineAdminNav({
      workspace: "basic-project-core",
      group: "records",
      items: [
        {
          id: "basic-project-core.records",
          label: "Records",
          icon: "folder-open",
          to: "/admin/basic-project-core/records",
          permission: "basic-project-core.records.read"
        }
      ]
    })
  ],
  pages: [
    definePage({
      id: "basic-project-core.home",
      kind: "list",
      route: "/admin/basic-project-core/records",
      label: "Basic Project Core Records",
      workspace: "basic-project-core",
      permission: "basic-project-core.records.read",
      component: BasicProjectCoreAdminPage
    })
  ],
  widgets: [
    defineWidget({
      id: "basic-project-core.records.status",
      kind: "status",
      shell: "admin",
      slot: "dashboard.basic-project-core",
      permission: "basic-project-core.records.read",
      title: "Basic Project Core Status"
    })
  ],
  commands: [
    defineCommand({
      id: "basic-project-core.open.home",
      label: "Open Basic Project Core",
      permission: "basic-project-core.records.read",
      href: "/admin/basic-project-core/records",
      keywords: ["basic-project-core", "basic project core", "records"]
    })
  ],
  searchProviders: [
    defineSearchProvider({
      id: "basic-project-core.search",
      scopes: ["records"],
      permission: "basic-project-core.records.read",
      search(query) {
        const entries: SearchResultItem[] = [
          {
            id: "basic-project-core:records",
            label: "Basic Project Core Records",
            href: "/admin/basic-project-core/records",
            kind: "page",
            description: "Starter search result for the generated workspace."
          }
        ];

        return entries.filter((entry) => query.trim().length === 0 || entry.label.toLowerCase().includes(query.trim().toLowerCase()));
      }
    })
  ]
};
