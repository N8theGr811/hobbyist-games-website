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
    <div
      className="text-center py-2 mx-auto"
      style={{
        borderTop: `1px solid ${COMBAT_COLORS.secondary_border}`,
        borderBottom: `1px solid ${COMBAT_COLORS.secondary_border}`,
        borderLeft: "none",
        borderRight: "none",
      }}
    >
      <p
        className="font-mono text-base font-bold tracking-wide"
        style={{ color: COMBAT_COLORS.body_text }}
      >
        {name}
      </p>
      {/* Dominance color bar */}
      <div
        className="mx-auto mt-1 rounded-full"
        style={{
          width: "120px",
          height: "5px",
          backgroundColor: domColor,
          boxShadow: `0 0 6px ${domColor}40`,
          transition: "background-color 0.4s ease, box-shadow 0.4s ease",
        }}
      />
    </div>
  );
}
