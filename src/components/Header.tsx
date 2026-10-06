import Link from "next/link";
import StoreLinks from "./StoreLinks";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-2.5 bg-steam-navy shadow-[0_2px_16px_rgba(0,0,0,0.5)] border-b-2 border-steam-gold/40 md:px-12">
      {/* The v3 wordmark set in markup rather than the PNG, whose double
          rule is baked in: one thin gold squircle, like the store buttons. */}
      <a
        href="#"
        aria-label="Hobbyist Games"
        className="flex shrink-0 items-center gap-2.5 rounded-[12px] border border-[#e8be3f] bg-steam-navy px-4 py-2.5 font-mono text-lg font-bold leading-none tracking-[0.08em] md:text-xl transition-colors hover:bg-[rgba(232,190,63,0.12)]"
      >
        <span aria-hidden="true" className="text-steam-gold">HOBBYIST</span>
        <span aria-hidden="true" className="inline-block h-[9px] w-[9px] rotate-45 bg-cream" />
        <span aria-hidden="true" className="text-cream">GAMES</span>
      </a>
      <nav className="flex items-center gap-6">
        <a
          href="#about"
          className="hidden text-sm font-medium tracking-[0.15em] uppercase text-cream/55 hover:text-steam-gold transition-colors md:block"
        >
          About
        </a>
        {/* Leave room for all three stores; phones use the Learn band. */}
        <Link
          href="/guide"
          className="hidden text-sm font-medium tracking-[0.15em] uppercase text-cream/55 hover:text-steam-gold transition-colors xl:block"
        >
          Guide
        </Link>
        <Link
          href="/glossary"
          className="hidden text-sm font-medium tracking-[0.15em] uppercase text-cream/55 hover:text-steam-gold transition-colors xl:block"
        >
          Glossary
        </Link>
        <StoreLinks />
      </nav>
    </header>
  );
}
