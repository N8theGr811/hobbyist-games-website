/** Public pages and supported languages, shared by routing and search metadata. */
export type Locale = "en" | "pt-BR";
export const LOCALES: Locale[] = ["en", "pt-BR"];
export const PAGE_PATHS = ["/", "/guide", "/glossary", "/shop", "/privacy", "/credits"];

export const LANGUAGE_COOKIE = "submission_saga_language";
export const LANGUAGE_QUERY = "lang";

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "pt-BR";
}

/** Only site pages have language variants. Media, APIs and community redirects do not. */
export function localePath(href: string, locale: Locale): string {
  const unprefixed = href.replace(/^\/(?:en|pt-BR)(?=\/|[?#]|$)/, "") || "/";
  const base = unprefixed.split(/[?#]/)[0] || "/";
  if (!PAGE_PATHS.includes(base)) return href;
  const suffix = unprefixed.startsWith("/") ? unprefixed : `/${unprefixed}`;
  return locale === "pt-BR" ? `/pt-BR${base === "/" ? suffix.slice(1) : suffix}` : suffix;
}
