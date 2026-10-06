interface BeltStripProps {
  /** Width as CSS value (defaults to 100%) */
  width?: string;
  /** Height in px */
  height?: number;
  className?: string;
}

/**
 * Belt-rank gradient strip (white → blue → purple → brown → black).
 * Used as a recurring section divider.
 */
export default function BeltStrip({
  width = "100%",
  height = 8,
  className = "",
}: BeltStripProps) {
  return (
    <div
      className={`belt-strip ${className}`}
      style={{
        width,
        height,
        boxShadow: "0 0 0 1px rgba(0,0,0,0.4), 0 1px 4px rgba(212,165,60,0.2)",
      }}
      aria-hidden="true"
    />
  );
}

/**
 * The hero's belt bar: hard stops, no shadow, min(640px, 80%) wide. Also
 * marks the seam between homepage sections, so the two always match.
 */
export function BeltBar({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      className={`h-2 w-[min(640px,80%)] rounded-[4px] ${className}`}
      style={{
        background:
          "linear-gradient(90deg, #f5f0d8 0 20%, #3878dc 0 40%, #7a3fb8 0 60%, #6b4226 0 80%, #0e0e14 0)",
        ...style,
      }}
    />
  );
}
