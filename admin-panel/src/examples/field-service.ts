import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_TICKET, PRIORITY } from "./_factory/options";
import { CITIES, code, daysAgo, personName, pick } from "./_factory/seeds";
import { fieldServiceCalendarView } from "./field-service-pages";

export const fieldServicePlugin = buildDomainPlugin({
  id: "field-service",
  label: "Field Service",
  icon: "Truck",
  section: SECTIONS.operations,
  order: 3,
  resources: [
    {
      id: "job",
      singular: "Job",
      plural: "Jobs",
      icon: "Wrench",
      path: "/field-service/jobs",
      displayField: "code",
      fields: [
        { name: "code", kind: "text", required: true, sortable: true, width: 120 },
        { name: "customer", kind: "text", sortable: true },
        { name: "technician", kind: "text", sortable: true },
        { name: "location", kind: "text" },
        { name: "priority", kind: "enum", options: PRIORITY, sortable: true },
        { name: "status", kind: "enum", options: STATUS_TICKET, sortable: true },
        { name: "scheduledAt", kind: "datetime", sortable: true },
      ],
      seedCount: 18,
      seed: (i) => ({
        code: code("FS", i),
        customer: personName(i),
        technician: pick(["Taylor", "Jordan", "Casey", "Morgan"], i),
        location: pick(CITIES, i),
        priority: pick(["low", "normal", "high", "urgent"], i),
        status: pick(["open", "in_progress", "resolved"], i),
        scheduledAt: daysAgo(i - 3),
      }),
    },
  ],
  extraNav: [
    { id: "field-service.calendar.nav", label: "Calendar", icon: "Calendar", path: "/field-service/calendar", view: "field-service.calendar.view" },
  ],
  extraViews: [fieldServiceCalendarView],
});
