import * as React from "react";
import type { ArchetypeId, Density } from "../types";
import { cn } from "@/lib/cn";

export interface PageProps {
  /** Archetype id is set as a data attribute on the page root for analytics
   *  and theme-overrides. The shell does NOT change behaviour from it. */
  archetype: ArchetypeId;
  /** When true, the shell skips the outer max-width container. The page
   *  becomes edge-to-edge — used by editor canvas, full-bleed dashboards,
   *  POS terminals. */
  fullBleed?: boolean;
  /** Default density for this page. User pref overrides. */
  density?: Density;
  /** Stable id for telemetry / saved-views. Defaults to the page descriptor id. */
  id?: string;
  /** ARIA label for the page region. */
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
}

const DENSITY_CLASS: Record<Density, string> = {
  comfortable: "data-[density=comfortable]:[--row-h:44px]",
  cozy: "data-[density=cozy]:[--row-h:36px]",
  compact: "data-[density=compact]:[--row-h:32px]",
};

/** Root container that every archetype wraps its content in. Does not own
 *  any chrome — slots do that. */
export function Page({
  archetype,
  fullBleed = false,
  density,
  id,
  ariaLabel,
  className,
  children,
}: PageProps) {
  const resolvedDensity = useEffectiveDensity(density);
  return (
    <div
      data-archetype={archetype}
      data-full-bleed={fullBleed ? "true" : "false"}
      data-density={resolvedDensity}
      data-page-id={id}
      role="region"
      aria-label={ariaLabel}
      className={cn(
        "flex flex-col min-h-0 w-full",
        DENSITY_CLASS[resolvedDensity],
        fullBleed ? "h-full" : "gap-4",
        className,
      )}
      style={
        {
          // Make density visible via CSS var to descendants that need it.
          ["--page-density" as string]: resolvedDensity,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

/** Read user-preferred density from localStorage with prop fallback. */
function useEffectiveDensity(propDensity?: Density): Density {
  const get = React.useCallback((): Density => {
    if (typeof window === "undefined") return propDensity ?? "comfortable";
    const stored = window.localStorage.getItem("gutu.ui.density");
    if (stored === "comfortable" || stored === "cozy" || stored === "compact") {
      return stored;
    }
    return propDensity ?? "comfortable";
  }, [propDensity]);

  const [d, setD] = React.useState<Density>(get);

  React.useEffect(() => {
    setD(get());
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === "gutu.ui.density") setD(get());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [get]);

  return d;
}
