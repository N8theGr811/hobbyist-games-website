// src/lib/glossary.ts
// Typed access to the generated combat glossary.
//
// glossary.json is GENERATED. Its source is combat_data.gd and
// move_tree_data.gd in the JiuJitsuRPG repo, exported by
// `python3 tools/export_glossary.py` there. Do not hand-edit either file.
//
// This exists because the hand-ported copy in src/lib/combat/moves.ts drifted
// from the game: 14 moves missing, 3 that do not exist, 23 renamed. The
// glossary is generated so /glossary cannot repeat that.

import raw from "./glossary.json";

export type MoveType = "Attack" | "Transition" | "Submission" | "Defense";

/** Which half of a position pair this is. Standing is the only neutral one. */
export type PositionSide = "top" | "bottom" | "neutral";

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
  position: string;
  stat: string | null;
  successPosition?: string;
  failPosition?: string;
  points: number;
  rarity: { base: string; max: string };
  opponentPoints?: number;
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

export interface GlossaryCounts {
  positions: number;
  families: number;
  moveEntries: number;
  uniqueMoves: number;
  byType: Record<MoveType, number>;
  scoringMoves: number;
  pointValues: number[];
}

export interface Glossary {
  schema: number;
  source: string;
  counts: GlossaryCounts;
  families: GlossaryFamily[];
  positions: GlossaryPosition[];
  moves: GlossaryMove[];
}

// The JSON is structurally typed by TS as wide string/number types, so the
// narrow unions above need an assertion. The generator guarantees the shape
// and fails loudly rather than emitting a partial file.
const glossary = raw as unknown as Glossary;

export const COUNTS: GlossaryCounts = glossary.counts;
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
