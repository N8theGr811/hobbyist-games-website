// src/components/combat/Scoreboard.tsx
// HUD scoreboard: player/opponent names, belt labels, scores, and turn counter.
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

  // Pulse color ramps from amber -> orange -> red as turns run out
  const turnColor = useMemo(() => {
    if (!isFinalTurns) return COMBAT_COLORS.title_gold;
    if (turnsRemaining === 3) return "#F59E0B"; // amber
    if (turnsRemaining === 2) return "#F97316"; // orange
    return "#EF4444"; // red
  }, [isFinalTurns, turnsRemaining]);

  return (
    <div
      className="flex items-center justify-between font-mono text-sm rounded-md px-3 py-2"
      style={{
        backgroundColor: COMBAT_COLORS.hud_bg,
        border: `1px solid ${COMBAT_COLORS.secondary_border}`,
      }}
    >
      {/* Player side */}
      <div className="flex flex-col items-start min-w-0">
        <span
          className="text-xs font-bold truncate"
          style={{ color: COMBAT_COLORS.player_blue }}
        >
          {playerName}
        </span>
        <span
          className="text-[10px] leading-tight"
          style={{ color: COMBAT_COLORS.secondary_text }}
        >
          Purple Belt
        </span>
        <span
          className="text-lg font-bold mt-0.5"
          style={{
            color: COMBAT_COLORS.player_blue,
            textShadow: `0 0 8px rgba(97, 165, 250, 0.25)`,
          }}
        >
          {playerScore}
        </span>
      </div>

      {/* Turn counter */}
      <div className="flex flex-col items-center px-2">
        <span
          className="text-xs"
          style={{
            color: turnColor,
            animation: isFinalTurns ? "scoreboard-pulse 0.8s ease-in-out infinite" : "none",
          }}
        >
          Turn {currentTurn}/{maxTurns}
        </span>
      </div>

      {/* Opponent side */}
      <div className="flex flex-col items-end min-w-0">
        <span
          className="text-xs font-bold truncate"
          style={{ color: COMBAT_COLORS.opponent_red }}
        >
          {opponentName}
        </span>
        <span
          className="text-[10px] leading-tight"
          style={{ color: COMBAT_COLORS.secondary_text }}
        >
          Purple Belt
        </span>
        <span
          className="text-lg font-bold mt-0.5"
          style={{
            color: COMBAT_COLORS.opponent_red,
            textShadow: `0 0 8px rgba(247, 113, 113, 0.25)`,
          }}
        >
          {opponentScore}
        </span>
      </div>

      {/* Keyframe for final-turns pulse */}
      <style jsx>{`
        @keyframes scoreboard-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
