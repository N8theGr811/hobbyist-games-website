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

// Spritesheet: 832×3456, 13 columns × 54 rows of 64×64 frames.
// Front idle: row 24 (y = 24 * 64 = 1536), columns 0–1, 2 frames at 5fps.
const FRAME_SIZE = 64;
const COLUMNS = 13;
const ROWS = 54;
const ROW_INDEX = 24;
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
  // Position the sheet so the right frame in the right row is visible inside the clip box
  const offsetX = -(frame * FRAME_SIZE * scale);
  const offsetY = -(ROW_INDEX * FRAME_SIZE * scale);
  const sheetWidth = FRAME_SIZE * COLUMNS * scale;
  const sheetHeight = FRAME_SIZE * ROWS * scale;

  return (
    <div
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size + 24}px`, // extra room for the floor shadow
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

      {/* Sprite clip box — renders the spritesheet as an <img>, offset into view */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: `${size}px`,
          height: `${size}px`,
          overflow: "hidden",
          transform: flip ? "scaleX(-1)" : "none",
        }}
      >
        {/* Use a plain <img>; Next/Image would optimize and break the spritesheet offset math */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={spriteSheet}
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${sheetWidth}px`,
            height: `${sheetHeight}px`,
            maxWidth: "none", // override any global img max-width
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            imageRendering: "pixelated",
            userSelect: "none",
          }}
        />
      </div>

      {/* Floor shadow (elliptical, beneath the sprite) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: `${size * 0.55}px`,
          height: "18px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 40%, transparent 75%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </div>
  );
}
