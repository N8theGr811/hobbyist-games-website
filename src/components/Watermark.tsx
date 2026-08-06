/** Premium combat position icons available as background washes. */
export type WatermarkName = "backcontrol" | "openguard" | "saddle" | "turtle";

interface WatermarkProps {
  name: WatermarkName;
  /** Position, size, and any mirroring. Caller owns placement. */
  className?: string;
}

/**
 * A faint position-icon wash for section backgrounds.
 *
 * The source art is team red and blue. Rendering it as-is would put two more
 * hues on a gold-on-navy page, so the PNGs are reduced to their alpha channel
 * and used as CSS masks: the fill comes from the theme, not the artwork.
 *
 * Mirroring is left to the caller as a `scale-x-[-1]` utility rather than a
 * prop, so it composes with Tailwind's other transforms instead of an inline
 * `transform` overwriting them.
 *
 * Decorative only, so it is hidden from assistive tech and ignores pointers.
 * Hidden below md, where sections are narrow enough that a wash would sit
 * directly behind body copy.
 */
export default function Watermark({ name, className = "" }: WatermarkProps) {
  const src = `url(/combat-icons/${name}.png)`;
  return (
    <div
      aria-hidden="true"
      className={`watermark hidden md:block ${className}`}
      style={{ maskImage: src, WebkitMaskImage: src }}
    />
  );
}
