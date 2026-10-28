"use client";

/** A real link keeps the current page, query and anchor when changing languages. */
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { localePath } from "@/lib/i18n";
import { useI18n } from "./LocaleProvider";

function subscribeLocation(callback: () => void): () => void {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

export default function LanguageSwitch() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const suffix = useSyncExternalStore(subscribeLocation, () => window.location.search + window.location.hash, () => "");
  const target = locale === "en" ? "pt-BR" : "en";
  const label = target === "pt-BR" ? "Português (Brasil)" : "English";
  return <a
    href={localePath(pathname, target) + suffix}
    hrefLang={target}
    lang={target}
    aria-label={label}
    title={label}
    className="inline-flex min-h-11 shrink-0 items-center border-l border-steam-gold/30 pl-3 text-xs font-medium text-cream/75 hover:text-steam-gold"
  >{target === "pt-BR" ? "PT-BR" : "EN"}</a>;
}
