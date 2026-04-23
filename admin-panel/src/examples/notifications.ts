import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE } from "./_factory/options";
import { daysAgo, hoursAgo, pick } from "./_factory/seeds";

export const notificationsPlugin = buildDomainPlugin({
  id: "notifications",
  label: "Notifications",
  icon: "Bell",
  section: SECTIONS.automation,
  order: 4,
  resources: [
    {
      id: "template",
      singular: "Template",
      plural: "Templates",
      icon: "Mail",
      path: "/notifications/templates",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "channel", kind: "enum", options: [
          { value: "email", label: "Email" },
          { value: "sms", label: "SMS" },
          { value: "push", label: "Push" },
          { value: "inapp", label: "In-app" },
        ], sortable: true },
        { name: "status", kind: "enum", options: STATUS_ACTIVE },
        { name: "updatedAt", kind: "datetime", sortable: true },
      ],
      seedCount: 10,
      seed: (i) => ({
        name: pick(["Welcome", "Invoice sent", "Password reset", "Booking confirmed", "Payment failed"], i),
        channel: pick(["email", "email", "sms", "push"], i),
        status: pick(["active", "active", "inactive"], i),
        updatedAt: daysAgo(i),
      }),
    },
    {
      id: "delivery",
      singular: "Delivery",
      plural: "Deliveries",
      icon: "Send",
      path: "/notifications/deliveries",
      readOnly: true,
      displayField: "id",
      fields: [
        { name: "template", kind: "text", sortable: true },
        { name: "recipient", kind: "text", sortable: true },
        { name: "status", kind: "enum", options: [
          { value: "sent", label: "Sent", intent: "success" },
          { value: "bounced", label: "Bounced", intent: "danger" },
          { value: "queued", label: "Queued", intent: "warning" },
        ], sortable: true },
        { name: "sentAt", kind: "datetime", sortable: true },
      ],
      seedCount: 22,
      seed: (i) => ({
        template: pick(["Welcome", "Invoice sent", "Password reset"], i),
        recipient: `user+${i}@example.com`,
        status: pick(["sent", "sent", "sent", "bounced", "queued"], i),
        sentAt: hoursAgo(i),
      }),
    },
  ],
});
