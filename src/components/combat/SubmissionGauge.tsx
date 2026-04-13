// src/components/combat/SubmissionGauge.tsx
// Canvas-based submission gauge mini-game with needle animation.
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { type GaugeResult } from "@/lib/combat/types";
import { COMBAT_COLORS } from "@/lib/combat/constants";
import {
  createGaugeConfig,
  calculateNeedlePosition,
  resolveGauge,
  getTotalGaugeDuration,
} from "@/lib/combat/gauge";

interface SubmissionGaugeProps {
  submissionAttacker: "player" | "opponent";
  baseSubChance: number;
  onResult: (result: GaugeResult) => void;
}

const GAUGE_WIDTH = 600;
const GAUGE_HEIGHT = 60;
const CANVAS_PADDING = 20;

export function SubmissionGauge({ submissionAttacker, baseSubChance, onResult }: SubmissionGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const [phase, setPhase] = useState<"struggle" | "gauge" | "result">("struggle");
  const [gaugeResult, setGaugeResult] = useState<GaugeResult | null>(null);
  const needleStoppedRef = useRef(false);
  const needlePosRef = useRef(0);

  const [config] = useState(() => createGaugeConfig());
  const isPlayerAttacking = submissionAttacker === "player";

  // Struggle phase -> gauge phase
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("gauge");
      startTimeRef.current = performance.now();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleStop = useCallback(() => {
    if (needleStoppedRef.current) return;
    needleStoppedRef.current = true;
    cancelAnimationFrame(animFrameRef.current);

    const result = resolveGauge(needlePosRef.current, baseSubChance, config, Math.random);
    setGaugeResult(result);
    setPhase("result");

    // Notify parent after brief display
    setTimeout(() => onResult(result), 1500);
  }, [baseSubChance, config, onResult]);

  // Canvas rendering loop
  useEffect(() => {
    if (phase !== "gauge") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const totalDuration = getTotalGaugeDuration(config);
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
          // Auto-stop: resolve
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
      perfectPulsePhase += 0.016; // ~60fps
      const perfectAlpha = 0.35 + 0.125 * (1 + Math.sin(perfectPulsePhase * Math.PI * 2));

      for (const zone of config.zones) {
        const w = zone.width * GAUGE_WIDTH;
        ctx.fillStyle = zone.color;
        ctx.globalAlpha = zone.label === "PERFECT" ? perfectAlpha : zone.alpha;
        ctx.beginPath();
        // Pill shape for first and last zones
        if (x === gaugeX) {
          roundedRectLeft(ctx, x, gaugeY, w, GAUGE_HEIGHT, 8);
        } else if (x + w >= gaugeX + GAUGE_WIDTH - 1) {
          roundedRectRight(ctx, x, gaugeY, w, GAUGE_HEIGHT, 8);
        } else {
          ctx.rect(x, gaugeY, w, GAUGE_HEIGHT);
        }
        ctx.fill();
        ctx.globalAlpha = 1;

        // Hash mark between zones (except last)
        if (x > gaugeX) {
          ctx.fillStyle = COMBAT_COLORS.gauge_bg;
          ctx.fillRect(x - 1, gaugeY, 2, GAUGE_HEIGHT);
        }

        // PERFECT zone border glow
        if (zone.label === "PERFECT") {
          ctx.strokeStyle = COMBAT_COLORS.success_green;
          ctx.lineWidth = 2;
          ctx.shadowColor = COMBAT_COLORS.success_green;
          ctx.shadowBlur = 4;
          ctx.strokeRect(x + 1, gaugeY + 1, w - 2, GAUGE_HEIGHT - 2);
          ctx.shadowBlur = 0;
        }

        x += w;
      }

      // Neon accent line below gauge
      const accentColor = isPlayerAttacking ? COMBAT_COLORS.sub_purple : COMBAT_COLORS.opponent_red;
      ctx.fillStyle = accentColor;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 4;
      ctx.fillRect(gaugeX, gaugeY + GAUGE_HEIGHT + 4, GAUGE_WIDTH, 2);
      ctx.shadowBlur = 0;

      // Needle
      const needleX = gaugeX + needlePosRef.current * GAUGE_WIDTH;
      const needleTop = gaugeY - 4;
      const needleBottom = gaugeY + GAUGE_HEIGHT + 4;

      // Halo
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(needleX - 4.5, needleTop, 9, needleBottom - needleTop);

      // Needle line
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(needleX - 1.5, needleTop, 3, needleBottom - needleTop);

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [phase, config, isPlayerAttacking, handleStop]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      {/* Struggle phase */}
      {phase === "struggle" && (
        <div className="text-center">
          <p
            className="font-mono text-xl font-bold uppercase tracking-wider animate-pulse"
            style={{ color: COMBAT_COLORS.sub_purple }}
          >
            SUBMISSION ATTEMPT!
          </p>
          <p className="font-mono text-sm mt-2" style={{ color: COMBAT_COLORS.body_text }}>
            {isPlayerAttacking ? "Squeeze tight..." : "Fight the submission!"}
          </p>
        </div>
      )}

      {/* Gauge phase */}
      {phase === "gauge" && (
        <div className="text-center">
          <p className="font-mono text-sm mb-4 uppercase tracking-wider" style={{ color: COMBAT_COLORS.body_text }}>
            {isPlayerAttacking ? "Time your squeeze!" : "Find the escape!"}
          </p>

          <canvas
            ref={canvasRef}
            width={GAUGE_WIDTH + CANVAS_PADDING * 2}
            height={GAUGE_HEIGHT + CANVAS_PADDING * 2 + 10}
            className="mx-auto"
            style={{ maxWidth: "100%" }}
          />

          <button
            onClick={handleStop}
            className="mt-4 px-6 py-2 font-mono text-sm font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-95"
            style={{
              backgroundColor: COMBAT_COLORS.panel_bg,
              color: isPlayerAttacking ? COMBAT_COLORS.sub_purple : COMBAT_COLORS.def_blue,
              borderBottom: `3px solid ${isPlayerAttacking ? COMBAT_COLORS.sub_purple : COMBAT_COLORS.def_blue}`,
              borderRadius: "6px",
            }}
          >
            {isPlayerAttacking ? "SQUEEZE!" : "FIGHT IT!"}
          </button>
        </div>
      )}

      {/* Result phase */}
      {phase === "result" && gaugeResult && (
        <div
          className="text-center"
          style={{ animation: "popIn 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
        >
          <p
            className="font-mono text-3xl font-bold uppercase"
            style={{
              color: gaugeResult.success ? COMBAT_COLORS.success_green : COMBAT_COLORS.fail_orange,
            }}
          >
            {gaugeResult.success ? "SUBMITTED!" : "ESCAPED!"}
          </p>
          <p className="font-mono text-sm mt-2" style={{ color: COMBAT_COLORS.body_text }}>
            Zone: {gaugeResult.zone_label}
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes popIn {
          from { transform: scale(1.3); opacity: 0; }
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
