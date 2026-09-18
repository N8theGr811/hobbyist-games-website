import Image from "next/image";
import Link from "next/link";
import StoreLinks from "./StoreLinks";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-1.5 bg-steam-navy shadow-[0_2px_16px_rgba(0,0,0,0.5)] border-b-2 border-steam-gold/40 md:px-12">
      <a href="#" className="block -my-3">
        <Image
          src="/brand/hobbyist-games-v3-dark-2048w.png"
          alt="Hobbyist Games"
          width={180}
          height={72}
          priority
          className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          style={{ height: "auto" }}
        />
      </a>
      <nav className="flex items-center gap-6">
        <a
          href="#about"
          className="hidden text-sm font-medium tracking-[0.15em] uppercase text-cream/55 hover:text-steam-gold transition-colors sm:block"
        >
          About
        </a>
        {/* lg, not md: at 768px the space between the logo and the nav is
            153px and these two need about 200. There is no Tailwind step
            between md and lg, so lg is the first that fits (measured: 220px
            clear at 1024). Phones reach them through the Learn The Game band
            on the homepage instead. */}
        <Link
          href="/guide"
          className="hidden text-sm font-medium tracking-[0.15em] uppercase text-cream/55 hover:text-steam-gold transition-colors lg:block"
        >
          Guide
        </Link>
        <Link
          href="/glossary"
          className="hidden text-sm font-medium tracking-[0.15em] uppercase text-cream/55 hover:text-steam-gold transition-colors lg:block"
        >
          Glossary
        </Link>
        <StoreLinks />
      </nav>
    </header>
  );
}
