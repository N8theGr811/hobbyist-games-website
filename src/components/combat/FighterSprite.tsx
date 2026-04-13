// src/components/combat/FighterSprite.tsx
// Animated pixel-art fighter sprite using CSS background-position technique.
"use client";

import { useState, useEffect, useRef } from "react";
import { COMBAT_COLORS } from "@/lib/combat/constants";

interface FighterSpriteProps {
  spriteSheet: string;
  side: "player" | "opponent";
}

// Front idle: row 24 (y = 24 * 64 = 1536), columns 0–1, 2 frames at 5fps
const FRAME_SIZE = 64;
const SCALE = 2; // 64 -> 128px display
const DISPLAY_SIZE = FRAME_SIZE * SCALE;
const ROW_Y = 1536; // row 24
const FRAME_COUNT = 2;
const FPS = 5;

export default function FighterSprite({ spriteSheet, side }: FighterSpriteProps) {
  const [frame, setFrame] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setFrame((prev) => (prev + 1) % FRAME_COUNT);
    }, 1000 / FPS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const bgX = -(frame * FRAME_SIZE * SCALE);
  const bgY = -(ROW_Y * SCALE);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: `${DISPLAY_SIZE}px`,
          height: `${DISPLAY_SIZE}px`,
          backgroundImage: `url("${spriteSheet}")`,
          backgroundPosition: `${bgX}px ${bgY}px`,
          backgroundSize: `${FRAME_SIZE * SCALE * 13}px auto`, // 13 columns in the spritesheet
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
          transform: side === "opponent" ? "scaleX(-1)" : "none",
        }}
      />
      {/* Platform */}
      <div
        style={{
          width: `${DISPLAY_SIZE}px`,
          height: "4px",
          background: `linear-gradient(to right, transparent, ${COMBAT_COLORS.gold_border}4D, transparent)`,
          boxShadow: `0 2px 8px ${COMBAT_COLORS.gold_border}20`,
          marginTop: "-2px",
        }}
      />
    </div>
  );
}
