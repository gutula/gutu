import * as React from "react";
import { RuntimeProvider } from "@/runtime/context";
import { AppShell } from "@/shell/AppShell";
import { usePluginHost } from "./PluginHost";
import { AuthGuard } from "./AuthGuard";
import { Spinner } from "@/primitives/Spinner";
import { ErrorState } from "@/admin-primitives/ErrorState";
import type { Plugin } from "@/contracts/plugin";

export interface AdminRootProps {
  plugins: readonly Plugin[];
}

export function AdminRoot({ plugins }: AdminRootProps) {
  return (
    <AuthGuard>
      <RuntimeProvider>
        <AdminInner plugins={plugins} />
      </RuntimeProvider>
    </AuthGuard>
  );
}

function AdminInner({ plugins }: AdminRootProps) {
  const { ready, registry, error } = usePluginHost(plugins);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <ErrorState
          title="Failed to start admin"
          description={error.message}
        />
      </div>
    );
  }
  if (!ready || !registry) {
    return (
      <div className="h-full w-full flex items-center justify-center gap-2 text-sm text-text-muted">
        <Spinner size={14} />
        Loading admin…
      </div>
    );
  }
  return <AppShell registry={registry} />;
}
