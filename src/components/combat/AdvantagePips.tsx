// src/components/combat/AdvantagePips.tsx
// Five advantage pips per fighter — gold fill when active, glow at max.
"use client";

import { COMBAT_COLORS } from "@/lib/combat/constants";

interface AdvantagePipsProps {
  count: number;
  side: "player" | "opponent";
}

export default function AdvantagePips({ count, side }: AdvantagePipsProps) {
  const isMax = count >= 5;

  const align = side === "opponent" ? "flex-end" : "flex-start";
  const textAlign = side === "opponent" ? ("right" as const) : ("left" as const);

  return (
    <div
      className="flex-1 flex flex-col gap-0.5"
      style={{ alignItems: align }}
    >
      {/* STREAK label */}
      <span
        className="font-mono"
        style={{ fontSize: "8px", color: COMBAT_COLORS.body_text, opacity: 0.25, textAlign }}
      >
        STREAK
      </span>

      {/* Pips row */}
      <div className="flex items-center gap-1" style={{ justifyContent: align }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < count;
          return (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: filled
                  ? COMBAT_COLORS.momentum_gold
                  : "transparent",
                border: `2px solid ${COMBAT_COLORS.momentum_gold}`,
                opacity: filled ? 1 : 0.3,
                boxShadow:
                  filled && isMax
                    ? `0 0 6px ${COMBAT_COLORS.momentum_gold}, 0 0 12px ${COMBAT_COLORS.momentum_gold}`
                    : "none",
                animation: isMax && filled ? "pip-glow 1.2s ease-in-out infinite" : "none",
                transition: "background-color 0.2s ease, opacity 0.2s ease",
              }}
            />
          );
        })}
      </div>

      {/* Bonus percentage */}
      {count > 0 && (
        <span
          className="font-mono"
          style={{ fontSize: "8px", color: COMBAT_COLORS.momentum_gold, textAlign }}
        >
          +{count}%
        </span>
      )}

      <style jsx>{`
        @keyframes pip-glow {
          0%, 100% {
            box-shadow: 0 0 6px ${COMBAT_COLORS.momentum_gold}, 0 0 12px ${COMBAT_COLORS.momentum_gold};
          }
          50% {
            box-shadow: 0 0 10px ${COMBAT_COLORS.momentum_gold}, 0 0 20px ${COMBAT_COLORS.momentum_gold};
          }
        }
      `}</style>
    </div>
  );
}
