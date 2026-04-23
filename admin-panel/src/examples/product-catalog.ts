import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE } from "./_factory/options";
import { code, money, pick } from "./_factory/seeds";

export const productCatalogPlugin = buildDomainPlugin({
  id: "product-catalog",
  label: "Product Catalog",
  icon: "ShoppingBasket",
  section: SECTIONS.commerce,
  order: 1,
  resources: [
    {
      id: "product",
      singular: "Product",
      plural: "Products",
      icon: "Tag",
      path: "/catalog/products",
      fields: [
        { name: "sku", kind: "text", required: true, sortable: true, width: 110 },
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "category", kind: "enum", options: [
          { value: "apparel", label: "Apparel" },
          { value: "electronics", label: "Electronics" },
          { value: "home", label: "Home" },
          { value: "books", label: "Books" },
        ], sortable: true },
        { name: "price", kind: "currency", align: "right", sortable: true },
        { name: "status", kind: "enum", options: STATUS_ACTIVE },
      ],
      seedCount: 26,
      seed: (i) => ({
        sku: code("P", i, 6),
        name: pick(["Classic Tee", "Running Shoes", "Coffee Mug", "Wireless Mouse", "Notebook"], i) + ` v${1 + (i % 5)}`,
        category: pick(["apparel", "electronics", "home", "books"], i),
        price: money(i, 9, 500),
        status: pick(["active", "active", "archived"], i),
      }),
    },
  ],
});
