// src/components/combat/CombatDemo.tsx
// Top-level combat demo section — manages game state with useReducer.
"use client";

import { useReducer, useCallback } from "react";
import {
  type GameState,
  type Move,
  type TurnResult,
  type GaugeResult,
  type Fighter,
  type FighterState,
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
  getAvailableMoves,
  getTimeoutMove,
} from "@/lib/combat/engine";
import { selectAIMove } from "@/lib/combat/ai";
import Scoreboard from "./Scoreboard";
import StaminaBar from "./StaminaBar";
import AdvantagePips from "./AdvantagePips";
import PositionDisplay from "./PositionDisplay";
import FighterSprite from "./FighterSprite";

// Sprite paths (served from public/)
const PLAYER_SPRITE = "/media/Player Sprites/Purple1_Website_Sprite.png";
const OPPONENT_SPRITE = "/media/Player Sprites/Purple2_Website_Sprite.png";

// Build full fighter objects with moves
const playerFighter: Fighter = { ...PLAYER_FIGHTER, moves: PLAYER_MOVES };
const opponentFighter: Fighter = { ...OPPONENT_FIGHTER, moves: OPPONENT_MOVES };

// RNG — uses Math.random for the web demo
const rng = () => Math.random();

// ─── Placeholder Sub-Components (replaced in Tasks 9-12) ───

function MoveSelection({ fighter, fighterState, onSelect }: {
  fighter: Fighter; fighterState: FighterState; onSelect: (move: Move) => void;
}) {
  const available = getAvailableMoves(fighter, fighterState);
  return (
    <div className="grid grid-cols-2 gap-2">
      {available.map((move) => (
        <button key={move.id} onClick={() => onSelect(move)}
          className="px-3 py-2 font-mono text-xs rounded cursor-pointer transition-colors duration-100"
          style={{
            backgroundColor: COMBAT_COLORS.button_bg,
            color: COMBAT_COLORS.button_text,
            borderBottom: `2px solid ${COMBAT_COLORS.gold_border}`,
          }}>
          <span className="font-bold">[{move.type}]</span> {move.name}
        </button>
      ))}
    </div>
  );
}

function TurnTimer({ onTimeout, active }: {
  onTimeout: () => void; active: boolean;
}) {
  // Placeholder — full implementation in later task
  return (
    <div className="h-1 rounded-full mt-2" style={{ backgroundColor: COMBAT_COLORS.stamina_bg }}>
      <div className="h-full rounded-full" style={{ width: "100%", backgroundColor: COMBAT_COLORS.title_gold }} />
    </div>
  );
}

function ResolveOverlay({ result, onComplete }: {
  result: TurnResult; onComplete: () => void;
}) {
  // Auto-complete after brief delay — placeholder
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onComplete}>
      <div className="text-center font-mono p-6 rounded-lg"
        style={{ backgroundColor: COMBAT_COLORS.panel_bg, border: `1px solid ${COMBAT_COLORS.gold_border}` }}>
        <p style={{ color: COMBAT_COLORS.body_text }}>
          {result.player_success ? "Your move succeeded!" : "Your move failed."}
        </p>
        <p className="text-xs mt-2" style={{ color: COMBAT_COLORS.secondary_text }}>
          Tap to continue
        </p>
      </div>
    </div>
  );
}

function SubmissionGauge({ submissionAttacker, baseSubChance, onResult }: {
  submissionAttacker: "player" | "opponent"; baseSubChance: number; onResult: (result: GaugeResult) => void;
}) {
  // Placeholder — click to resolve with a random result
  const handleClick = () => {
    const roll = Math.random();
    onResult({
      zone_index: 5,
      zone_label: "GOOD",
      modifier: 0.0,
      success: roll < baseSubChance,
    });
  };
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      <div className="text-center font-mono p-6 rounded-lg cursor-pointer"
        style={{ backgroundColor: COMBAT_COLORS.gauge_bg, border: `1px solid ${COMBAT_COLORS.sub_purple}` }}
        onClick={handleClick}>
        <p style={{ color: COMBAT_COLORS.sub_purple }}>
          {submissionAttacker === "player" ? "Your" : "Opponent's"} Submission!
        </p>
        <p className="text-xs mt-2" style={{ color: COMBAT_COLORS.secondary_text }}>
          Click to resolve (gauge placeholder)
        </p>
      </div>
    </div>
  );
}

function MatchResult({ winner, winMethod, playerScore, opponentScore, onPlayAgain }: {
  winner: "player" | "opponent" | "draw" | null;
  winMethod: "submission" | "points" | "decision" | null;
  playerScore: number; opponentScore: number;
  onPlayAgain: () => void;
}) {
  const heading = winner === "player" ? "You Win!" : winner === "opponent" ? "You Lose" : "Draw";
  const headingColor = winner === "player" ? COMBAT_COLORS.success_green : winner === "opponent" ? COMBAT_COLORS.opponent_red : COMBAT_COLORS.title_gold;
  return (
    <div className="text-center py-12">
      <h3 className="font-display text-3xl mb-2" style={{ color: headingColor }}>{heading}</h3>
      <p className="font-mono text-sm mb-1" style={{ color: COMBAT_COLORS.body_text }}>
        {winMethod === "submission" ? "by Submission" : winMethod === "points" ? "by Points" : "by Decision"}
      </p>
      <p className="font-mono text-sm mb-6" style={{ color: COMBAT_COLORS.secondary_text }}>
        {playerScore} - {opponentScore}
      </p>
      <button onClick={onPlayAgain}
        className="px-8 py-3 font-mono text-lg tracking-wide uppercase cursor-pointer transition-all duration-150 hover:scale-105 active:scale-95"
        style={{
          backgroundColor: COMBAT_COLORS.panel_bg,
          color: COMBAT_COLORS.button_text,
          borderBottom: `3px solid ${COMBAT_COLORS.gold_border}`,
          borderRadius: "6px",
        }}>
        Play Again
      </button>
    </div>
  );
}

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
                <FighterSprite spriteSheet={PLAYER_SPRITE} side="player" />
                <p className="mt-2 font-mono text-xs" style={{ color: COMBAT_COLORS.player_blue }}>
                  You
                </p>
              </div>
              <p className="font-mono text-lg" style={{ color: COMBAT_COLORS.title_gold }}>
                VS
              </p>
              <div className="text-center">
                <FighterSprite spriteSheet={OPPONENT_SPRITE} side="opponent" />
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
              playerName={PLAYER_FIGHTER.name}
              opponentName={OPPONENT_FIGHTER.name}
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
              <AdvantagePips count={game.player.advantage_pips} side="player" />
              <AdvantagePips count={game.opponent.advantage_pips} side="opponent" />
            </div>

            <PositionDisplay position={game.player.position} />

            <div className="flex items-center justify-center gap-8 py-4">
              <FighterSprite spriteSheet={PLAYER_SPRITE} side="player" />
              <FighterSprite spriteSheet={OPPONENT_SPRITE} side="opponent" />
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
