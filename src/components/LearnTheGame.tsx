import Image from "next/image";
import Link from "next/link";
import { COUNTS } from "@/lib/glossary";

/**
 * The homepage's way into /guide and /glossary.
 *
 * The header carries the same two links, but only from lg up: beside the logo
 * on a 375px screen there is room for the Wishlist button and nothing else.
 * The footer carries them too, at 12px under everything. So on a phone this
 * band is the only visible route to either page without scrolling to the very
 * bottom, which is why it exists rather than a third header link.
 *
 * The move count is read from the generated glossary data, not written here,
 * so it follows the game's move table the same way the glossary page does.
 * This is a server component, so only the number reaches the bundle.
 *
 * The art is each page's own: the guide opens on position diagrams and the
 * glossary on the game's move cards.
 */
interface Door {
  href: string;
  label: string;
  line: string;
  art: { src: string; width: number; height: number; alt: string };
}

const DOORS: Door[] = [
  {
    href: "/guide",
    label: "Beginner's Guide",
    line: "The positions and terms the game uses, for anyone who has never trained.",
    art: {
      src: "/media/positions/mount.png",
      width: 320,
      height: 240,
      alt: "The Mount position, blue and red figures.",
    },
  },
  {
    href: "/glossary",
    label: "Move Glossary",
    line: `All ${COUNTS.uniqueMoves} moves by position, with the odds, points and unlock for each.`,
    art: {
      src: "/combat-icons/moves/flying_triangle.png",
      width: 256,
      height: 192,
      alt: "Move card art for a flying triangle.",
    },
  },
];

export default function LearnTheGame() {
  return (
    <section id="learn" className="relative px-6 py-16 bg-steam-navy md:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-10 font-pixel text-pixel-xs tracking-[0.2em] uppercase text-steam-gold">
          <span className="w-6 h-px bg-steam-gold/40" />
          Learn The Game
          <span className="w-6 h-px bg-steam-gold/40" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {DOORS.map((door) => (
            <Link
              key={door.href}
              href={door.href}
              className="group flex flex-col rounded-md border border-steam-gold/25 bg-steam-navy-2 p-5 transition-colors hover:border-steam-gold"
            >
              <div className="mb-4 flex h-32 items-center justify-center rounded bg-steam-navy-3/60">
                <Image
                  src={door.art.src}
                  alt={door.art.alt}
                  width={door.art.width}
                  height={door.art.height}
                  className="h-full w-auto"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <span className="flex items-center justify-between font-pixel text-pixel-sm tracking-[0.1em] uppercase text-steam-gold">
                {door.label}
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
              <span className="mt-2 text-sm text-cream/55 leading-relaxed">{door.line}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
