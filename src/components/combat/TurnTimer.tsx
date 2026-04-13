// src/components/combat/TurnTimer.tsx
// Horizontal countdown bar that drains over the turn duration.
"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { COMBAT_COLORS, TURN_TIMER_SECONDS } from "@/lib/combat/constants";

interface TurnTimerProps {
  duration?: number;
  onTimeout: () => void;
  isActive: boolean;
}

export default function TurnTimer({
  duration = TURN_TIMER_SECONDS,
  onTimeout,
  isActive,
}: TurnTimerProps) {
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const [fraction, setFraction] = useState(1);
  const calledRef = useRef(false);

  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const tick = useCallback(
    (now: number) => {
      const elapsed = (now - startRef.current) / 1000;
      const remaining = Math.max(0, 1 - elapsed / duration);
      setFraction(remaining);

      if (remaining <= 0) {
        if (!calledRef.current) {
          calledRef.current = true;
          onTimeoutRef.current();
        }
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [duration]
  );

  useEffect(() => {
    if (!isActive) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setFraction(1);
      calledRef.current = false;
      return;
    }

    // Reset and start
    calledRef.current = false;
    startRef.current = performance.now();
    setFraction(1);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isActive, tick]);

  const timeLeft = fraction * duration;
  const isUrgent = timeLeft <= 3;

  // Color: gold normally, red in final 3 seconds
  const fillColor = isUrgent ? "#D93333" : COMBAT_COLORS.title_gold;

  return (
    <div
      className="w-full rounded-full mt-2 overflow-hidden"
      style={{
        height: "6px",
        backgroundColor: COMBAT_COLORS.stamina_bg,
      }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${fraction * 100}%`,
          backgroundColor: fillColor,
          transition: "background-color 0.3s ease",
          ...(isUrgent
            ? {
                animation: "timerPulse 0.5s ease-in-out infinite",
              }
            : {}),
        }}
      />
      {isUrgent && (
        <style jsx>{`
          @keyframes timerPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}</style>
      )}
    </div>
  );
}
