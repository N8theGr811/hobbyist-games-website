import type { Metadata } from "next";
import Link from "next/link";

import {
  COUNTS,
  FAMILIES,
  MOVES_BY_POSITION,
  familyPositions,
  type GlossaryFamily,
  type GlossaryMove,
  type GlossaryPosition,
  type MoveType,
} from "@/lib/glossary";

export const metadata: Metadata = {
  title: "Jiu Jitsu Glossary — Every Position and Move in Submission Saga",
  description:
    "All 19 positions and 92 moves in Submission Saga, grouped by position, with what each one does. Generated from the game's own combat data.",
  alternates: { canonical: "/glossary" },
};

/**
 * The four type colours are the game's own (CodexData.TYPE_COLORS), lifted a
 * few points so 11px text clears WCAG AA on steam-navy. Same hue as the Codex,
 * so a player recognises the tag.
 */
const TYPE_STYLE: Record<MoveType, { text: string; border: string; bg: string }> = {
  Attack: { text: "text-[#F2685C]", border: "border-[#F2685C]/40", bg: "bg-[#F2685C]/10" },
  Transition: { text: "text-[#7EE39A]", border: "border-[#7EE39A]/40", bg: "bg-[#7EE39A]/10" },
  Submission: { text: "text-[#C48CF0]", border: "border-[#C48CF0]/40", bg: "bg-[#C48CF0]/10" },
  Defense: { text: "text-[#6FC5F2]", border: "border-[#6FC5F2]/40", bg: "bg-[#6FC5F2]/10" },
};

const TYPE_ORDER: MoveType[] = ["Attack", "Transition", "Submission", "Defense"];

const TYPE_BLURB: Record<MoveType, string> = {
  Attack: "Scores. Takedowns, sweeps, passes.",
  Transition: "Moves you somewhere better. No points.",
  Submission: "Ends the match. No points.",
  Defense: "Survives the turn. No points.",
};

function TypeChip({ type }: { type: MoveType }) {
  const s = TYPE_STYLE[type];
  return (
    <span
      className={`shrink-0 text-[0.6875rem] leading-none px-1.5 py-1 border rounded-sm ${s.text} ${s.border} ${s.bg}`}
    >
      {type}
    </span>
  );
}

/** The game's 0-10 dominance, as ten cells. Tells you how good the spot is. */
function DominanceBar({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-2" title={`Dominance ${value} of 10`}>
      <span className="flex gap-px" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`w-1.5 h-3 rounded-[1px] ${i < value ? "bg-steam-gold" : "bg-cream/15"}`}
          />
        ))}
      </span>
      <span className="text-xs text-cream/55">{value}/10 control</span>
    </span>
  );
}

function MoveRow({ move }: { move: GlossaryMove }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 py-2 border-b border-steam-gold/10 last:border-b-0">
      <span className="text-sm text-cream">{move.name}</span>
      <TypeChip type={move.type} />
      {move.points > 0 && (
        <span className="shrink-0 font-mono text-[0.6875rem] leading-none px-1.5 py-1 border border-steam-gold/30 bg-steam-gold/10 text-steam-gold-2 rounded-sm">
          {move.points} pts
        </span>
      )}
      <span className="basis-full text-sm text-cream/55">{move.description}</span>
    </li>
  );
}

function PositionBlock({
  position,
  family,
}: {
  position: GlossaryPosition;
  family: GlossaryFamily;
}) {
  const moves = MOVES_BY_POSITION.get(position.id) ?? [];
  const roleLabel =
    position.side === "neutral"
      ? null
      : position.side === "top"
        ? (family.topLabel ?? "Top")
        : (family.bottomLabel ?? "Bottom");

  return (
    <div className="steam-panel p-5 md:p-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
        <h3 className="font-pixel text-pixel-sm text-cream tracking-wide">{position.name}</h3>
        {roleLabel && (
          <span className="text-[0.6875rem] uppercase tracking-[0.12em] text-steam-gold">
            {roleLabel}
          </span>
        )}
      </div>
      <p className="text-sm text-cream/55 mb-3">{position.description}</p>
      <div className="mb-4">
        <DominanceBar value={position.dominance} />
      </div>

      <p className="font-pixel text-pixel-xs tracking-[0.15em] uppercase text-cream/55 mb-1">
        {moves.length} {moves.length === 1 ? "move" : "moves"}
      </p>
      <ul>
        {moves.map((move) => (
          <MoveRow key={move.key} move={move} />
        ))}
      </ul>
    </div>
  );
}

export default function GlossaryPage() {
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-pixel text-pixel-xs tracking-[0.2em] uppercase text-steam-gold mb-4">
              Reference
            </p>
            <h1 className="font-pixel text-2xl text-cream mb-4">Glossary</h1>
            <p className="text-sm text-cream/55">
              Every position and move in Submission Saga, grouped by where you are on the mat.
              New to the sport? Start with the{" "}
              <Link
                href="/guide"
                className="text-cream underline underline-offset-2 decoration-cream/30 hover:text-steam-gold hover:decoration-steam-gold transition-colors"
              >
                beginner&apos;s guide
              </Link>
              .
            </p>
          </div>

          {/* Counts, straight from the data rather than typed out. */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              `${COUNTS.positions} positions`,
              `${COUNTS.families} groups`,
              `${COUNTS.uniqueMoves} moves`,
            ].map((stat) => (
              <span
                key={stat}
                className="font-mono text-xs text-cream/55 border border-steam-gold/25 bg-steam-navy-2 px-2.5 py-1 rounded-sm"
              >
                {stat}
              </span>
            ))}
          </div>

          {/* Type legend */}
          <div className="steam-panel p-5 md:p-6 mb-10">
            <p className="font-pixel text-pixel-xs tracking-[0.15em] uppercase text-steam-gold mb-3">
              Move types
            </p>
            <ul className="space-y-2">
              {TYPE_ORDER.map((type) => (
                <li key={type} className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <TypeChip type={type} />
                  <span className="font-mono text-xs text-cream/55">
                    {COUNTS.byType[type]}
                  </span>
                  <span className="text-sm text-cream/55">{TYPE_BLURB[type]}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-cream/55 mt-3 italic">
              Attack does not mean striking. There is none in the game. It means a scoring
              action. {COUNTS.scoringMoves} of the {COUNTS.byType.Attack} Attacks score, worth{" "}
              {COUNTS.pointValues.join(", ")} points.
            </p>
          </div>

          {/* Jump links */}
          <nav aria-label="Jump to a position group" className="mb-12">
            <p className="font-pixel text-pixel-xs tracking-[0.15em] uppercase text-cream/55 mb-3">
              Jump to
            </p>
            <div className="flex flex-wrap gap-2">
              {FAMILIES.map((family) => (
                <a
                  key={family.id}
                  href={`#${family.id}`}
                  className="text-xs text-cream/55 border border-steam-gold/25 bg-steam-navy-2 px-2.5 py-1.5 rounded-sm hover:text-steam-gold hover:border-steam-gold/60 transition-colors"
                >
                  {family.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="space-y-14">
            {FAMILIES.map((family) => (
              <section key={family.id} id={family.id} className="scroll-mt-6">
                <h2 className="font-pixel text-pixel-lg text-steam-gold mb-5">{family.label}</h2>
                <div className="space-y-5">
                  {familyPositions(family).map((position) => (
                    <PositionBlock key={position.id} position={position} family={family} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-steam-gold/15 text-center">
            <p className="text-xs text-cream/55">
              Positions and moves are read straight from the game&apos;s combat data, so this
              page and the game cannot disagree.
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/guide"
              className="font-pixel text-pixel-xs tracking-[0.12em] uppercase text-cream/55 hover:text-steam-gold transition-colors"
            >
              ← Beginner&apos;s guide
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
