/** Shared locale paths and small website translations. Game text is exported separately. */
import type { Metadata } from "next";
import common from "./i18n/common.pt-BR.json";
import { SITE_URL } from "./site";

import { PAGE_PATHS, type Locale } from "./locales";
export { LOCALES, PAGE_PATHS, type Locale } from "./locales";
export type Dictionary = Readonly<Record<string, string>>;

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

export function getI18n(value: string, dictionary: Dictionary = {}) {
  const locale: Locale = value === "pt-BR" ? "pt-BR" : "en";
  const translations: Dictionary = common;
  function t(source: string, values: Record<string, string | number> = {}): string {
    const translated = locale === "pt-BR" ? dictionary[source] ?? translations[source] ?? source : source;
    return translated.replace(/\{(\w+)\}/g, (token, key: string) => key in values ? String(values[key]) : token);
  }
  return { locale, t, path: (href: string): string => localePath(href, locale) };
}

/** Each language names itself as canonical and points to its matching translation. */
export function pageMetadata(locale: string, pathname: string, copy: { title: string; description: string }): Metadata {
  const canonical = localePath(pathname, locale === "pt-BR" ? "pt-BR" : "en");
  return {
    ...copy,
    alternates: {
      canonical,
      languages: { en: localePath(pathname, "en"), "pt-BR": localePath(pathname, "pt-BR"), "x-default": localePath(pathname, "en") },
    },
    openGraph: {
      ...copy,
      url: `${SITE_URL}${canonical === "/" ? "" : canonical}`,
      locale: locale === "pt-BR" ? "pt_BR" : "en_US",
      alternateLocale: locale === "pt-BR" ? "en_US" : "pt_BR",
      images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
    },
  };
}
