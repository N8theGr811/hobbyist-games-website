import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  BELT_GATE,
  COUNTS,
  FAMILIES,
  MOVES,
  MOVES_BY_POSITION,
  THEME,
  familyPositions,
  iconSrc,
  pct,
  positionName,
  type Acquisition,
  type GlossaryFamily,
  type GlossaryMove,
  type GlossaryPosition,
  type MoveType,
  type Rarity,
  type Rivalry,
} from "@/lib/glossary";

export const metadata: Metadata = {
  title: "Move Glossary — Every Move in Submission Saga",
  description:
    "All 92 moves in Submission Saga, with the game's own move card for each one: art, odds, points, where it puts you, what it beats, and how you unlock it.",
  alternates: { canonical: "/glossary" },
};

/**
 * The connective copy on this page is mine, not Nathan's, and it is kept to
 * the shortest factual statement each slot needs. Every move name, description
 * and rivalry line below is the game's own text, generated into glossary.json
 * rather than retyped. Same split as /guide, where the body copy is his and
 * only the captions are mine. Reword any of this freely; do not reword
 * anything that comes out of the data.
 */
const INTRO =
  "Every move in the game, grouped by the position you use it from. Most have to be " +
  "unlocked with move points, but a handful are taught to you by specific people, and " +
  "some you start with. The description on each move is the same text the game shows " +
  "on the card.";

const TYPE_BLURB: Record<MoveType, string> = {
  Attack: "Scores. Takedowns, sweeps and passes are all attacks.",
  Transition: "Moves you somewhere better without scoring.",
  Submission: "Ends the match if it lands.",
  Defense: "Gets you out, or keeps you where you are.",
};

const TYPE_ORDER: MoveType[] = ["Attack", "Transition", "Submission", "Defense"];

/** One line per acquisition route. See the Acquisition type for the fields. */
function acquisitionText(acq: Acquisition): string {
  switch (acq.route) {
    case "default":
      return "You start with it.";
    case "points":
      return `Bought with move points (costs ${acq.cost}). Unlocking a position rolls a random locked move from that group, so which one you get is not up to you.`;
    case "gym":
      return `Taught when you clear the ${gymName(acq.badge)} gym, both leaders beaten.`;
    case "ashi":
      return `Taught outright for beating ${acq.teacher} at Ashi Academy. No move point.`;
    // "Coach Herb" is what a player sees. The game keys him "The Old Master"
    // internally and resolves the name through GymLeaderNames.DISPLAY_NAMES,
    // so the key is what save data is written against, not what to print.
    case "class":
      // "an 8-class course". The class counts are interpolated, so the article
      // has to be picked rather than written.
      return `Taught by Coach Herb at the end of ${acq.course}, ${acq.classes === 8 || acq.classes === 11 ? "an" : "a"} ${acq.classes}-class course.`;
    case "secret":
      return `Only from ${acq.teacher}. It never enters the mystery pool, so finding him is the only way to get it.`;
    case "belt":
      return `Unlocks on its own once you reach ${acq.belt} belt. Nothing to buy.`;
  }
}

/** "beach_badge" -> "Beach". The badge ids are the gyms' own names. */
function gymName(badge: string | undefined): string {
  if (!badge) return "";
  const word = badge.replace(/_badge$/, "").replace(/_/g, " ");
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Short label for the compact row, where the full sentence will not fit. */
const ROUTE_LABEL: Record<Acquisition["route"], string> = {
  default: "Start",
  points: "Move points",
  gym: "Gym leader",
  ashi: "Ashi Academy",
  class: "Class",
  secret: "Secret",
  belt: "Belt",
};

/** The site already ships the game's stat art; only this one name disagrees. */
function statIconSrc(stat: string): string {
  return `/stat-icons/${stat === "leg_entanglements" ? "leg-locks" : stat}.png`;
}

function statLabel(stat: string): string {
  return stat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function TypeTag({ type }: { type: MoveType }) {
  // The game's own type colour, used at full strength: all four clear WCAG AA
  // on steam-navy as authored. See GlossaryTheme.
  const color = THEME.typeColors[type];
  return (
    <span
      className="shrink-0 font-mono text-[0.625rem] leading-none px-1.5 py-1 border rounded-sm"
      style={{ color, borderColor: `${color}66`, backgroundColor: `${color}1a` }}
      title={type}
    >
      {THEME.typeTags[type]}
    </span>
  );
}

/**
 * The card's dot ladder: one dot per rarity this move can reach, the first
 * filled. A player's own card fills more as they upgrade it; a move on this
 * page is always shown unupgraded, so only the base rung is lit.
 */
/**
 * One rung of the upgrade ladder: filled where the move starts, a ring for each
 * upgrade still to take. The game dims unearned rungs instead, but a dimmed dot
 * this small disappears on steam-navy, and the whole point of the ladder here
 * is to say "this can be upgraded". A ring at full strength always shows: every
 * rarity colour clears the 3:1 non-text contrast floor on navy.
 */
function RarityDot({ rarity, filled, size }: { rarity: Rarity; filled: boolean; size: number }) {
  const color = THEME.rarityColors[rarity];
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        border: `2px solid ${color}`,
        backgroundColor: filled ? color : "transparent",
      }}
    />
  );
}

/** Unique moves with more than one rung. rip_leg_out is listed twice, hence the set. */
const UPGRADEABLE = new Set(MOVES.filter((m) => m.tiers.length > 1).map((m) => m.id)).size;

const DOT_SIZE = 10;
const DOT_GAP = 3;
/** Widest ladder in the game is four rungs, common to legendary. */
const DOT_SLOT = 4 * DOT_SIZE + 3 * DOT_GAP;

function RarityDots({ move }: { move: GlossaryMove }) {
  const label =
    move.tiers.length > 1
      ? `${THEME.rarityLabels[move.rarity.base]}, upgradeable to ${THEME.rarityLabels[move.rarity.max]}`
      : `${THEME.rarityLabels[move.rarity.base]}, does not upgrade`;
  return (
    // A fixed slot, sized for the longest ladder, so the chance column beside
    // it lines up down the list whether a move has one rung or four.
    <span
      className="shrink-0 flex items-center"
      style={{ width: DOT_SLOT, gap: DOT_GAP }}
      title={label}
    >
      {move.tiers.map((tier, i) => (
        <RarityDot key={tier.rarity} rarity={tier.rarity} filled={i === 0} size={DOT_SIZE} />
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
}

/**
 * Every rung of the move's upgrade ladder, base rarity at the top. The in-game
 * card shows one rung at a time, because a player's own move sits at exactly
 * one; here nobody owns anything, so the whole ladder is the useful thing and
 * the reader can see what upgrading actually buys.
 *
 * Points are deliberately not a column: the exporter refuses to emit a move
 * whose points differ across rarities, so a second column would always repeat.
 * Upgrading raises the odds, never the score.
 */
function TierLadder({ move }: { move: GlossaryMove }) {
  const isSub = move.tiers[0].subChance !== undefined;
  const multi = move.tiers.length > 1;

  return (
    <table className="w-full border-collapse">
      <caption className="sr-only">
        {multi
          ? `Upgrade ladder for ${move.name}, ${THEME.rarityLabels[move.rarity.base]} through ${THEME.rarityLabels[move.rarity.max]}.`
          : `${move.name} does not upgrade.`}
      </caption>
      <thead>
        <tr className="text-[0.625rem] uppercase tracking-[0.08em] text-cream/40">
          <th scope="col" className="font-normal text-left pb-1 pr-3">
            {multi ? "Upgrades" : "Rarity"}
          </th>
          <th scope="col" className="font-normal text-right pb-1 pr-3">
            Chance
          </th>
          {isSub && (
            <th scope="col" className="font-normal text-right pb-1" title="Sub chance">
              Finish
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {move.tiers.map((tier, i) => (
          <tr key={tier.rarity}>
            <th
              scope="row"
              className="font-normal text-left text-xs py-0.5 pr-3 whitespace-nowrap"
              style={{ color: THEME.rarityColors[tier.rarity] }}
            >
              {/* The same dot the collapsed row shows for this rung, so the
                  ladder above reads as the ladder here. */}
              <span className="inline-flex items-center gap-1.5 align-middle">
                <RarityDot rarity={tier.rarity} filled={i === 0} size={8} />
                {THEME.rarityLabels[tier.rarity]}
              </span>
              {/* Which rung you land on when you first unlock it. */}
              {i === 0 && multi && <span className="text-cream/40"> · start</span>}
            </th>
            <td className="font-mono text-sm text-cream text-right py-0.5 pr-3">
              {pct(tier.baseChance ?? 0)}
            </td>
            {isSub && (
              <td className="font-mono text-sm text-cream text-right py-0.5">
                {pct(tier.subChance ?? 0)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xs text-cream/55">{label}</span>
      <span className="font-mono text-sm text-cream">{value}</span>
    </div>
  );
}

/** "On success → Guard Top". The arrow is the game's. */
function PositionLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xs text-cream/55">{label}</span>
      <span className="text-sm text-cream/80">
        <span aria-hidden="true" className="text-steam-gold">
          →{" "}
        </span>
        {value}
      </span>
    </div>
  );
}

function RivalryRow({ rivalry, strong }: { rivalry: Rivalry; strong: boolean }) {
  const swing =
    rivalry.mechanic === "auto_punish"
      ? "auto"
      : rivalry.mod
        ? `${strong ? "+" : "−"}${Math.round(rivalry.mod * 100)}%`
        : "";
  return (
    <li className="py-1.5">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-sm text-cream/80">{rivalry.name}</span>
        {swing && (
          <span
            className="font-mono text-[0.625rem] leading-none px-1 py-0.5 rounded-sm border"
            style={
              strong
                ? { color: "#7EE39A", borderColor: "#7EE39A66", backgroundColor: "#7EE39A1a" }
                : { color: "#F2685C", borderColor: "#F2685C66", backgroundColor: "#F2685C1a" }
            }
          >
            {swing}
          </span>
        )}
      </div>
      {/* The game's own clause. It states a fact about the position and never
          says who won, so it reads the same from either side. */}
      <p className="text-xs text-cream/55 italic">{rivalry.reason}</p>
    </li>
  );
}

/**
 * The expanded body: the game's move card, in the game's order. Rarity banner
 * and name are already in the summary row above it, so this picks up at the
 * type row and runs to the rivalries, with acquisition added on the end —
 * the one thing the in-game card has no reason to print.
 */
function MoveCard({ move }: { move: GlossaryMove }) {
  return (
    <div className="px-3 pb-4 pt-1 sm:px-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Hero art. 160 wide is the card's own slot; the source is 256x192.
            `sizes` because the rendered box is much smaller than the intrinsic
            width, and without it Next serves a 640px variant of all 93. */}
        <Image
          src={iconSrc(move)}
          width={256}
          height={192}
          sizes="160px"
          alt={`${move.name}, blue figure against red.`}
          className="w-[160px] h-auto shrink-0 self-center sm:self-start"
        />

        <div className="min-w-0 flex-1 space-y-2">
          <TierLadder move={move} />
          {move.points > 0 && <StatLine label="Points" value={String(move.points)} />}

          <div className="pt-1">
            <PositionLine
              label="From"
              value={move.from.map((id) => positionName(id) ?? id).join(", ")}
            />
            {/* A landed submission ends the match, so the card omits its
                success line. The fail line shows for every type. */}
            {move.type !== "Submission" && move.successPosition && (
              <PositionLine
                label="On success"
                value={positionName(move.successPosition) ?? move.successPosition}
              />
            )}
            {move.failPosition && (
              <PositionLine
                label="On fail"
                value={positionName(move.failPosition) ?? move.failPosition}
              />
            )}
          </div>
        </div>
      </div>

      <hr className="my-4 border-steam-gold/15" />

      <p className="text-sm text-cream/70 leading-relaxed">{move.description}</p>

      {move.rivalries && (
        <>
          <hr className="my-4 border-steam-gold/15" />
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {move.rivalries.strongVs.length > 0 && (
              <div>
                <p className="font-pixel text-pixel-xs tracking-[0.12em] uppercase text-[#7EE39A] mb-1">
                  Strong vs
                </p>
                <ul>
                  {move.rivalries.strongVs.map((r) => (
                    <RivalryRow key={r.move} rivalry={r} strong />
                  ))}
                </ul>
              </div>
            )}
            {move.rivalries.weakVs.length > 0 && (
              <div>
                <p className="font-pixel text-pixel-xs tracking-[0.12em] uppercase text-[#F2685C] mb-1">
                  Weak vs
                </p>
                <ul>
                  {move.rivalries.weakVs.map((r) => (
                    <RivalryRow key={r.move} rivalry={r} strong={false} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      <hr className="my-4 border-steam-gold/15" />

      <div className="space-y-1">
        <p className="font-pixel text-pixel-xs tracking-[0.12em] uppercase text-steam-gold">
          How you get it
        </p>
        <p className="text-sm text-cream/70">{acquisitionText(move.acquisition)}</p>
        {move.beltGate && (
          <p className="text-xs text-cream/55">
            Leg entanglement, so it also needs a {move.beltGate} belt. That applies to the
            opponent too.
          </p>
        )}
        {move.stat && (
          <p className="flex items-center gap-1.5 text-xs text-cream/55">
            {/* The stat icon the card carries next to the type tag. */}
            <Image
              src={statIconSrc(move.stat)}
              width={21}
              height={21}
              alt=""
              aria-hidden="true"
              className="w-[18px] h-[18px] shrink-0"
            />
            Rolls against your {statLabel(move.stat)} stat.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * One move: a compact row that expands into the card. `details` rather than a
 * client component — this page is 93 static rows and the open/closed state is
 * the browser's to keep, so nothing here needs to ship JavaScript.
 */
function MoveEntry({ move }: { move: GlossaryMove }) {
  const rarityColor = THEME.rarityColors[move.rarity.base];
  return (
    <details className="group border-b border-steam-gold/10 last:border-b-0">
      {/* Two layouts from one set of elements. On a phone the stats wrap onto
          their own line under the name: beside it, the tag, points, chance and a
          four-rung dot slot left the name about 100px and cut "Transition to
          Mount" to "Transitio...". From sm up it is one row, stats on the right. */}
      <summary className="flex flex-wrap cursor-pointer list-none items-center gap-x-2.5 gap-y-1 py-2 px-3 hover:bg-steam-navy-3/40 sm:flex-nowrap sm:px-4 [&::-webkit-details-marker]:hidden">
        <Image
          src={iconSrc(move)}
          width={256}
          height={192}
          sizes="36px"
          alt=""
          aria-hidden="true"
          className="w-9 h-auto shrink-0"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-cream truncate" style={{ color: rarityColor }}>
            {move.name}
          </span>
          {/* Desktop only, and hidden once open: the card below prints the same
              line in full. On a phone it truncated to a few words, so the stats
              line takes its place there instead. */}
          <span className="hidden sm:block text-xs text-cream/55 truncate sm:group-open:hidden">
            {move.description}
          </span>
        </span>
        {/* Before the stats in the DOM so it stays on the name's line when they
            wrap; order-last puts it back at the end of the single desktop row. */}
        <span
          aria-hidden="true"
          className="shrink-0 text-cream/40 transition-transform group-open:rotate-90 sm:order-last"
        >
          ›
        </span>
        {/* pl = icon width + gap, so on a phone the stats sit under the name. */}
        <span className="flex basis-full items-center gap-2.5 pl-[46px] sm:basis-auto sm:shrink-0 sm:pl-0">
          <TypeTag type={move.type} />
          {/* A slot even when empty, so the chance column lines up on the
              left-aligned phone layout too, not just the right-aligned one. */}
          <span className="flex w-7 shrink-0 items-center">
            {move.points > 0 && (
              <span className="inline-block font-mono text-[0.625rem] leading-none px-1.5 py-1 border border-steam-gold/30 bg-steam-gold/10 text-steam-gold-2 rounded-sm">
                +{move.points}
              </span>
            )}
          </span>
          <span className="shrink-0 font-mono text-xs text-cream/55 w-9 text-right">
            {pct(move.tiers[0].baseChance ?? 0)}
          </span>
          <RarityDots move={move} />
        </span>
      </summary>
      <MoveCard move={move} />
    </details>
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
    <div className="steam-panel overflow-hidden">
      <div className="px-3 pt-4 pb-3 sm:px-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
          <h3 className="font-pixel text-pixel-sm text-cream tracking-wide">{position.name}</h3>
          {roleLabel && (
            <span className="text-[0.6875rem] uppercase tracking-[0.12em] text-steam-gold">
              {roleLabel}
            </span>
          )}
          <span className="font-mono text-xs text-cream/55">
            {moves.length} {moves.length === 1 ? "move" : "moves"}
          </span>
        </div>
        <p className="text-sm text-cream/55 mb-3">{position.description}</p>
        <DominanceBar value={position.dominance} />
      </div>
      <div className="border-t border-steam-gold/15">
        {moves.map((move) => (
          <MoveEntry key={move.key} move={move} />
        ))}
      </div>
    </div>
  );
}

/** The game's 0-10 dominance, as ten cells. Tells you how good the spot is. */
function DominanceBar({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-2">
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

      <main className="bg-pixel-grid min-h-screen px-4 section-rhythm sm:px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-pixel text-pixel-xs tracking-[0.2em] uppercase text-steam-gold mb-4">
              Reference
            </p>
            <h1 className="font-pixel text-xl md:text-2xl text-cream mb-4">Move Glossary</h1>
            <p className="text-sm text-cream/70 leading-relaxed text-left sm:text-center">
              {INTRO}{" "}
              <Link
                href="/guide"
                className="text-cream underline underline-offset-2 decoration-cream/30 hover:text-steam-gold hover:decoration-steam-gold transition-colors"
              >
                New to the sport? Start here.
              </Link>
            </p>
          </div>

          {/* Counts, straight from the data rather than typed out. */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              `${COUNTS.uniqueMoves} moves`,
              `${COUNTS.positions} positions`,
              `${COUNTS.families} groups`,
            ].map((stat) => (
              <span
                key={stat}
                className="font-mono text-xs text-cream/55 border border-steam-gold/25 bg-steam-navy-2 px-2.5 py-1 rounded-sm"
              >
                {stat}
              </span>
            ))}
          </div>

          <div className="steam-panel p-4 sm:p-6 mb-6">
            <p className="font-pixel text-pixel-xs tracking-[0.15em] uppercase text-steam-gold mb-3">
              Move types
            </p>
            <ul className="space-y-2">
              {TYPE_ORDER.map((type) => (
                <li key={type} className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <TypeTag type={type} />
                  <span className="font-mono text-xs text-cream/55">{COUNTS.byType[type]}</span>
                  <span className="text-sm text-cream/70">{TYPE_BLURB[type]}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-cream/55 mt-3">
              {COUNTS.scoringMoves} moves score, worth {COUNTS.pointValues.join(", ")} points.
            </p>

            {/* Upgrades get their own line and a drawn example, because a row of
                dots with no key reads as decoration rather than as a ladder. */}
            <div className="mt-4 pt-4 border-t border-steam-gold/15 flex items-start gap-3">
              <span
                className="flex items-center pt-1 shrink-0"
                style={{ gap: DOT_GAP }}
                aria-hidden="true"
              >
                {THEME.rarityLevels.map((rarity, i) => (
                  <RarityDot key={rarity} rarity={rarity} filled={i === 0} size={12} />
                ))}
              </span>
              <p className="text-sm text-cream/70">
                {UPGRADEABLE} of the {COUNTS.uniqueMoves} moves can be upgraded. The filled dot
                is where a move starts when you unlock it, and each ring after it is an upgrade
                you buy with move points, up to{" "}
                <span style={{ color: THEME.rarityColors.legendary }}>legendary</span>. One dot
                means the move doesn&apos;t upgrade. Upgrading raises the odds, not the points.
              </p>
            </div>
          </div>

          <div className="steam-panel p-4 sm:p-6 mb-10">
            <p className="font-pixel text-pixel-xs tracking-[0.15em] uppercase text-steam-gold mb-3">
              How moves are unlocked
            </p>
            <ul className="space-y-1.5">
              {(
                [
                  ["default", "You start with it."],
                  ["points", "Bought with move points, rolled at random from that position's locked moves."],
                  ["gym", "Taught for clearing a badge gym."],
                  ["ashi", "Taught for beating a fighter on the Ashi Academy ladder."],
                  ["class", "Taught by Coach Herb at the end of a class course."],
                  ["secret", "One person in the world teaches it, and nothing else does."],
                  ["belt", "Unlocks on belt alone."],
                ] as const
              ).map(([route, text]) => (
                <li key={route} className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="shrink-0 font-mono text-[0.625rem] leading-none px-1.5 py-1 border border-steam-gold/25 bg-steam-navy-3 text-cream/70 rounded-sm">
                    {ROUTE_LABEL[route]}
                  </span>
                  <span className="font-mono text-xs text-cream/55">
                    {COUNTS.byRoute[route] ?? 0}
                  </span>
                  <span className="text-sm text-cream/70">{text}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-cream/55 mt-3">
              The {BELT_GATE.moves.length} leg entanglement moves also need a{" "}
              {BELT_GATE.belt} belt on top of however you unlocked them. That applies to the
              opponent too.
            </p>
          </div>

          <nav aria-label="Jump to a position group" className="mb-10">
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

          <div className="space-y-12">
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
              Every move, number and picture on this page is read straight from the game&apos;s
              own combat data, so this page and the game cannot disagree.
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
