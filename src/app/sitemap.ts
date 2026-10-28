/** Both language versions share timestamps and point to their translated counterparts. */
import type { MetadataRoute } from "next";
import { getShopConfig } from "@/lib/shop";
import { SITE_URL } from "@/lib/site";
import { LOCALES, PAGE_PATHS, localePath } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGE_PATHS.filter(path => path !== "/shop" || getShopConfig()).flatMap(path =>
    LOCALES.map(locale => ({
      url: `${SITE_URL}${localePath(path, locale)}`,
      lastModified,
      changeFrequency: path === "/" || path === "/shop" ? "weekly" as const : "monthly" as const,
      priority: path === "/" ? 1 : path === "/guide" ? 0.8 : path === "/shop" ? 0.7 : path === "/glossary" ? 0.6 : 0.3,
      alternates: { languages: { en: `${SITE_URL}${localePath(path, "en")}`, "pt-BR": `${SITE_URL}${localePath(path, "pt-BR")}`, "x-default": `${SITE_URL}${localePath(path, "en")}` } },
    })),
  );
}
