import { ui, defaultLang, languages, type Lang } from "./ui";

export { languages, defaultLang };
export type { Lang };

type TranslationKey = keyof typeof ui[typeof defaultLang];

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split("/");
  if (first && first in ui) return first as Lang;
  return defaultLang;
}

/**
 * Pick the active locale.
 * Prefers Astro.currentLocale when provided (set by the i18n middleware),
 * falls back to URL parsing (useful when middleware hasn't run, e.g. rewrite fallback).
 */
export function pickLang(
  currentLocale: string | undefined,
  url: URL,
): Lang {
  if (currentLocale && currentLocale in ui) return currentLocale as Lang;
  return getLangFromUrl(url);
}

export function useTranslations(lang: Lang) {
  return function t(
    key: TranslationKey,
    vars?: Record<string, string | number>,
  ): string {
    const dict = ui[lang] ?? ui[defaultLang];
    let value =
      (dict as Record<string, string>)[key] ??
      (ui[defaultLang] as Record<string, string>)[key] ??
      String(key);
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        value = value.replace(`{${k}}`, String(v));
      }
    }
    return value;
  };
}

/**
 * Given the current pathname and a target locale, return the equivalent pathname for the target locale.
 * English at root (no prefix), Greek at /el/ prefix.
 */
export function switchLocaleHref(pathname: string, target: Lang): string {
  const segments = pathname.split("/").filter(Boolean);
  const isPrefixed = segments[0] === "el";
  const rest = isPrefixed ? segments.slice(1) : segments;

  if (target === defaultLang) {
    return "/" + (rest.length ? rest.join("/") : "");
  }
  return "/" + target + (rest.length ? "/" + rest.join("/") : "/");
}

/**
 * Prefix an internal href with the current locale prefix.
 * Pass a path starting with "/" (e.g. "/collections/walking-aids") and the function returns
 * "/el/collections/walking-aids" for Greek, or the original path for English.
 */
export function localizeHref(path: string, lang: Lang): string {
  if (lang === defaultLang) return path;
  if (!path.startsWith("/")) return "/" + lang + "/" + path;
  return "/" + lang + path;
}
