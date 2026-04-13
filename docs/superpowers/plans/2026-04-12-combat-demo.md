# Combat Demo & Feature Highlights — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive BJJ combat demo (full engine port) and feature highlights section for the Hobbyist Games landing page.

**Architecture:** Pure TypeScript combat engine (`src/lib/combat/`) consumed by React components (`src/components/combat/`). Engine is a state machine with no React dependencies. UI uses useReducer for state management, CSS transitions for animations, and HTML Canvas for the submission gauge. Feature highlights is a simple static component.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, HTML Canvas

**Spec:** `docs/superpowers/specs/2026-04-12-combat-demo-features-design.md`

---

## File Structure

```
src/
  lib/
    combat/
      types.ts              — CREATE: all TypeScript types and enums
      constants.ts          — CREATE: position data, interaction table, belt config, stamina costs
      moves.ts              — CREATE: player + opponent move pools (~25 + ~20 moves)
      engine.ts             — CREATE: pure combat engine (resolve turn, success calc, win check)
      ai.ts                 — CREATE: AI move selection (purple belt intelligence)
      gauge.ts              — CREATE: submission gauge logic (zones, needle math, result)
  components/
    combat/
      CombatDemo.tsx        — CREATE: top-level section (pre-match / in-match / post-match)
      Scoreboard.tsx        — CREATE: names, belt badges, scores, turn counter
      StaminaBar.tsx        — CREATE: animated stamina bar with hurt pulse
      AdvantagePips.tsx     — CREATE: 5 pips per fighter (gold fill)
      PositionDisplay.tsx   — CREATE: position name + dominance color bar
      FighterSprite.tsx     — CREATE: animated pixel art sprite (CSS sprite technique)
      MoveSelection.tsx     — CREATE: move buttons grid with type colors
      TurnTimer.tsx         — CREATE: 10-second countdown bar
      ResolveOverlay.tsx    — CREATE: turn resolution animation sequence
      SubmissionGauge.tsx   — CREATE: canvas-based gauge mini-game
      MatchResult.tsx       — CREATE: end screen with CTA
    FeatureHighlights.tsx   — CREATE: 5 feature cards section
  app/
    page.tsx                — MODIFY: replace Preview with CombatDemo, add FeatureHighlights
```

---

## Task 1: Types & Constants

**Files:** Create `src/lib/combat/types.ts`, `src/lib/combat/constants.ts`

- [ ] **Step 1: Create `src/lib/combat/types.ts`**

```typescript
// src/lib/combat/types.ts
// All TypeScript types and enums for the combat engine.

/** 19 BJJ positions. Gap at 1 is intentional (deleted CLINCH). */
export enum Position {
  STANDING = 0,
  // 1 intentionally skipped (former CLINCH)
  GUARD_TOP = 2,
  GUARD_BOTTOM = 3,
  HALF_GUARD_TOP = 4,
  HALF_GUARD_BOTTOM = 5,
  SIDE_CONTROL_TOP = 6,
  SIDE_CONTROL_BOTTOM = 7,
  MOUNT_TOP = 8,
  MOUNT_BOTTOM = 9,
  BACK_CONTROL = 10,
  BACK_EXPOSED = 11,
  TURTLE_TOP = 12,
  TURTLE_BOTTOM = 13,
  FRONT_HEADLOCK_ATTACK = 14,
  FRONT_HEADLOCK_DEFEND = 15,
  SINGLE_LEG_X_OFFENSE = 16,
  SINGLE_LEG_X_DEFENSE = 17,
  SADDLE_OFFENSE = 18,
  SADDLE_DEFENSE = 19,
}

export enum MoveType {
  ATK = "ATK",
  DEF = "DEF",
  TRN = "TRN",
  SUB = "SUB",
}

export enum InteractionType {
  CONTESTED = "CONTESTED",
  COUNTER = "COUNTER",
  SCRAMBLE = "SCRAMBLE",
  SUB_DEFENDED = "SUB_DEFENDED",
  SUB_GAMBLE = "SUB_GAMBLE",
  STALL = "STALL",
  REPOSITION = "REPOSITION",
  CAUGHT_TRANSITIONING = "CAUGHT_TRANSITIONING",
  DOUBLE_SUB = "DOUBLE_SUB",
  POSITIONAL_SCRAMBLE = "POSITIONAL_SCRAMBLE",
}

export enum MoveRarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

export type StatName =
  | "guard"
  | "passing"
  | "submissions"
  | "escapes"
  | "wrestling"
  | "cardio"
  | "strength"
  | "leg_entanglements";

export interface FighterStats {
  guard: number;
  passing: number;
  submissions: number;
  escapes: number;
  wrestling: number;
  cardio: number;
  strength: number;
  leg_entanglements: number;
}

export interface Fighter {
  name: string;
  stats: FighterStats;
  moves: Move[];
}

export interface Move {
  id: string;
  name: string;
  type: MoveType;
  /** Which stat governs this move's success */
  stat: StatName;
  /** Base success chance 0.0-1.0 */
  base_chance: number;
  /** BJJ points awarded on success */
  points: number;
  /** Position the attacker must be in to use this move */
  from_position: Position;
  /** Position attacker moves to on success */
  success_position: Position;
  /** Position attacker moves to on failure */
  fail_position: Position;
  rarity: MoveRarity;
  /** For SUB moves: base submission chance 0.0-1.0 */
  sub_chance?: number;
  /** Whether this is a chain move (requires 3+ advantage pips, costs 2) */
  is_chain?: boolean;
}

export interface InteractionModifiers {
  attacker_mod: number;
  defender_mod: number;
  sub_chance_mod: number;
  auto_punish: boolean;
  counter_bonus: number;
  stamina_recovery: number;
}

export interface PositionData {
  name: string;
  dominance: number;
  pair: Position;
}

export interface FighterState {
  position: Position;
  stamina: number;
  score: number;
  advantage_pips: number;
}

export interface GameState {
  player: FighterState;
  opponent: FighterState;
  current_turn: number;
  max_turns: number;
  phase: "pre-match" | "selecting" | "resolving" | "submission-gauge" | "post-match";
  /** Last turn result for display */
  last_result: TurnResult | null;
  /** Winner at end of match */
  winner: "player" | "opponent" | "draw" | null;
  win_method: "submission" | "points" | "decision" | null;
}

export interface TurnResult {
  player_move: Move;
  opponent_move: Move;
  interaction: InteractionType;
  /** Did the player's move succeed? */
  player_success: boolean;
  /** Did the opponent's move succeed? */
  opponent_success: boolean;
  /** Points scored this turn by player */
  player_points: number;
  /** Points scored this turn by opponent */
  opponent_points: number;
  /** Stamina drained from player */
  player_stamina_drain: number;
  /** Stamina drained from opponent */
  opponent_stamina_drain: number;
  /** New player position after resolution */
  new_player_position: Position;
  /** New opponent position after resolution */
  new_opponent_position: Position;
  /** Whether a submission attempt was triggered */
  submission_triggered: boolean;
  /** Whether the submission succeeded (after gauge) */
  submission_success: boolean;
  /** Who attempted the submission */
  submission_attacker: "player" | "opponent" | null;
}

export interface GaugeZone {
  label: string;
  /** Width as fraction of total gauge (0.0-1.0) */
  width: number;
  color: string;
  /** Alpha value for rendering */
  alpha: number;
  /** Modifier applied to submission chance (-1.0 to 1.0) */
  modifier: number;
}

export interface GaugeConfig {
  zones: GaugeZone[];
  /** Number of bounces before auto-stop */
  max_bounces: number;
  /** Speed multiplier per bounce (< 1.0 = deceleration) */
  bounce_speed_ramp: number;
  /** Base sweep duration in seconds */
  base_sweep_duration: number;
}

export interface GaugeResult {
  zone_index: number;
  zone_label: string;
  modifier: number;
  /** Final submission success after zone modifier */
  success: boolean;
}
```

- [ ] **Step 2: Create `src/lib/combat/constants.ts`**

```typescript
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

export const PLAYER_FIGHTER: Omit<Fighter, "moves"> = {
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
};

export const OPPONENT_FIGHTER: Omit<Fighter, "moves"> = {
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

  atk_red: "#D93333",
  def_blue: "#408CE0",
  trn_blue: "#408CE0",
  sub_purple: "#BF8CFF",

  stamina_fill: "#4CBE5C",
  stamina_bg: "#262832",
  stamina_low_pulse: "#FF9999",
} as const;

/** Returns the accent color for a move type. */
export function getMoveTypeColor(type: MoveType): string {
  switch (type) {
    case MoveType.ATK: return COMBAT_COLORS.atk_red;
    case MoveType.DEF: return COMBAT_COLORS.def_blue;
    case MoveType.TRN: return COMBAT_COLORS.trn_blue;
    case MoveType.SUB: return COMBAT_COLORS.sub_purple;
  }
}
```

- [ ] **Step 3: Verify** — `npm run build` must pass with no errors.

- [ ] **Step 4: Commit** — `git add src/lib/combat/types.ts src/lib/combat/constants.ts && git commit -m "feat(combat): add types and constants for combat engine"`

---

## Task 2: Move Data

**Files:** Create `src/lib/combat/moves.ts`

This task defines the complete move pool. Every position must have at least 2 moves for both player and opponent so the AI and player always have options. Moves must use correct `from_position`, `success_position`, `fail_position`, `stat`, and `type` values.

- [ ] **Step 1: Create `src/lib/combat/moves.ts`**

```typescript
// src/lib/combat/moves.ts
// Complete move pools for player and opponent fighters.

import { Position, MoveType, MoveRarity, type Move } from "./types";

// ─── Player Moves (~25, including 2–3 legendary) ───

export const PLAYER_MOVES: Move[] = [
  // === STANDING ===
  {
    id: "p_takedown",
    name: "Takedown",
    type: MoveType.ATK,
    stat: "wrestling",
    base_chance: 0.55,
    points: 2,
    from_position: Position.STANDING,
    success_position: Position.GUARD_TOP,
    fail_position: Position.STANDING,
    rarity: MoveRarity.COMMON,
  },
  {
    id: "p_pull_guard",
    name: "Pull Guard",
    type: MoveType.TRN,
    stat: "guard",
    base_chance: 0.70,
    points: 0,
    from_position: Position.STANDING,
    success_position: Position.GUARD_BOTTOM,
    fail_position: Position.STANDING,
    rarity: MoveRarity.COMMON,
  },
  {
    id: "p_sprawl",
    name: "Sprawl",
    type: MoveType.DEF,
    stat: "wrestling",
    base_chance: 0.65,
    points: 0,
    from_position: Position.STANDING,
    success_position: Position.FRONT_HEADLOCK_ATTACK,
    fail_position: Position.STANDING,
    rarity: MoveRarity.COMMON,
  },

  // === GUARD TOP ===
  {
    id: "p_guard_pass",
    name: "Guard Pass",
    type: MoveType.ATK,
    stat: "passing",
    base_chance: 0.45,
    points: 3,
    from_position: Position.GUARD_TOP,
    success_position: Position.SIDE_CONTROL_TOP,
    fail_position: Position.GUARD_TOP,
    rarity: MoveRarity.UNCOMMON,
  },
  {
    id: "p_stack_pass",
    name: "Stack Pass",
    type: MoveType.ATK,
    stat: "strength",
    base_chance: 0.50,
    points: 3,
    from_position: Position.GUARD_TOP,
    success_position: Position.HALF_GUARD_TOP,
    fail_position: Position.GUARD_TOP,
    rarity: MoveRarity.COMMON,
  },

  // === GUARD BOTTOM ===
  {
    id: "p_triangle",
    name: "Triangle",
    type: MoveType.SUB,
    stat: "guard",
    base_chance: 0.50,
    points: 0,
    from_position: Position.GUARD_BOTTOM,
    success_position: Position.GUARD_BOTTOM,
    fail_position: Position.GUARD_BOTTOM,
    rarity: MoveRarity.UNCOMMON,
    sub_chance: 0.35,
  },
  {
    id: "p_armbar_guard",
    name: "Armbar",
    type: MoveType.SUB,
    stat: "submissions",
    base_chance: 0.45,
    points: 0,
    from_position: Position.GUARD_BOTTOM,
    success_position: Position.GUARD_BOTTOM,
    fail_position: Position.HALF_GUARD_BOTTOM,
    rarity: MoveRarity.RARE,
    sub_chance: 0.40,
  },
  {
    id: "p_hip_bump_sweep",
    name: "Hip Bump Sweep",
    type: MoveType.ATK,
    stat: "guard",
    base_chance: 0.50,
    points: 2,
    from_position: Position.GUARD_BOTTOM,
    success_position: Position.MOUNT_TOP,
    fail_position: Position.GUARD_BOTTOM,
    rarity: MoveRarity.UNCOMMON,
  },

  // === HALF GUARD TOP ===
  {
    id: "p_half_pass",
    name: "Knee Slide Pass",
    type: MoveType.ATK,
    stat: "passing",
    base_chance: 0.55,
    points: 3,
    from_position: Position.HALF_GUARD_TOP,
    success_position: Position.SIDE_CONTROL_TOP,
    fail_position: Position.HALF_GUARD_TOP,
    rarity: MoveRarity.COMMON,
  },

  // === HALF GUARD BOTTOM ===
  {
    id: "p_half_sweep",
    name: "Dogfight Sweep",
    type: MoveType.ATK,
    stat: "guard",
    base_chance: 0.45,
    points: 2,
    from_position: Position.HALF_GUARD_BOTTOM,
    success_position: Position.HALF_GUARD_TOP,
    fail_position: Position.HALF_GUARD_BOTTOM,
    rarity: MoveRarity.UNCOMMON,
  },
  {
    id: "p_half_recover",
    name: "Recover Full Guard",
    type: MoveType.DEF,
    stat: "guard",
    base_chance: 0.60,
    points: 0,
    from_position: Position.HALF_GUARD_BOTTOM,
    success_position: Position.GUARD_BOTTOM,
    fail_position: Position.HALF_GUARD_BOTTOM,
    rarity: MoveRarity.COMMON,
  },

  // === SIDE CONTROL TOP ===
  {
    id: "p_mount_transition",
    name: "Advance to Mount",
    type: MoveType.TRN,
    stat: "passing",
    base_chance: 0.50,
    points: 4,
    from_position: Position.SIDE_CONTROL_TOP,
    success_position: Position.MOUNT_TOP,
    fail_position: Position.SIDE_CONTROL_TOP,
    rarity: MoveRarity.UNCOMMON,
  },
  {
    id: "p_americana",
    name: "Americana",
    type: MoveType.SUB,
    stat: "submissions",
    base_chance: 0.45,
    points: 0,
    from_position: Position.SIDE_CONTROL_TOP,
    success_position: Position.SIDE_CONTROL_TOP,
    fail_position: Position.GUARD_TOP,
    rarity: MoveRarity.UNCOMMON,
    sub_chance: 0.30,
  },

  // === SIDE CONTROL BOTTOM ===
  {
    id: "p_side_escape",
    name: "Hip Escape",
    type: MoveType.DEF,
    stat: "escapes",
    base_chance: 0.45,
    points: 0,
    from_position: Position.SIDE_CONTROL_BOTTOM,
    success_position: Position.GUARD_BOTTOM,
    fail_position: Position.SIDE_CONTROL_BOTTOM,
    rarity: MoveRarity.COMMON,
  },
  {
    id: "p_underhook_escape",
    name: "Underhook Escape",
    type: MoveType.TRN,
    stat: "escapes",
    base_chance: 0.40,
    points: 0,
    from_position: Position.SIDE_CONTROL_BOTTOM,
    success_position: Position.HALF_GUARD_BOTTOM,
    fail_position: Position.SIDE_CONTROL_BOTTOM,
    rarity: MoveRarity.COMMON,
  },

  // === MOUNT TOP ===
  {
    id: "p_mounted_armbar",
    name: "Mounted Armbar",
    type: MoveType.SUB,
    stat: "submissions",
    base_chance: 0.50,
    points: 0,
    from_position: Position.MOUNT_TOP,
    success_position: Position.MOUNT_TOP,
    fail_position: Position.GUARD_TOP,
    rarity: MoveRarity.RARE,
    sub_chance: 0.45,
  },
  {
    id: "p_back_take_mount",
    name: "Take the Back",
    type: MoveType.TRN,
    stat: "passing",
    base_chance: 0.45,
    points: 4,
    from_position: Position.MOUNT_TOP,
    success_position: Position.BACK_CONTROL,
    fail_position: Position.MOUNT_TOP,
    rarity: MoveRarity.RARE,
  },

  // === MOUNT BOTTOM ===
  {
    id: "p_mount_bridge",
    name: "Bridge Escape",
    type: MoveType.DEF,
    stat: "escapes",
    base_chance: 0.40,
    points: 0,
    from_position: Position.MOUNT_BOTTOM,
    success_position: Position.GUARD_BOTTOM,
    fail_position: Position.MOUNT_BOTTOM,
    rarity: MoveRarity.COMMON,
  },

  // === BACK CONTROL ===
  {
    id: "p_rnc",
    name: "Rear Naked Choke",
    type: MoveType.SUB,
    stat: "submissions",
    base_chance: 0.55,
    points: 0,
    from_position: Position.BACK_CONTROL,
    success_position: Position.BACK_CONTROL,
    fail_position: Position.TURTLE_TOP,
    rarity: MoveRarity.LEGENDARY,
    sub_chance: 0.55,
  },

  // === BACK EXPOSED ===
  {
    id: "p_back_escape",
    name: "Escape Back Control",
    type: MoveType.DEF,
    stat: "escapes",
    base_chance: 0.40,
    points: 0,
    from_position: Position.BACK_EXPOSED,
    success_position: Position.GUARD_BOTTOM,
    fail_position: Position.BACK_EXPOSED,
    rarity: MoveRarity.COMMON,
  },

  // === TURTLE TOP ===
  {
    id: "p_turtle_back_take",
    name: "Back Take from Turtle",
    type: MoveType.TRN,
    stat: "passing",
    base_chance: 0.55,
    points: 4,
    from_position: Position.TURTLE_TOP,
    success_position: Position.BACK_CONTROL,
    fail_position: Position.TURTLE_TOP,
    rarity: MoveRarity.UNCOMMON,
  },

  // === TURTLE BOTTOM ===
  {
    id: "p_turtle_sit_out",
    name: "Sit Out",
    type: MoveType.DEF,
    stat: "wrestling",
    base_chance: 0.50,
    points: 0,
    from_position: Position.TURTLE_BOTTOM,
    success_position: Position.GUARD_BOTTOM,
    fail_position: Position.TURTLE_BOTTOM,
    rarity: MoveRarity.COMMON,
  },

  // === FRONT HEADLOCK ATTACK ===
  {
    id: "p_guillotine",
    name: "Guillotine",
    type: MoveType.SUB,
    stat: "submissions",
    base_chance: 0.50,
    points: 0,
    from_position: Position.FRONT_HEADLOCK_ATTACK,
    success_position: Position.FRONT_HEADLOCK_ATTACK,
    fail_position: Position.GUARD_TOP,
    rarity: MoveRarity.EPIC,
    sub_chance: 0.40,
  },
  {
    id: "p_snap_down",
    name: "Snap Down",
    type: MoveType.ATK,
    stat: "wrestling",
    base_chance: 0.55,
    points: 2,
    from_position: Position.FRONT_HEADLOCK_ATTACK,
    success_position: Position.TURTLE_TOP,
    fail_position: Position.STANDING,
    rarity: MoveRarity.COMMON,
  },

  // === FRONT HEADLOCK DEFEND ===
  {
    id: "p_fl_defend",
    name: "Posture Up",
    type: MoveType.DEF,
    stat: "wrestling",
    base_chance: 0.55,
    points: 0,
    from_position: Position.FRONT_HEADLOCK_DEFEND,
    success_position: Position.STANDING,
    fail_position: Position.FRONT_HEADLOCK_DEFEND,
    rarity: MoveRarity.COMMON,
  },

  // === SINGLE LEG X OFFENSE ===
  {
    id: "p_slx_sweep",
    name: "SLX Sweep",
    type: MoveType.ATK,
    stat: "leg_entanglements",
    base_chance: 0.50,
    points: 2,
    from_position: Position.SINGLE_LEG_X_OFFENSE,
    success_position: Position.SADDLE_OFFENSE,
    fail_position: Position.SINGLE_LEG_X_OFFENSE,
    rarity: MoveRarity.UNCOMMON,
  },

  // === SINGLE LEG X DEFENSE ===
  {
    id: "p_slx_defend",
    name: "Disengage Legs",
    type: MoveType.DEF,
    stat: "leg_entanglements",
    base_chance: 0.55,
    points: 0,
    from_position: Position.SINGLE_LEG_X_DEFENSE,
    success_position: Position.STANDING,
    fail_position: Position.SINGLE_LEG_X_DEFENSE,
    rarity: MoveRarity.COMMON,
  },

  // === SADDLE OFFENSE ===
  {
    id: "p_heel_hook",
    name: "Heel Hook",
    type: MoveType.SUB,
    stat: "leg_entanglements",
    base_chance: 0.50,
    points: 0,
    from_position: Position.SADDLE_OFFENSE,
    success_position: Position.SADDLE_OFFENSE,
    fail_position: Position.GUARD_BOTTOM,
    rarity: MoveRarity.LEGENDARY,
    sub_chance: 0.50,
  },

  // === SADDLE DEFENSE ===
  {
    id: "p_saddle_escape",
    name: "Clear Knee Line",
    type: MoveType.DEF,
    stat: "leg_entanglements",
    base_chance: 0.45,
    points: 0,
    from_position: Position.SADDLE_DEFENSE,
    success_position: Position.STANDING,
    fail_position: Position.SADDLE_DEFENSE,
    rarity: MoveRarity.UNCOMMON,
  },
];

// ─── Opponent Moves (~20, no legendary) ───

export const OPPONENT_MOVES: Move[] = [
  // === STANDING ===
  {
    id: "o_blast_double",
    name: "Blast Double",
    type: MoveType.ATK,
    stat: "wrestling",
    base_chance: 0.60,
    points: 2,
    from_position: Position.STANDING,
    success_position: Position.GUARD_TOP,
    fail_position: Position.STANDING,
    rarity: MoveRarity.UNCOMMON,
  },
  {
    id: "o_sprawl",
    name: "Sprawl",
    type: MoveType.DEF,
    stat: "wrestling",
    base_chance: 0.65,
    points: 0,
    from_position: Position.STANDING,
    success_position: Position.FRONT_HEADLOCK_ATTACK,
    fail_position: Position.STANDING,
    rarity: MoveRarity.COMMON,
  },

  // === GUARD TOP ===
  {
    id: "o_pressure_pass",
    name: "Pressure Pass",
    type: MoveType.ATK,
    stat: "passing",
    base_chance: 0.55,
    points: 3,
    from_position: Position.GUARD_TOP,
    success_position: Position.SIDE_CONTROL_TOP,
    fail_position: Position.GUARD_TOP,
    rarity: MoveRarity.UNCOMMON,
  },

  // === GUARD BOTTOM ===
  {
    id: "o_scissor_sweep",
    name: "Scissor Sweep",
    type: MoveType.ATK,
    stat: "guard",
    base_chance: 0.45,
    points: 2,
    from_position: Position.GUARD_BOTTOM,
    success_position: Position.MOUNT_TOP,
    fail_position: Position.GUARD_BOTTOM,
    rarity: MoveRarity.COMMON,
  },
  {
    id: "o_guard_retain",
    name: "Retain Guard",
    type: MoveType.DEF,
    stat: "guard",
    base_chance: 0.65,
    points: 0,
    from_position: Position.GUARD_BOTTOM,
    success_position: Position.GUARD_BOTTOM,
    fail_position: Position.HALF_GUARD_BOTTOM,
    rarity: MoveRarity.COMMON,
  },

  // === HALF GUARD TOP ===
  {
    id: "o_half_smash",
    name: "Smash Pass",
    type: MoveType.ATK,
    stat: "strength",
    base_chance: 0.55,
    points: 3,
    from_position: Position.HALF_GUARD_TOP,
    success_position: Position.SIDE_CONTROL_TOP,
    fail_position: Position.HALF_GUARD_TOP,
    rarity: MoveRarity.UNCOMMON,
  },

  // === HALF GUARD BOTTOM ===
  {
    id: "o_hg_recover",
    name: "Recover Guard",
    type: MoveType.DEF,
    stat: "guard",
    base_chance: 0.55,
    points: 0,
    from_position: Position.HALF_GUARD_BOTTOM,
    success_position: Position.GUARD_BOTTOM,
    fail_position: Position.HALF_GUARD_BOTTOM,
    rarity: MoveRarity.COMMON,
  },

  // === SIDE CONTROL TOP ===
  {
    id: "o_knee_on_belly",
    name: "Knee on Belly",
    type: MoveType.ATK,
    stat: "passing",
    base_chance: 0.55,
    points: 2,
    from_position: Position.SIDE_CONTROL_TOP,
    success_position: Position.MOUNT_TOP,
    fail_position: Position.SIDE_CONTROL_TOP,
    rarity: MoveRarity.UNCOMMON,
  },
  {
    id: "o_kimura_sc",
    name: "Kimura",
    type: MoveType.SUB,
    stat: "submissions",
    base_chance: 0.45,
    points: 0,
    from_position: Position.SIDE_CONTROL_TOP,
    success_position: Position.SIDE_CONTROL_TOP,
    fail_position: Position.GUARD_TOP,
    rarity: MoveRarity.RARE,
    sub_chance: 0.30,
  },

  // === SIDE CONTROL BOTTOM ===
  {
    id: "o_frame_escape",
    name: "Frame Escape",
    type: MoveType.DEF,
    stat: "escapes",
    base_chance: 0.45,
    points: 0,
    from_position: Position.SIDE_CONTROL_BOTTOM,
    success_position: Position.GUARD_BOTTOM,
    fail_position: Position.SIDE_CONTROL_BOTTOM,
    rarity: MoveRarity.COMMON,
  },

  // === MOUNT TOP ===
  {
    id: "o_cross_choke",
    name: "Cross Choke",
    type: MoveType.SUB,
    stat: "submissions",
    base_chance: 0.45,
    points: 0,
    from_position: Position.MOUNT_TOP,
    success_position: Position.MOUNT_TOP,
    fail_position: Position.GUARD_TOP,
    rarity: MoveRarity.RARE,
    sub_chance: 0.35,
  },

  // === MOUNT BOTTOM ===
  {
    id: "o_upa_escape",
    name: "Upa Escape",
    type: MoveType.DEF,
    stat: "escapes",
    base_chance: 0.40,
    points: 0,
    from_position: Position.MOUNT_BOTTOM,
    success_position: Position.GUARD_BOTTOM,
    fail_position: Position.MOUNT_BOTTOM,
    rarity: MoveRarity.COMMON,
  },

  // === BACK CONTROL ===
  {
    id: "o_rnc",
    name: "Rear Naked Choke",
    type: MoveType.SUB,
    stat: "submissions",
    base_chance: 0.50,
    points: 0,
    from_position: Position.BACK_CONTROL,
    success_position: Position.BACK_CONTROL,
    fail_position: Position.TURTLE_TOP,
    rarity: MoveRarity.EPIC,
    sub_chance: 0.45,
  },

  // === BACK EXPOSED ===
  {
    id: "o_turtle_up",
    name: "Turtle Up",
    type: MoveType.DEF,
    stat: "escapes",
    base_chance: 0.45,
    points: 0,
    from_position: Position.BACK_EXPOSED,
    success_position: Position.TURTLE_BOTTOM,
    fail_position: Position.BACK_EXPOSED,
    rarity: MoveRarity.COMMON,
  },

  // === TURTLE TOP ===
  {
    id: "o_clock_choke",
    name: "Clock Choke",
    type: MoveType.ATK,
    stat: "passing",
    base_chance: 0.50,
    points: 2,
    from_position: Position.TURTLE_TOP,
    success_position: Position.BACK_CONTROL,
    fail_position: Position.TURTLE_TOP,
    rarity: MoveRarity.UNCOMMON,
  },

  // === TURTLE BOTTOM ===
  {
    id: "o_granby_roll",
    name: "Granby Roll",
    type: MoveType.DEF,
    stat: "wrestling",
    base_chance: 0.50,
    points: 0,
    from_position: Position.TURTLE_BOTTOM,
    success_position: Position.GUARD_BOTTOM,
    fail_position: Position.TURTLE_BOTTOM,
    rarity: MoveRarity.COMMON,
  },

  // === FRONT HEADLOCK ATTACK ===
  {
    id: "o_darce",
    name: "D'Arce Choke",
    type: MoveType.SUB,
    stat: "submissions",
    base_chance: 0.45,
    points: 0,
    from_position: Position.FRONT_HEADLOCK_ATTACK,
    success_position: Position.FRONT_HEADLOCK_ATTACK,
    fail_position: Position.GUARD_TOP,
    rarity: MoveRarity.RARE,
    sub_chance: 0.35,
  },

  // === FRONT HEADLOCK DEFEND ===
  {
    id: "o_fl_escape",
    name: "Posture Up",
    type: MoveType.DEF,
    stat: "wrestling",
    base_chance: 0.55,
    points: 0,
    from_position: Position.FRONT_HEADLOCK_DEFEND,
    success_position: Position.STANDING,
    fail_position: Position.FRONT_HEADLOCK_DEFEND,
    rarity: MoveRarity.COMMON,
  },

  // === SLX OFFENSE ===
  {
    id: "o_slx_heel_hook",
    name: "Heel Hook Entry",
    type: MoveType.TRN,
    stat: "leg_entanglements",
    base_chance: 0.45,
    points: 0,
    from_position: Position.SINGLE_LEG_X_OFFENSE,
    success_position: Position.SADDLE_OFFENSE,
    fail_position: Position.SINGLE_LEG_X_OFFENSE,
    rarity: MoveRarity.UNCOMMON,
  },

  // === SLX DEFENSE ===
  {
    id: "o_slx_clear",
    name: "Clear Legs",
    type: MoveType.DEF,
    stat: "leg_entanglements",
    base_chance: 0.55,
    points: 0,
    from_position: Position.SINGLE_LEG_X_DEFENSE,
    success_position: Position.STANDING,
    fail_position: Position.SINGLE_LEG_X_DEFENSE,
    rarity: MoveRarity.COMMON,
  },

  // === SADDLE OFFENSE ===
  {
    id: "o_straight_ankle",
    name: "Straight Ankle Lock",
    type: MoveType.SUB,
    stat: "leg_entanglements",
    base_chance: 0.45,
    points: 0,
    from_position: Position.SADDLE_OFFENSE,
    success_position: Position.SADDLE_OFFENSE,
    fail_position: Position.GUARD_BOTTOM,
    rarity: MoveRarity.RARE,
    sub_chance: 0.35,
  },

  // === SADDLE DEFENSE ===
  {
    id: "o_saddle_escape",
    name: "Boot Scoot",
    type: MoveType.DEF,
    stat: "leg_entanglements",
    base_chance: 0.45,
    points: 0,
    from_position: Position.SADDLE_DEFENSE,
    success_position: Position.STANDING,
    fail_position: Position.SADDLE_DEFENSE,
    rarity: MoveRarity.COMMON,
  },
];
```

- [ ] **Step 2: Verify** — `npm run build` must pass with no errors.

- [ ] **Step 3: Commit** — `git add src/lib/combat/moves.ts && git commit -m "feat(combat): add player and opponent move pools"`

---

## Task 3: Combat Engine Core

**Files:** Create `src/lib/combat/engine.ts`

All functions are pure — state in, new state out. Randomness is injected via a `rng` parameter (a `() => number` function returning 0.0-1.0) so results are deterministic in tests.

- [ ] **Step 1: Create `src/lib/combat/engine.ts`**

```typescript
// src/lib/combat/engine.ts
// Pure combat engine — no React, no DOM, no side effects.

import {
  Position,
  MoveType,
  InteractionType,
  type Move,
  type Fighter,
  type FighterStats,
  type GameState,
  type FighterState,
  type TurnResult,
} from "./types";
import {
  POSITIONS,
  INTERACTION_TABLE,
  INTERACTION_MODIFIERS,
  STAMINA_COSTS,
  PURPLE_BELT_CONFIG,
  MAX_ADVANTAGE_PIPS,
  CHAIN_MOVE_PIP_COST,
  CHAIN_MOVE_PIP_THRESHOLD,
  getOpposingPosition,
} from "./constants";
import { PLAYER_MOVES, OPPONENT_MOVES } from "./moves";

type RNG = () => number;

/** Create the initial game state. Both fighters start Standing, full stamina. */
export function createInitialState(): GameState {
  return {
    player: {
      position: Position.STANDING,
      stamina: 100,
      score: 0,
      advantage_pips: 0,
    },
    opponent: {
      position: Position.STANDING,
      stamina: 100,
      score: 0,
      advantage_pips: 0,
    },
    current_turn: 1,
    max_turns: PURPLE_BELT_CONFIG.max_turns,
    phase: "pre-match",
    last_result: null,
    winner: null,
    win_method: null,
  };
}

/** Get available moves for a fighter at their current position. */
export function getAvailableMoves(
  fighter: Fighter,
  state: FighterState
): Move[] {
  return fighter.moves.filter((move) => {
    // Must be at the correct position
    if (move.from_position !== state.position) return false;
    // Must have enough stamina
    if (state.stamina < STAMINA_COSTS[move.type]) return false;
    // Chain moves require 3+ pips
    if (move.is_chain && state.advantage_pips < CHAIN_MOVE_PIP_THRESHOLD) return false;
    return true;
  });
}

/**
 * Stat advantage formula:
 * ((attackerStat * attackerStamina/100) - (defenderStat * defenderStamina/100)) / 200.0
 */
export function calculateStatAdvantage(
  attackerStatValue: number,
  attackerStamina: number,
  defenderStatValue: number,
  defenderStamina: number
): number {
  const attackerEffective = attackerStatValue * (attackerStamina / 100);
  const defenderEffective = defenderStatValue * (defenderStamina / 100);
  return (attackerEffective - defenderEffective) / 200.0;
}

/**
 * Calculate final success chance for a move given interaction context.
 * Returns a clamped 0.0-1.0 probability.
 */
export function calculateSuccessChance(
  move: Move,
  attackerStats: FighterStats,
  attackerStamina: number,
  defenderStats: FighterStats,
  defenderStamina: number,
  interaction: InteractionType,
  isAttacker: boolean
): number {
  const mods = INTERACTION_MODIFIERS[interaction];

  // Determine relevant defender stat (use the same stat category for opposition)
  const attackerStatVal = attackerStats[move.stat];
  const defenderStatVal = defenderStats[move.stat];

  // Base chance + stat advantage
  const statAdv = calculateStatAdvantage(
    attackerStatVal,
    attackerStamina,
    defenderStatVal,
    defenderStamina
  );

  // Apply interaction modifier (attacker_mod helps the attacker, defender_mod helps the defender)
  const interactionMod = isAttacker ? mods.attacker_mod : mods.defender_mod;

  let chance = move.base_chance + statAdv + interactionMod;

  // Clamp to 0.05-0.95 (always some chance of success/failure)
  return Math.max(0.05, Math.min(0.95, chance));
}

/**
 * Resolve a full turn given both fighters' moves.
 * Returns a new GameState and TurnResult.
 */
export function resolveTurn(
  state: GameState,
  playerFighter: Fighter,
  opponentFighter: Fighter,
  playerMove: Move,
  opponentMove: Move,
  rng: RNG
): { newState: GameState; result: TurnResult } {
  // Determine interaction
  const interaction = INTERACTION_TABLE[playerMove.type][opponentMove.type];
  const mods = INTERACTION_MODIFIERS[interaction];

  // Calculate success chances
  const playerChance = calculateSuccessChance(
    playerMove,
    playerFighter.stats,
    state.player.stamina,
    opponentFighter.stats,
    state.opponent.stamina,
    interaction,
    true
  );
  const opponentChance = calculateSuccessChance(
    opponentMove,
    opponentFighter.stats,
    state.opponent.stamina,
    playerFighter.stats,
    state.player.stamina,
    interaction,
    false
  );

  // Roll for success
  const playerSuccess = rng() < playerChance;
  const opponentSuccess = rng() < opponentChance;

  // Apply stamina drain
  let playerStaminaDrain = STAMINA_COSTS[playerMove.type];
  let opponentStaminaDrain = STAMINA_COSTS[opponentMove.type];

  // Stamina recovery from stall
  if (mods.stamina_recovery > 0) {
    playerStaminaDrain = Math.max(0, playerStaminaDrain - mods.stamina_recovery);
    opponentStaminaDrain = Math.max(0, opponentStaminaDrain - mods.stamina_recovery);
  }

  // Determine new positions
  let newPlayerPos = playerSuccess ? playerMove.success_position : playerMove.fail_position;
  let newOpponentPos = opponentSuccess ? opponentMove.success_position : opponentMove.fail_position;

  // Auto-punish: if caught transitioning or sub gamble fails, defender gains position advantage
  if (mods.auto_punish && !playerSuccess && playerMove.type === MoveType.TRN) {
    // Player was caught — opponent keeps their successful position
  }
  if (mods.auto_punish && !opponentSuccess && opponentMove.type === MoveType.TRN) {
    // Opponent was caught — player keeps their successful position
  }

  // Ensure opposing positions stay paired
  // The "winner" of the position exchange sets both positions
  if (playerSuccess && !opponentSuccess) {
    newOpponentPos = getOpposingPosition(newPlayerPos);
  } else if (opponentSuccess && !playerSuccess) {
    newPlayerPos = getOpposingPosition(newOpponentPos);
  } else if (playerSuccess && opponentSuccess) {
    // Both succeed — player's move takes priority (attacker advantage)
    newOpponentPos = getOpposingPosition(newPlayerPos);
  } else {
    // Both fail — positions stay as they are
    newPlayerPos = state.player.position;
    newOpponentPos = state.opponent.position;
  }

  // Calculate points
  let playerPoints = 0;
  let opponentPoints = 0;
  if (playerSuccess && playerMove.points > 0) {
    playerPoints = playerMove.points;
  }
  if (opponentSuccess && opponentMove.points > 0) {
    opponentPoints = opponentMove.points;
  }

  // Counter bonus: extra advantage pip
  let playerPips = state.player.advantage_pips;
  let opponentPips = state.opponent.advantage_pips;
  if (mods.counter_bonus > 0 && interaction === InteractionType.COUNTER) {
    // DEF player gets counter bonus (player used DEF vs opponent ATK)
    if (playerMove.type === MoveType.DEF) {
      playerPips = Math.min(MAX_ADVANTAGE_PIPS, playerPips + mods.counter_bonus);
    } else {
      opponentPips = Math.min(MAX_ADVANTAGE_PIPS, opponentPips + mods.counter_bonus);
    }
  }

  // Advantage pip gains: +1 on successful attack or transition
  if (playerSuccess && (playerMove.type === MoveType.ATK || playerMove.type === MoveType.TRN)) {
    playerPips = Math.min(MAX_ADVANTAGE_PIPS, playerPips + 1);
  }
  if (opponentSuccess && (opponentMove.type === MoveType.ATK || opponentMove.type === MoveType.TRN)) {
    opponentPips = Math.min(MAX_ADVANTAGE_PIPS, opponentPips + 1);
  }

  // Chain move cost
  if (playerMove.is_chain) {
    playerPips -= CHAIN_MOVE_PIP_COST;
  }
  if (opponentMove.is_chain) {
    opponentPips -= CHAIN_MOVE_PIP_COST;
  }

  // Check for submission trigger
  let submissionTriggered = false;
  let submissionAttacker: "player" | "opponent" | null = null;

  if (playerMove.type === MoveType.SUB && playerSuccess && playerMove.sub_chance) {
    const subChance = playerMove.sub_chance + mods.sub_chance_mod;
    if (rng() < subChance) {
      submissionTriggered = true;
      submissionAttacker = "player";
    }
  }
  if (!submissionTriggered && opponentMove.type === MoveType.SUB && opponentSuccess && opponentMove.sub_chance) {
    const subChance = opponentMove.sub_chance + mods.sub_chance_mod;
    if (rng() < subChance) {
      submissionTriggered = true;
      submissionAttacker = "opponent";
    }
  }

  const result: TurnResult = {
    player_move: playerMove,
    opponent_move: opponentMove,
    interaction,
    player_success: playerSuccess,
    opponent_success: opponentSuccess,
    player_points: playerPoints,
    opponent_points: opponentPoints,
    player_stamina_drain: playerStaminaDrain,
    opponent_stamina_drain: opponentStaminaDrain,
    new_player_position: newPlayerPos,
    new_opponent_position: newOpponentPos,
    submission_triggered: submissionTriggered,
    submission_success: false, // Set later by gauge result
    submission_attacker: submissionAttacker,
  };

  const newState: GameState = {
    ...state,
    player: {
      position: newPlayerPos,
      stamina: Math.max(0, state.player.stamina - playerStaminaDrain),
      score: state.player.score + playerPoints,
      advantage_pips: playerPips,
    },
    opponent: {
      position: newOpponentPos,
      stamina: Math.max(0, state.opponent.stamina - opponentStaminaDrain),
      score: state.opponent.score + opponentPoints,
      advantage_pips: opponentPips,
    },
    current_turn: state.current_turn + 1,
    last_result: result,
    phase: submissionTriggered ? "submission-gauge" : "selecting",
  };

  return { newState, result };
}

/**
 * Apply submission gauge result to game state.
 * If submission succeeds, sets winner. Otherwise, continues match.
 */
export function applySubmissionResult(
  state: GameState,
  success: boolean
): GameState {
  if (success && state.last_result?.submission_attacker) {
    return {
      ...state,
      phase: "post-match",
      winner: state.last_result.submission_attacker,
      win_method: "submission",
    };
  }
  return {
    ...state,
    phase: "selecting",
  };
}

/**
 * Check if the match should end (turns exhausted).
 * Call after resolveTurn. Returns updated state with winner if match is over.
 */
export function checkWinCondition(state: GameState): GameState {
  if (state.phase === "post-match") return state; // Already ended (submission)

  if (state.current_turn > state.max_turns) {
    let winner: "player" | "opponent" | "draw";
    let winMethod: "points" | "decision";

    if (state.player.score > state.opponent.score) {
      winner = "player";
      winMethod = "points";
    } else if (state.opponent.score > state.player.score) {
      winner = "opponent";
      winMethod = "points";
    } else {
      // Tiebreaker: advantage pips, then dominance, then draw
      if (state.player.advantage_pips > state.opponent.advantage_pips) {
        winner = "player";
        winMethod = "decision";
      } else if (state.opponent.advantage_pips > state.player.advantage_pips) {
        winner = "opponent";
        winMethod = "decision";
      } else {
        winner = "draw";
        winMethod = "decision";
      }
    }

    return {
      ...state,
      phase: "post-match",
      winner,
      win_method: winMethod,
    };
  }

  return state;
}

/**
 * Get a random DEF move for timeout auto-selection.
 * Falls back to any available move if no DEF moves exist.
 */
export function getTimeoutMove(fighter: Fighter, fighterState: FighterState, rng: RNG): Move {
  const available = getAvailableMoves(fighter, fighterState);
  const defMoves = available.filter((m) => m.type === MoveType.DEF);
  const pool = defMoves.length > 0 ? defMoves : available;
  return pool[Math.floor(rng() * pool.length)];
}
```

- [ ] **Step 2: Verify** — `npm run build` must pass with no errors.

- [ ] **Step 3: Commit** — `git add src/lib/combat/engine.ts && git commit -m "feat(combat): add pure combat engine with turn resolution"`

---

## Task 4: AI Logic

**Files:** Create `src/lib/combat/ai.ts`

- [ ] **Step 1: Create `src/lib/combat/ai.ts`**

```typescript
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
  STAMINA_COSTS,
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
  rng: RNG
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
```

- [ ] **Step 2: Verify** — `npm run build` must pass with no errors.

- [ ] **Step 3: Commit** — `git add src/lib/combat/ai.ts && git commit -m "feat(combat): add AI move selection with dominance-aware weights"`

---

## Task 5: Submission Gauge Logic

**Files:** Create `src/lib/combat/gauge.ts`

- [ ] **Step 1: Create `src/lib/combat/gauge.ts`**

```typescript
// src/lib/combat/gauge.ts
// Submission gauge logic — zone configs, needle math, result calculation.
// Pure math, no rendering.

import { MoveRarity, type GaugeZone, type GaugeConfig, type GaugeResult } from "./types";

// ─── Zone Definitions ───
// 11 zones, symmetric layout: MISS-POOR-OK-GOOD-GREAT-PERFECT-GREAT-GOOD-OK-POOR-MISS
// Widths must sum to 1.0.

const GAUGE_ZONES: GaugeZone[] = [
  { label: "MISS",    width: 0.08, color: "#DB2626", alpha: 0.45, modifier: -1.0 },
  { label: "POOR",    width: 0.09, color: "#EB5909", alpha: 0.50, modifier: -0.50 },
  { label: "OK",      width: 0.10, color: "#CA8902", alpha: 0.55, modifier: -0.15 },
  { label: "GOOD",    width: 0.10, color: "#66A40D", alpha: 0.55, modifier: 0.0 },
  { label: "GREAT",   width: 0.09, color: "#178642", alpha: 0.60, modifier: 0.10 },
  { label: "PERFECT", width: 0.08, color: "#4ADF80", alpha: 0.50, modifier: 0.25 },
  { label: "GREAT",   width: 0.09, color: "#178642", alpha: 0.60, modifier: 0.10 },
  { label: "GOOD",    width: 0.10, color: "#66A40D", alpha: 0.55, modifier: 0.0 },
  { label: "OK",      width: 0.10, color: "#CA8902", alpha: 0.55, modifier: -0.15 },
  { label: "POOR",    width: 0.09, color: "#EB5909", alpha: 0.50, modifier: -0.50 },
  { label: "MISS",    width: 0.08, color: "#DB2626", alpha: 0.45, modifier: -1.0 },
];

export function createGaugeConfig(): GaugeConfig {
  return {
    zones: GAUGE_ZONES,
    max_bounces: 4,
    bounce_speed_ramp: 0.85,
    base_sweep_duration: 1.0,
  };
}

/**
 * Calculate needle position (0.0-1.0) given elapsed time and config.
 * The needle sweeps left-to-right, then bounces back, getting slower each bounce.
 * Returns a normalized position along the gauge.
 */
export function calculateNeedlePosition(
  elapsedSeconds: number,
  config: GaugeConfig
): { position: number; bounces: number; stopped: boolean } {
  let time = elapsedSeconds;
  let bounces = 0;
  let sweepDuration = config.base_sweep_duration;
  let direction = 1; // 1 = left-to-right, -1 = right-to-left

  while (bounces < config.max_bounces) {
    if (time <= sweepDuration) {
      // Currently in this sweep
      const t = time / sweepDuration;
      const position = direction === 1 ? t : 1.0 - t;
      return { position: Math.max(0, Math.min(1, position)), bounces, stopped: false };
    }

    time -= sweepDuration;
    bounces++;
    direction *= -1;
    sweepDuration *= config.bounce_speed_ramp;
  }

  // Max bounces reached — needle stops at final position
  // The final position after all bounces
  const finalDirection = bounces % 2 === 0 ? 1 : -1;
  return {
    position: finalDirection === 1 ? 1.0 : 0.0,
    bounces: config.max_bounces,
    stopped: true,
  };
}

/**
 * Get total duration the needle will sweep before auto-stopping (sum of all sweep durations).
 */
export function getTotalGaugeDuration(config: GaugeConfig): number {
  let total = 0;
  let duration = config.base_sweep_duration;
  for (let i = 0; i <= config.max_bounces; i++) {
    total += duration;
    duration *= config.bounce_speed_ramp;
  }
  return total;
}

/**
 * Determine which zone the needle landed in.
 * @param position 0.0-1.0 along the gauge
 */
export function getZoneAtPosition(position: number, zones: GaugeZone[]): { index: number; zone: GaugeZone } {
  let accumulated = 0;
  for (let i = 0; i < zones.length; i++) {
    accumulated += zones[i].width;
    if (position <= accumulated) {
      return { index: i, zone: zones[i] };
    }
  }
  // Edge case: return last zone
  return { index: zones.length - 1, zone: zones[zones.length - 1] };
}

/**
 * Calculate the final submission result given needle position and base sub_chance.
 * The zone modifier is added to the base chance, then we roll.
 */
export function resolveGauge(
  needlePosition: number,
  baseSubChance: number,
  config: GaugeConfig,
  rng: () => number
): GaugeResult {
  const { index, zone } = getZoneAtPosition(needlePosition, config.zones);

  // MISS zone = automatic failure (modifier -1.0 brings any chance to near zero)
  const finalChance = Math.max(0, Math.min(1, baseSubChance + zone.modifier));
  const success = rng() < finalChance;

  return {
    zone_index: index,
    zone_label: zone.label,
    modifier: zone.modifier,
    success,
  };
}
```

- [ ] **Step 2: Verify** — `npm run build` must pass with no errors.

- [ ] **Step 3: Commit** — `git add src/lib/combat/gauge.ts && git commit -m "feat(combat): add submission gauge logic with zone configs"`

---

## Task 6: Combat Demo Shell

**Files:** Create `src/components/combat/CombatDemo.tsx`

This is the top-level component. It manages the 3 phases (pre-match, in-match, post-match) using `useReducer`. It imports the combat engine and composes all child components.

- [ ] **Step 1: Create `src/components/combat/CombatDemo.tsx`**

```typescript
// src/components/combat/CombatDemo.tsx
// Top-level combat demo section — manages game state with useReducer.
"use client";

import { useReducer, useCallback, useMemo, useRef } from "react";
import {
  type GameState,
  type Move,
  type TurnResult,
  type GaugeResult,
  Position,
} from "@/lib/combat/types";
import {
  PLAYER_FIGHTER,
  OPPONENT_FIGHTER,
  COMBAT_COLORS,
  PURPLE_BELT_CONFIG,
} from "@/lib/combat/constants";
import { PLAYER_MOVES, OPPONENT_MOVES } from "@/lib/combat/moves";
import {
  createInitialState,
  resolveTurn,
  applySubmissionResult,
  checkWinCondition,
  getTimeoutMove,
} from "@/lib/combat/engine";
import { selectAIMove } from "@/lib/combat/ai";
import { Scoreboard } from "./Scoreboard";
import { StaminaBar } from "./StaminaBar";
import { AdvantagePips } from "./AdvantagePips";
import { PositionDisplay } from "./PositionDisplay";
import { FighterSprite } from "./FighterSprite";
import { MoveSelection } from "./MoveSelection";
import { TurnTimer } from "./TurnTimer";
import { ResolveOverlay } from "./ResolveOverlay";
import { SubmissionGauge } from "./SubmissionGauge";
import { MatchResult } from "./MatchResult";

// Build full fighter objects with moves
const playerFighter = { ...PLAYER_FIGHTER, moves: PLAYER_MOVES };
const opponentFighter = { ...OPPONENT_FIGHTER, moves: OPPONENT_MOVES };

// RNG — uses Math.random for the web demo
const rng = () => Math.random();

// ─── Reducer ───

type CombatAction =
  | { type: "START_MATCH" }
  | { type: "SELECT_MOVE"; move: Move }
  | { type: "TIMEOUT" }
  | { type: "RESOLVE_COMPLETE" }
  | { type: "GAUGE_RESULT"; result: GaugeResult }
  | { type: "RESTART" };

interface CombatState {
  game: GameState;
  /** Whether we're showing the resolve animation */
  showResolve: boolean;
  /** The turn result currently being animated */
  animatingResult: TurnResult | null;
}

function combatReducer(state: CombatState, action: CombatAction): CombatState {
  switch (action.type) {
    case "START_MATCH": {
      return {
        game: { ...createInitialState(), phase: "selecting" },
        showResolve: false,
        animatingResult: null,
      };
    }

    case "SELECT_MOVE": {
      if (state.game.phase !== "selecting") return state;

      // AI picks a move
      const aiMove = selectAIMove(opponentFighter, state.game.opponent, rng);

      // Resolve the turn
      const { newState, result } = resolveTurn(
        state.game,
        playerFighter,
        opponentFighter,
        action.move,
        aiMove,
        rng
      );

      return {
        game: { ...newState, phase: "resolving" },
        showResolve: true,
        animatingResult: result,
      };
    }

    case "TIMEOUT": {
      if (state.game.phase !== "selecting") return state;

      // Auto-select a DEF move
      const timeoutMove = getTimeoutMove(playerFighter, state.game.player, rng);
      const aiMove = selectAIMove(opponentFighter, state.game.opponent, rng);
      const { newState, result } = resolveTurn(
        state.game,
        playerFighter,
        opponentFighter,
        timeoutMove,
        aiMove,
        rng
      );

      return {
        game: { ...newState, phase: "resolving" },
        showResolve: true,
        animatingResult: result,
      };
    }

    case "RESOLVE_COMPLETE": {
      const result = state.animatingResult;
      if (!result) return state;

      // If submission was triggered, transition to gauge phase
      if (result.submission_triggered) {
        return {
          ...state,
          game: { ...state.game, phase: "submission-gauge" },
          showResolve: false,
        };
      }

      // Check win condition (turns exhausted)
      const checked = checkWinCondition(state.game);
      return {
        game: { ...checked, phase: checked.phase === "post-match" ? "post-match" : "selecting" },
        showResolve: false,
        animatingResult: null,
      };
    }

    case "GAUGE_RESULT": {
      const updated = applySubmissionResult(state.game, action.result.success);
      // If not a submission win, check turn limit
      const checked = updated.phase === "post-match" ? updated : checkWinCondition(updated);
      return {
        game: checked.phase === "post-match" ? checked : { ...checked, phase: "selecting" },
        showResolve: false,
        animatingResult: null,
      };
    }

    case "RESTART": {
      return {
        game: createInitialState(),
        showResolve: false,
        animatingResult: null,
      };
    }

    default:
      return state;
  }
}

// ─── Component ───

export default function CombatDemo() {
  const [state, dispatch] = useReducer(combatReducer, {
    game: createInitialState(),
    showResolve: false,
    animatingResult: null,
  });

  const { game, showResolve, animatingResult } = state;

  const handleMoveSelect = useCallback((move: Move) => {
    dispatch({ type: "SELECT_MOVE", move });
  }, []);

  const handleTimeout = useCallback(() => {
    dispatch({ type: "TIMEOUT" });
  }, []);

  const handleResolveComplete = useCallback(() => {
    dispatch({ type: "RESOLVE_COMPLETE" });
  }, []);

  const handleGaugeResult = useCallback((result: GaugeResult) => {
    dispatch({ type: "GAUGE_RESULT", result });
  }, []);

  const handleStart = useCallback(() => {
    dispatch({ type: "START_MATCH" });
  }, []);

  const handleRestart = useCallback(() => {
    dispatch({ type: "RESTART" });
    // Small delay then start
    setTimeout(() => dispatch({ type: "START_MATCH" }), 100);
  }, []);

  return (
    <section
      id="combat-demo"
      className="relative py-16 px-4 overflow-hidden md:px-8"
      style={{ backgroundColor: COMBAT_COLORS.hud_bg }}
    >
      <div className="relative max-w-[800px] mx-auto">
        {/* ─── Pre-Match ─── */}
        {game.phase === "pre-match" && (
          <div className="text-center py-12">
            <h2
              className="font-display text-3xl md:text-4xl mb-6"
              style={{ color: COMBAT_COLORS.title_gold }}
            >
              Think you can hang at purple belt?
            </h2>
            <ul
              className="text-left max-w-md mx-auto mb-8 space-y-2 text-sm"
              style={{ color: COMBAT_COLORS.body_text }}
            >
              <li>Choose attacks, defenses, transitions, or submissions each turn</li>
              <li>Manage your stamina — every move costs energy</li>
              <li>Win by submission or outscore your opponent in {PURPLE_BELT_CONFIG.max_turns} turns</li>
            </ul>

            {/* Sprites */}
            <div className="flex items-center justify-center gap-12 mb-8">
              <div className="text-center">
                <FighterSprite side="player" />
                <p className="mt-2 font-mono text-xs" style={{ color: COMBAT_COLORS.player_blue }}>
                  You
                </p>
              </div>
              <p className="font-mono text-lg" style={{ color: COMBAT_COLORS.title_gold }}>
                VS
              </p>
              <div className="text-center">
                <FighterSprite side="opponent" />
                <p className="mt-2 font-mono text-xs" style={{ color: COMBAT_COLORS.opponent_red }}>
                  Carlos
                </p>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="px-8 py-3 font-mono text-lg tracking-wide uppercase cursor-pointer transition-all duration-150 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: COMBAT_COLORS.panel_bg,
                color: COMBAT_COLORS.button_text,
                borderBottom: `3px solid ${COMBAT_COLORS.gold_border}`,
                borderRadius: "6px",
              }}
            >
              Start Match
            </button>
          </div>
        )}

        {/* ─── In-Match ─── */}
        {(game.phase === "selecting" || game.phase === "resolving" || game.phase === "submission-gauge") && (
          <div className="space-y-3">
            <Scoreboard
              playerScore={game.player.score}
              opponentScore={game.opponent.score}
              currentTurn={game.current_turn}
              maxTurns={game.max_turns}
            />

            <div className="flex justify-between gap-4">
              <StaminaBar value={game.player.stamina} side="player" />
              <StaminaBar value={game.opponent.stamina} side="opponent" />
            </div>

            <div className="flex justify-between gap-4">
              <AdvantagePips pips={game.player.advantage_pips} side="player" />
              <AdvantagePips pips={game.opponent.advantage_pips} side="opponent" />
            </div>

            <PositionDisplay position={game.player.position} />

            <div className="flex items-center justify-center gap-8 py-4">
              <FighterSprite
                side="player"
                hurtPulse={game.player.stamina <= 30}
                maxPipGlow={game.player.advantage_pips >= 5}
              />
              <FighterSprite
                side="opponent"
                hurtPulse={game.opponent.stamina <= 30}
                maxPipGlow={game.opponent.advantage_pips >= 5}
              />
            </div>

            {game.phase === "selecting" && (
              <>
                <MoveSelection
                  fighter={playerFighter}
                  fighterState={game.player}
                  onSelect={handleMoveSelect}
                />
                <TurnTimer
                  key={game.current_turn}
                  onTimeout={handleTimeout}
                  active={game.phase === "selecting"}
                />
              </>
            )}
          </div>
        )}

        {/* ─── Resolve Overlay ─── */}
        {showResolve && animatingResult && (
          <ResolveOverlay
            result={animatingResult}
            onComplete={handleResolveComplete}
          />
        )}

        {/* ─── Submission Gauge ─── */}
        {game.phase === "submission-gauge" && animatingResult && (
          <SubmissionGauge
            submissionAttacker={animatingResult.submission_attacker!}
            baseSubChance={
              animatingResult.submission_attacker === "player"
                ? animatingResult.player_move.sub_chance ?? 0
                : animatingResult.opponent_move.sub_chance ?? 0
            }
            onResult={handleGaugeResult}
          />
        )}

        {/* ─── Post-Match ─── */}
        {game.phase === "post-match" && (
          <MatchResult
            winner={game.winner}
            winMethod={game.win_method}
            playerScore={game.player.score}
            opponentScore={game.opponent.score}
            onPlayAgain={handleRestart}
          />
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify** — `npm run build` must pass. It will have errors for missing child components — that is expected at this stage. Verify only that the file has no syntax errors by checking TypeScript compilation: `npx tsc --noEmit src/components/combat/CombatDemo.tsx` or temporarily stub the missing imports. If it fails on missing imports, that is acceptable — they will be created in Tasks 7-12. Proceed.

- [ ] **Step 3: Commit** — `git add src/components/combat/CombatDemo.tsx && git commit -m "feat(combat): add CombatDemo shell with useReducer state management"`

---

## Task 7: Scoreboard + Stamina + Pips

**Files:** Create `src/components/combat/Scoreboard.tsx`, `src/components/combat/StaminaBar.tsx`, `src/components/combat/AdvantagePips.tsx`

- [ ] **Step 1: Create `src/components/combat/Scoreboard.tsx`**

```typescript
// src/components/combat/Scoreboard.tsx
// Top scoreboard bar — names, belt badges, scores, turn counter.
"use client";

import { COMBAT_COLORS } from "@/lib/combat/constants";

interface ScoreboardProps {
  playerScore: number;
  opponentScore: number;
  currentTurn: number;
  maxTurns: number;
}

export function Scoreboard({ playerScore, opponentScore, currentTurn, maxTurns }: ScoreboardProps) {
  const turnsLeft = maxTurns - currentTurn + 1;
  const isFinalTurns = turnsLeft <= 3;

  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg"
      style={{ backgroundColor: COMBAT_COLORS.gauge_bg }}
    >
      {/* Player side */}
      <div className="flex items-center gap-3">
        <div>
          <p className="font-mono text-xs font-bold" style={{ color: COMBAT_COLORS.player_blue }}>
            You
          </p>
          <p className="font-mono text-[0.55rem] uppercase tracking-wider" style={{ color: COMBAT_COLORS.body_text, opacity: 0.6 }}>
            Purple Belt
          </p>
        </div>
        <span
          className="font-mono text-2xl font-bold tabular-nums"
          style={{
            color: COMBAT_COLORS.body_text,
            textShadow: `0 0 12px ${COMBAT_COLORS.player_blue}40`,
          }}
        >
          {playerScore}
        </span>
      </div>

      {/* Turn counter */}
      <div className="text-center">
        <p
          className={`font-mono text-sm font-bold tabular-nums ${isFinalTurns ? "animate-pulse" : ""}`}
          style={{ color: isFinalTurns ? COMBAT_COLORS.fail_orange : COMBAT_COLORS.title_gold }}
        >
          Turn {Math.min(currentTurn, maxTurns)}/{maxTurns}
        </p>
      </div>

      {/* Opponent side */}
      <div className="flex items-center gap-3">
        <span
          className="font-mono text-2xl font-bold tabular-nums"
          style={{
            color: COMBAT_COLORS.body_text,
            textShadow: `0 0 12px ${COMBAT_COLORS.opponent_red}40`,
          }}
        >
          {opponentScore}
        </span>
        <div className="text-right">
          <p className="font-mono text-xs font-bold" style={{ color: COMBAT_COLORS.opponent_red }}>
            Carlos
          </p>
          <p className="font-mono text-[0.55rem] uppercase tracking-wider" style={{ color: COMBAT_COLORS.body_text, opacity: 0.6 }}>
            Purple Belt
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/combat/StaminaBar.tsx`**

```typescript
// src/components/combat/StaminaBar.tsx
// Animated stamina bar with smooth drain and hurt pulse.
"use client";

import { COMBAT_COLORS } from "@/lib/combat/constants";

interface StaminaBarProps {
  value: number;  // 0-100
  side: "player" | "opponent";
}

export function StaminaBar({ value, side }: StaminaBarProps) {
  const isLow = value <= 30;
  const accentColor = side === "player" ? COMBAT_COLORS.player_blue : COMBAT_COLORS.opponent_red;

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[0.55rem] uppercase tracking-wider" style={{ color: accentColor }}>
          {side === "player" ? "Your Stamina" : "Opponent Stamina"}
        </span>
        <span className="font-mono text-xs tabular-nums" style={{ color: COMBAT_COLORS.body_text }}>
          {value}
        </span>
      </div>
      <div
        className="h-3 rounded-full overflow-hidden"
        style={{ backgroundColor: COMBAT_COLORS.stamina_bg }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            backgroundColor: isLow ? COMBAT_COLORS.stamina_low_pulse : COMBAT_COLORS.stamina_fill,
            transition: "width 0.4s ease-out, background-color 0.3s",
            animation: isLow ? "hurtPulse 0.6s ease-in-out infinite" : "none",
          }}
        />
      </div>
      <style jsx>{`
        @keyframes hurtPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/combat/AdvantagePips.tsx`**

```typescript
// src/components/combat/AdvantagePips.tsx
// Row of 5 advantage pips per fighter.
"use client";

import { COMBAT_COLORS, MAX_ADVANTAGE_PIPS } from "@/lib/combat/constants";

interface AdvantagePipsProps {
  pips: number;
  side: "player" | "opponent";
}

export function AdvantagePips({ pips, side }: AdvantagePipsProps) {
  const accentColor = side === "player" ? COMBAT_COLORS.player_blue : COMBAT_COLORS.opponent_red;

  return (
    <div className="flex-1">
      <p className="font-mono text-[0.5rem] uppercase tracking-wider mb-1" style={{ color: accentColor }}>
        Advantage
      </p>
      <div className={`flex gap-1.5 ${side === "opponent" ? "justify-end" : ""}`}>
        {Array.from({ length: MAX_ADVANTAGE_PIPS }, (_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full border transition-all duration-300"
            style={{
              borderColor: i < pips ? COMBAT_COLORS.momentum_gold : COMBAT_COLORS.muted_border,
              backgroundColor: i < pips ? COMBAT_COLORS.momentum_gold : "transparent",
              boxShadow: i < pips ? `0 0 6px ${COMBAT_COLORS.momentum_gold}60` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify** — `npm run build` must pass with no errors on these three files (they have no missing deps).

- [ ] **Step 5: Commit** — `git add src/components/combat/Scoreboard.tsx src/components/combat/StaminaBar.tsx src/components/combat/AdvantagePips.tsx && git commit -m "feat(combat): add scoreboard, stamina bar, and advantage pips"`

---

## Task 8: Position Display + Fighter Sprites

**Files:** Create `src/components/combat/PositionDisplay.tsx`, `src/components/combat/FighterSprite.tsx`

- [ ] **Step 1: Create `src/components/combat/PositionDisplay.tsx`**

```typescript
// src/components/combat/PositionDisplay.tsx
// Current position name with dominance color spectrum bar.
"use client";

import { Position } from "@/lib/combat/types";
import { POSITIONS, getDominanceColor, COMBAT_COLORS } from "@/lib/combat/constants";

interface PositionDisplayProps {
  position: Position;
}

export function PositionDisplay({ position }: PositionDisplayProps) {
  const data = POSITIONS[position];
  const color = getDominanceColor(data.dominance);

  return (
    <div className="text-center py-2">
      {/* Top border */}
      <div className="h-px mx-auto max-w-[200px] mb-2" style={{ backgroundColor: COMBAT_COLORS.secondary_border }} />

      <p
        className="font-mono text-lg font-bold uppercase tracking-wider"
        style={{ color: COMBAT_COLORS.body_text }}
      >
        {data.name}
      </p>

      {/* Dominance bar */}
      <div
        className="h-[5px] mx-auto max-w-[160px] mt-2 rounded-full transition-all duration-500"
        style={{ backgroundColor: color }}
      />

      {/* Bottom border */}
      <div className="h-px mx-auto max-w-[200px] mt-2" style={{ backgroundColor: COMBAT_COLORS.secondary_border }} />
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/combat/FighterSprite.tsx`**

```typescript
// src/components/combat/FighterSprite.tsx
// Animated pixel art sprite from spritesheet using CSS background-position.
"use client";

import { useEffect, useState } from "react";
import { COMBAT_COLORS } from "@/lib/combat/constants";

interface FighterSpriteProps {
  side: "player" | "opponent";
  hurtPulse?: boolean;
  maxPipGlow?: boolean;
}

// Spritesheet: 832x3456, 64x64 frames, 13 columns x 54 rows
// Front idle: row 24 (y=1536), columns 0-1, 2 frames at 5fps
const FRAME_SIZE = 64;
const IDLE_ROW = 24;
const IDLE_Y = IDLE_ROW * FRAME_SIZE; // 1536
const FRAME_COUNT = 2;
const FPS = 5;
const RENDER_SIZE = 256; // 4x scale

const PLAYER_SPRITE = "/media/Player Sprites/Purple1_Website_Sprite.png";
const OPPONENT_SPRITE = "/media/Player Sprites/Purple2_Website_Sprite.png";

export function FighterSprite({ side, hurtPulse = false, maxPipGlow = false }: FighterSpriteProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % FRAME_COUNT);
    }, 1000 / FPS);
    return () => clearInterval(interval);
  }, []);

  const spriteUrl = side === "player" ? PLAYER_SPRITE : OPPONENT_SPRITE;
  const bgX = frame * FRAME_SIZE * (RENDER_SIZE / FRAME_SIZE); // Scale the offset
  const bgY = IDLE_Y * (RENDER_SIZE / FRAME_SIZE);
  const glowColor = side === "player" ? COMBAT_COLORS.player_blue : COMBAT_COLORS.opponent_red;

  return (
    <div className="relative">
      {/* Max pip glow */}
      {maxPipGlow && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${COMBAT_COLORS.momentum_gold}25 0%, transparent 70%)`,
            transform: "scale(1.5)",
          }}
        />
      )}

      <div
        className="relative"
        style={{
          width: RENDER_SIZE,
          height: RENDER_SIZE,
          imageRendering: "pixelated",
          backgroundImage: `url(${spriteUrl})`,
          backgroundSize: `${832 * (RENDER_SIZE / FRAME_SIZE)}px ${3456 * (RENDER_SIZE / FRAME_SIZE)}px`,
          backgroundPosition: `-${bgX}px -${bgY}px`,
          transform: side === "opponent" ? "scaleX(-1)" : "none",
          filter: hurtPulse ? "brightness(1.3) saturate(0.5)" : "none",
          animation: hurtPulse ? "hurtTint 0.6s ease-in-out infinite" : "none",
        }}
      />

      <style jsx>{`
        @keyframes hurtTint {
          0%, 100% { filter: brightness(1.0); }
          50% { filter: brightness(1.3) hue-rotate(-10deg); }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 3: Verify** — `npm run build` must pass.

- [ ] **Step 4: Commit** — `git add src/components/combat/PositionDisplay.tsx src/components/combat/FighterSprite.tsx && git commit -m "feat(combat): add position display and animated fighter sprites"`

---

## Task 9: Move Selection UI

**Files:** Create `src/components/combat/MoveSelection.tsx`

- [ ] **Step 1: Create `src/components/combat/MoveSelection.tsx`**

```typescript
// src/components/combat/MoveSelection.tsx
// Move buttons grid with type-colored bottom borders and success percentage.
"use client";

import { useCallback, useRef } from "react";
import { type Move, type Fighter, type FighterState, MoveRarity } from "@/lib/combat/types";
import {
  COMBAT_COLORS,
  STAMINA_COSTS,
  getMoveTypeColor,
  PLAYER_FIGHTER,
  OPPONENT_FIGHTER,
} from "@/lib/combat/constants";
import { getAvailableMoves, calculateSuccessChance } from "@/lib/combat/engine";
import { INTERACTION_TABLE, INTERACTION_MODIFIERS } from "@/lib/combat/constants";

interface MoveSelectionProps {
  fighter: Fighter;
  fighterState: FighterState;
  onSelect: (move: Move) => void;
}

export function MoveSelection({ fighter, fighterState, onSelect }: MoveSelectionProps) {
  const moves = getAvailableMoves(fighter, fighterState);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Estimate success % as a simple display (average across possible interactions)
  function estimateSuccess(move: Move): number {
    // Simple estimate: use base_chance + stat advantage (no interaction context yet)
    const attackerStatVal = PLAYER_FIGHTER.stats[move.stat];
    const defenderStatVal = OPPONENT_FIGHTER.stats[move.stat];
    const statAdv = ((attackerStatVal * fighterState.stamina / 100) - (defenderStatVal * 75 / 100)) / 200.0;
    return Math.round(Math.max(5, Math.min(95, (move.base_chance + statAdv) * 100)));
  }

  const handleClick = useCallback(
    (move: Move) => {
      onSelect(move);
    },
    [onSelect]
  );

  if (moves.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="font-mono text-sm" style={{ color: COMBAT_COLORS.fail_orange }}>
          No moves available — not enough stamina!
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-3"
      style={{ backgroundColor: COMBAT_COLORS.panel_bg }}
    >
      <p className="font-mono text-[0.5rem] uppercase tracking-widest mb-2" style={{ color: COMBAT_COLORS.title_gold }}>
        Choose Your Move
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {moves.map((move) => {
          const typeColor = getMoveTypeColor(move.type);
          const isLegendary = move.rarity === MoveRarity.LEGENDARY;
          const successPct = estimateSuccess(move);
          const cost = STAMINA_COSTS[move.type];
          const canAfford = fighterState.stamina >= cost;

          return (
            <button
              key={move.id}
              onClick={() => handleClick(move)}
              disabled={!canAfford}
              className="relative text-left px-3 py-2 cursor-pointer transition-all duration-100 active:scale-[0.93] active:brightness-[1.3] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: COMBAT_COLORS.button_bg,
                borderBottom: `3px solid ${typeColor}`,
                borderLeft: isLegendary ? `2px solid ${COMBAT_COLORS.gold_border}` : "none",
                borderRadius: "6px",
                color: COMBAT_COLORS.button_text,
              }}
              onMouseEnter={(e) => {
                if (canAfford) e.currentTarget.style.backgroundColor = COMBAT_COLORS.button_hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COMBAT_COLORS.button_bg;
              }}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-xs font-bold truncate">{move.name}</span>
                <span
                  className="font-mono text-[0.55rem] font-bold shrink-0"
                  style={{ color: typeColor }}
                >
                  {move.type}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-[0.5rem]" style={{ color: COMBAT_COLORS.body_text, opacity: 0.7 }}>
                  {successPct}% success
                </span>
                {move.points > 0 && (
                  <span className="font-mono text-[0.5rem]" style={{ color: COMBAT_COLORS.momentum_gold }}>
                    +{move.points}pts
                  </span>
                )}
                {move.sub_chance && (
                  <span className="font-mono text-[0.5rem]" style={{ color: COMBAT_COLORS.sub_purple }}>
                    SUB
                  </span>
                )}
              </div>
              {isLegendary && (
                <div
                  className="absolute top-0 right-0 px-1 rounded-bl text-[0.45rem] font-mono font-bold"
                  style={{ backgroundColor: COMBAT_COLORS.gold_border, color: COMBAT_COLORS.gauge_bg }}
                >
                  LEGENDARY
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify** — `npm run build` must pass.

- [ ] **Step 3: Commit** — `git add src/components/combat/MoveSelection.tsx && git commit -m "feat(combat): add move selection UI with type colors and success estimates"`

---

## Task 10: Turn Timer

**Files:** Create `src/components/combat/TurnTimer.tsx`

- [ ] **Step 1: Create `src/components/combat/TurnTimer.tsx`**

```typescript
// src/components/combat/TurnTimer.tsx
// 10-second countdown bar with gold fill draining left-to-right.
"use client";

import { useEffect, useRef, useState } from "react";
import { COMBAT_COLORS, TURN_TIMER_SECONDS } from "@/lib/combat/constants";

interface TurnTimerProps {
  onTimeout: () => void;
  active: boolean;
}

export function TurnTimer({ onTimeout, active }: TurnTimerProps) {
  const [remaining, setRemaining] = useState(TURN_TIMER_SECONDS);
  const startTimeRef = useRef(Date.now());
  const calledRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    startTimeRef.current = Date.now();
    calledRef.current = false;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const left = Math.max(0, TURN_TIMER_SECONDS - elapsed);
      setRemaining(left);

      if (left <= 0 && !calledRef.current) {
        calledRef.current = true;
        clearInterval(interval);
        onTimeout();
      }
    }, 50); // Update at ~20fps for smooth drain

    return () => clearInterval(interval);
  }, [active, onTimeout]);

  const pct = (remaining / TURN_TIMER_SECONDS) * 100;
  const isCritical = remaining <= 3;

  return (
    <div className="mt-2">
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: COMBAT_COLORS.stamina_bg }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            backgroundColor: isCritical ? COMBAT_COLORS.opponent_red : COMBAT_COLORS.momentum_gold,
            transition: "background-color 0.3s",
            animation: isCritical ? "timerPulse 0.5s ease-in-out infinite" : "none",
          }}
        />
      </div>
      <style jsx>{`
        @keyframes timerPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Verify** — `npm run build` must pass.

- [ ] **Step 3: Commit** — `git add src/components/combat/TurnTimer.tsx && git commit -m "feat(combat): add turn timer with countdown bar"`

---

## Task 11: Turn Resolution Overlay

**Files:** Create `src/components/combat/ResolveOverlay.tsx`

- [ ] **Step 1: Create `src/components/combat/ResolveOverlay.tsx`**

```typescript
// src/components/combat/ResolveOverlay.tsx
// Dim overlay with move reveals, pulsing dots, interaction result popup.
"use client";

import { useEffect, useState } from "react";
import { type TurnResult, InteractionType } from "@/lib/combat/types";
import { COMBAT_COLORS, getMoveTypeColor, INTERACTION_MODIFIERS } from "@/lib/combat/constants";

interface ResolveOverlayProps {
  result: TurnResult;
  onComplete: () => void;
}

/** Friendly display names for interaction types. */
const INTERACTION_LABELS: Record<InteractionType, string> = {
  [InteractionType.CONTESTED]: "CONTESTED!",
  [InteractionType.COUNTER]: "COUNTER!",
  [InteractionType.SCRAMBLE]: "SCRAMBLE!",
  [InteractionType.SUB_DEFENDED]: "SUB DEFENDED!",
  [InteractionType.SUB_GAMBLE]: "SUB GAMBLE!",
  [InteractionType.STALL]: "STALL",
  [InteractionType.REPOSITION]: "REPOSITION",
  [InteractionType.CAUGHT_TRANSITIONING]: "CAUGHT!",
  [InteractionType.DOUBLE_SUB]: "DOUBLE SUB!",
  [InteractionType.POSITIONAL_SCRAMBLE]: "SCRAMBLE!",
};

function getInteractionColor(interaction: InteractionType): string {
  switch (interaction) {
    case InteractionType.COUNTER:
      return COMBAT_COLORS.success_green;
    case InteractionType.CAUGHT_TRANSITIONING:
    case InteractionType.SUB_GAMBLE:
      return COMBAT_COLORS.fail_orange;
    case InteractionType.SUB_DEFENDED:
      return COMBAT_COLORS.def_blue;
    case InteractionType.STALL:
      return COMBAT_COLORS.secondary_text;
    default:
      return COMBAT_COLORS.title_gold;
  }
}

export function ResolveOverlay({ result, onComplete }: ResolveOverlayProps) {
  const [phase, setPhase] = useState<"moves" | "dots" | "result" | "done">("moves");
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    // Sequence: show moves (0.4s) → pulsing dots (1.4s) → result (0.5s) → done
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase("dots"), 400));

    // Pulsing dots
    timers.push(setTimeout(() => setDotCount(1), 700));
    timers.push(setTimeout(() => setDotCount(2), 1100));
    timers.push(setTimeout(() => setDotCount(3), 1500));

    timers.push(setTimeout(() => setPhase("result"), 1800));
    timers.push(setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 2300));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const interactionColor = getInteractionColor(result.interaction);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="text-center space-y-4">
        {/* Both moves */}
        {(phase === "moves" || phase === "dots" || phase === "result") && (
          <div className="flex items-center justify-center gap-8">
            <div>
              <p className="font-mono text-[0.55rem] uppercase mb-1" style={{ color: COMBAT_COLORS.player_blue }}>
                You
              </p>
              <p
                className="font-mono text-sm font-bold px-3 py-1 rounded"
                style={{
                  color: COMBAT_COLORS.button_text,
                  backgroundColor: COMBAT_COLORS.panel_bg,
                  borderBottom: `2px solid ${getMoveTypeColor(result.player_move.type)}`,
                }}
              >
                {result.player_move.name}
              </p>
            </div>

            <p className="font-mono text-xs" style={{ color: COMBAT_COLORS.body_text, opacity: 0.5 }}>
              vs
            </p>

            <div>
              <p className="font-mono text-[0.55rem] uppercase mb-1" style={{ color: COMBAT_COLORS.opponent_red }}>
                Carlos
              </p>
              <p
                className="font-mono text-sm font-bold px-3 py-1 rounded"
                style={{
                  color: COMBAT_COLORS.button_text,
                  backgroundColor: COMBAT_COLORS.panel_bg,
                  borderBottom: `2px solid ${getMoveTypeColor(result.opponent_move.type)}`,
                }}
              >
                {result.opponent_move.name}
              </p>
            </div>
          </div>
        )}

        {/* Pulsing dots */}
        {phase === "dots" && (
          <div className="flex items-center justify-center gap-2 h-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i < dotCount ? COMBAT_COLORS.title_gold : COMBAT_COLORS.muted_border,
                  transform: i < dotCount ? "scale(1.2)" : "scale(0.8)",
                }}
              />
            ))}
          </div>
        )}

        {/* Interaction result */}
        {phase === "result" && (
          <div
            className="space-y-2"
            style={{
              animation: "popIn 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
            <p
              className="font-mono text-2xl font-bold uppercase tracking-wider"
              style={{ color: interactionColor }}
            >
              {INTERACTION_LABELS[result.interaction]}
            </p>

            {/* Points */}
            <div className="flex items-center justify-center gap-6">
              {result.player_points > 0 && (
                <span className="font-mono text-sm" style={{ color: COMBAT_COLORS.success_green }}>
                  You +{result.player_points}pts
                </span>
              )}
              {result.opponent_points > 0 && (
                <span className="font-mono text-sm" style={{ color: COMBAT_COLORS.fail_orange }}>
                  Carlos +{result.opponent_points}pts
                </span>
              )}
              {result.player_points === 0 && result.opponent_points === 0 && (
                <span className="font-mono text-xs" style={{ color: COMBAT_COLORS.body_text, opacity: 0.5 }}>
                  No points scored
                </span>
              )}
            </div>

            {/* Submission trigger */}
            {result.submission_triggered && (
              <p className="font-mono text-sm font-bold" style={{ color: COMBAT_COLORS.sub_purple }}>
                SUBMISSION ATTEMPT!
              </p>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes popIn {
          from { transform: scale(1.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Verify** — `npm run build` must pass.

- [ ] **Step 3: Commit** — `git add src/components/combat/ResolveOverlay.tsx && git commit -m "feat(combat): add turn resolution overlay with animation sequence"`

---

## Task 12: Submission Gauge UI

**Files:** Create `src/components/combat/SubmissionGauge.tsx`

- [ ] **Step 1: Create `src/components/combat/SubmissionGauge.tsx`**

```typescript
// src/components/combat/SubmissionGauge.tsx
// Canvas-based submission gauge mini-game with needle animation.
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { type GaugeResult } from "@/lib/combat/types";
import { COMBAT_COLORS } from "@/lib/combat/constants";
import {
  createGaugeConfig,
  calculateNeedlePosition,
  getZoneAtPosition,
  resolveGauge,
  getTotalGaugeDuration,
} from "@/lib/combat/gauge";

interface SubmissionGaugeProps {
  submissionAttacker: "player" | "opponent";
  baseSubChance: number;
  onResult: (result: GaugeResult) => void;
}

const GAUGE_WIDTH = 600;
const GAUGE_HEIGHT = 60;
const NEEDLE_HEIGHT = 48;
const CANVAS_PADDING = 20;

export function SubmissionGauge({ submissionAttacker, baseSubChance, onResult }: SubmissionGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const [phase, setPhase] = useState<"struggle" | "gauge" | "result">("struggle");
  const [gaugeResult, setGaugeResult] = useState<GaugeResult | null>(null);
  const needleStoppedRef = useRef(false);
  const needlePosRef = useRef(0);

  const config = createGaugeConfig();
  const isPlayerAttacking = submissionAttacker === "player";

  // Struggle phase → gauge phase
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("gauge");
      startTimeRef.current = performance.now();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Canvas rendering loop
  useEffect(() => {
    if (phase !== "gauge") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const totalDuration = getTotalGaugeDuration(config);
    let perfectPulsePhase = 0;

    function draw(timestamp: number) {
      if (!ctx || !canvas) return;
      const elapsed = (timestamp - startTimeRef.current) / 1000;

      // Update needle position
      if (!needleStoppedRef.current) {
        const { position, stopped } = calculateNeedlePosition(elapsed, config);
        needlePosRef.current = position;
        if (stopped) {
          needleStoppedRef.current = true;
          // Auto-stop: resolve
          handleStop();
          return;
        }
      }

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gaugeX = CANVAS_PADDING;
      const gaugeY = (canvas.height - GAUGE_HEIGHT) / 2;

      // Draw zones
      let x = gaugeX;
      perfectPulsePhase += 0.016; // ~60fps
      const perfectAlpha = 0.35 + 0.125 * (1 + Math.sin(perfectPulsePhase * Math.PI * 2));

      for (const zone of config.zones) {
        const w = zone.width * GAUGE_WIDTH;
        ctx.fillStyle = zone.color;
        ctx.globalAlpha = zone.label === "PERFECT" ? perfectAlpha : zone.alpha;
        ctx.beginPath();
        // Pill shape for first and last zones
        if (x === gaugeX) {
          roundedRectLeft(ctx, x, gaugeY, w, GAUGE_HEIGHT, 8);
        } else if (x + w >= gaugeX + GAUGE_WIDTH - 1) {
          roundedRectRight(ctx, x, gaugeY, w, GAUGE_HEIGHT, 8);
        } else {
          ctx.rect(x, gaugeY, w, GAUGE_HEIGHT);
        }
        ctx.fill();
        ctx.globalAlpha = 1;

        // Hash mark between zones (except last)
        if (x > gaugeX) {
          ctx.fillStyle = COMBAT_COLORS.gauge_bg;
          ctx.fillRect(x - 1, gaugeY, 2, GAUGE_HEIGHT);
        }

        // PERFECT zone border glow
        if (zone.label === "PERFECT") {
          ctx.strokeStyle = COMBAT_COLORS.success_green;
          ctx.lineWidth = 2;
          ctx.shadowColor = COMBAT_COLORS.success_green;
          ctx.shadowBlur = 4;
          ctx.strokeRect(x + 1, gaugeY + 1, w - 2, GAUGE_HEIGHT - 2);
          ctx.shadowBlur = 0;
        }

        x += w;
      }

      // Neon accent line below gauge
      const accentColor = isPlayerAttacking ? COMBAT_COLORS.sub_purple : COMBAT_COLORS.opponent_red;
      ctx.fillStyle = accentColor;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 4;
      ctx.fillRect(gaugeX, gaugeY + GAUGE_HEIGHT + 4, GAUGE_WIDTH, 2);
      ctx.shadowBlur = 0;

      // Needle
      const needleX = gaugeX + needlePosRef.current * GAUGE_WIDTH;
      const needleTop = gaugeY - 4;
      const needleBottom = gaugeY + GAUGE_HEIGHT + 4;

      // Halo
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(needleX - 4.5, needleTop, 9, needleBottom - needleTop);

      // Needle line
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(needleX - 1.5, needleTop, 3, needleBottom - needleTop);

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [phase, config, isPlayerAttacking]);

  const handleStop = useCallback(() => {
    if (needleStoppedRef.current && gaugeResult) return;
    needleStoppedRef.current = true;
    cancelAnimationFrame(animFrameRef.current);

    const result = resolveGauge(needlePosRef.current, baseSubChance, config, Math.random);
    setGaugeResult(result);
    setPhase("result");

    // Notify parent after brief display
    setTimeout(() => onResult(result), 1500);
  }, [baseSubChance, config, onResult, gaugeResult]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      {/* Struggle phase */}
      {phase === "struggle" && (
        <div className="text-center">
          <p
            className="font-mono text-xl font-bold uppercase tracking-wider animate-pulse"
            style={{ color: COMBAT_COLORS.sub_purple }}
          >
            SUBMISSION ATTEMPT!
          </p>
          <p className="font-mono text-sm mt-2" style={{ color: COMBAT_COLORS.body_text }}>
            {isPlayerAttacking ? "Squeeze tight..." : "Fight the submission!"}
          </p>
        </div>
      )}

      {/* Gauge phase */}
      {phase === "gauge" && (
        <div className="text-center">
          <p className="font-mono text-sm mb-4 uppercase tracking-wider" style={{ color: COMBAT_COLORS.body_text }}>
            {isPlayerAttacking ? "Time your squeeze!" : "Find the escape!"}
          </p>

          <canvas
            ref={canvasRef}
            width={GAUGE_WIDTH + CANVAS_PADDING * 2}
            height={GAUGE_HEIGHT + CANVAS_PADDING * 2 + 10}
            className="mx-auto"
            style={{ maxWidth: "100%" }}
          />

          <button
            onClick={handleStop}
            className="mt-4 px-6 py-2 font-mono text-sm font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-95"
            style={{
              backgroundColor: COMBAT_COLORS.panel_bg,
              color: isPlayerAttacking ? COMBAT_COLORS.sub_purple : COMBAT_COLORS.def_blue,
              borderBottom: `3px solid ${isPlayerAttacking ? COMBAT_COLORS.sub_purple : COMBAT_COLORS.def_blue}`,
              borderRadius: "6px",
            }}
          >
            {isPlayerAttacking ? "SQUEEZE!" : "FIGHT IT!"}
          </button>
        </div>
      )}

      {/* Result phase */}
      {phase === "result" && gaugeResult && (
        <div
          className="text-center"
          style={{ animation: "popIn 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
        >
          <p
            className="font-mono text-3xl font-bold uppercase"
            style={{
              color: gaugeResult.success ? COMBAT_COLORS.success_green : COMBAT_COLORS.fail_orange,
            }}
          >
            {gaugeResult.success ? "SUBMITTED!" : "ESCAPED!"}
          </p>
          <p className="font-mono text-sm mt-2" style={{ color: COMBAT_COLORS.body_text }}>
            Zone: {gaugeResult.zone_label}
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes popIn {
          from { transform: scale(1.3); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Canvas helpers ───

function roundedRectLeft(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function roundedRectRight(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x, y + h);
  ctx.closePath();
}
```

- [ ] **Step 2: Verify** — `npm run build` must pass.

- [ ] **Step 3: Commit** — `git add src/components/combat/SubmissionGauge.tsx && git commit -m "feat(combat): add canvas-based submission gauge mini-game"`

---

## Task 13: Match Result + Page Integration

**Files:** Create `src/components/combat/MatchResult.tsx`, modify `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/combat/MatchResult.tsx`**

```typescript
// src/components/combat/MatchResult.tsx
// End-of-match screen with result, score, Play Again, and email CTA.
"use client";

import { COMBAT_COLORS } from "@/lib/combat/constants";

interface MatchResultProps {
  winner: "player" | "opponent" | "draw" | null;
  winMethod: "submission" | "points" | "decision" | null;
  playerScore: number;
  opponentScore: number;
  onPlayAgain: () => void;
}

export function MatchResult({ winner, winMethod, playerScore, opponentScore, onPlayAgain }: MatchResultProps) {
  const isVictory = winner === "player";
  const isDraw = winner === "draw";

  const title = isDraw ? "DRAW" : isVictory ? "VICTORY" : "DEFEAT";
  const titleColor = isDraw
    ? COMBAT_COLORS.momentum_gold
    : isVictory
      ? COMBAT_COLORS.success_green
      : COMBAT_COLORS.opponent_red;

  const methodLabel = winMethod === "submission"
    ? "by Submission"
    : winMethod === "points"
      ? "by Points"
      : "by Decision";

  return (
    <div className="text-center py-16 space-y-6">
      {/* Title */}
      <h2
        className="font-display text-5xl md:text-6xl"
        style={{
          color: titleColor,
          textShadow: `0 0 30px ${titleColor}40`,
        }}
      >
        {title}
      </h2>

      {/* Win method */}
      {!isDraw && (
        <p className="font-mono text-sm uppercase tracking-wider" style={{ color: COMBAT_COLORS.body_text }}>
          {methodLabel}
        </p>
      )}

      {/* Score */}
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <p className="font-mono text-xs mb-1" style={{ color: COMBAT_COLORS.player_blue }}>You</p>
          <p className="font-mono text-3xl font-bold" style={{ color: COMBAT_COLORS.body_text }}>
            {playerScore}
          </p>
        </div>
        <p className="font-mono text-lg" style={{ color: COMBAT_COLORS.muted_border }}>—</p>
        <div className="text-center">
          <p className="font-mono text-xs mb-1" style={{ color: COMBAT_COLORS.opponent_red }}>Carlos</p>
          <p className="font-mono text-3xl font-bold" style={{ color: COMBAT_COLORS.body_text }}>
            {opponentScore}
          </p>
        </div>
      </div>

      {/* Play Again */}
      <button
        onClick={onPlayAgain}
        className="px-8 py-3 font-mono text-lg tracking-wide uppercase cursor-pointer transition-all duration-150 hover:scale-105 active:scale-95"
        style={{
          backgroundColor: COMBAT_COLORS.panel_bg,
          color: COMBAT_COLORS.button_text,
          borderBottom: `3px solid ${COMBAT_COLORS.gold_border}`,
          borderRadius: "6px",
        }}
      >
        Play Again
      </button>

      {/* Email CTA */}
      <div>
        <a
          href="#signup"
          className="inline-block font-mono text-sm transition-opacity hover:opacity-80"
          style={{ color: COMBAT_COLORS.title_gold }}
        >
          Sign up for early access &rarr;
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Modify `src/app/page.tsx`** — Replace `Preview` import with `CombatDemo` and add it in place of `<Preview />`.

Replace the entire file contents with:

```typescript
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CombatDemo from "@/components/combat/CombatDemo";
import Trailer from "@/components/Trailer";
import GameInfo from "@/components/GameInfo";
import EmailSignup from "@/components/EmailSignup";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CombatDemo />
        <Trailer />
        <GameInfo />
        <EmailSignup />
      </main>
      <Footer />
    </>
  );
}
```

**Note:** Do NOT delete `Preview.tsx` — keep it in case we want to bring it back. Just remove the import from `page.tsx`.

- [ ] **Step 3: Verify** — `npm run build` must pass with no errors. The full combat demo should compile and render.

- [ ] **Step 4: Commit** — `git add src/components/combat/MatchResult.tsx src/app/page.tsx && git commit -m "feat(combat): add match result screen and integrate CombatDemo into page"`

---

## Task 14: Feature Highlights

**Files:** Create `src/components/FeatureHighlights.tsx`, modify `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/FeatureHighlights.tsx`**

```typescript
// src/components/FeatureHighlights.tsx
// 5 feature cards with inline SVG icons on espresso background.

const features = [
  {
    title: "Custom Submission Creator",
    description:
      "Design your own finishing moves. Combine positions, grips, and pressure angles to create signature submissions that only you can execute.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 28c0-4 4-8 8-10s8-2 12 0 6 6 4 10-6 6-10 6-10-2-14-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 18c2-4 6-6 10-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 32l-4 6M32 28l4 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="22" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Submission Gauge & Timing",
    description:
      "Land the perfect squeeze. An 11-zone oscillating timing gauge tests your precision — nail the PERFECT zone for maximum damage, or miss and give your opponent a chance to escape.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="18" width="40" height="12" rx="6" stroke="currentColor" strokeWidth="2" />
        <line x1="14" y1="18" x2="14" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="24" y1="18" x2="24" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="34" y1="18" x2="34" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <rect x="20" y="16" width="8" height="16" rx="1" fill="currentColor" opacity="0.2" />
        <line x1="24" y1="14" x2="24" y2="34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Move & Position Prioritization",
    description:
      "Every position opens different options. Choose between attacks, defenses, transitions, and submissions — each with real success probabilities based on your stats and your opponent's weaknesses.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="28" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="28" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="28" y="28" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M20 14h8M14 20v8M34 20v8M20 34h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <circle cx="14" cy="14" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Mystery Move Draws",
    description:
      "Unlock rare techniques as you progress. Mystery draws reward you with new moves from Common to Legendary rarity — expanding your arsenal with every belt promotion.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="12" width="28" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M10 20h28" stroke="currentColor" strokeWidth="2" />
        <text x="24" y="32" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="bold">?</text>
        <path d="M20 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="38" cy="12" r="3" fill="currentColor" opacity="0.6" />
        <path d="M36.5 10.5l3 3M39.5 10.5l-3 3" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "Skill Tree",
    description:
      "Shape your fighter's growth. Invest in 7 skill categories across 5 tiers to specialize your stats — become a guard specialist, wrestling powerhouse, or balanced all-rounder.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="14" cy="24" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="34" cy="24" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="10" cy="38" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="38" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="38" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="40" cy="38" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M24 14v2l-10 6M24 14v2l10 6M14 27v2l-4 6M14 27v2l6 6M34 27v2l-4 6M34 27v2l6 6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function FeatureHighlights() {
  return (
    <section className="relative py-24 px-6 bg-espresso overflow-hidden md:px-12">
      <div className="relative max-w-[800px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-px w-12 bg-belt-gold/30" />
            <p className="font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-belt-gold">
              Features
            </p>
            <div className="h-px w-12 bg-belt-gold/30" />
          </div>
          <h2 className="font-display text-3xl text-cream">
            What makes it special
          </h2>
        </div>

        {/* Feature cards */}
        <div className="space-y-0">
          {features.map((feature, i) => (
            <div key={feature.title}>
              <div className="flex gap-6 py-8 items-start">
                {/* Icon */}
                <div className="shrink-0 text-belt-gold">
                  {feature.icon}
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-mono text-xs font-bold tracking-[0.15em] uppercase text-cream mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-cream/50">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Divider (except last) */}
              {i < features.length - 1 && (
                <div className="h-px bg-cream/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Modify `src/app/page.tsx`** — Add FeatureHighlights between CombatDemo and Trailer.

Replace the entire file contents with:

```typescript
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CombatDemo from "@/components/combat/CombatDemo";
import FeatureHighlights from "@/components/FeatureHighlights";
import Trailer from "@/components/Trailer";
import GameInfo from "@/components/GameInfo";
import EmailSignup from "@/components/EmailSignup";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CombatDemo />
        <FeatureHighlights />
        <Trailer />
        <GameInfo />
        <EmailSignup />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify** — `npm run build` must pass with zero errors. The full page should render with all sections.

- [ ] **Step 4: Commit** — `git add src/components/FeatureHighlights.tsx src/app/page.tsx && git commit -m "feat: add feature highlights section with SVG icons"`
