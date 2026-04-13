// src/components/combat/MatchResult.tsx
// Post-match result screen with CTA.
"use client";

import { useEffect, useState } from "react";
import { COMBAT_COLORS } from "@/lib/combat/constants";

interface MatchResultProps {
  winner: "player" | "opponent" | "draw" | null;
  winMethod: "submission" | "points" | "decision" | null;
  playerScore: number;
  opponentScore: number;
  onPlayAgain: () => void;
}

export default function MatchResult({
  winner,
  winMethod,
  playerScore,
  opponentScore,
  onPlayAgain,
}: MatchResultProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entry animation on next frame
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const heading =
    winner === "player" ? "VICTORY" : winner === "opponent" ? "DEFEAT" : "DRAW";

  const headingColor =
    winner === "player"
      ? COMBAT_COLORS.title_gold
      : winner === "opponent"
        ? COMBAT_COLORS.opponent_red
        : COMBAT_COLORS.secondary_text;

  const methodLabel =
    winMethod === "submission"
      ? "by Submission"
      : winMethod === "points"
        ? "by Points"
        : "by Decision";

  return (
    <div
      className="text-center py-8 transition-all duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.92)",
      }}
    >
      {/* Result heading */}
      <h3
        className="font-display text-5xl md:text-6xl mb-3 tracking-wide"
        style={{
          color: headingColor,
          textShadow:
            winner === "player"
              ? "0 0 30px rgba(242, 204, 64, 0.35)"
              : winner === "opponent"
                ? "0 0 30px rgba(247, 113, 113, 0.25)"
                : "none",
        }}
      >
        {heading}
      </h3>

      {/* Win method */}
      <p
        className="font-mono text-sm uppercase tracking-widest mb-2"
        style={{ color: COMBAT_COLORS.body_text }}
      >
        {methodLabel}
      </p>

      {/* Score */}
      <p
        className="font-mono text-2xl mb-10 tabular-nums"
        style={{ color: COMBAT_COLORS.secondary_text }}
      >
        {playerScore} &ndash; {opponentScore}
      </p>

      {/* Play Again button */}
      <button
        onClick={onPlayAgain}
        className="px-10 py-3.5 font-mono text-lg tracking-wide uppercase cursor-pointer transition-all duration-150 hover:scale-105 active:scale-95"
        style={{
          backgroundColor: COMBAT_COLORS.panel_bg,
          color: COMBAT_COLORS.button_text,
          borderBottom: `3px solid ${COMBAT_COLORS.gold_border}`,
          borderRadius: "6px",
        }}
      >
        Play Again
      </button>

      {/* Signup CTA */}
      <div className="mt-6">
        <a
          href="#signup"
          className="font-mono text-sm transition-opacity duration-200 hover:opacity-80"
          style={{ color: "rgba(244, 233, 210, 0.55)" }}
        >
          Sign up for early access &rarr;
        </a>
      </div>
    </div>
  );
}
