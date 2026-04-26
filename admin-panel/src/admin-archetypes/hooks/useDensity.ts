import * as React from "react";
import type { Density } from "../types";

const STORAGE_KEY = "gutu.ui.density";

/** Read + persist the user's preferred density. */
export function useDensity(initial?: Density): [Density, (next: Density) => void] {
  const [density, setDensityState] = React.useState<Density>(() => {
    if (typeof window === "undefined") return initial ?? "comfortable";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "comfortable" || stored === "cozy" || stored === "compact") {
      return stored;
    }
    return initial ?? "comfortable";
  });

  const setDensity = React.useCallback((next: Density) => {
    setDensityState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
      // Notify other tabs and any listeners in this tab.
      try {
        window.dispatchEvent(
          new StorageEvent("storage", { key: STORAGE_KEY, newValue: next }),
        );
      } catch {
        /* StorageEvent constructor unsupported in some old browsers; ignore. */
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      if (
        e.newValue === "comfortable" ||
        e.newValue === "cozy" ||
        e.newValue === "compact"
      ) {
        setDensityState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return [density, setDensity];
}
