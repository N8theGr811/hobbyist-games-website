// src/components/HeroSprite.tsx
// Large animated pixel-art fighter sprite for the hero section.
"use client";

import { useState, useEffect, useRef } from "react";

interface HeroSpriteProps {
  spriteSheet: string;
  /** Flip horizontally so opponent faces inward */
  flip?: boolean;
  /** Display size in px (square) */
  size?: number;
  /** Glow color behind the sprite (defaults to mat red) */
  glowColor?: string;
}

// Front idle: row 24 (y = 24 * 64 = 1536), columns 0–1, 2 frames at 5fps
const FRAME_SIZE = 64;
const COLUMNS = 13;
const ROW_Y = 1536;
const FRAME_COUNT = 2;
const FPS = 5;

export default function HeroSprite({
  spriteSheet,
  flip = false,
  size = 320,
  glowColor = "rgba(200,55,45,0.18)",
}: HeroSpriteProps) {
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

  const scale = size / FRAME_SIZE;
  const bgX = -(frame * FRAME_SIZE * scale);
  const bgY = -(ROW_Y * scale);

  return (
    <div
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size + 24}px`, // a bit of extra room for the floor shadow
      }}
    >
      {/* Colored glow behind sprite */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: `${size * 0.95}px`,
          height: `${size * 0.95}px`,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 65%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Sprite */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: `${size}px`,
          height: `${size}px`,
          backgroundImage: `url("${spriteSheet}")`,
          backgroundPosition: `${bgX}px ${bgY}px`,
          backgroundSize: `${FRAME_SIZE * scale * COLUMNS}px auto`,
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
          transform: flip ? "scaleX(-1)" : "none",
        }}
      />

      {/* Floor shadow (elliptical, beneath the sprite) */}
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: `${size * 0.55}px`,
          height: "18px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(27,22,18,0.32) 0%, rgba(27,22,18,0.18) 40%, transparent 75%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </div>
  );
}
