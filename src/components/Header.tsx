import { getI18n, type Locale } from "@/lib/i18n";
import Link from "next/link";
import StoreLinks from "./StoreLinks";
import LanguageSwitch from "./LanguageSwitch";

export default function Header({ locale = "en" }: { locale?: Locale }) {
  const { t, path } = getI18n(locale);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-2.5 bg-steam-navy shadow-[0_2px_16px_rgba(0,0,0,0.5)] border-b-2 border-steam-gold/40 sm:px-6 md:px-12">
      {/* The v3 wordmark set in markup rather than the PNG, whose double
          rule is baked in: one thin gold squircle, like the store buttons. */}
      <Link
        href={path("/")}
        aria-label="Hobbyist Games"
        className="flex shrink-0 items-center gap-2 sm:gap-2.5 rounded-[12px] border border-[#e8be3f] bg-steam-navy px-3 py-2.5 font-mono text-xs sm:px-4 sm:text-sm font-bold sm:text-lg leading-none tracking-[0.08em] md:text-xl transition-colors hover:bg-[rgba(232,190,63,0.12)]"
      >
        <span aria-hidden="true" className="text-steam-gold">HOBBYIST</span>
        <span aria-hidden="true" className="inline-block h-[9px] w-[9px] rotate-45 bg-cream" />
        <span aria-hidden="true" className="text-cream">GAMES</span>
      </Link>
      <nav className="flex items-center gap-3 lg:gap-6">
        <Link
          href={path("/#about")}
          className="hidden text-sm font-medium tracking-[0.15em] uppercase text-cream/55 hover:text-steam-gold transition-colors md:block"
        >
          {t("About")}
        </Link>
        <Link
          href={path("/shop")}
          className="inline-flex min-h-11 items-center text-sm font-medium tracking-[0.15em] uppercase text-steam-gold hover:text-cream transition-colors"
        >
          {t("Shop")}
        </Link>
        {/* Leave room for all three stores; phones use the Learn band. */}
        <Link
          href={path("/guide")}
          className="hidden text-sm font-medium tracking-[0.15em] uppercase text-cream/55 hover:text-steam-gold transition-colors xl:block"
        >
          {t("Guide")}
        </Link>
        <Link
          href={path("/glossary")}
          className="hidden text-sm font-medium tracking-[0.15em] uppercase text-cream/55 hover:text-steam-gold transition-colors xl:block"
        >
          {t("Glossary")}
        </Link>
        <StoreLinks locale={locale} />
        <LanguageSwitch />
      </nav>
    </header>
  );
}
