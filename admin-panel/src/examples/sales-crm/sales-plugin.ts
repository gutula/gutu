import { z } from "zod";
import { definePlugin, defineResource } from "@/builders";
import {
  salesDealDetailView,
  salesDealsView,
  salesForecastView,
  salesFunnelView,
  salesLeaderboardView,
  salesOverviewView,
  salesPipelineView,
  salesQuotesView,
  salesRevenueView,
} from "./sales-pages";
import { DEALS, QUOTES } from "./data";

const DealSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  account: z.string(),
  contact: z.string(),
  owner: z.string(),
  stage: z.enum(["qualify", "proposal", "negotiate", "won", "lost"]),
  amount: z.number(),
  probability: z.number(),
  closeAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const dealResource = defineResource({
  id: "sales.deal",
  singular: "Deal",
  plural: "Deals",
  schema: DealSchema,
  displayField: "name",
  searchable: ["name", "account", "code"],
  icon: "Handshake",
});
(dealResource as unknown as { __seed: Record<string, unknown>[] }).__seed =
  DEALS as unknown as Record<string, unknown>[];

const QuoteSchema = z.object({
  id: z.string(),
  number: z.string(),
  account: z.string(),
  amount: z.number(),
  status: z.enum(["draft", "sent", "accepted", "expired"]),
  expiresAt: z.string(),
});

const quoteResource = defineResource({
  id: "sales.quote",
  singular: "Quote",
  plural: "Quotes",
  schema: QuoteSchema,
  displayField: "number",
  icon: "FileText",
});
(quoteResource as unknown as { __seed: Record<string, unknown>[] }).__seed =
  QUOTES as unknown as Record<string, unknown>[];

export const salesPlugin = definePlugin({
  id: "sales",
  label: "Sales",
  icon: "TrendingUp",
  description: "Deals, quotes, forecast, and leaderboard.",
  version: "0.2.0",
  admin: {
    navSections: [{ id: "sales", label: "Sales & CRM", order: 10 }],
    nav: [
      { id: "sales.overview", label: "Sales overview", icon: "LayoutDashboard", path: "/sales", view: "sales.overview.view", section: "sales", order: 20 },
      { id: "sales.deals", label: "Deals", icon: "Handshake", path: "/sales/deals", view: "sales.deals.view", section: "sales", order: 21 },
      { id: "sales.pipeline", label: "Pipeline", icon: "Layers", path: "/sales/pipeline", view: "sales.pipeline.view", section: "sales", order: 22 },
      { id: "sales.forecast", label: "Forecast", icon: "Target", path: "/sales/forecast", view: "sales.forecast.view", section: "sales", order: 23 },
      { id: "sales.leaderboard", label: "Leaderboard", icon: "Trophy", path: "/sales/leaderboard", view: "sales.leaderboard.view", section: "sales", order: 24 },
      { id: "sales.revenue", label: "Revenue", icon: "TrendingUp", path: "/sales/revenue", view: "sales.revenue.view", section: "sales", order: 25 },
      { id: "sales.funnel", label: "Funnel", icon: "GitFork", path: "/sales/funnel", view: "sales.funnel.view", section: "sales", order: 26 },
      { id: "sales.quotes", label: "Quotes", icon: "FileText", path: "/sales/quotes", view: "sales.quotes.view", section: "sales", order: 27 },
    ],
    resources: [dealResource, quoteResource],
    views: [
      salesOverviewView,
      salesDealsView,
      salesPipelineView,
      salesForecastView,
      salesLeaderboardView,
      salesRevenueView,
      salesFunnelView,
      salesQuotesView,
      salesDealDetailView,
    ],
    commands: [
      { id: "sales.go.overview", label: "Sales: Overview", icon: "LayoutDashboard", run: () => { window.location.hash = "/sales"; } },
      { id: "sales.go.pipeline", label: "Sales: Pipeline", icon: "Layers", run: () => { window.location.hash = "/sales/pipeline"; } },
      { id: "sales.go.forecast", label: "Sales: Forecast", icon: "Target", run: () => { window.location.hash = "/sales/forecast"; } },
      { id: "sales.go.leaderboard", label: "Sales: Leaderboard", icon: "Trophy", run: () => { window.location.hash = "/sales/leaderboard"; } },
    ],
  },
});
