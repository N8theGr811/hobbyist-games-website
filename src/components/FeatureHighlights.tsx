import MomentRows, { type Moment } from "./MomentRows";
import Watermark from "./Watermark";

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
 * Each moment shows rather than tells.
 *
 * All three are phone captures, cropped the same way the Explore The Region
 * shots are: the game renders 16:9 inside a 2556x1179 screen, so 230px of
 * black pillar comes off each side and the remaining 2096x1179 drops into the
 * aspect-video panel with nothing trimmed.
 *
 * The submission row used to be a looping clip. A still of the gauge landing
 * on GREAT says the same thing in one frame, costs 263KB instead of 1.1MB,
 * and does not need autoplay to work.
 */
const MOMENTS: Moment[] = [
  {
    headline: "Every position plays differently",
    line: "90+ techniques across 19 positions, and you choose which ones you bring to each.",
    media: {
      kind: "image",
      src: "/media/screenshots/combat-guard-top.png",
      alt: "Combat screen in guard top on turn 3 of 10, showing the double leg takedown that landed against the flying triangle that missed, and three move options with their odds and point values",
    },
  },
  {
    headline: "Time it perfectly to increase your submission odds",
    line: "An 11-zone gauge decides the squeeze. Miss it and they escape.",
    media: {
      kind: "image",
      src: "/media/screenshots/submission-great.png",
      alt: "A buggy choke locked in from bottom side control, with the timing gauge stopped inside the GREAT band",
    },
  },
  {
    headline: "Fight like nobody else",
    line: "Six archetypes, a skill tree, and a submission you name yourself.",
    media: {
      kind: "image",
      src: "/media/screenshots/skill-tree.png",
      alt: "The skills tree with passing, submissions, escapes and wrestling maxed at five ranks each, guard untouched, and leg locks part-spent",
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
      <MomentRows moments={MOMENTS} />
    </section>
  );
}
