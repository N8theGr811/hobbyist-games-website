"use client";

/** The server-selected language also controls interactive forms and shop dialogs. */
import { createContext, useContext } from "react";
import { getI18n, type Dictionary, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<Locale>("en");

export default function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useI18n(dictionary?: Dictionary) {
  return getI18n(useContext(LocaleContext), dictionary);
}
