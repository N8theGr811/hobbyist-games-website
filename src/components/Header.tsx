"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 100);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-500 md:px-12 ${
        scrolled
          ? "bg-cream/95 backdrop-blur-xl border-b border-ink/8 shadow-[0_1px_8px_rgba(27,22,18,0.06)]"
          : "bg-cream/70 backdrop-blur-md border-b border-ink/8 shadow-[0_1px_4px_rgba(27,22,18,0.04)]"
      }`}
    >
      <a href="#" className="block">
        <Image
          src="/brand/hobbyist-games-v4-working.svg"
          alt="Hobbyist Games"
          width={140}
          height={28}
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
