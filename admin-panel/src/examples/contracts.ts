import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_LIFECYCLE } from "./_factory/options";
import { COMPANIES, code, daysAgo, money, pick } from "./_factory/seeds";

export const contractsPlugin = buildDomainPlugin({
  id: "contracts",
  label: "Contracts",
  icon: "FileSignature",
  section: SECTIONS.workspace,
  order: 4,
  resources: [
    {
      id: "contract",
      singular: "Contract",
      plural: "Contracts",
      icon: "FileSignature",
      path: "/contracts",
      displayField: "name",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "counterparty", kind: "text", sortable: true },
        { name: "value", kind: "currency", align: "right", sortable: true },
        { name: "status", kind: "enum", options: STATUS_LIFECYCLE, sortable: true },
        { name: "expiresAt", kind: "date", sortable: true },
      ],
      seedCount: 16,
      seed: (i) => ({
        name: `${pick(["MSA", "NDA", "Order Form", "DPA", "SOW"], i)} — ${pick(COMPANIES, i)}`,
        counterparty: pick(COMPANIES, i),
        value: money(i, 1000, 500_000),
        status: pick(["draft", "pending", "approved", "published"], i),
        expiresAt: daysAgo(-60 + (i * 13) % 365),
      }),
    },
  ],
});
void code; // suppress unused (kept for symmetry with other plugin files)
