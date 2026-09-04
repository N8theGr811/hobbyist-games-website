export interface Moment {
  headline: string;
  line: string;
  media:
    | { kind: "image"; src: string; alt: string }
    | { kind: "video"; src: string; label: string };
}

/**
 * Alternating headline/media rows.
 *
 * Extracted when Beyond The Mat became a second set of these. The layout is
 * one idea, so it lives in one place rather than being pasted into the second
 * caller and left to drift.
 *
 * `startSide` exists because the zigzag has to survive a section boundary.
 * How It Plays ends on a left-media row, so Beyond The Mat has to open on a
 * right-media one or the alternation stutters exactly where the two meet —
 * which is the one place a reader is most likely to notice it.
 */
export default function MomentRows({
  moments,
  startSide = "left",
}: {
  moments: Moment[];
  startSide?: "left" | "right";
}) {
  const flip = startSide === "right";

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-16 md:gap-20">
      {moments.map((moment, i) => {
        const mediaRight = (i % 2 === 1) !== flip;
        return (
          <div
            key={moment.headline}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
          >
            <div className={mediaRight ? "md:order-2" : undefined}>
              <MomentMedia media={moment.media} />
            </div>
            <div className={mediaRight ? "md:order-1" : undefined}>
              <h3 className="font-pixel text-pixel-md uppercase tracking-[0.1em] text-steam-gold mb-4 leading-relaxed">
                {moment.headline}
              </h3>
              <p className="text-base leading-relaxed text-cream/70">
                {moment.line}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Screenshot or looping clip, both in the shared gold panel frame. */
function MomentMedia({ media }: { media: Moment["media"] }) {
  return (
    <div className="steam-panel relative aspect-video overflow-hidden">
      {media.kind === "video" ? (
        <video
          src={media.src}
          aria-label={media.label}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        /* Plain img rather than next/image: this is a fixed decorative frame
           and object-cover already handles the fit. */
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={media.src}
          alt={media.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
