// src/components/combat/ResolveOverlay.tsx
// Dim overlay with move reveals, pulsing dots, interaction result popup.
"use client";

import { useEffect, useState } from "react";
import { type TurnResult } from "@/lib/combat/types";
import { COMBAT_COLORS, getMoveTypeColor } from "@/lib/combat/constants";

interface ResolveOverlayProps {
  result: TurnResult;
  onComplete: () => void;
}

/** Derive result text and color from move outcomes using past_tense. */
function getResultDisplay(result: TurnResult): { text: string; color: string } {
  const { player_move, opponent_move, player_success, opponent_success, submission_triggered } = result;

  // Submission locked in
  if (submission_triggered && player_success) {
    return { text: `You ${player_move.past_tense}!`, color: COMBAT_COLORS.sub_purple };
  }
  if (submission_triggered && opponent_success) {
    return { text: `Opponent ${opponent_move.past_tense}!`, color: COMBAT_COLORS.sub_purple };
  }

  // Player's move succeeded
  if (player_success) {
    return { text: `You ${player_move.past_tense}!`, color: COMBAT_COLORS.success_green };
  }

  // Opponent's move succeeded
  if (opponent_success) {
    return { text: `Opponent ${opponent_move.past_tense}!`, color: COMBAT_COLORS.fail_orange };
  }

  // Player's move failed but opponent didn't succeed either — stuffed
  if (!player_success && !opponent_success) {
    // Check if both essentially stalled (static defense vs static defense)
    if (player_move.from_position === player_move.success_position &&
        opponent_move.from_position === opponent_move.success_position) {
      return { text: "Nothing happens", color: COMBAT_COLORS.secondary_text };
    }
    return { text: `${player_move.name} is stuffed!`, color: COMBAT_COLORS.secondary_text };
  }

  return { text: "Nothing happens", color: COMBAT_COLORS.secondary_text };
}

export function ResolveOverlay({ result, onComplete }: ResolveOverlayProps) {
  const [phase, setPhase] = useState<"moves" | "dots" | "result" | "done">("moves");
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    // Sequence: show moves (0.6s) → pulsing dots (1.8s) → result (2s) → done
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase("dots"), 600));

    // Pulsing dots
    timers.push(setTimeout(() => setDotCount(1), 1000));
    timers.push(setTimeout(() => setDotCount(2), 1400));
    timers.push(setTimeout(() => setDotCount(3), 1800));

    timers.push(setTimeout(() => setPhase("result"), 2400));
    timers.push(setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 4400));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const resultDisplay = getResultDisplay(result);

  return (
    <div className="py-2 px-4">
      <div className="text-center space-y-2">
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
              style={{ color: resultDisplay.color }}
            >
              {resultDisplay.text}
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
