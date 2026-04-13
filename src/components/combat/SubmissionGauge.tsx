// src/components/combat/SubmissionGauge.tsx
// Canvas-based submission gauge mini-game. Shows the gauge, lets the player
// tap to stop the needle, briefly flashes the zone name, then calls onResult.
// The cinematic sequence (DIM → STRUGGLE → FREEZE → REVEAL) happens in CombatDemo.
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { type GaugeResult } from "@/lib/combat/types";
import { COMBAT_COLORS } from "@/lib/combat/constants";
import {
  createGaugeConfig,
  calculateNeedlePosition,
  resolveGauge,
  getZoneAtPosition,
} from "@/lib/combat/gauge";

interface SubmissionGaugeProps {
  submissionAttacker: "player" | "opponent";
  moveName: string;
  baseSubChance: number;
  onResult: (result: GaugeResult) => void;
}

const GAUGE_WIDTH = 600;
const GAUGE_HEIGHT = 60;
const CANVAS_PADDING = 20;

/** Zone label colors matching the game exactly. */
const ZONE_COLORS: Record<string, string> = {
  MISS: "#666666",
  POOR: "#E64040",
  OK: "#E68C33",
  GOOD: "#E6D940",
  GREAT: "#66F266",
  PERFECT: "#BF8CFF",
};

export function SubmissionGauge({ submissionAttacker, moveName, baseSubChance, onResult }: SubmissionGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const [started, setStarted] = useState(false);
  const [zoneFlash, setZoneFlash] = useState<{ label: string; color: string } | null>(null);
  const needleStoppedRef = useRef(false);
  const needlePosRef = useRef(0);
  const resultRef = useRef<GaugeResult | null>(null);

  const [config] = useState(() => createGaugeConfig());
  const isPlayerAttacking = submissionAttacker === "player";

  // Start the gauge after a brief moment
  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
      startTimeRef.current = performance.now();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleStop = useCallback(() => {
    if (needleStoppedRef.current) return;
    needleStoppedRef.current = true;
    cancelAnimationFrame(animFrameRef.current);

    const result = resolveGauge(needlePosRef.current, baseSubChance, config, Math.random);
    resultRef.current = result;

    // Get zone color for the flash
    const { zone } = getZoneAtPosition(needlePosRef.current, config.zones);
    setZoneFlash({ label: zone.label, color: ZONE_COLORS[zone.label] || zone.color });

    // Hold zone name for 0.75s, then fire onResult
    setTimeout(() => onResult(result), 750);
  }, [baseSubChance, config, onResult]);

  // Canvas rendering loop
  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let perfectPulsePhase = 0;

    function draw(timestamp: number) {
      if (!ctx || !canvas) return;
      const elapsed = (timestamp - startTimeRef.current) / 1000;

      // Update needle position
      if (!needleStoppedRef.current) {
        const { position, stopped } = calculateNeedlePosition(elapsed, config);
        needlePosRef.current = position;
        if (stopped) {
          needleStoppedRef.current = true;
          handleStop();
          return;
        }
      }

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gaugeX = CANVAS_PADDING;
      const gaugeY = (canvas.height - GAUGE_HEIGHT) / 2;

      // Draw zones
      let x = gaugeX;
      perfectPulsePhase += 0.016;
      const perfectAlpha = 0.35 + 0.125 * (1 + Math.sin(perfectPulsePhase * Math.PI));

      for (const zone of config.zones) {
        const w = zone.width * GAUGE_WIDTH;
        ctx.fillStyle = zone.color;
        ctx.globalAlpha = zone.label === "PERFECT" ? perfectAlpha : zone.alpha;
        ctx.beginPath();
        if (x === gaugeX) {
          roundedRectLeft(ctx, x, gaugeY, w, GAUGE_HEIGHT, 8);
        } else if (x + w >= gaugeX + GAUGE_WIDTH - 1) {
          roundedRectRight(ctx, x, gaugeY, w, GAUGE_HEIGHT, 8);
        } else {
          ctx.rect(x, gaugeY, w, GAUGE_HEIGHT);
        }
        ctx.fill();
        ctx.globalAlpha = 1;

        // Hash mark between zones
        if (x > gaugeX) {
          ctx.fillStyle = COMBAT_COLORS.gauge_bg;
          ctx.fillRect(x - 1, gaugeY, 2, GAUGE_HEIGHT);
        }

        // PERFECT zone border glow
        if (zone.label === "PERFECT") {
          ctx.strokeStyle = "#BF8CFF";
          ctx.lineWidth = 2;
          ctx.shadowColor = "#BF8CFF";
          ctx.shadowBlur = 4;
          ctx.strokeRect(x + 1, gaugeY + 1, w - 2, GAUGE_HEIGHT - 2);
          ctx.shadowBlur = 0;
        }

        x += w;
      }

      // Accent line below gauge
      const accentColor = isPlayerAttacking ? COMBAT_COLORS.sub_purple : COMBAT_COLORS.def_blue;
      ctx.fillStyle = accentColor;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 4;
      ctx.fillRect(gaugeX, gaugeY + GAUGE_HEIGHT + 4, GAUGE_WIDTH, 2);
      ctx.shadowBlur = 0;

      // Needle
      const needleX = gaugeX + needlePosRef.current * GAUGE_WIDTH;
      const needleTop = gaugeY - 4;
      const needleBottom = gaugeY + GAUGE_HEIGHT + 4;

      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(needleX - 4.5, needleTop, 9, needleBottom - needleTop);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(needleX - 1.5, needleTop, 3, needleBottom - needleTop);

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [started, config, isPlayerAttacking, handleStop]);

  return (
    <div className="flex flex-col items-center justify-center py-2">
      {/* Header */}
      <p
        className="font-mono text-sm font-bold uppercase tracking-wider mb-1"
        style={{ color: isPlayerAttacking ? "#D93333" : "#408CE0" }}
      >
        {isPlayerAttacking ? "LOCK IN SUBMISSION!" : `${moveName} Locked In!`}
      </p>

      {/* Subtitle */}
      <p className="font-mono text-xs mb-3" style={{ color: COMBAT_COLORS.body_text, opacity: 0.6 }}>
        {isPlayerAttacking ? "Time your squeeze..." : "Fight to escape..."}
      </p>

      {/* Zone flash overlay (shown after needle stops) */}
      {zoneFlash && (
        <div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        >
          <p
            className="font-mono text-4xl font-bold uppercase"
            style={{
              color: zoneFlash.color,
              animation: "zonePopIn 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              textShadow: `0 0 16px ${zoneFlash.color}80`,
            }}
          >
            {zoneFlash.label}
          </p>
        </div>
      )}

      {/* Canvas gauge */}
      {started && !zoneFlash && (
        <canvas
          ref={canvasRef}
          width={GAUGE_WIDTH + CANVAS_PADDING * 2}
          height={GAUGE_HEIGHT + CANVAS_PADDING * 2 + 10}
          className="mx-auto"
          style={{ maxWidth: "100%" }}
        />
      )}

      {/* Button */}
      {started && !zoneFlash && (
        <button
          onClick={handleStop}
          className="mt-2 px-6 py-2 font-mono text-sm font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-95"
          style={{
            backgroundColor: COMBAT_COLORS.panel_bg,
            color: isPlayerAttacking ? COMBAT_COLORS.sub_purple : COMBAT_COLORS.def_blue,
            borderBottom: `3px solid ${isPlayerAttacking ? COMBAT_COLORS.sub_purple : COMBAT_COLORS.def_blue}`,
            borderRadius: "6px",
          }}
        >
          {isPlayerAttacking ? "SQUEEZE!" : "FIGHT IT!"}
        </button>
      )}

      <style jsx>{`
        @keyframes zonePopIn {
          from { transform: scale(1.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// --- Canvas helpers ---

function roundedRectLeft(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function roundedRectRight(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x, y + h);
  ctx.closePath();
}
