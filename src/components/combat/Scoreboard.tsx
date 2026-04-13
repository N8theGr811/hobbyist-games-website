// src/components/combat/Scoreboard.tsx
// HUD scoreboard: player/opponent names, scores, and turn counter — compact single row.
"use client";

import { useMemo } from "react";
import { COMBAT_COLORS } from "@/lib/combat/constants";

interface ScoreboardProps {
  playerName: string;
  opponentName: string;
  playerScore: number;
  opponentScore: number;
  currentTurn: number;
  maxTurns: number;
}

export default function Scoreboard({
  playerName,
  opponentName,
  playerScore,
  opponentScore,
  currentTurn,
  maxTurns,
}: ScoreboardProps) {
  const turnsRemaining = maxTurns - currentTurn + 1;
  const isFinalTurns = turnsRemaining <= 3;

  const turnColor = useMemo(() => {
    if (!isFinalTurns) return COMBAT_COLORS.title_gold;
    if (turnsRemaining === 3) return "#F59E0B";
    if (turnsRemaining === 2) return "#F97316";
    return "#EF4444";
  }, [isFinalTurns, turnsRemaining]);

  const BELT_COLOR = "rgb(166, 77, 217)"; // Purple belt

  // Turn pip colors
  const getTurnPipColor = (turnIndex: number, filled: boolean): string => {
    if (!filled) return COMBAT_COLORS.muted_border + "4D"; // 30% opacity
    const turnsLeft = maxTurns - turnIndex;
    if (turnsLeft <= 3) {
      if (turnsLeft === 1) return "#EF4444";
      if (turnsLeft === 2) return "#F97316";
      return "#F59E0B";
    }
    return COMBAT_COLORS.momentum_gold;
  };

  return (
    <div
      className="font-mono text-sm rounded-md px-3 py-1.5"
      style={{
        backgroundColor: COMBAT_COLORS.hud_bg,
        border: `1px solid ${COMBAT_COLORS.secondary_border}`,
      }}
    >
      <div className="flex items-center justify-between">
        {/* Player side */}
        <div className="flex items-center gap-2 min-w-0">
          <span
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: BELT_COLOR,
              borderRadius: "2px",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span
            className="text-xs font-bold truncate"
            style={{ color: COMBAT_COLORS.player_blue }}
          >
            {playerName}
          </span>
          <span
            className="text-lg font-bold tabular-nums"
            style={{
              color: COMBAT_COLORS.player_blue,
              textShadow: `0 0 8px rgba(97, 165, 250, 0.25)`,
            }}
          >
            {playerScore}
          </span>
        </div>

        {/* Turn counter */}
        <div className="flex flex-col items-center">
          <span
            className="text-xs px-2"
            style={{
              color: turnColor,
              animation: isFinalTurns ? "scoreboard-pulse 0.8s ease-in-out infinite" : "none",
            }}
          >
            Turn {currentTurn}/{maxTurns}
          </span>

          {/* Turn pips */}
          <div className="flex items-center gap-[2px] mt-0.5">
            {Array.from({ length: maxTurns }).map((_, i) => {
              const filled = i < currentTurn;
              return (
                <div
                  key={i}
                  style={{
                    width: "4px",
                    height: "4px",
                    backgroundColor: getTurnPipColor(i, filled),
                    transition: "background-color 0.3s ease",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Opponent side */}
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-lg font-bold tabular-nums"
            style={{
              color: COMBAT_COLORS.opponent_red,
              textShadow: `0 0 8px rgba(247, 113, 113, 0.25)`,
            }}
          >
            {opponentScore}
          </span>
          <span
            className="text-xs font-bold truncate"
            style={{ color: COMBAT_COLORS.opponent_red }}
          >
            {opponentName}
          </span>
          <span
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: BELT_COLOR,
              borderRadius: "2px",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scoreboard-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
