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
  /** Past tense for result display, e.g. "hit a Single Leg" */
  past_tense: string;
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
  /** Move ID that failed last turn — can't be used again next turn */
  lastFailedMoveId: string | null;
}

export interface GameState {
  player: FighterState;
  opponent: FighterState;
  current_turn: number;
  max_turns: number;
  phase: "pre-match" | "selecting" | "resolving" | "submission-gauge" | "submission-cinematic" | "post-match";
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
  /** Final submission chance after zone modifier (0.0-1.0) */
  final_chance: number;
  /** Final submission success after zone modifier */
  success: boolean;
}
