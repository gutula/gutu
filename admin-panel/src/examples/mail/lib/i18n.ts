/** Mail-plugin i18n loader.
 *
 *  Lookups are first-pass synchronous against an in-memory catalog so
 *  the renderer never blocks. Catalogs are loaded lazily by locale,
 *  cached forever. Falls back to English for any missing key. */

import en from "../messages/en.json";

type Catalog = Record<string, string>;

const catalogs: Record<string, Catalog> = { en };
let active = "en";

export function setLocale(locale: string): void {
  active = locale;
}

export async function loadLocale(locale: string): Promise<void> {
  if (catalogs[locale]) return;
  try {
    const mod = await import(`../messages/${locale}.json`);
    catalogs[locale] = (mod.default ?? mod) as Catalog;
  } catch {
    catalogs[locale] = {};
  }
}

export function t(key: string, params?: Record<string, string | number>): string {
  const cat = catalogs[active] ?? catalogs.en;
  const tmpl = cat[key] ?? catalogs.en[key] ?? key;
  if (!params) return tmpl;
  return tmpl.replace(/\{(\w+)\}/g, (_m, k) => String(params[k] ?? `{${k}}`));
}

export function locales(): string[] {
  return Object.keys(catalogs);
}
