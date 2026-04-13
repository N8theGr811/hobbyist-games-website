// src/lib/combat/constants.ts
// All combat constants — positions, interactions, belt config, stamina costs.

import {
  Position,
  MoveType,
  InteractionType,
  type PositionData,
  type InteractionModifiers,
} from "./types";

// ─── Position Data ───

export const POSITIONS: Record<Position, PositionData> = {
  [Position.STANDING]: { name: "Standing", dominance: 5, pair: Position.STANDING },
  [Position.GUARD_TOP]: { name: "Guard Top", dominance: 6, pair: Position.GUARD_BOTTOM },
  [Position.GUARD_BOTTOM]: { name: "Guard Bottom", dominance: 5, pair: Position.GUARD_TOP },
  [Position.HALF_GUARD_TOP]: { name: "Half Guard Top", dominance: 6, pair: Position.HALF_GUARD_BOTTOM },
  [Position.HALF_GUARD_BOTTOM]: { name: "Half Guard Bottom", dominance: 4, pair: Position.HALF_GUARD_TOP },
  [Position.SIDE_CONTROL_TOP]: { name: "Side Control Top", dominance: 8, pair: Position.SIDE_CONTROL_BOTTOM },
  [Position.SIDE_CONTROL_BOTTOM]: { name: "Side Control Bottom", dominance: 2, pair: Position.SIDE_CONTROL_TOP },
  [Position.MOUNT_TOP]: { name: "Mount Top", dominance: 9, pair: Position.MOUNT_BOTTOM },
  [Position.MOUNT_BOTTOM]: { name: "Mount Bottom", dominance: 1, pair: Position.MOUNT_TOP },
  [Position.BACK_CONTROL]: { name: "Back Control", dominance: 10, pair: Position.BACK_EXPOSED },
  [Position.BACK_EXPOSED]: { name: "Back Exposed", dominance: 0, pair: Position.BACK_CONTROL },
  [Position.TURTLE_TOP]: { name: "Turtle Top", dominance: 7, pair: Position.TURTLE_BOTTOM },
  [Position.TURTLE_BOTTOM]: { name: "Turtle Bottom", dominance: 3, pair: Position.TURTLE_TOP },
  [Position.FRONT_HEADLOCK_ATTACK]: { name: "Front Headlock Attack", dominance: 7, pair: Position.FRONT_HEADLOCK_DEFEND },
  [Position.FRONT_HEADLOCK_DEFEND]: { name: "Front Headlock Defend", dominance: 3, pair: Position.FRONT_HEADLOCK_ATTACK },
  [Position.SINGLE_LEG_X_OFFENSE]: { name: "Single Leg X Offense", dominance: 6, pair: Position.SINGLE_LEG_X_DEFENSE },
  [Position.SINGLE_LEG_X_DEFENSE]: { name: "Single Leg X Defense", dominance: 4, pair: Position.SINGLE_LEG_X_OFFENSE },
  [Position.SADDLE_OFFENSE]: { name: "Saddle Offense", dominance: 8, pair: Position.SADDLE_DEFENSE },
  [Position.SADDLE_DEFENSE]: { name: "Saddle Defense", dominance: 2, pair: Position.SADDLE_OFFENSE },
};

/** Given a position, returns the opposing fighter's position. */
export function getOpposingPosition(pos: Position): Position {
  return POSITIONS[pos].pair;
}

// ─── Interaction Table ───

/** Lookup: INTERACTION_TABLE[playerMoveType][opponentMoveType] → InteractionType */
export const INTERACTION_TABLE: Record<MoveType, Record<MoveType, InteractionType>> = {
  [MoveType.ATK]: {
    [MoveType.ATK]: InteractionType.SCRAMBLE,
    [MoveType.DEF]: InteractionType.CONTESTED,
    [MoveType.TRN]: InteractionType.SCRAMBLE,
    [MoveType.SUB]: InteractionType.SCRAMBLE,
  },
  [MoveType.DEF]: {
    [MoveType.ATK]: InteractionType.COUNTER,
    [MoveType.DEF]: InteractionType.STALL,
    [MoveType.TRN]: InteractionType.REPOSITION,
    [MoveType.SUB]: InteractionType.SUB_DEFENDED,
  },
  [MoveType.TRN]: {
    [MoveType.ATK]: InteractionType.CAUGHT_TRANSITIONING,
    [MoveType.DEF]: InteractionType.REPOSITION,
    [MoveType.TRN]: InteractionType.POSITIONAL_SCRAMBLE,
    [MoveType.SUB]: InteractionType.CAUGHT_TRANSITIONING,
  },
  [MoveType.SUB]: {
    [MoveType.ATK]: InteractionType.SUB_GAMBLE,
    [MoveType.DEF]: InteractionType.SUB_DEFENDED,
    [MoveType.TRN]: InteractionType.SUB_GAMBLE,
    [MoveType.SUB]: InteractionType.DOUBLE_SUB,
  },
};

// ─── Interaction Modifiers ───

export const INTERACTION_MODIFIERS: Record<InteractionType, InteractionModifiers> = {
  [InteractionType.CONTESTED]: {
    attacker_mod: 0.0,
    defender_mod: 0.10,
    sub_chance_mod: 0.0,
    auto_punish: false,
    counter_bonus: 0,
    stamina_recovery: 0,
  },
  [InteractionType.COUNTER]: {
    attacker_mod: 0.10,
    defender_mod: -0.05,
    sub_chance_mod: 0.0,
    auto_punish: false,
    counter_bonus: 1,
    stamina_recovery: 0,
  },
  [InteractionType.SCRAMBLE]: {
    attacker_mod: -0.05,
    defender_mod: -0.05,
    sub_chance_mod: 0.0,
    auto_punish: false,
    counter_bonus: 0,
    stamina_recovery: 0,
  },
  [InteractionType.SUB_DEFENDED]: {
    attacker_mod: -0.10,
    defender_mod: 0.15,
    sub_chance_mod: -0.15,
    auto_punish: false,
    counter_bonus: 0,
    stamina_recovery: 0,
  },
  [InteractionType.SUB_GAMBLE]: {
    attacker_mod: 0.05,
    defender_mod: 0.05,
    sub_chance_mod: 0.05,
    auto_punish: true,
    counter_bonus: 0,
    stamina_recovery: 0,
  },
  [InteractionType.STALL]: {
    attacker_mod: 0.0,
    defender_mod: 0.0,
    sub_chance_mod: 0.0,
    auto_punish: false,
    counter_bonus: 0,
    stamina_recovery: 3,
  },
  [InteractionType.REPOSITION]: {
    attacker_mod: 0.0,
    defender_mod: 0.08,
    sub_chance_mod: 0.0,
    auto_punish: false,
    counter_bonus: 0,
    stamina_recovery: 0,
  },
  [InteractionType.CAUGHT_TRANSITIONING]: {
    attacker_mod: -0.10,
    defender_mod: 0.10,
    sub_chance_mod: 0.0,
    auto_punish: true,
    counter_bonus: 0,
    stamina_recovery: 0,
  },
  [InteractionType.DOUBLE_SUB]: {
    attacker_mod: 0.0,
    defender_mod: 0.0,
    sub_chance_mod: 0.0,
    auto_punish: false,
    counter_bonus: 0,
    stamina_recovery: 0,
  },
  [InteractionType.POSITIONAL_SCRAMBLE]: {
    attacker_mod: -0.05,
    defender_mod: -0.05,
    sub_chance_mod: 0.0,
    auto_punish: false,
    counter_bonus: 0,
    stamina_recovery: 0,
  },
};

// ─── Stamina Costs ───

export const STAMINA_COSTS: Record<MoveType, number> = {
  [MoveType.ATK]: 10,
  [MoveType.DEF]: 5,
  [MoveType.TRN]: 5,
  [MoveType.SUB]: 16,
};

// ─── Purple Belt Config ───

export const PURPLE_BELT_CONFIG = {
  stat_min: 50,
  stat_max: 75,
  intelligence: 0.60,
  max_turns: 14,
} as const;

// ─── Advantage Pips ───

export const MAX_ADVANTAGE_PIPS = 5;
export const CHAIN_MOVE_PIP_COST = 2;
export const CHAIN_MOVE_PIP_THRESHOLD = 3;

// ─── Fighter Definitions ───

import type { Fighter } from "./types";
import { ALL_MOVES } from "./moves";

export const PLAYER_FIGHTER: Fighter = {
  name: "You",
  stats: {
    guard: 68,
    passing: 65,
    submissions: 72,
    escapes: 60,
    wrestling: 67,
    cardio: 65,
    strength: 62,
    leg_entanglements: 55,
  },
  moves: ALL_MOVES,
};

export const OPPONENT_FIGHTER: Fighter = {
  name: "Carlos",
  stats: {
    guard: 62,
    passing: 70,
    submissions: 60,
    escapes: 66,
    wrestling: 72,
    cardio: 68,
    strength: 70,
    leg_entanglements: 50,
  },
  moves: ALL_MOVES,
};

// ─── Dominance Color Thresholds ───

/** Returns a CSS color for a dominance value (0-10). */
export function getDominanceColor(dominance: number): string {
  if (dominance >= 8) return "#178642";      // Green — dominant
  if (dominance >= 6) return "#66A40D";      // Yellow-green — advantaged
  if (dominance >= 4) return "#CA8902";      // Amber — neutral
  if (dominance >= 2) return "#EB5909";      // Orange — disadvantaged
  return "#DB2626";                           // Red — desperate
}

// ─── Turn Timer ───

export const TURN_TIMER_SECONDS = 10;

// ─── UI Colors (game palette) ───

export const COMBAT_COLORS = {
  panel_bg: "#1A1F32",
  hud_bg: "#141424",
  gauge_bg: "#0D0D1A",
  button_bg: "#1A1F32",
  button_hover: "#242C42",
  button_pressed: "#141A28",

  gold_border: "#C0A040",
  secondary_border: "#404073",
  muted_border: "#4D4D4D",

  title_gold: "#F2CC40",
  body_text: "#DDE0EB",
  button_text: "#F2E6BF",
  secondary_text: "#9FAA7D",

  player_blue: "#61A5FA",
  opponent_red: "#F77171",

  success_green: "#4ADF80",
  fail_orange: "#FB9238",
  momentum_gold: "#FFC00A",

  atk_red: "#E65940",
  def_blue: "#4DA6E6",
  trn_gold: "#D9BF40",
  sub_purple: "#CC4DCC",

  stamina_fill: "#4CBE5C",
  stamina_bg: "#262832",
  stamina_low_pulse: "#FF9999",
} as const;

/** Returns the accent color for a move type. */
export function getMoveTypeColor(type: MoveType): string {
  switch (type) {
    case MoveType.ATK: return COMBAT_COLORS.atk_red;
    case MoveType.DEF: return COMBAT_COLORS.def_blue;
    case MoveType.TRN: return COMBAT_COLORS.trn_gold;
    case MoveType.SUB: return COMBAT_COLORS.sub_purple;
  }
}
