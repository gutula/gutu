import * as React from "react";
import { useRuntime } from "@/runtime/context";
import type { MockBackend } from "@/runtime/mockBackend";
import type { Plugin } from "@/contracts/plugin";
import { buildRegistry, type AdminRegistry } from "@/shell/registry";

export interface PluginHostResult {
  ready: boolean;
  registry: AdminRegistry | null;
  error?: Error;
}

/** Activates a list of plugins against the runtime.
 *  - seeds resource stores from `__seed` metadata when a mock backend is used
 *  - calls plugin.onActivate lifecycle hooks (if present)
 *  - returns the aggregated registry once activation completes             */
export function usePluginHost(plugins: readonly Plugin[]): PluginHostResult {
  const runtime = useRuntime();
  const [state, setState] = React.useState<PluginHostResult>({
    ready: false,
    registry: null,
  });

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // 1. Seed demo data from plugins' resource.__seed metadata (opt-in).
        const backend = (runtime as { __backend?: MockBackend }).__backend;
        if (backend) {
          for (const p of plugins) {
            for (const r of p.admin?.resources ?? []) {
              const seed = (r as { __seed?: readonly Record<string, unknown>[] })
                .__seed;
              if (seed && Array.isArray(seed)) {
                backend.seed(r.id, seed);
              }
            }
          }
        }
        // 2. Activate
        for (const p of plugins) {
          if (p.onActivate) await p.onActivate();
        }
        if (cancelled) return;
        // 3. Build registry
        const registry = buildRegistry(plugins);
        setState({ ready: true, registry });
      } catch (err) {
        if (!cancelled) {
          setState({
            ready: false,
            registry: null,
            error: err instanceof Error ? err : new Error(String(err)),
          });
        }
      }
    })();

    return () => {
      cancelled = true;
      for (const p of plugins) {
        void p.onDeactivate?.();
      }
    };
  }, [plugins, runtime]);

  return state;
}
