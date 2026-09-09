import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Introduction to Jiu Jitsu Concepts — Hobbyist Games",
  description:
    "Jiu jitsu is a grappling martial art with no strikes, where opponents try to gain positional control and submission. The key terms and positions used in Submission Saga.",
  alternates: { canonical: "/guide" },
};

/**
 * All copy on this page is Nathan's. Edits are limited to spelling, possessives,
 * one verb tense, one preposition, and punctuation that changed nothing about
 * the meaning. Every one is listed in the commit message. Nothing here has been
 * reworded for style, and nothing should be without asking him first.
 */
const INTRO: string[] = [
  "At its most basic description, jiu jitsu or Brazilian jiu jitsu is a grappling martial art (no strikes allowed) where opponents try to gain positional control over their opponent and/or submission (opponent giving up). More on this later.",
  "Submission Saga is a video game built around the concepts of jiu jitsu in its many forms, so it's important to understand many of the terms and ideas to understand the game. While jiu jitsu is done in both the Gi (kimono) and without (generally rash guard and shorts), Submission Saga focuses on jiu jitsu from the No-gi perspective.",
];

interface Art {
  src: string;
  width: number;
  height: number;
  /** Describes the picture for screen readers. */
  alt: string;
}

interface Entry {
  name: string;
  body: string;
  art?: Art;
}

const KEY_CONCEPTS: Entry[] = [
  {
    name: "Position",
    body: "Different grappling situations in jiu jitsu are generally grouped into broad “Positions” which describe the orientation of the two opponents in given scenarios. These positions vary from neutral to both opponents, to heavily favoring one opponent. Submission Saga uses a subset of these but not all of them.",
  },
  {
    name: "Move",
    body: "A jiu jitsu technique. Any body movement, trick, or idea used by one player to accomplish a specific goal while grappling to gain an advantage. Most involve either moving to a more dominant position, submitting your opponent, or maintaining current position.",
  },
  {
    name: "Submission",
    body: "A move that attempts to get an opponent to submit or tap. When a submission is landed in competition, that is the end of the match and the player who submitted or tapped has lost.",
  },
  {
    name: "Points",
    body: "Systems used in jiu jitsu to track the dominant positions that each competitor gets to. If there is no submission in a match, the most points decides the outcome.",
  },
  {
    name: "Sweep",
    body: "A move from bottom guard that attempts to knock your opponent over to take top position.",
  },
];

const POSITIONS: Entry[] = [
  {
    name: "Standing",
    body: "Any situation where both opponents are on their feet. This is the starting position in Submission Saga. Neutral.",
    art: {
      src: "/media/positions/standing.png",
      width: 320,
      height: 240,
      alt: "The Standing position, blue and red figures.",
    },
  },
  {
    name: "Guard",
    body: "One player is seated and the other is either standing or on their knees. The seated player has their legs in between themself and their opponent to some degree. The player on top is generally trying to get past the legs to “pass” the guard. Generally neutral (no points).",
    art: {
      src: "/media/positions/guard.png",
      width: 320,
      height: 240,
      alt: "The Guard position, blue and red figures.",
    },
  },
  {
    name: "Half Guard",
    body: "A position where the bottom guard player has one leg of their opponent trapped. They often use one leg to hook the top player's leg and the knee of the other leg to keep distance from the opponent.",
    art: {
      src: "/media/positions/half-guard.png",
      width: 320,
      height: 240,
      alt: "The Half Guard position, blue and red figures.",
    },
  },
  {
    name: "Side Control",
    body: "The top player is past their opponent's legs and pinning them (perpendicular torsos). Favors the top player (scores 3).",
    art: {
      src: "/media/positions/side-control.png",
      width: 320,
      height: 240,
      alt: "The Side Control position, blue and red figures.",
    },
  },
  {
    name: "Mount",
    body: "Top player is pinning their opponent with their knees on either side of their opponent's torso, directly on top of them. Heavily favors the top player (scores 4).",
    art: {
      src: "/media/positions/mount.png",
      width: 320,
      height: 240,
      alt: "The Mount position, blue and red figures.",
    },
  },
  {
    name: "Turtle",
    body: "One player is on their hands (or elbows) and knees and the other is behind them. Favors the top player.",
    art: {
      src: "/media/positions/turtle.png",
      width: 320,
      height: 240,
      alt: "The Turtle position, blue and red figures.",
    },
  },
  {
    name: "Front Headlock",
    body: "One person has the other's head trapped with their arms. Favors the player holding the headlock.",
    art: {
      src: "/media/positions/front-headlock.png",
      width: 320,
      height: 240,
      alt: "The Front Headlock position, blue and red figures.",
    },
  },
  {
    name: "Back Control",
    body: "One person is fully behind the other with two legs wrapped around the waist in between their legs (or figure foured). Attacker usually has a seatbelt grip (one arm under the armpit of the opponent and the other over the shoulder by the neck, with hands clasped). Very heavily favors the attacking opponent. (4 points)",
    art: {
      src: "/media/positions/back-control.png",
      width: 320,
      height: 240,
      alt: "The Back Control position, blue and red figures.",
    },
  },
  {
    name: "Single Leg X",
    body: "Most basic leg entanglement position. Bottom player holds one of their opponent's legs with two of theirs. One foot on their hip on the outside and the other leg pinched with their foot in between the opponent's legs. Generally favors the bottom attacking player.",
    art: {
      src: "/media/positions/single-leg-x.png",
      width: 320,
      height: 240,
      alt: "The Single Leg X position, blue and red figures.",
    },
  },
  {
    name: "Saddle (Cross Ashi)",
    body: "More advanced and dominant leg entanglement position. Favors the attacker more heavily.",
    art: {
      src: "/media/positions/saddle.png",
      width: 320,
      height: 240,
      alt: "The Saddle position, blue and red figures.",
    },
  },
];

function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <dl className="space-y-8">
      {entries.map((entry) => (
        <div
          key={entry.name}
          className={
            entry.art
              ? "grid gap-x-5 gap-y-3 sm:grid-cols-[190px_1fr] sm:items-start"
              : ""
          }
        >
          {entry.art && (
            <Image
              src={entry.art.src}
              width={entry.art.width}
              height={entry.art.height}
              alt={entry.art.alt}
              className="w-[190px] max-w-full h-auto justify-self-center sm:justify-self-start"
            />
          )}

          <div>
            <dt className="font-pixel text-pixel-sm text-cream mb-1.5 tracking-wide">
              {entry.name}
            </dt>
            <dd className="text-sm text-cream/70 leading-relaxed">{entry.body}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export default function GuidePage() {
  return (
    <>
      <header className="bg-steam-navy border-b-2 border-steam-gold/40 px-6 py-4 md:px-12">
        <Link
          href="/"
          className="font-pixel text-pixel-xs tracking-[0.1em] uppercase text-cream/60 hover:text-steam-gold transition-colors"
        >
          ← Back to Hobbyist Games
        </Link>
      </header>

      <main className="bg-pixel-grid min-h-screen px-6 section-rhythm md:px-12">
        <article className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-pixel text-pixel-xs tracking-[0.2em] uppercase text-steam-gold mb-4">
              Beginner&apos;s Guide
            </p>
            <h1 className="font-pixel text-xl md:text-2xl text-cream leading-relaxed">
              Introduction to Jiu Jitsu Concepts
            </h1>
          </div>

          <section className="mb-14 space-y-4">
            {INTRO.map((para) => (
              <p key={para} className="text-base text-cream/80 leading-relaxed">
                {para}
              </p>
            ))}
          </section>

          <section className="mb-14">
            <h2 className="font-pixel text-pixel-lg text-steam-gold mb-6">Key Concepts</h2>
            <EntryList entries={KEY_CONCEPTS} />
          </section>

          <section>
            <h2 className="font-pixel text-pixel-lg text-steam-gold mb-2">Positions</h2>
            <p className="text-xs text-cream/55 mb-6 tracking-[0.05em] uppercase">
              Used in Submission Saga
            </p>
            <EntryList entries={POSITIONS} />
          </section>

          <div className="mt-16 text-center">
            <Link
              href="/"
              className="font-pixel text-pixel-xs tracking-[0.12em] uppercase text-cream/55 hover:text-steam-gold transition-colors"
            >
              ← Back to Hobbyist Games
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
