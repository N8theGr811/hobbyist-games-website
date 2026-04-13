// src/components/combat/MoveSelection.tsx
// Move selection grid — shows available moves as styled buttons.
"use client";

import type { Move } from "@/lib/combat/types";
import { MoveType, MoveRarity } from "@/lib/combat/types";
import {
  COMBAT_COLORS,
  getMoveTypeColor,
  STAMINA_COSTS,
  CHAIN_MOVE_PIP_THRESHOLD,
} from "@/lib/combat/constants";

interface MoveSelectionProps {
  moves: Move[];
  onSelect: (move: Move) => void;
  disabled: boolean;
  playerStamina: number;
  playerPips: number;
}

export default function MoveSelection({
  moves,
  onSelect,
  disabled,
  playerStamina,
  playerPips,
}: MoveSelectionProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {moves.map((move) => {
        const staminaCost = STAMINA_COSTS[move.type];
        const canAfford = playerStamina >= staminaCost;
        const chainLocked = move.is_chain && playerPips < CHAIN_MOVE_PIP_THRESHOLD;
        const isDisabled = disabled || !canAfford || chainLocked;
        const isLegendary = move.rarity === MoveRarity.LEGENDARY;
        const typeColor = getMoveTypeColor(move.type);
        const borderColor = isLegendary ? COMBAT_COLORS.gold_border : typeColor;
        const successPct = Math.round(move.base_chance * 100);

        return (
          <button
            key={move.id}
            onClick={() => !isDisabled && onSelect(move)}
            disabled={isDisabled}
            className="relative px-3 py-2.5 font-mono text-xs text-left rounded-[6px] transition-all duration-100 select-none"
            style={{
              backgroundColor: COMBAT_COLORS.button_bg,
              color: COMBAT_COLORS.button_text,
              borderBottom: `3px solid ${borderColor}`,
              opacity: isDisabled ? 0.4 : 1,
              cursor: isDisabled ? "not-allowed" : "pointer",
              ...(isLegendary && !isDisabled
                ? {
                    boxShadow: `0 0 8px ${COMBAT_COLORS.gold_border}44, inset 0 0 12px ${COMBAT_COLORS.gold_border}18`,
                  }
                : {}),
            }}
            onMouseEnter={(e) => {
              if (!isDisabled) {
                e.currentTarget.style.backgroundColor = COMBAT_COLORS.button_hover;
                e.currentTarget.style.borderBottomColor = isLegendary
                  ? COMBAT_COLORS.title_gold
                  : typeColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!isDisabled) {
                e.currentTarget.style.backgroundColor = COMBAT_COLORS.button_bg;
                e.currentTarget.style.borderBottomColor = borderColor;
              }
            }}
            onMouseDown={(e) => {
              if (!isDisabled) {
                e.currentTarget.style.backgroundColor = COMBAT_COLORS.button_pressed;
                e.currentTarget.style.transform = "scale(0.95)";
              }
            }}
            onMouseUp={(e) => {
              if (!isDisabled) {
                e.currentTarget.style.backgroundColor = COMBAT_COLORS.button_hover;
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {/* Row 1: type badge + name */}
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="inline-block px-1.5 py-0.5 text-[10px] font-bold rounded"
                style={{
                  backgroundColor: typeColor + "22",
                  color: typeColor,
                  border: `1px solid ${typeColor}44`,
                }}
              >
                {move.type}
              </span>
              {move.is_chain && (
                <span
                  className="inline-block px-1 py-0.5 text-[9px] font-bold rounded"
                  style={{
                    backgroundColor: COMBAT_COLORS.momentum_gold + "22",
                    color: COMBAT_COLORS.momentum_gold,
                    border: `1px solid ${COMBAT_COLORS.momentum_gold}44`,
                  }}
                >
                  CHAIN
                </span>
              )}
              <span className="font-bold truncate">{move.name}</span>
            </div>

            {/* Row 2: success % + stamina cost */}
            <div className="flex items-center justify-between">
              <span
                className="text-[10px]"
                style={{ color: COMBAT_COLORS.secondary_text }}
              >
                {successPct}% success
              </span>
              <span
                className="text-[10px]"
                style={{ color: canAfford ? COMBAT_COLORS.stamina_fill : COMBAT_COLORS.opponent_red }}
              >
                {staminaCost} stamina
              </span>
            </div>

            {/* Legendary shimmer overlay */}
            {isLegendary && !isDisabled && (
              <div
                className="absolute inset-0 rounded-[6px] pointer-events-none"
                style={{
                  background: `linear-gradient(105deg, transparent 40%, ${COMBAT_COLORS.gold_border}12 50%, transparent 60%)`,
                  backgroundSize: "200% 100%",
                  animation: "legendaryShimmer 3s ease-in-out infinite",
                }}
              />
            )}
          </button>
        );
      })}

      {/* Keyframe for legendary shimmer */}
      <style jsx>{`
        @keyframes legendaryShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
