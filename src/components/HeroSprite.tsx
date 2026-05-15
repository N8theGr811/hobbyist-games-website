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
}

// Front idle: row 24 (y = 24 * 64 = 1536), columns 0–1, 2 frames at 5fps
const FRAME_SIZE = 64;
const COLUMNS = 13;
const ROW_Y = 1536;
const FRAME_COUNT = 2;
const FPS = 5;

export default function HeroSprite({ spriteSheet, flip = false, size = 320 }: HeroSpriteProps) {
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
  );
}
