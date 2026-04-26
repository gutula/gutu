import * as React from "react";
import type { LoadState } from "../types";

interface CacheEntry<T> {
  data?: T;
  error?: unknown;
  promise?: Promise<T>;
  expires?: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

export interface SwrResult<T> {
  data?: T;
  error?: unknown;
  state: LoadState;
  isValidating: boolean;
  refetch: () => Promise<T | undefined>;
}

export interface SwrOptions {
  /** Time-to-live for cached data, in ms. After TTL the next reader triggers
   *  a background refetch but still gets the cached value immediately. */
  ttlMs?: number;
  /** When false, never refetch automatically. */
  revalidate?: boolean;
}

/** Stale-while-revalidate fetcher tuned for KPI tiles, rail cards, and any
 *  read-mostly widget. Returns cached data on revisit, refetches in
 *  background, surfaces error/empty/loading states uniformly. */
export function useSwr<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  options: SwrOptions = {},
): SwrResult<T> {
  const { ttlMs = 60_000, revalidate = true } = options;

  const fetcherRef = React.useRef(fetcher);
  fetcherRef.current = fetcher;

  const [, force] = React.useReducer((n: number) => n + 1, 0);
  const isValidatingRef = React.useRef(false);

  const run = React.useCallback(async (): Promise<T | undefined> => {
    if (!key) return undefined;
    const entry = (cache.get(key) ?? {}) as CacheEntry<T>;
    isValidatingRef.current = true;
    force();
    try {
      const promise = fetcherRef.current();
      entry.promise = promise;
      cache.set(key, entry as CacheEntry<unknown>);
      const data = await promise;
      entry.data = data;
      entry.error = undefined;
      entry.expires = Date.now() + ttlMs;
      cache.set(key, entry as CacheEntry<unknown>);
      isValidatingRef.current = false;
      force();
      return data;
    } catch (error) {
      entry.error = error;
      cache.set(key, entry as CacheEntry<unknown>);
      isValidatingRef.current = false;
      force();
      return undefined;
    }
  }, [key, ttlMs]);

  React.useEffect(() => {
    if (!key) return;
    const entry = (cache.get(key) ?? {}) as CacheEntry<T>;
    const stale = !entry.expires || entry.expires < Date.now();
    if (entry.data === undefined || (stale && revalidate)) {
      void run();
    }
  }, [key, revalidate, run]);

  const entry = key ? ((cache.get(key) ?? {}) as CacheEntry<T>) : ({} as CacheEntry<T>);
  const data = entry.data;
  const error = entry.error;

  let state: LoadState;
  if (data !== undefined) state = { status: "ready" };
  else if (error !== undefined) state = { status: "error", error };
  else if (isValidatingRef.current) state = { status: "loading" };
  else state = { status: "idle" };

  return {
    data,
    error,
    state,
    isValidating: isValidatingRef.current,
    refetch: run,
  };
}

/** Clear cached SWR entries that match a prefix — used when a write
 *  invalidates downstream KPIs or rail cards. */
export function invalidateSwr(prefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}
