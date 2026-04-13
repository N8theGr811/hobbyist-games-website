// src/lib/combat/gauge.ts
// Submission gauge logic — zone configs, needle math, result calculation.
// Pure math, no rendering.

import { type GaugeZone, type GaugeConfig, type GaugeResult } from "./types";

// ─── Zone Definitions ───
// 11 zones, symmetric layout: MISS-POOR-OK-GOOD-GREAT-PERFECT-GREAT-GOOD-OK-POOR-MISS
// Widths must sum to 1.0.

const GAUGE_ZONES: GaugeZone[] = [
  { label: "MISS",    width: 0.08, color: "#666666", alpha: 0.45, modifier: -1.0 },
  { label: "POOR",    width: 0.09, color: "#E64040", alpha: 0.50, modifier: -0.50 },
  { label: "OK",      width: 0.10, color: "#E68C33", alpha: 0.55, modifier: -0.15 },
  { label: "GOOD",    width: 0.10, color: "#E6D940", alpha: 0.55, modifier: 0.0 },
  { label: "GREAT",   width: 0.09, color: "#66F266", alpha: 0.60, modifier: 0.10 },
  { label: "PERFECT", width: 0.08, color: "#BF8CFF", alpha: 0.50, modifier: 0.25 },
  { label: "GREAT",   width: 0.09, color: "#66F266", alpha: 0.60, modifier: 0.10 },
  { label: "GOOD",    width: 0.10, color: "#E6D940", alpha: 0.55, modifier: 0.0 },
  { label: "OK",      width: 0.10, color: "#E68C33", alpha: 0.55, modifier: -0.15 },
  { label: "POOR",    width: 0.09, color: "#E64040", alpha: 0.50, modifier: -0.50 },
  { label: "MISS",    width: 0.08, color: "#666666", alpha: 0.45, modifier: -1.0 },
];

export function createGaugeConfig(): GaugeConfig {
  return {
    zones: GAUGE_ZONES,
    max_bounces: 4,
    bounce_speed_ramp: 0.85,
    base_sweep_duration: 1.0,
  };
}

/**
 * Calculate needle position (0.0-1.0) given elapsed time and config.
 * The needle sweeps left-to-right, then bounces back, getting slower each bounce.
 * Returns a normalized position along the gauge.
 */
export function calculateNeedlePosition(
  elapsedSeconds: number,
  config: GaugeConfig
): { position: number; bounces: number; stopped: boolean } {
  let time = elapsedSeconds;
  let bounces = 0;
  let sweepDuration = config.base_sweep_duration;
  let direction = 1; // 1 = left-to-right, -1 = right-to-left

  while (bounces < config.max_bounces) {
    if (time <= sweepDuration) {
      // Currently in this sweep
      const t = time / sweepDuration;
      const position = direction === 1 ? t : 1.0 - t;
      return { position: Math.max(0, Math.min(1, position)), bounces, stopped: false };
    }

    time -= sweepDuration;
    bounces++;
    direction *= -1;
    sweepDuration *= config.bounce_speed_ramp;
  }

  // Max bounces reached — needle stops at final position
  // The final position after all bounces
  const finalDirection = bounces % 2 === 0 ? 1 : -1;
  return {
    position: finalDirection === 1 ? 1.0 : 0.0,
    bounces: config.max_bounces,
    stopped: true,
  };
}

/**
 * Get total duration the needle will sweep before auto-stopping (sum of all sweep durations).
 */
export function getTotalGaugeDuration(config: GaugeConfig): number {
  let total = 0;
  let duration = config.base_sweep_duration;
  for (let i = 0; i <= config.max_bounces; i++) {
    total += duration;
    duration *= config.bounce_speed_ramp;
  }
  return total;
}

/**
 * Determine which zone the needle landed in.
 * @param position 0.0-1.0 along the gauge
 */
export function getZoneAtPosition(position: number, zones: GaugeZone[]): { index: number; zone: GaugeZone } {
  let accumulated = 0;
  for (let i = 0; i < zones.length; i++) {
    accumulated += zones[i].width;
    if (position <= accumulated) {
      return { index: i, zone: zones[i] };
    }
  }
  // Edge case: return last zone
  return { index: zones.length - 1, zone: zones[zones.length - 1] };
}

/**
 * Calculate the final submission result given needle position and base sub_chance.
 * The zone modifier is added to the base chance, then we roll.
 */
export function resolveGauge(
  needlePosition: number,
  baseSubChance: number,
  config: GaugeConfig,
  rng: () => number
): GaugeResult {
  const { index, zone } = getZoneAtPosition(needlePosition, config.zones);

  // MISS zone = automatic failure (modifier -1.0 brings any chance to near zero)
  const finalChance = Math.max(0, Math.min(1, baseSubChance + zone.modifier));
  const success = rng() < finalChance;

  return {
    zone_index: index,
    zone_label: zone.label,
    modifier: zone.modifier,
    final_chance: finalChance,
    success,
  };
}
