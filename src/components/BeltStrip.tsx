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
