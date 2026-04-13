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

import type { Fighter, Move } from "./types";
import { ALL_MOVES } from "./moves";

// ─── Equipped Move Loadouts (3 per position, like the real game) ───

/** Player equipped moves — a mix showing off variety + legendaries */
const PLAYER_EQUIPPED_IDS: string[] = [
  // Standing: ATK + TRN + legendary ATK
  "single_leg", "pull_guard", "arm_drag",
  // Guard Bottom: SUB + ATK + TRN
  "triangle", "lumberjack_sweep", "stand_up",
  // Guard Top: ATK + ATK + legendary ATK
  "force_half_guard", "knee_slice_pass", "torreando_pass",
  // Half Guard Bottom: ATK + TRN + legendary ATK
  "underhook_sweep", "recover_guard", "octopus_guard_sweep",
  // Half Guard Top: ATK + SUB + TRN
  "pummel_pass", "kimura_half", "backstep_to_saddle",
  // Side Control Top: ATK + SUB + legendary ATK
  "throw_leg_mount", "kimura_side", "take_back_side",
  // Side Control Bottom: DEF + DEF + SUB
  "escape_to_guard", "frame_defense", "buggy_choke",
  // Mount Top: DEF + SUB + legendary ATK
  "maintain_mount", "armbar_mount", "take_back_mount",
  // Mount Bottom: DEF + DEF + DEF
  "upa", "elbow_escape", "survive_mount",
  // Back Control: legendary SUB + SUB + ATK
  "rnc", "twister", "mount_from_back",
  // Back Exposed: DEF + DEF + DEF
  "clear_hooks", "turtle_up", "hand_fight",
  // Turtle Top: ATK + ATK + SUB
  "hooks_aggressive", "take_back_turtle", "bulldog_choke",
  // Turtle Bottom: TRN + DEF + TRN
  "break_grips_stand", "granby_roll", "roll_to_saddle",
  // Front Headlock Attack: ATK + SUB + SUB
  "go_behind", "high_wrist_guillotine", "darce_choke",
  // Front Headlock Defend: TRN + DEF + TRN
  "pull_guard_headlock", "peek_out", "sucker_drag",
  // SLX Offense: ATK + SUB + SUB
  "slx_sweep", "slx_footlock", "slx_outside_heelhook",
  // SLX Defense: DEF + DEF + DEF
  "rip_leg_out", "disentangle_step_out", "strip_grip_pass",
  // Saddle Offense: SUB + SUB + ATK
  "saddle_inside_heelhook", "saddle_pass_heelhook", "saddle_to_back",
  // Saddle Defense: DEF + DEF + ATK
  "rip_leg_out_saddle", "hide_heel_extract", "counter_back_take",
];

/** Opponent equipped moves — more wrestling/pressure focused */
const OPPONENT_EQUIPPED_IDS: string[] = [
  // Standing
  "wrestle", "snapdown", "knee_tap",
  // Guard Bottom
  "armbar_guard", "sweep", "heist_snapdown",
  // Guard Top
  "force_half_guard", "double_under_pass", "knee_slice_pass",
  // Half Guard Bottom
  "underhook_sweep", "recover_guard", "enter_single_leg_x",
  // Half Guard Top
  "pummel_pass", "pass_to_side", "kimura_half",
  // Side Control Top
  "mount_transition", "kimura_side", "throw_leg_mount",
  // Side Control Bottom
  "escape_to_guard", "turtle_up_side_control", "frame_defense",
  // Mount Top
  "maintain_mount", "head_arm_choke", "smother_choke",
  // Mount Bottom
  "upa", "elbow_escape", "survive_mount",
  // Back Control
  "armbar_back", "mount_from_back", "rnc",
  // Back Exposed
  "clear_hooks", "turtle_up", "hand_fight",
  // Turtle Top
  "hooks_aggressive", "front_headlock_snap", "take_back_turtle",
  // Turtle Bottom
  "break_grips_stand", "break_grips_guard", "granby_roll",
  // Front Headlock Attack
  "cow_catcher", "go_behind", "high_wrist_guillotine",
  // Front Headlock Defend
  "handfight_stand", "peek_out", "pull_guard_headlock",
  // SLX Offense
  "slx_sweep", "slx_footlock", "slx_outside_heelhook",
  // SLX Defense
  "rip_leg_out", "disentangle_step_out", "strip_grip_pass",
  // Saddle Offense
  "ankle_lock_secondary", "saddle_inside_heelhook", "saddle_to_back",
  // Saddle Defense
  "rip_leg_out_saddle", "hide_heel_extract", "counter_back_take",
];

function filterMovesByIds(ids: string[], boostSubs: boolean = false): Move[] {
  return ALL_MOVES
    .filter((m) => ids.includes(m.id))
    .map((m) => {
      if (!boostSubs || m.type !== MoveType.SUB) return m;
      // Boost player sub chances for demo purposes
      return {
        ...m,
        base_chance: Math.min(0.95, m.base_chance + 0.15),
        sub_chance: m.sub_chance ? Math.min(0.95, m.sub_chance + 0.20) : undefined,
      };
    });
}

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
  moves: filterMovesByIds(PLAYER_EQUIPPED_IDS, true), // boost subs for demo
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
  moves: filterMovesByIds(OPPONENT_EQUIPPED_IDS),
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
