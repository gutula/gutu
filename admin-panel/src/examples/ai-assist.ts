import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { daysAgo, hoursAgo, pick } from "./_factory/seeds";

export const aiAssistPlugin = buildDomainPlugin({
  id: "ai-assist",
  label: "AI Assist",
  icon: "Bot",
  section: SECTIONS.ai,
  order: 5,
  resources: [
    {
      id: "thread",
      singular: "Thread",
      plural: "Threads",
      icon: "MessagesSquare",
      path: "/ai/assist/threads",
      displayField: "title",
      fields: [
        { name: "title", kind: "text", required: true, sortable: true },
        { name: "owner", kind: "text", sortable: true },
        { name: "messages", kind: "number", align: "right" },
        { name: "lastActive", kind: "datetime", sortable: true },
      ],
      seedCount: 14,
      seed: (i) => ({
        title: pick(
          ["Draft Q3 OKRs", "Rewrite landing page", "Find duplicates in CRM", "Summarize interview", "Plan migration"],
          i,
        ),
        owner: pick(["sam@gutu.dev", "alex@gutu.dev", "taylor@gutu.dev"], i),
        messages: 2 + ((i * 3) % 40),
        lastActive: hoursAgo(i * 2),
      }),
    },
    {
      id: "memory",
      singular: "Memory",
      plural: "Memories",
      icon: "Bookmark",
      path: "/ai/assist/memories",
      readOnly: true,
      fields: [
        { name: "summary", kind: "text", sortable: true },
        { name: "type", kind: "enum", options: [
          { value: "user", label: "User" },
          { value: "project", label: "Project" },
          { value: "feedback", label: "Feedback" },
        ] },
        { name: "createdAt", kind: "datetime", sortable: true },
      ],
      seedCount: 18,
      seed: (i) => ({
        summary: pick([
          "User prefers terse responses",
          "Accounting invoices use Net 30",
          "Company is Gutu framework workspace",
          "Booking confirmations go to ops@",
        ], i),
        type: pick(["user", "project", "feedback"], i),
        createdAt: daysAgo(i * 2),
      }),
    },
  ],
});
