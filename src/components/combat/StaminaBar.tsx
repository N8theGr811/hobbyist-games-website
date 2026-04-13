// src/components/combat/StaminaBar.tsx
// Animated stamina bar with low-stamina pulse effect.
"use client";

import { COMBAT_COLORS } from "@/lib/combat/constants";

interface StaminaBarProps {
  value: number;
  maxValue?: number;
  side: "player" | "opponent";
}

export default function StaminaBar({
  value,
  maxValue = 100,
  side,
}: StaminaBarProps) {
  const pct = Math.max(0, Math.min(100, (value / maxValue) * 100));
  const isLow = pct <= 30;
  const accentColor =
    side === "player" ? COMBAT_COLORS.player_blue : COMBAT_COLORS.opponent_red;

  return (
    <div className="flex-1">
      <div
        className="h-2.5 rounded-full overflow-hidden relative"
        style={{ backgroundColor: COMBAT_COLORS.stamina_bg }}
      >
        <div
          className="h-full rounded-full relative"
          style={{
            width: `${pct}%`,
            backgroundColor: isLow
              ? COMBAT_COLORS.stamina_low_pulse
              : COMBAT_COLORS.stamina_fill,
            transition: "width 0.4s ease-out, background-color 0.3s ease",
            animation: isLow ? "stamina-pulse 1s ease-in-out infinite" : "none",
          }}
        />
        {/* Percentage text inside bar */}
        <span
          className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold leading-none"
          style={{
            color: pct > 15 ? "#fff" : COMBAT_COLORS.body_text,
            textShadow: "0 1px 2px rgba(0,0,0,0.6)",
          }}
        >
          {Math.round(value)}
        </span>
      </div>

      <style jsx>{`
        @keyframes stamina-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
