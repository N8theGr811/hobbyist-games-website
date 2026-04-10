import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-cream/85 backdrop-blur-xl border-b border-ink/5 md:px-12">
      <a href="#" className="block">
        <Image
          src="/brand/hobbyist-games-v4-working.svg"
          alt="Hobbyist Games"
          width={160}
          height={32}
          priority
          style={{ height: "auto" }}
        />
      </a>
      <nav className="flex items-center gap-6">
        <a
          href="#preview"
          className="hidden text-sm font-medium text-ink/50 hover:text-ink transition-colors sm:block"
        >
          Preview
        </a>
        <a
          href="#about"
          className="hidden text-sm font-medium text-ink/50 hover:text-ink transition-colors sm:block"
        >
          About
        </a>
        <a
          href="#signup"
          className="font-mono text-[0.65rem] font-bold tracking-widest uppercase px-5 py-2.5 bg-ink text-cream hover:bg-mat-red transition-colors"
        >
          Get Early Access
        </a>
      </nav>
    </header>
  );
}
