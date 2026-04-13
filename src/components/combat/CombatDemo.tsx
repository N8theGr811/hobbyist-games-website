// src/components/combat/CombatDemo.tsx
// Top-level combat demo section — manages game state with useReducer.
"use client";

import { useReducer, useCallback, useRef, useEffect, useState } from "react";
import {
  type GameState,
  type Move,
  type TurnResult,
  type GaugeResult,
  type Fighter,
  InteractionType,
} from "@/lib/combat/types";
import {
  PLAYER_FIGHTER,
  OPPONENT_FIGHTER,
  COMBAT_COLORS,
  PURPLE_BELT_CONFIG,
} from "@/lib/combat/constants";
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
import MoveSelection from "./MoveSelection";
import { ResolveOverlay } from "./ResolveOverlay";
import { SubmissionGauge } from "./SubmissionGauge";
import MatchResult from "./MatchResult";

// Sprite paths (served from public/)
const PLAYER_SPRITE = "/media/Player Sprites/Purple1_Website_Sprite.png";
const OPPONENT_SPRITE = "/media/Player Sprites/Purple2_Website_Sprite.png";

// Both fighters use the full move pool
const playerFighter: Fighter = PLAYER_FIGHTER;
const opponentFighter: Fighter = OPPONENT_FIGHTER;

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

  // Screen shake state
  const [shaking, setShaking] = useState(false);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger shake when the result text appears (2.4s into resolve sequence)
  const shakeDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (showResolve && animatingResult) {
      const r = animatingResult;
      const hasImpact =
        r.player_success || r.opponent_success ||
        r.player_points > 0 || r.opponent_points > 0;
      const isStall = r.interaction === InteractionType.STALL;
      if (hasImpact && !isStall) {
        // Delay shake to match when result text appears in ResolveOverlay
        if (shakeDelayRef.current) clearTimeout(shakeDelayRef.current);
        shakeDelayRef.current = setTimeout(() => {
          setShaking(true);
          if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
          shakeTimeoutRef.current = setTimeout(() => setShaking(false), 200);
        }, 2400);
      }
    }
    return () => {
      if (shakeDelayRef.current) clearTimeout(shakeDelayRef.current);
    };
  }, [showResolve, animatingResult]);

  const handleMoveSelect = useCallback((move: Move) => {
    dispatch({ type: "SELECT_MOVE", move });
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

  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => { if (restartTimerRef.current) clearTimeout(restartTimerRef.current); };
  }, []);
  const handleRestart = useCallback(() => {
    dispatch({ type: "RESTART" });
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    restartTimerRef.current = setTimeout(() => dispatch({ type: "START_MATCH" }), 100);
  }, []);

  return (
    <section
      id="combat-demo"
      className={`relative px-4 overflow-hidden md:px-8${shaking ? " combat-shake" : ""}`}
      style={{ backgroundColor: COMBAT_COLORS.hud_bg, paddingTop: "2rem", paddingBottom: "2rem" }}
    >
      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div className="relative max-w-[800px] mx-auto" style={{ zIndex: 2 }}>
        {/* ─── Pre-Match ─── */}
        {game.phase === "pre-match" && (
          <div className="text-center py-6">
            <h2
              className="font-display text-2xl md:text-3xl mb-4"
              style={{ color: COMBAT_COLORS.title_gold }}
            >
              Think you can hang at purple belt?
            </h2>
            <ul
              className="text-left max-w-md mx-auto mb-4 space-y-1 text-sm"
              style={{ color: COMBAT_COLORS.body_text }}
            >
              <li>Choose attacks, defenses, transitions, or submissions each turn</li>
              <li>Manage your stamina — every move costs energy</li>
              <li>Win by submission or outscore your opponent in {PURPLE_BELT_CONFIG.max_turns} turns</li>
            </ul>

            {/* Sprites */}
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="text-center">
                <FighterSprite spriteSheet={PLAYER_SPRITE} side="player" />
                <p className="mt-1 font-mono text-xs" style={{ color: COMBAT_COLORS.player_blue }}>
                  You
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div style={{ width: "1px", height: "20px", background: `linear-gradient(to bottom, transparent, ${COMBAT_COLORS.title_gold})` }} />
                <div style={{ width: "12px", height: "12px", backgroundColor: COMBAT_COLORS.title_gold, transform: "rotate(45deg)", boxShadow: `0 0 8px ${COMBAT_COLORS.title_gold}40` }} />
                <div style={{ width: "1px", height: "20px", background: `linear-gradient(to top, transparent, ${COMBAT_COLORS.title_gold})` }} />
                <p className="font-mono text-xs" style={{ color: COMBAT_COLORS.title_gold, opacity: 0.5 }}>VS</p>
              </div>
              <div className="text-center">
                <FighterSprite spriteSheet={OPPONENT_SPRITE} side="opponent" />
                <p className="mt-1 font-mono text-xs" style={{ color: COMBAT_COLORS.opponent_red }}>
                  Carlos
                </p>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="px-8 py-2.5 font-mono text-base tracking-wide uppercase cursor-pointer transition-all duration-150 hover:scale-105 active:scale-95"
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
          <div className="space-y-1.5">
            {/* 1. Scoreboard at top */}
            <Scoreboard
              playerName={PLAYER_FIGHTER.name}
              opponentName={OPPONENT_FIGHTER.name}
              playerScore={game.player.score}
              opponentScore={game.opponent.score}
              currentTurn={game.current_turn}
              maxTurns={game.max_turns}
            />

            {/* 2. Stamina bars */}
            <div className="flex justify-between gap-3">
              <StaminaBar value={game.player.stamina} side="player" />
              <StaminaBar value={game.opponent.stamina} side="opponent" />
            </div>

            {/* 3. Fighter sprites + resolve overlay on top */}
            <div className="relative">
              <div
                className="flex items-center justify-center gap-6 py-1 transition-opacity duration-300"
                style={{ opacity: game.phase === "resolving" && showResolve ? 0.3 : 1 }}
              >
                <FighterSprite spriteSheet={PLAYER_SPRITE} side="player" />
                <div className="flex flex-col items-center gap-0.5">
                  <div style={{ width: "1px", height: "16px", background: `linear-gradient(to bottom, transparent, ${COMBAT_COLORS.title_gold}80)` }} />
                  <div style={{ width: "10px", height: "10px", backgroundColor: COMBAT_COLORS.title_gold, transform: "rotate(45deg)", opacity: 0.6, boxShadow: `0 0 6px ${COMBAT_COLORS.title_gold}30` }} />
                  <div style={{ width: "1px", height: "16px", background: `linear-gradient(to top, transparent, ${COMBAT_COLORS.title_gold}80)` }} />
                  <p className="font-mono" style={{ fontSize: "8px", color: COMBAT_COLORS.title_gold, opacity: 0.4 }}>VS</p>
                </div>
                <FighterSprite spriteSheet={OPPONENT_SPRITE} side="opponent" />
              </div>

              {/* Resolve result overlaid on sprite area */}
              {game.phase === "resolving" && showResolve && animatingResult && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <ResolveOverlay
                    result={animatingResult}
                    onComplete={handleResolveComplete}
                  />
                </div>
              )}
            </div>

            {/* 4. Position bar + advantage pips (directly above move selection) */}
            <div className="flex items-center gap-2">
              <AdvantagePips count={game.player.advantage_pips} side="player" />
              <div className="flex-shrink-0">
                <PositionDisplay position={game.player.position} />
              </div>
              <AdvantagePips count={game.opponent.advantage_pips} side="opponent" />
            </div>

            {/* 5. Move selection */}
            {game.phase === "selecting" && (
              <MoveSelection
                moves={getAvailableMoves(playerFighter, game.player)}
                onSelect={handleMoveSelect}
                disabled={false}
                playerStamina={game.player.stamina}
                playerPips={game.player.advantage_pips}
              />
            )}
          </div>
        )}

        {/* Resolve overlay moved inline above */}

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

      <style jsx>{`
        @keyframes combat-shake {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-3px, 2px); }
          40% { transform: translate(3px, -2px); }
          60% { transform: translate(-2px, -3px); }
          80% { transform: translate(2px, 3px); }
        }
        .combat-shake {
          animation: combat-shake 0.2s ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .combat-shake {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
