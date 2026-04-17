import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Credits & Attribution — Hobbyist Games",
  description: "Credits and attribution for Jiu-Jitsu RPG assets, music, and tools.",
};

interface Credit {
  name: string;
  role?: string;
  url?: string;
}

interface CreditSection {
  label: string;
  title: string;
  entries: Credit[];
  note?: string;
}

const SECTIONS: CreditSection[] = [
  {
    label: "Creator",
    title: "Game Design & Development",
    entries: [
      { name: "Nathan Markham" },
    ],
  },
  {
    label: "Art & Assets",
    title: "Interior Tilesets",
    entries: [
      { name: "LimeZu", role: "Modern Interiors", url: "https://limezu.itch.io/moderninteriors" },
    ],
    note: "Commercial use with credits required.",
  },
  {
    label: "Art & Assets",
    title: "Character Generator Tool",
    entries: [
      { name: "0x72 (0a3r)", url: "https://0a3r.itch.io/modern-interiors-character-generation-tool" },
    ],
  },
  {
    label: "Art & Assets",
    title: "Player Sprites — Universal LPC Spritesheet Generator",
    entries: [
      { name: "bluecarrot16" },
      { name: "JaidynReiman" },
      { name: "Benjamin K. Smith (BenCreating)" },
      { name: "Eliza Wyatt (ElizaWy)" },
      { name: "TheraHedwig" },
      { name: "MuffinElZangano" },
      { name: "Durrani" },
      { name: "Johannes Sjölund (wulax)" },
      { name: "Stephen Challener (Redshrike)" },
      { name: "Evert" },
    ],
    note: "Licensed under CC-BY-SA 3.0 / OGA-BY 3.0 / GPL 3.0.",
  },
  {
    label: "Art & Assets",
    title: "Animal Sprites",
    entries: [
      { name: "Pixellab.ai", url: "https://pixellab.ai" },
    ],
  },
  {
    label: "Music",
    title: "Music & Sound",
    entries: [
      { name: "freemusicforvideo.com", url: "https://freemusicforvideo.com" },
    ],
  },
  {
    label: "Typography",
    title: "Font",
    entries: [
      { name: "Monogram Extended by datagoblin" },
    ],
  },
  {
    label: "Tools",
    title: "AsepriteWizard",
    entries: [
      { name: "Vinicius Gerevini", role: "MIT License" },
    ],
  },
];

export default function CreditsPage() {
  return (
    <>
      {/* Header bar */}
      <header className="bg-espresso border-b-2 border-ink px-6 py-4 md:px-12">
        <Link href="/" className="font-mono text-sm text-cream/60 hover:text-cream transition-colors">
          ← Back to Hobbyist Games
        </Link>
      </header>

      <main className="bg-cream min-h-screen px-6 py-16 md:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Page heading */}
          <div className="text-center mb-16">
            <p className="font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-mat-red mb-3">
              Attribution
            </p>
            <h1 className="font-display text-3xl text-ink mb-3">
              Credits
            </h1>
            <p className="text-sm text-ink/40">
              Jiu-Jitsu RPG is made possible by these incredible creators and tools.
            </p>
          </div>

          {/* Credit sections */}
          <div className="space-y-12">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="font-mono text-[0.55rem] font-bold tracking-[0.2em] uppercase text-mat-red mb-1.5">
                  {section.label}
                </p>
                <h2 className="font-display text-lg text-ink mb-3">
                  {section.title}
                </h2>

                <div className="space-y-1">
                  {section.entries.map((entry) => (
                    <div key={entry.name} className="flex items-baseline gap-2">
                      <div className="w-5 h-px bg-belt-gold/40 mt-2 shrink-0" />
                      <div>
                        {entry.url ? (
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-ink hover:text-mat-red transition-colors underline underline-offset-2 decoration-ink/20 hover:decoration-mat-red"
                          >
                            {entry.name}
                          </a>
                        ) : (
                          <span className="text-sm text-ink">{entry.name}</span>
                        )}
                        {entry.role && (
                          <span className="text-sm text-ink/40 ml-1.5">— {entry.role}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {section.note && (
                  <p className="text-xs text-ink/30 mt-2 ml-7">{section.note}</p>
                )}
              </div>
            ))}
          </div>

          {/* Licenses footer */}
          <div className="mt-16 pt-8 border-t border-ink/8">
            <p className="font-mono text-[0.55rem] font-bold tracking-[0.2em] uppercase text-ink/30 mb-3">
              Licenses
            </p>
            <div className="flex flex-wrap gap-2">
              {["CC-BY-SA 3.0", "OGA-BY 3.0", "GPL 3.0", "MIT"].map((license) => (
                <span
                  key={license}
                  className="font-mono text-[0.6rem] text-ink/40 border border-ink/10 px-2.5 py-1 rounded"
                >
                  {license}
                </span>
              ))}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-ink/35 hover:text-mat-red transition-colors"
            >
              ← Back to Hobbyist Games
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
