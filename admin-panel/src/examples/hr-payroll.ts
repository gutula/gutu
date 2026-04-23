import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { daysAgo, personEmail, personName, pick, money } from "./_factory/seeds";
import { hrHeadcountView } from "./hr-payroll-pages";

export const hrPayrollPlugin = buildDomainPlugin({
  id: "hr-payroll",
  label: "HR & Payroll",
  icon: "UsersRound",
  section: SECTIONS.people,
  order: 2,
  resources: [
    {
      id: "employee",
      singular: "Employee",
      plural: "Employees",
      icon: "UserCircle2",
      path: "/hr/employees",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "email", kind: "email", required: true },
        { name: "department", kind: "enum", options: [
          { value: "eng", label: "Engineering" },
          { value: "ops", label: "Operations" },
          { value: "sales", label: "Sales" },
          { value: "support", label: "Support" },
          { value: "hr", label: "HR" },
        ], sortable: true },
        { name: "role", kind: "text", sortable: true },
        { name: "hiredAt", kind: "date", sortable: true },
      ],
      seedCount: 18,
      seed: (i) => ({
        name: personName(i),
        email: personEmail(i, "gutu.dev"),
        department: pick(["eng", "ops", "sales", "support", "hr"], i),
        role: pick(["Engineer", "Designer", "Manager", "Lead", "Specialist"], i),
        hiredAt: daysAgo(i * 60),
      }),
    },
    {
      id: "payroll",
      singular: "Payroll Run",
      plural: "Payroll Runs",
      icon: "Banknote",
      path: "/hr/payroll",
      displayField: "period",
      fields: [
        { name: "period", kind: "text", required: true, sortable: true },
        { name: "employees", kind: "number", align: "right" },
        { name: "gross", kind: "currency", align: "right", sortable: true },
        { name: "status", kind: "enum", options: [
          { value: "pending", label: "Pending", intent: "warning" },
          { value: "paid", label: "Paid", intent: "success" },
        ] },
        { name: "processedAt", kind: "date", sortable: true },
      ],
      seedCount: 8,
      seed: (i) => ({
        period: `2026-${String(i + 1).padStart(2, "0")}`,
        employees: 42 + (i % 10),
        gross: money(i, 50000, 200000),
        status: pick(["paid", "paid", "pending"], i),
        processedAt: daysAgo(i * 30),
      }),
    },
  ],
  extraNav: [
    { id: "hr.headcount.nav", label: "Headcount", icon: "Users", path: "/hr/headcount", view: "hr-payroll.headcount.view" },
  ],
  extraViews: [hrHeadcountView],
});
