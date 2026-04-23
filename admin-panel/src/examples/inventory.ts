import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { code, money, pick } from "./_factory/seeds";
import { inventoryAlertsView } from "./inventory-pages";

export const inventoryPlugin = buildDomainPlugin({
  id: "inventory",
  label: "Inventory",
  icon: "Boxes",
  section: SECTIONS.supplyChain,
  order: 1,
  resources: [
    {
      id: "item",
      singular: "Item",
      plural: "Items",
      icon: "Box",
      path: "/inventory/items",
      fields: [
        { name: "sku", label: "SKU", kind: "text", required: true, sortable: true, width: 110 },
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "category", kind: "enum", options: [
          { value: "raw", label: "Raw materials" },
          { value: "wip", label: "Work in progress" },
          { value: "finished", label: "Finished goods" },
        ] },
        { name: "onHand", label: "On hand", kind: "number", align: "right", sortable: true },
        { name: "reorderPoint", label: "Reorder @", kind: "number", align: "right" },
        { name: "unitCost", kind: "currency", align: "right", sortable: true },
      ],
      seedCount: 28,
      seed: (i) => ({
        sku: code("SKU", i, 5),
        name: pick(["Widget A", "Gizmo B", "Part C", "Bracket D", "Screw E"], i) + ` #${i}`,
        category: pick(["raw", "wip", "finished"], i),
        onHand: (i * 13) % 500,
        reorderPoint: 20 + ((i * 7) % 60),
        unitCost: money(i, 1, 200),
      }),
    },
    {
      id: "warehouse",
      singular: "Warehouse",
      plural: "Warehouses",
      icon: "Warehouse",
      path: "/inventory/warehouses",
      fields: [
        { name: "code", kind: "text", required: true, sortable: true, width: 100 },
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "city", kind: "text" },
        { name: "capacity", kind: "number", align: "right", sortable: true },
      ],
      seedCount: 6,
      seed: (i) => ({
        code: pick(["WH-SFO", "WH-AUS", "WH-LHR", "WH-FRA", "WH-NRT", "WH-SYD"], i),
        name: pick(["San Francisco", "Austin", "London", "Frankfurt", "Tokyo", "Sydney"], i) + " DC",
        city: pick(["San Francisco", "Austin", "London", "Frankfurt", "Tokyo", "Sydney"], i),
        capacity: 50_000 + ((i * 10_000) % 200_000),
      }),
    },
  ],
  extraNav: [
    { id: "inventory.alerts.nav", label: "Low stock", icon: "AlertTriangle", path: "/inventory/alerts", view: "inventory.alerts.view" },
  ],
  extraViews: [inventoryAlertsView],
});
