/**
 * The marker beside "Out now": a square, because everything else here is
 * pixels, and gold, because the hero's VS badge is deliberately the page's
 * only red element.
 *
 * The ping loops for as long as the page is open, so it is slow, and
 * globals.css turns it off under prefers-reduced-motion.
 */
export default function LiveDot({ size = 8 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex shrink-0"
      style={{ width: size, height: size }}
    >
      <span className="animate-live-ping absolute inset-0 bg-steam-gold" />
      <span className="relative h-full w-full bg-steam-gold-2 shadow-[0_0_8px_rgba(232,194,92,0.7)]" />
    </span>
  );
}
