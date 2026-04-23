import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { code, daysAgo, money, pick, COMPANIES } from "./_factory/seeds";

export const subscriptionsPlugin = buildDomainPlugin({
  id: "subscriptions",
  label: "Subscriptions",
  icon: "RefreshCw",
  section: SECTIONS.commerce,
  order: 4,
  resources: [
    {
      id: "subscription",
      singular: "Subscription",
      plural: "Subscriptions",
      icon: "RefreshCw",
      path: "/subscriptions",
      fields: [
        { name: "ref", kind: "text", required: true, sortable: true, width: 130 },
        { name: "customer", kind: "text", sortable: true },
        { name: "plan", kind: "enum", options: [
          { value: "starter", label: "Starter" },
          { value: "pro", label: "Pro" },
          { value: "enterprise", label: "Enterprise" },
        ], sortable: true },
        { name: "mrr", label: "MRR", kind: "currency", align: "right", sortable: true },
        { name: "status", kind: "enum", options: [
          { value: "trialing", label: "Trialing", intent: "warning" },
          { value: "active", label: "Active", intent: "success" },
          { value: "past_due", label: "Past due", intent: "danger" },
          { value: "canceled", label: "Canceled", intent: "neutral" },
        ], sortable: true },
        { name: "renewsAt", kind: "date", sortable: true },
      ],
      seedCount: 18,
      seed: (i) => ({
        ref: code("SUB", i, 6),
        customer: pick(COMPANIES, i),
        plan: pick(["starter", "pro", "enterprise"], i),
        mrr: money(i, 10, 5000),
        status: pick(["trialing", "active", "active", "past_due", "canceled"], i),
        renewsAt: daysAgo(-i * 5),
      }),
    },
  ],
});
