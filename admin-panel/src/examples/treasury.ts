import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { daysAgo, money, pick } from "./_factory/seeds";
import { treasuryCashView } from "./treasury-pages";

export const treasuryPlugin = buildDomainPlugin({
  id: "treasury",
  label: "Treasury",
  icon: "Vault",
  section: SECTIONS.finance,
  order: 4,
  resources: [
    {
      id: "account",
      singular: "Bank Account",
      plural: "Bank Accounts",
      icon: "Landmark",
      path: "/treasury/accounts",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "bank", kind: "text", sortable: true },
        { name: "currency", kind: "enum", options: [
          { value: "USD", label: "USD" },
          { value: "EUR", label: "EUR" },
          { value: "GBP", label: "GBP" },
        ] },
        { name: "balance", kind: "currency", align: "right", sortable: true },
      ],
      seedCount: 6,
      seed: (i) => ({
        name: pick(["Ops USD", "Reserve EUR", "Payroll USD", "Operating GBP"], i),
        bank: pick(["Chase", "HSBC", "Barclays", "Wise"], i),
        currency: pick(["USD", "EUR", "GBP"], i),
        balance: money(i, 10000, 500000),
      }),
    },
    {
      id: "transfer",
      singular: "Transfer",
      plural: "Transfers",
      icon: "ArrowLeftRight",
      path: "/treasury/transfers",
      displayField: "id",
      fields: [
        { name: "from", kind: "text", sortable: true },
        { name: "to", kind: "text", sortable: true },
        { name: "amount", kind: "currency", align: "right", sortable: true },
        { name: "status", kind: "enum", options: [
          { value: "pending", label: "Pending", intent: "warning" },
          { value: "settled", label: "Settled", intent: "success" },
        ] },
        { name: "initiatedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 12,
      seed: (i) => ({
        from: pick(["Ops USD", "Reserve EUR"], i),
        to: pick(["Payroll USD", "Operating GBP"], i + 1),
        amount: money(i, 1000, 50000),
        status: pick(["pending", "settled", "settled"], i),
        initiatedAt: daysAgo(i),
      }),
    },
  ],
  extraNav: [
    { id: "treasury.cash.nav", label: "Cash position", icon: "PiggyBank", path: "/treasury/cash", view: "treasury.cash.view" },
  ],
  extraViews: [treasuryCashView],
});
