import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE } from "./_factory/options";
import { daysAgo, pick } from "./_factory/seeds";

export const runtimeBridgePlugin = buildDomainPlugin({
  id: "runtime-bridge",
  label: "Runtime Bridge",
  icon: "Radio",
  section: SECTIONS.platform,
  order: 5,
  resources: [
    {
      id: "channel",
      singular: "Channel",
      plural: "Channels",
      icon: "Radio",
      path: "/platform/runtime-bridges",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "kind", kind: "enum", options: [
          { value: "event", label: "Event" },
          { value: "command", label: "Command" },
          { value: "query", label: "Query" },
        ] },
        { name: "status", kind: "enum", options: STATUS_ACTIVE },
        { name: "lastMessage", kind: "datetime", sortable: true },
      ],
      seedCount: 8,
      seed: (i) => ({
        name: pick(["orders.events", "crm.commands", "inventory.queries", "auth.events"], i),
        kind: pick(["event", "command", "query"], i),
        status: pick(["active", "active", "inactive"], i),
        lastMessage: daysAgo(i * 0.2),
      }),
    },
  ],
});
