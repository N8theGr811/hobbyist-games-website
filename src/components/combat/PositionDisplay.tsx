// src/components/combat/PositionDisplay.tsx
// Shows current position name with a dominance-colored bar underneath.
"use client";

import { type Position } from "@/lib/combat/types";
import { POSITIONS, getDominanceColor, COMBAT_COLORS } from "@/lib/combat/constants";

interface PositionDisplayProps {
  position: Position;
}

export default function PositionDisplay({ position }: PositionDisplayProps) {
  const posData = POSITIONS[position];
  const name = posData?.name ?? "Unknown";
  const dominance = posData?.dominance ?? 5;
  const domColor = getDominanceColor(dominance);

  return (
    <div className="text-center px-3 py-1">
      <p
        className="font-mono text-sm font-bold tracking-wide whitespace-nowrap"
        style={{ color: COMBAT_COLORS.body_text }}
      >
        {name}
      </p>
      {/* Dominance color bar */}
      <div
        className="mx-auto mt-0.5 rounded-full"
        style={{
          width: "80px",
          height: "4px",
          backgroundColor: domColor,
          boxShadow: `0 0 6px ${domColor}40`,
          transition: "background-color 0.4s ease, box-shadow 0.4s ease",
        }}
      />
    </div>
  );
}
