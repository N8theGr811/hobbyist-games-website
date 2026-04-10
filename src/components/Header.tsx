import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3.5 bg-espresso shadow-[0_2px_16px_rgba(59,42,31,0.25)] md:px-12">
      <a href="#" className="block">
        <Image
          src="/brand/hobbyist-games-v4-working.svg"
          alt="Hobbyist Games"
          width={180}
          height={36}
          priority
          style={{ height: "auto" }}
        />
      </a>
      <nav className="flex items-center gap-6">
        <a
          href="#preview"
          className="hidden text-sm font-semibold text-cream/50 hover:text-cream transition-colors sm:block"
        >
          Preview
        </a>
        <a
          href="#about"
          className="hidden text-sm font-semibold text-cream/50 hover:text-cream transition-colors sm:block"
        >
          About
        </a>
        <a
          href="#signup"
          className="font-mono text-[0.65rem] font-bold tracking-widest uppercase px-5 py-2.5 bg-cream/15 text-cream border border-cream/20 hover:bg-cream hover:text-espresso transition-colors"
        >
          Get Early Access
        </a>
      </nav>
    </header>
  );
}
