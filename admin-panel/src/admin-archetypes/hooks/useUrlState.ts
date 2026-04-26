import * as React from "react";

/** Reads/writes the hash query of the current URL.
 *
 *  Routes use the format `#/path?key=value&other=...`. This hook gives a
 *  reactive view over that querystring so that filter/view/period/group/
 *  sort/page/tab state round-trips through the URL — supporting
 *  deep-linking and back-button restore for free.
 *
 *  Each archetype that wants URL state calls this with a key list. Values
 *  are normalised to strings; serialise complex values yourself.
 */
export function useUrlState<K extends string>(keys: readonly K[]) {
  const get = React.useCallback((): Record<K, string | undefined> => {
    if (typeof window === "undefined")
      return Object.fromEntries(keys.map((k) => [k, undefined])) as Record<
        K,
        string | undefined
      >;
    const hash = window.location.hash.slice(1);
    const q = hash.includes("?") ? hash.slice(hash.indexOf("?") + 1) : "";
    const params = new URLSearchParams(q);
    const out: Record<string, string | undefined> = {};
    for (const k of keys) {
      out[k] = params.get(k) ?? undefined;
    }
    return out as Record<K, string | undefined>;
  }, [keys]);

  const [state, setState] = React.useState(get);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const onHashChange = () => setState(get());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [get]);

  const set = React.useCallback(
    (patch: Partial<Record<K, string | undefined | null>>, replace = false) => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.slice(1);
      const path = hash.includes("?") ? hash.slice(0, hash.indexOf("?")) : hash;
      const q = hash.includes("?") ? hash.slice(hash.indexOf("?") + 1) : "";
      const params = new URLSearchParams(q);
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === undefined || v === "") {
          params.delete(k);
        } else {
          params.set(k, String(v));
        }
      }
      const next = "#" + path + (params.size ? "?" + params.toString() : "");
      if (replace) {
        window.history.replaceState(null, "", next);
        setState(get());
      } else {
        window.location.hash = next.slice(1);
      }
    },
    [get],
  );

  return [state, set] as const;
}
