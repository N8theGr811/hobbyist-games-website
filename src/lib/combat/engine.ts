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
 * Returns a clamped 0.05-0.95 probability.
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

  // Determine relevant stat values (same stat category for opposition)
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

  const chance = move.base_chance + statAdv + interactionMod;

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
  rng: RNG = Math.random
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
      // Tiebreaker: advantage pips, then draw
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
export function getTimeoutMove(fighter: Fighter, fighterState: FighterState, rng: RNG = Math.random): Move {
  const available = getAvailableMoves(fighter, fighterState);
  const defMoves = available.filter((m) => m.type === MoveType.DEF);
  const pool = defMoves.length > 0 ? defMoves : available;
  return pool[Math.floor(rng() * pool.length)];
}
