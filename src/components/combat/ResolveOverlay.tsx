// src/components/combat/ResolveOverlay.tsx
// Dim overlay with move reveals, pulsing dots, interaction result popup.
"use client";

import { useEffect, useState } from "react";
import { type TurnResult, InteractionType } from "@/lib/combat/types";
import { COMBAT_COLORS, getMoveTypeColor } from "@/lib/combat/constants";

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
