/** Synthetic host-plugin that registers the resource catalog for the
 *  bundled example application.
 *
 *  Why this exists: the framework intentionally treats every resource
 *  as plugin-owned, but the shipped example app (`admin-panel/src/
 *  examples`) seeds CRM, booking, support, projects, etc. directly
 *  into the records table without a backing backend plugin. Without a
 *  declaration, the resource-write gate would 404 every example POST
 *  on a fresh database.
 *
 *  Adding this entry — loaded ALONGSIDE the real plugins, NOT before —
 *  keeps the catalog gate's source of truth uniform: it's always the
 *  union of plugin-declared `resources[]`. Drop the example app at
 *  build time and this plugin disappears with it; the gate adapts
 *  automatically.
 *
 *  Real plugins shipped via `gutuPlugins` in package.json continue to
 *  declare their own resources directly on their `HostPlugin` export. */

import type { HostPlugin } from "./plugin-contract";

/** Resource ids the example application's frontend pages POST to.
 *  Grouped by namespace for readability; flat for registration. The
 *  shape is stable across releases — the example app's seed factories
 *  drive these. */
const EXAMPLE_RESOURCE_IDS: ReadonlyArray<string> = [
  // AI demo set
  "ai-assist.memory",
  "ai-assist.thread",
  "ai-core.model",
  "ai-core.prompt",
  "ai-evals.case",
  "ai-evals.run",
  "ai-evals.suite",
  "ai-rag.collection",
  "ai-skills.skill",

  // Analytics surface (shell-level metrics)
  "analytics.arr",
  "analytics.cohort",
  "analytics.event",
  "analytics.revenue-mix",

  // Asset register
  "assets.asset",
  "assets.asset-transfer",
  "assets.assignment",
  "assets.audit",
  "assets.depreciation-entry",
  "assets.disposal",

  // Audit log surface
  "audit.event",

  // Bookings demo
  "booking.availability-rule",
  "booking.booking",
  "booking.kpi",
  "booking.location",
  "booking.resource",
  "booking.service",
  "booking.staff",
  "booking.waitlist",

  // Business portals
  "business-portals.portal",

  // Community feed
  "community.post",
  "community.report",
  "community.space",

  // Company builder
  "company-builder.company",

  // Content / knowledge
  "content.article",
  "knowledge.article",

  // Contracts
  "contracts.contract",

  // CRM
  "crm.activity",
  "crm.appointment",
  "crm.campaign",
  "crm.competitor",
  "crm.contact",
  "crm.contract",
  "crm.lead",
  "crm.market-segment",
  "crm.note",
  "crm.opportunity",
  "crm.sales-stage",

  // Dashboards
  "dashboards.board",

  // Execution workspaces
  "execution-workspaces.workspace",

  // Field service
  "field-service.customer-site",
  "field-service.job",
  "field-service.parts-request",
  "field-service.parts-usage",
  "field-service.quote",
  "field-service.service-contract",
  "field-service.technician",
  "field-service.vehicle",

  // Files
  "files.file",

  // HR demo (legacy single-namespace surface alongside hr-payroll)
  "hr.headcount",

  // Issues & releases
  "issues.issue",
  "issues.issue-comment",
  "issues.issue-watcher",
  "issues.release",

  // Jobs queue UI
  "jobs.job",

  // Maintenance / CMMS
  "maintenance-cmms.asset-kpi",
  "maintenance-cmms.checklist",
  "maintenance-cmms.downtime",
  "maintenance-cmms.pm-schedule",
  "maintenance-cmms.spare-part",
  "maintenance-cmms.work-order",

  // Org / tenant
  "org-tenant.tenant",

  // Page builder
  "page-builder.page",

  // Party-relationships graph
  "party-relationships.entity",
  "party-relationships.relationship",

  // Payments
  "payments.payment",

  // Platform-shell metadata
  "platform.config",
  "platform.metric",
  "platform.notification",
  "platform.onboarding-step",
  "platform.release",
  "platform.search-index",

  // Customer/partner portal sessions
  "portal.session",

  // POS
  "pos.sale",
  "pos.shift",
  "pos.terminal",

  // Procurement
  "procurement.approval-rule",
  "procurement.contract",
  "procurement.goods-receipt",
  "procurement.purchase-order",
  "procurement.requisition",
  "procurement.rfq",
  "procurement.supplier",

  // Product catalog
  "product-catalog.product",

  // Projects
  "projects.milestone",
  "projects.project",
  "projects.project-member",
  "projects.risk",
  "projects.sprint",
  "projects.task",
  "projects.time-log",

  // Quality
  "quality.audit",
  "quality.calibration",
  "quality.capa",
  "quality.defect",
  "quality.inspection",
  "quality.ncr",

  // Role / policy
  "role-policy.policy",
  "role-policy.role",

  // Runtime bridge
  "runtime-bridge.channel",

  // Subscriptions
  "subscriptions.subscription",

  // Support / service
  "support-service.canned-response",
  "support-service.csat-response",
  "support-service.escalation",
  "support-service.kb-article",
  "support-service.service-contract",
  "support-service.sla-policy",
  "support-service.ticket",
  "support-service.warranty-claim",

  // Traceability
  "traceability.lot",

  // User directory
  "user-directory.person",
];

/** The synthetic plugin record. Declares only the catalog contribution
 *  — no migrate/routes/start hooks, because the example app already
 *  ships its data via the shell's seed factory. */
export const exampleAppHostPlugin: HostPlugin = {
  id: "example-app",
  version: "1.0.0",
  manifest: {
    label: "Bundled example application",
    description:
      "Catalog declarations for the demo CRM/Sales/Booking/Support/etc. resources that ship with the framework's example app.",
    vendor: "gutu",
  },
  resources: EXAMPLE_RESOURCE_IDS,
};
