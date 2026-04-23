import { buildDomainPlugin } from "./_factory/buildDomainPlugin";
import { SECTIONS } from "./_factory/sections";
import { STATUS_ACTIVE } from "./_factory/options";
import { code, daysAgo, pick } from "./_factory/seeds";
import { aiPlaygroundView } from "./ai-core-pages";

export const aiCorePlugin = buildDomainPlugin({
  id: "ai-core",
  label: "AI Core",
  icon: "Sparkles",
  section: SECTIONS.ai,
  order: 1,
  resources: [
    {
      id: "model",
      singular: "Model",
      plural: "Models",
      icon: "Cpu",
      path: "/ai/models",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "provider", kind: "enum", required: true, sortable: true, options: [
          { value: "anthropic", label: "Anthropic" },
          { value: "openai", label: "OpenAI" },
          { value: "google", label: "Google" },
          { value: "local", label: "Local" },
        ] },
        { name: "contextWindow", label: "Context", kind: "number", align: "right", sortable: true },
        { name: "status", kind: "enum", required: true, options: STATUS_ACTIVE },
      ],
      seedCount: 12,
      seed: (i) => ({
        name: pick(["claude-opus-4-7", "claude-sonnet-4-6", "gpt-4o", "gemini-2.5-pro", "llama-3.1-70b"], i),
        provider: pick(["anthropic", "anthropic", "openai", "google", "local"], i),
        contextWindow: pick([1_000_000, 200_000, 128_000, 2_000_000, 8192], i),
        status: pick(["active", "inactive"], i),
      }),
    },
    {
      id: "prompt",
      singular: "Prompt",
      plural: "Prompts",
      icon: "MessageSquare",
      path: "/ai/prompts",
      fields: [
        { name: "name", kind: "text", required: true, sortable: true },
        { name: "version", kind: "text", width: 90 },
        { name: "updatedAt", label: "Updated", kind: "datetime", sortable: true, width: 180 },
        { name: "body", kind: "textarea", formSection: "Body", required: true },
      ],
      seedCount: 10,
      seed: (i) => ({
        name: pick(["summarize-invoice", "classify-intent", "extract-contact", "rewrite-support", "translate-copy"], i),
        version: `v${1 + (i % 5)}`,
        updatedAt: daysAgo(i),
        body: "You are a helpful assistant…",
      }),
    },
  ],
  extraNav: [
    { id: "ai.playground.nav", label: "Playground", icon: "MessageCircle", path: "/ai/playground", view: "ai-core.playground.view" },
  ],
  extraViews: [aiPlaygroundView],
});
