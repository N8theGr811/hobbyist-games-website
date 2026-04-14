// src/components/combat/CombatDemo.tsx
// Top-level combat demo section — manages game state with useReducer.
// Includes the 4-phase submission cinematic (DIM → STRUGGLE → FREEZE → REVEAL).
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

// ─── Submission Cinematic Phases ───

type CinematicPhase = "dim" | "struggle" | "freeze" | "reveal" | null;

// ─── Reducer ───

type CombatAction =
  | { type: "START_MATCH" }
  | { type: "SELECT_MOVE"; move: Move }
  | { type: "TIMEOUT" }
  | { type: "RESOLVE_COMPLETE" }
  | { type: "GAUGE_RESULT"; result: GaugeResult }
  | { type: "CINEMATIC_COMPLETE" }
  | { type: "RESTART" };

interface CombatState {
  game: GameState;
  /** Snapshot of game state before resolve — used for display during animations */
  displayGame: GameState | null;
  /** Whether we're showing the resolve animation */
  showResolve: boolean;
  /** The turn result currently being animated */
  animatingResult: TurnResult | null;
  /** Gauge result stored for cinematic */
  gaugeResult: GaugeResult | null;
}

function combatReducer(state: CombatState, action: CombatAction): CombatState {
  switch (action.type) {
    case "START_MATCH": {
      return {
        game: { ...createInitialState(), phase: "selecting" },
        displayGame: null,
        showResolve: false,
        animatingResult: null,
        gaugeResult: null,
      };
    }

    case "SELECT_MOVE": {
      if (state.game.phase !== "selecting") return state;

      // Snapshot current state BEFORE resolving — this is what we display during animation
      const preResolveSnapshot = { ...state.game };

      const aiMove = selectAIMove(opponentFighter, state.game.opponent, rng);
      const { newState, result } = resolveTurn(
        state.game,
        playerFighter,
        opponentFighter,
        action.move,
        aiMove,
        rng
      );

      return {
        ...state,
        game: { ...newState, phase: "resolving" },
        displayGame: preResolveSnapshot,
        showResolve: true,
        animatingResult: result,
      };
    }

    case "TIMEOUT": {
      if (state.game.phase !== "selecting") return state;

      const preResolveSnapshot = { ...state.game };

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
        ...state,
        game: { ...newState, phase: "resolving" },
        displayGame: preResolveSnapshot,
        showResolve: true,
        animatingResult: result,
      };
    }

    case "RESOLVE_COMPLETE": {
      const result = state.animatingResult;
      if (!result) return state;

      if (result.submission_triggered) {
        return {
          ...state,
          game: { ...state.game, phase: "submission-gauge" },
          displayGame: null,
          showResolve: false,
        };
      }

      const checked = checkWinCondition(state.game);
      return {
        ...state,
        game: { ...checked, phase: checked.phase === "post-match" ? "post-match" : "selecting" },
        displayGame: null,
        showResolve: false,
        animatingResult: null,
      };
    }

    case "GAUGE_RESULT": {
      return {
        ...state,
        game: { ...state.game, phase: "submission-cinematic" },
        displayGame: null,
        gaugeResult: action.result,
      };
    }

    case "CINEMATIC_COMPLETE": {
      const gr = state.gaugeResult;
      if (!gr) return state;

      const updated = applySubmissionResult(state.game, gr.success);
      const checked = updated.phase === "post-match" ? updated : checkWinCondition(updated);
      return {
        game: checked.phase === "post-match" ? checked : { ...checked, phase: "selecting" },
        displayGame: null,
        showResolve: false,
        animatingResult: null,
        gaugeResult: null,
      };
    }

    case "RESTART": {
      return {
        game: createInitialState(),
        displayGame: null,
        showResolve: false,
        animatingResult: null,
        gaugeResult: null,
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
    displayGame: null,
    showResolve: false,
    animatingResult: null,
    gaugeResult: null,
  });

  const { game, showResolve, animatingResult } = state;
  // Use the pre-resolve snapshot for display during animations, otherwise real state
  const visibleGame = state.displayGame ?? game;

  // Screen shake state
  const [shakeIntensity, setShakeIntensity] = useState<"none" | "light" | "heavy">("none");
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Submission cinematic phase
  const [cinematicPhase, setCinematicPhase] = useState<CinematicPhase>(null);

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
        if (shakeDelayRef.current) clearTimeout(shakeDelayRef.current);
        shakeDelayRef.current = setTimeout(() => {
          setShakeIntensity("light");
          if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
          shakeTimeoutRef.current = setTimeout(() => setShakeIntensity("none"), 200);
        }, 2400);
      }
    }
    return () => {
      if (shakeDelayRef.current) clearTimeout(shakeDelayRef.current);
    };
  }, [showResolve, animatingResult]);

  // ─── 4-Phase Submission Cinematic ───
  const cinematicTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (game.phase !== "submission-cinematic" || !state.gaugeResult) return;

    // Clear any old timers
    cinematicTimersRef.current.forEach(clearTimeout);
    cinematicTimersRef.current = [];

    const timers = cinematicTimersRef.current;

    // Phase 1: DIM (0.3s)
    setCinematicPhase("dim");

    // Phase 2: STRUGGLE (starts at 0.3s, lasts 1.0s)
    timers.push(setTimeout(() => setCinematicPhase("struggle"), 300));

    // Phase 3: FREEZE (starts at 1.3s, lasts 0.15s)
    timers.push(setTimeout(() => setCinematicPhase("freeze"), 1300));

    // Phase 4: REVEAL (starts at 1.45s, lasts 1.35s)
    timers.push(setTimeout(() => {
      setCinematicPhase("reveal");
      // Trigger screen shake
      const intensity = state.gaugeResult!.success ? "heavy" : "light";
      setShakeIntensity(intensity);
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
      shakeTimeoutRef.current = setTimeout(() => setShakeIntensity("none"), 300);
    }, 1450));

    // Complete (at 2.8s)
    timers.push(setTimeout(() => {
      setCinematicPhase(null);
      dispatch({ type: "CINEMATIC_COMPLETE" });
    }, 2800));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [game.phase, state.gaugeResult]);

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

  // Cinematic state helpers
  const isCinematic = game.phase === "submission-cinematic";
  const isInMatch = game.phase === "selecting" || game.phase === "resolving" || game.phase === "submission-gauge" || game.phase === "submission-cinematic";
  const gaugeResult = state.gaugeResult;
  const subAttacker = animatingResult?.submission_attacker ?? null;

  // Determine sprite dim level
  const spriteDim = isCinematic && (cinematicPhase === "dim" || cinematicPhase === "struggle" || cinematicPhase === "freeze")
    ? 0.3
    : (game.phase === "resolving" && showResolve ? 0.3 : 1);

  // Determine move button dim
  const movesDim = isCinematic ? 0.3 : 1;

  // Chance text for struggle phase
  const chancePercent = gaugeResult ? Math.round(gaugeResult.final_chance * 100) : 0;

  // Reveal text
  const getRevealText = () => {
    if (!gaugeResult || !subAttacker) return { text: "", color: "" };
    if (gaugeResult.zone_label === "MISS") {
      return { text: "SUBMISSION FAILED!", color: "#F25A4D" };
    }
    if (gaugeResult.success) {
      return { text: "SUBMISSION!", color: "#21C45E" };
    }
    // Defended
    const defenderName = subAttacker === "player" ? "Opponent" : "You";
    return { text: `${defenderName} ESCAPED!`, color: "#F25A4D" };
  };

  return (
    <section id="combat-demo" className="py-20 px-6 bg-cream md:px-12">
      {/* Section header */}
      <div className="max-w-[850px] mx-auto mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3 font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-mat-red">
          <span className="w-6 h-px bg-mat-red/30" />
          Combat Demo
          <span className="w-6 h-px bg-mat-red/30" />
        </div>
        <h2 className="font-display text-[clamp(1.6rem,4vw,2.2rem)] text-ink">
          Try the combat system
        </h2>
        <p className="text-sm text-ink/40 mt-2">
          Play a full match right here in your browser
        </p>
      </div>

      {/* Game screen frame */}
      <div
        className="max-w-[850px] mx-auto rounded-lg overflow-hidden"
        style={{
          border: "3px solid #3B2A1F",
          boxShadow: "0 8px 32px rgba(27,22,18,0.15), 0 2px 8px rgba(27,22,18,0.1), inset 0 0 0 1px rgba(244,233,210,0.1)",
        }}
      >
        {/* Dark combat area inside the frame */}
        <div
          className={`relative overflow-hidden${shakeIntensity === "heavy" ? " combat-shake-heavy" : shakeIntensity === "light" ? " combat-shake" : ""}`}
          style={{ backgroundColor: COMBAT_COLORS.hud_bg, padding: "1.5rem 1rem" }}
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

          {/* Cinematic dim overlay */}
          {isCinematic && cinematicPhase && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                opacity: cinematicPhase === "dim" || cinematicPhase === "struggle" || cinematicPhase === "freeze" || cinematicPhase === "reveal" ? 1 : 0,
                transition: "opacity 0.3s ease",
                pointerEvents: "none",
                zIndex: 15,
              }}
            />
          )}

          <div className="relative max-w-[800px] mx-auto" style={{ zIndex: 2 }}>
        {/* ─── Pre-Match ─── */}
        {game.phase === "pre-match" && (
          <div className="flex flex-col items-center justify-center text-center py-4">
            <p
              className="font-mono text-[0.5rem] font-bold tracking-[0.25em] uppercase mb-2"
              style={{ color: COMBAT_COLORS.title_gold, opacity: 0.5 }}
            >
              Interactive Demo
            </p>
            <h2
              className="font-display text-lg mb-2"
              style={{ color: COMBAT_COLORS.body_text }}
            >
              Test out the game&apos;s combat system
            </h2>
            <ul
              className="text-left max-w-sm mx-auto mb-3 space-y-0.5 text-xs"
              style={{ color: COMBAT_COLORS.body_text, opacity: 0.5 }}
            >
              <li>Choose attacks, defenses, transitions, or submissions each turn</li>
              <li>Manage your stamina — every move costs energy</li>
              <li>Win by submission or outscore your opponent in {PURPLE_BELT_CONFIG.max_turns} turns</li>
            </ul>

            {/* Sprites */}
            <div className="flex items-center justify-center gap-6 mb-3">
              <div className="text-center">
                <FighterSprite spriteSheet={PLAYER_SPRITE} side="player" />
                <p className="mt-1 font-mono text-xs" style={{ color: COMBAT_COLORS.player_blue }}>
                  You
                </p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <div style={{ width: "1px", height: "16px", background: `linear-gradient(to bottom, transparent, ${COMBAT_COLORS.title_gold}80)` }} />
                <div style={{ width: "10px", height: "10px", backgroundColor: COMBAT_COLORS.title_gold, transform: "rotate(45deg)", opacity: 0.6, boxShadow: `0 0 6px ${COMBAT_COLORS.title_gold}30` }} />
                <div style={{ width: "1px", height: "16px", background: `linear-gradient(to top, transparent, ${COMBAT_COLORS.title_gold}80)` }} />
                <p className="font-mono" style={{ fontSize: "8px", color: COMBAT_COLORS.title_gold, opacity: 0.4 }}>VS</p>
              </div>
              <div className="text-center">
                <FighterSprite spriteSheet={OPPONENT_SPRITE} side="opponent" />
                <p className="mt-1 font-mono text-xs" style={{ color: COMBAT_COLORS.opponent_red }}>
                  Opponent
                </p>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="px-6 py-2 font-mono text-sm tracking-wide uppercase cursor-pointer transition-all duration-150 hover:scale-105 active:scale-95"
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
        {isInMatch && (
          <div className="space-y-1.5">
            {/* 1. Scoreboard at top */}
            <Scoreboard
              playerName={PLAYER_FIGHTER.name}
              opponentName={OPPONENT_FIGHTER.name}
              playerScore={visibleGame.player.score}
              opponentScore={visibleGame.opponent.score}
              currentTurn={visibleGame.current_turn}
              maxTurns={visibleGame.max_turns}
            />

            {/* 2. Stamina bars */}
            <div className="flex justify-between gap-3">
              <StaminaBar value={visibleGame.player.stamina} side="player" />
              <StaminaBar value={visibleGame.opponent.stamina} side="opponent" />
            </div>

            {/* 3. Fighter sprites + resolve/gauge/cinematic overlays */}
            <div className="relative">
              <div
                className={`flex items-center justify-center gap-6 py-1 transition-opacity duration-300${isCinematic && cinematicPhase === "struggle" ? " sub-oscillate" : ""}`}
                style={{ opacity: spriteDim }}
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

              {/* Submission gauge overlaid on sprite area */}
              {game.phase === "submission-gauge" && animatingResult && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <SubmissionGauge
                    submissionAttacker={animatingResult.submission_attacker!}
                    moveName={
                      animatingResult.submission_attacker === "player"
                        ? animatingResult.player_move.name
                        : animatingResult.opponent_move.name
                    }
                    baseSubChance={
                      animatingResult.submission_attacker === "player"
                        ? animatingResult.player_move.sub_chance ?? 0
                        : animatingResult.opponent_move.sub_chance ?? 0
                    }
                    onResult={handleGaugeResult}
                  />
                </div>
              )}

              {/* Cinematic: STRUGGLE — chance text */}
              {isCinematic && cinematicPhase === "struggle" && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <p
                    className="font-mono text-3xl font-bold uppercase tracking-wider sub-chance-text"
                    style={{
                      textShadow: `0 0 20px ${COMBAT_COLORS.title_gold}80`,
                    }}
                  >
                    {chancePercent}% SUBMIT
                  </p>
                </div>
              )}

              {/* Cinematic: REVEAL — result text */}
              {isCinematic && cinematicPhase === "reveal" && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <p
                    className="font-mono text-3xl font-bold uppercase tracking-wider sub-reveal-text"
                    style={{
                      color: getRevealText().color,
                      textShadow: `0 0 20px ${getRevealText().color}80`,
                    }}
                  >
                    {getRevealText().text}
                  </p>
                </div>
              )}
            </div>

            {/* 4. Position bar + advantage pips */}
            <div className="flex items-center gap-2">
              <AdvantagePips count={visibleGame.player.advantage_pips} side="player" />
              <div className="flex-shrink-0">
                <PositionDisplay position={visibleGame.player.position} />
              </div>
              <AdvantagePips count={visibleGame.opponent.advantage_pips} side="opponent" />
            </div>

            {/* 5. Move selection */}
            <div
              style={{
                minHeight: "72px",
                opacity: movesDim,
                transition: "opacity 0.3s ease",
              }}
            >
              <MoveSelection
                moves={getAvailableMoves(playerFighter, visibleGame.player)}
                onSelect={handleMoveSelect}
                disabled={game.phase !== "selecting"}
                playerStamina={visibleGame.player.stamina}
                playerPips={visibleGame.player.advantage_pips}
              />
            </div>
          </div>
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
              20% { transform: translate(-2px, 1px); }
              40% { transform: translate(2px, -1px); }
              60% { transform: translate(-1px, -2px); }
              80% { transform: translate(1px, 2px); }
            }
            @keyframes combat-shake-heavy {
              0%, 100% { transform: translate(0, 0); }
              10% { transform: translate(-4px, 3px); }
              20% { transform: translate(4px, -2px); }
              30% { transform: translate(-3px, -4px); }
              40% { transform: translate(3px, 4px); }
              50% { transform: translate(-4px, 1px); }
              60% { transform: translate(2px, -4px); }
              70% { transform: translate(-1px, 3px); }
              80% { transform: translate(4px, -1px); }
              90% { transform: translate(-3px, 2px); }
            }
            .combat-shake {
              animation: combat-shake 0.2s ease-in-out;
            }
            .combat-shake-heavy {
              animation: combat-shake-heavy 0.3s ease-in-out;
            }
            @media (prefers-reduced-motion: reduce) {
              .combat-shake, .combat-shake-heavy {
                animation: none;
              }
            }

            /* Sprite oscillation during STRUGGLE phase: +-2px at 8Hz */
            @keyframes sub-oscillate {
              0%, 100% { transform: translateX(0); }
              50% { transform: translateX(2px); }
            }
            .sub-oscillate {
              animation: sub-oscillate 0.0625s linear infinite alternate;
            }

            /* Chance text pop-in + gold pulse */
            @keyframes sub-chance-pop {
              from { transform: scale(1.3); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes sub-chance-pulse {
              0%, 100% { color: #F2CC40; }
              50% { color: #D9BF73; }
            }
            .sub-chance-text {
              animation:
                sub-chance-pop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                sub-chance-pulse 0.5s ease-in-out infinite;
            }

            /* Reveal text pop-in + fade-out */
            @keyframes sub-reveal-pop {
              from { transform: scale(1.3); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes sub-reveal-fade {
              from { opacity: 1; }
              to { opacity: 0; }
            }
            .sub-reveal-text {
              animation:
                sub-reveal-pop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                sub-reveal-fade 0.3s ease 1.05s forwards;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
