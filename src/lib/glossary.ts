// src/lib/glossary.ts
// Typed access to the generated combat glossary.
//
// glossary.json is GENERATED. Its source is combat_data.gd, move_tree_data.gd,
// move_rivalry_data.gd, the three reservation files and ui_theme.gd in the
// JiuJitsuRPG repo, exported by `python3 tools/export_glossary.py` there.
// That same command writes public/combat-icons/moves/. Do not hand-edit either.
//
// This exists because the hand-ported copy in src/lib/combat/moves.ts drifted
// from the game: 14 moves missing, 3 that do not exist, 23 renamed. The
// glossary is generated so /glossary cannot repeat that.

import raw from "./glossary.json";

export type MoveType = "Attack" | "Transition" | "Submission" | "Defense";

export type Rarity = "common" | "rare" | "epic" | "legendary";

/** Which half of a position pair this is. Standing is the only neutral one. */
export type PositionSide = "top" | "bottom" | "neutral";

/**
 * How a move is obtained. Five reservations sit on top of the move-point pool,
 * and a reserved move never enters it, so the route is exclusive rather than
 * a list. `belt` is rip_leg_out alone, which unlocks on belt with no purchase.
 */
export type AcquisitionRoute =
  | "default"
  | "points"
  | "gym"
  | "ashi"
  | "class"
  | "secret"
  | "belt";

export interface Acquisition {
  route: AcquisitionRoute;
  /** points: move points to buy it. */
  cost?: number;
  /** gym: the badge whose gym teaches it on clear. */
  badge?: string;
  /** ashi / secret: who hands it over. */
  teacher?: string;
  /** class: the course that ends in it, and how many classes that course runs. */
  course?: string;
  classes?: number;
  /** belt: the belt it unlocks at. */
  belt?: string;
}

/** One rung of a move's upgrade ladder, base rarity through max. */
export interface MoveTier {
  rarity: Rarity;
  /** 0-1. Absent on the handful of moves that never roll. */
  baseChance?: number;
  /** 0-1, submissions only: the chance the finish actually lands. */
  subChance?: number;
  points: number;
}

/**
 * A move this one beats (`strongVs`) or loses to (`weakVs`). `reason` is the
 * game's authored clause, side-neutral and never a verdict, so it reads the
 * same whichever fighter is holding the counter.
 */
export interface Rivalry {
  move: string;
  name: string;
  mechanic: "mod_swing" | "auto_punish" | string;
  reason: string;
  /** mod_swing only: the swing, as a fraction. Absent on auto_punish. */
  mod?: number;
}

export interface GlossaryPosition {
  id: string;
  name: string;
  description: string;
  /** The game's own 0-10 scale. 0 is the worst place to be, 10 the best. */
  dominance: number;
  family: string;
  side: PositionSide;
}

export interface GlossaryMove {
  /** Unique. `id` is not: rip_leg_out is listed under two positions. */
  key: string;
  id: string;
  name: string;
  shortName?: string;
  description: string;
  type: MoveType;
  /** The position block this entry sits in. `from` lists every one. */
  position: string;
  from: string[];
  stat: string | null;
  successPosition?: string;
  failPosition?: string;
  points: number;
  rarity: { base: Rarity; max: Rarity };
  opponentPoints?: number;
  tiers: MoveTier[];
  icon: { kind: "move" | "submission" | "position"; file: string };
  acquisition: Acquisition;
  /** Present only on the leg entanglements. The belt they need. */
  beltGate?: string;
  rivalries?: { strongVs: Rivalry[]; weakVs: Rivalry[] };
}

export interface GlossaryFamily {
  id: string;
  label: string;
  neutral: boolean;
  top: string;
  bottom: string;
  topLabel?: string;
  bottomLabel?: string;
}

/**
 * The game's own presentation constants, read from move_tree_data.gd and
 * ui_theme.gd rather than restated here.
 *
 * All eight clear WCAG AA on steam-navy as authored, so they are used at full
 * strength: the weakest is Submission at 4.68:1, then Attack 5.02:1 and epic
 * 5.17:1. If the game retunes one below 4.5:1 this is where it will show.
 */
export interface GlossaryTheme {
  rarityLevels: Rarity[];
  rarityLabels: Record<Rarity, string>;
  rarityColors: Record<Rarity, string>;
  typeTags: Record<MoveType, string>;
  typeColors: Record<MoveType, string>;
}

export interface GlossaryCounts {
  positions: number;
  families: number;
  moveEntries: number;
  uniqueMoves: number;
  byType: Record<MoveType, number>;
  scoringMoves: number;
  pointValues: number[];
  byRoute: Partial<Record<AcquisitionRoute, number>>;
  beltGated: number;
  icons: number;
}

export interface Glossary {
  schema: number;
  source: string;
  counts: GlossaryCounts;
  theme: GlossaryTheme;
  beltGate: { belt: string; moves: string[] };
  families: GlossaryFamily[];
  positions: GlossaryPosition[];
  moves: GlossaryMove[];
}

// The JSON is structurally typed by TS as wide string/number types, so the
// narrow unions above need an assertion. The generator guarantees the shape
// and fails loudly rather than emitting a partial file.
const glossary = raw as unknown as Glossary;

export const COUNTS: GlossaryCounts = glossary.counts;
export const THEME: GlossaryTheme = glossary.theme;
export const BELT_GATE = glossary.beltGate;
export const FAMILIES: GlossaryFamily[] = glossary.families;
export const POSITIONS: GlossaryPosition[] = glossary.positions;
export const MOVES: GlossaryMove[] = glossary.moves;

export const POSITIONS_BY_ID: ReadonlyMap<string, GlossaryPosition> = new Map(
  POSITIONS.map((p) => [p.id, p]),
);

/** Moves available from a given position, in the order the game lists them. */
export const MOVES_BY_POSITION: ReadonlyMap<string, GlossaryMove[]> = MOVES.reduce(
  (acc, move) => {
    const list = acc.get(move.position);
    if (list) list.push(move);
    else acc.set(move.position, [move]);
    return acc;
  },
  new Map<string, GlossaryMove[]>(),
);

/** The positions in a family, top first. Standing lists once, not twice. */
export function familyPositions(family: GlossaryFamily): GlossaryPosition[] {
  const ids = family.neutral ? [family.top] : [family.top, family.bottom];
  return ids
    .map((id) => POSITIONS_BY_ID.get(id))
    .filter((p): p is GlossaryPosition => p !== undefined);
}

export function positionName(id: string | undefined): string | undefined {
  return id ? POSITIONS_BY_ID.get(id)?.name : undefined;
}

/** Web path for a move's art. The exporter writes these files. */
export function iconSrc(move: GlossaryMove): string {
  return `/combat-icons/moves/${move.icon.file}`;
}

/**
 * The rarity a move sits at before any upgrade, and the ladder above it. The
 * card draws one dot per rung, the first filled.
 */
export function tierLadder(move: GlossaryMove): Rarity[] {
  return move.tiers.map((t) => t.rarity);
}

/** 0.4 -> "40%". The game prints whole percents on the card. */
export function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}
