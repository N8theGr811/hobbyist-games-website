import Watermark from "./Watermark";

interface Moment {
  headline: string;
  line: string;
  media:
    | { kind: "image"; src: string; alt: string }
    | { kind: "video"; src: string; label: string };
}

/**
 * Three moments, not seven features.
 *
 * This section used to be a seven-item grid carrying ~245 words. Every item
 * had equal weight, so nothing landed, and a game about reading a position
 * and picking a move was argued entirely in prose. The seven collapsed into
 * these three ideas without losing anything GameInfo does not already cover,
 * which is the same move the combat system made when nine interactions
 * became three player-facing rules.
 *
 * Each moment shows rather than tells. The assets were already in the repo,
 * stranded in an unimported Preview.tsx.
 */
const MOMENTS: Moment[] = [
  {
    headline: "Every position plays differently",
    line: "70+ techniques across 19 positions, and you choose which ones you bring to each.",
    media: {
      kind: "image",
      src: "/media/screenshots/combat-position-odds.jpg",
      alt: "Combat screen in the guard top position, showing two move cards and three move options with their success odds",
    },
  },
  {
    headline: "Time it perfectly to increase your submission odds",
    line: "An 11-zone gauge decides the squeeze. Miss it and they escape.",
    media: {
      kind: "video",
      src: "/media/clips/submission-gauge.mp4",
      label: "Submission gauge resolving to a Great finish and a match victory",
    },
  },
  {
    headline: "Fight like nobody else",
    line: "Six archetypes, a skill tree, and a submission you name yourself.",
    media: {
      kind: "image",
      src: "/media/screenshots/choose-style.jpg",
      alt: "Style selection screen comparing the Wrestler archetype's starting stats and growth room",
    },
  },
];

export default function FeatureHighlights() {
  return (
    <section className="relative isolate section-rhythm px-6 bg-pixel-grid overflow-hidden md:px-12 border-y border-steam-gold/20">
      <Watermark name="backcontrol" className="-right-24 top-32 h-[440px] w-[440px]" />
      <Watermark name="granbyroll" className="-left-28 bottom-24 h-[420px] w-[336px]" />

      {/* Section header. The old title, "What Makes It Special", named the
          section instead of claiming anything. This one makes the claim. */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6 font-pixel text-pixel-xs tracking-[0.2em] uppercase text-steam-gold">
          <span className="w-6 h-px bg-steam-gold/40" />
          How It Plays
          <span className="w-6 h-px bg-steam-gold/40" />
        </div>
        <h2 className="font-pixel text-pixel-lg text-cream leading-tight tracking-wide">
          Real Jiu-Jitsu. Real Decisions.
        </h2>
      </div>

      {/* Alternating rows. Three across would shrink each frame to ~380px,
          and these are dense UI screenshots that stop being readable there. */}
      <div className="max-w-5xl mx-auto flex flex-col gap-16 md:gap-20">
        {MOMENTS.map((moment, i) => (
          <div
            key={moment.headline}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
          >
            <div className={i % 2 === 1 ? "md:order-2" : undefined}>
              <MomentMedia media={moment.media} />
            </div>
            <div className={i % 2 === 1 ? "md:order-1" : undefined}>
              <h3 className="font-pixel text-pixel-md uppercase tracking-[0.1em] text-steam-gold mb-4 leading-relaxed">
                {moment.headline}
              </h3>
              <p className="text-base leading-relaxed text-cream/70">
                {moment.line}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
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
