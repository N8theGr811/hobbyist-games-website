import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-1.5 bg-steam-navy shadow-[0_2px_16px_rgba(0,0,0,0.5)] border-b-2 border-steam-gold/40 md:px-12">
      <a href="#" className="block -my-3">
        <Image
          src="/brand/hobbyist-games-v3-formal-2048w.png"
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
          className="hidden font-pixel text-[0.55rem] tracking-[0.15em] uppercase text-cream/55 hover:text-steam-gold transition-colors sm:block"
        >
          About
        </a>
        <a
          href="#signup"
          className="font-pixel text-[0.55rem] tracking-[0.15em] uppercase px-5 py-2.5 bg-steam-gold/15 text-steam-gold border border-steam-gold/50 hover:bg-steam-gold hover:text-steam-navy transition-colors rounded-md"
        >
          Get Early Access
        </a>
      </nav>
    </header>
  );
}
