// src/lib/combat/ai.ts
// AI opponent move selection — intelligence-based with dominance-aware weights.

import {
  MoveType,
  type Move,
  type Fighter,
  type FighterState,
} from "./types";
import {
  POSITIONS,
  PURPLE_BELT_CONFIG,
} from "./constants";
import { getAvailableMoves } from "./engine";

type RNG = () => number;

/** Dominance-based move type weights. */
const DOMINANCE_WEIGHTS: Record<string, Record<MoveType, number>> = {
  dominant: {
    [MoveType.SUB]: 35,
    [MoveType.ATK]: 30,
    [MoveType.TRN]: 15,
    [MoveType.DEF]: 5,
  },
  advantaged: {
    [MoveType.ATK]: 30,
    [MoveType.SUB]: 25,
    [MoveType.TRN]: 20,
    [MoveType.DEF]: 10,
  },
  disadvantaged: {
    [MoveType.DEF]: 35,
    [MoveType.TRN]: 25,
    [MoveType.ATK]: 20,
    [MoveType.SUB]: 10,
  },
  desperate: {
    [MoveType.DEF]: 50,
    [MoveType.TRN]: 25,
    [MoveType.ATK]: 10,
    [MoveType.SUB]: 5,
  },
};

function getDominanceCategory(dominance: number): string {
  if (dominance >= 8) return "dominant";
  if (dominance >= 6) return "advantaged";
  if (dominance >= 4) return "disadvantaged"; // neutral-ish, lean defensive
  return "desperate";
}

/**
 * Select an AI move using purple belt intelligence (0.60).
 * 60% chance of smart (weighted) pick, 40% random from available.
 */
export function selectAIMove(
  fighter: Fighter,
  state: FighterState,
  rng: RNG = Math.random
): Move {
  const available = getAvailableMoves(fighter, state);
  if (available.length === 0) {
    // Emergency fallback — should not happen if move pools cover all positions
    throw new Error(`AI has no available moves at position ${state.position}`);
  }
  if (available.length === 1) return available[0];

  const intelligence = PURPLE_BELT_CONFIG.intelligence;

  // Intelligence check: smart or random?
  if (rng() > intelligence) {
    // Random pick
    return available[Math.floor(rng() * available.length)];
  }

  // Smart pick: weight by dominance category
  const dominance = POSITIONS[state.position].dominance;
  const category = getDominanceCategory(dominance);
  const weights = DOMINANCE_WEIGHTS[category];

  // Build weighted pool
  const weightedMoves: { move: Move; weight: number }[] = available.map((move) => ({
    move,
    weight: weights[move.type] || 1,
  }));

  const totalWeight = weightedMoves.reduce((sum, wm) => sum + wm.weight, 0);
  let roll = rng() * totalWeight;

  for (const wm of weightedMoves) {
    roll -= wm.weight;
    if (roll <= 0) return wm.move;
  }

  // Fallback (rounding edge case)
  return available[available.length - 1];
}
