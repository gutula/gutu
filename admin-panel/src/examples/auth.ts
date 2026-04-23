import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { personEmail, personName, daysAgo, hoursAgo, pick } from "./_factory/seeds";

export const authPlugin = buildDomainPlugin({
  id: "auth",
  label: "Auth",
  icon: "Lock",
  section: SECTIONS.people,
  order: 1,
  resources: [
    {
      id: "user",
      singular: "User",
      plural: "Users",
      icon: "UserCircle",
      path: "/auth/users",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "email", kind: "email", required: true, sortable: true },
        { name: "role", kind: "enum", options: [
          { value: "admin", label: "Admin", intent: "danger" },
          { value: "member", label: "Member", intent: "info" },
          { value: "viewer", label: "Viewer", intent: "neutral" },
        ], sortable: true },
        { name: "mfa", label: "MFA", kind: "boolean" },
        { name: "lastLogin", kind: "datetime", sortable: true },
      ],
      seedCount: 22,
      seed: (i) => ({
        name: personName(i),
        email: personEmail(i, "gutu.dev"),
        role: pick(["admin", "member", "member", "member", "viewer"], i),
        mfa: i % 3 !== 0,
        lastLogin: hoursAgo(i * 4),
      }),
    },
    {
      id: "session",
      singular: "Session",
      plural: "Sessions",
      icon: "Fingerprint",
      path: "/auth/sessions",
      readOnly: true,
      displayField: "id",
      fields: [
        { name: "user", kind: "text", sortable: true },
        { name: "ip", kind: "text", width: 140 },
        { name: "userAgent", label: "User Agent", kind: "text" },
        { name: "createdAt", kind: "datetime", sortable: true },
      ],
      seedCount: 18,
      seed: (i) => ({
        user: personEmail(i, "gutu.dev"),
        ip: `10.0.${i}.${(i * 7) % 255}`,
        userAgent: pick(["Safari/17", "Chrome/131", "Firefox/133", "iOS Safari"], i),
        createdAt: daysAgo(i * 0.5),
      }),
    },
  ],
});
