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
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3.5 transition-all duration-500 md:px-12 ${
        scrolled
          ? "bg-paper/95 backdrop-blur-xl border-b-2 border-ink/12 shadow-[0_2px_16px_rgba(27,22,18,0.1)]"
          : "bg-paper/90 backdrop-blur-md border-b-2 border-ink/12 shadow-[0_2px_12px_rgba(27,22,18,0.08)]"
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
          className="hidden text-sm font-semibold text-ink/60 hover:text-ink transition-colors sm:block"
        >
          Preview
        </a>
        <a
          href="#about"
          className="hidden text-sm font-semibold text-ink/60 hover:text-ink transition-colors sm:block"
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
