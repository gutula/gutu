import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { code, daysAgo, money, personName, pick } from "./_factory/seeds";

export const paymentsPlugin = buildDomainPlugin({
  id: "payments",
  label: "Payments",
  icon: "CreditCard",
  section: SECTIONS.finance,
  order: 2,
  resources: [
    {
      id: "payment",
      singular: "Payment",
      plural: "Payments",
      icon: "CreditCard",
      path: "/finance/payments",
      displayField: "reference",
      fields: [
        { name: "reference", kind: "text", required: true, sortable: true, width: 140 },
        { name: "payer", kind: "text", sortable: true },
        { name: "amount", kind: "currency", align: "right", required: true, sortable: true },
        { name: "method", kind: "enum", options: [
          { value: "card", label: "Card" },
          { value: "ach", label: "ACH" },
          { value: "wire", label: "Wire" },
          { value: "crypto", label: "Crypto" },
        ] },
        { name: "status", kind: "enum", options: [
          { value: "succeeded", label: "Succeeded", intent: "success" },
          { value: "failed", label: "Failed", intent: "danger" },
          { value: "refunded", label: "Refunded", intent: "warning" },
          { value: "pending", label: "Pending", intent: "neutral" },
        ], sortable: true },
        { name: "paidAt", kind: "datetime", sortable: true },
      ],
      seedCount: 20,
      seed: (i) => ({
        reference: code("PAY", i, 6),
        payer: personName(i),
        amount: money(i, 20, 5000),
        method: pick(["card", "ach", "wire", "card"], i),
        status: pick(["succeeded", "succeeded", "succeeded", "failed", "refunded"], i),
        paidAt: daysAgo(i),
      }),
    },
  ],
});
