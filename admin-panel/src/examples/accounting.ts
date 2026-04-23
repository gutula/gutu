import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_LIFECYCLE, CURRENCY } from "./_factory/options";
import { COMPANIES, code, daysAgo, money, pick } from "./_factory/seeds";
import { accountingCloseView } from "./accounting-pages";

export const accountingPlugin = buildDomainPlugin({
  id: "accounting",
  label: "Accounting",
  icon: "Receipt",
  section: SECTIONS.finance,
  order: 1,
  resources: [
    {
      id: "invoice",
      singular: "Invoice",
      plural: "Invoices",
      icon: "FileText",
      path: "/accounting/invoices",
      displayField: "number",
      pageSize: 12,
      defaultSort: { field: "issuedAt", dir: "desc" },
      fields: [
        { name: "number", label: "Number", kind: "text", required: true, sortable: true, width: 130 },
        { name: "customer", label: "Customer", kind: "text", required: true, sortable: true },
        { name: "status", label: "Status", kind: "enum", required: true, options: STATUS_LIFECYCLE, sortable: true, width: 120 },
        { name: "issuedAt", label: "Issued", kind: "date", required: true, sortable: true, width: 130 },
        { name: "dueAt", label: "Due", kind: "date", sortable: true, width: 130 },
        { name: "amount", label: "Amount", kind: "currency", required: true, align: "right", sortable: true, width: 120 },
        { name: "currency", label: "Currency", kind: "enum", options: CURRENCY, width: 100 },
        { name: "notes", kind: "textarea", formSection: "Notes" },
      ],
      seedCount: 24,
      seed: (i) => ({
        number: code("INV", i),
        customer: pick(COMPANIES, i),
        status: pick(["draft", "pending", "approved", "published", "archived"], i),
        issuedAt: daysAgo(i * 3),
        dueAt: daysAgo(i * 3 - 30),
        amount: money(i, 200, 20000),
        currency: pick(["USD", "EUR", "GBP"], i),
        notes: i % 4 === 0 ? "Net 30" : "",
      }),
    },
    {
      id: "bill",
      singular: "Bill",
      plural: "Bills",
      icon: "FileMinus",
      path: "/accounting/bills",
      displayField: "number",
      fields: [
        { name: "number", label: "Number", kind: "text", required: true, sortable: true },
        { name: "vendor", label: "Vendor", kind: "text", required: true, sortable: true },
        { name: "status", kind: "enum", required: true, options: STATUS_LIFECYCLE, sortable: true },
        { name: "dueAt", label: "Due", kind: "date", sortable: true },
        { name: "amount", kind: "currency", required: true, align: "right", sortable: true },
      ],
      seedCount: 18,
      seed: (i) => ({
        number: code("BILL", i),
        vendor: pick(COMPANIES, i + 2),
        status: pick(["pending", "approved", "published"], i),
        dueAt: daysAgo(i * 2 - 15),
        amount: money(i, 100, 8000),
      }),
    },
    {
      id: "account",
      singular: "Account",
      plural: "Chart of Accounts",
      icon: "BookOpen",
      path: "/accounting/accounts",
      fields: [
        { name: "code", kind: "text", required: true, sortable: true, width: 100 },
        { name: "name", kind: "text", required: true, sortable: true },
        {
          name: "type",
          kind: "enum",
          required: true,
          options: [
            { value: "asset", label: "Asset" },
            { value: "liability", label: "Liability" },
            { value: "equity", label: "Equity" },
            { value: "revenue", label: "Revenue" },
            { value: "expense", label: "Expense" },
          ],
          sortable: true,
        },
        { name: "balance", kind: "currency", align: "right", sortable: true },
      ],
      seedCount: 20,
      seed: (i) => ({
        code: String(1000 + i * 10),
        name: pick(
          ["Cash", "Accounts Receivable", "Inventory", "Accounts Payable", "Sales Revenue", "COGS", "Rent", "Utilities"],
          i,
        ),
        type: pick(["asset", "liability", "revenue", "expense"], i),
        balance: money(i, 500, 50000),
      }),
    },
  ],
  extraNav: [
    { id: "accounting.close.nav", label: "Month-end close", icon: "CalendarCheck", path: "/accounting/close", view: "accounting.close.view" },
  ],
  extraViews: [accountingCloseView],
});
