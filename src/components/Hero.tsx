import Image from "next/image";
import HeroSprite from "./HeroSprite";
import BeltStrip from "./BeltStrip";
import LiveDot from "./LiveDot";
import StoreButtons from "./StoreButtons";
import StatIcon, { type StatName } from "./StatIcon";
import Watermark from "./Watermark";

const PLAYER_SPRITE = "/sprites/purple1.png";
const OPPONENT_SPRITE = "/sprites/purple2.png";

/** The fighters' box centre sits 30px above the VS badge's centre. */
const FIGHTER_Y = "translateY(calc(-50% - 30px))";
/**
 * Each fighter's box starts 10% in from its edge of the screen. The ring's
 * row is centred, so measured from its middle that is half its own width,
 * less 40vw.
 */
const FIGHTER_X = "calc(50% - 40vw)";

// The 8 game stats arranged in a ring around the central VS
const STAT_RING: StatName[] = [
  "guard",        // top
  "passing",      // top-right
  "submissions",  // right
  "escapes",      // bottom-right
  "wrestling",    // bottom
  "leg-locks",    // bottom-left
  "cardio",       // left
  "strength",     // top-left
];

export default function Hero() {
  return (
    <section className="relative isolate min-h-screen flex flex-col items-center justify-center overflow-hidden bg-pixel-grid">
      {/* Standing position wash. Centred so the gap between the two figures
          sits behind the VS badge and they bracket it, echoing the flanking
          sprites. `isolate` on the section is what lets the wash's negative
          z-index land above the background but under the z-10/z-20 layers. */}
      <Watermark
        name="standing"
        className="left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2"
      />

      {/* ─── Atmospheric glows ─── */}
      <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(212,165,60,0.10)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(74,134,224,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(212,165,60,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* ─── Content ───
          A flex column only so the store buttons can change places with the
          stat ring (see the order classes below). The items stretch to full
          width, exactly as blocks did, so nothing else moves. */}
      <div className="relative z-20 flex flex-col text-center px-6 pt-24 pb-16">
        {/* Studio credit. Body face, not pixel: this is metadata, and set in
            Press Start 2P it was competing with the wordmark below it. */}
        <p
          className="animate-fade-up text-xs tracking-[0.2em] uppercase text-cream/55 mb-10"
          style={{ animationDelay: "0.4s" }}
        >
          A Hobbyist Games Production
        </p>

        {/* ─── Pixel-art Wordmark ─── */}
        <div className="animate-title-reveal mb-8" style={{ animationDelay: "0.5s" }}>
          <Image
            src="/brand/wordmarks/submission-saga-gold.png"
            alt="Submission Saga — The Jiu Jitsu RPG"
            width={1280}
            height={720}
            priority
            /* max-height is the binding constraint, not max-width: the source
               is 640x360, so height drives the rendered width. Held at 200px
               on mobile, where 200 already renders 356px wide inside a 375px
               viewport and anything larger clips against the section's
               overflow-hidden. */
            className="w-auto h-auto max-w-[520px] max-h-[200px] sm:max-h-[220px] md:max-h-[240px] mx-auto"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* Stat-icon ring with VS centerpiece. From xl it sits between the
            wordmark and the tagline, with the two fighters bracketing its VS
            badge. Below xl there are no fighters, so it drops under the
            store buttons: on a phone it is 294px of decoration that would
            otherwise push them below the fold. */}
        <div className="relative mb-10 max-xl:order-1">
          <div
            className="animate-fade-up flex justify-center"
            style={{ animationDelay: "1.0s" }}
          >
            <StatRing />
          </div>

          {/* ─── Flanking sprites ───
              Anchored to this row rather than to the section, so they stay
              level with the VS badge whatever the content above or below
              does. Hung off the section's centre, as they were before
              launch, they drifted against the badge whenever the hero's
              height changed. FIGHTER_X and FIGHTER_Y put them exactly where
              the section-based numbers did before launch. */}
          <div
            className="hidden xl:block absolute top-1/2 z-10 animate-fade-in pointer-events-none"
            style={{ left: FIGHTER_X, animationDelay: "0.6s", transform: FIGHTER_Y }}
          >
            <HeroSprite
              spriteSheet={PLAYER_SPRITE}
              size={360}
              glowColor="rgba(74,134,224,0.25)"
            />
          </div>
          <div
            className="hidden xl:block absolute top-1/2 z-10 animate-fade-in pointer-events-none"
            style={{ right: FIGHTER_X, animationDelay: "0.6s", transform: FIGHTER_Y }}
          >
            <HeroSprite
              spriteSheet={OPPONENT_SPRITE}
              flip
              size={360}
              glowColor="rgba(200,55,45,0.25)"
            />
          </div>
        </div>

        {/* Tagline */}
        <p
          className="animate-fade-up text-[clamp(0.95rem,2vw,1.15rem)] text-cream/70 mb-8 max-w-md mx-auto leading-relaxed"
          style={{ animationDelay: "1.2s" }}
        >
          From white belt to <span className="text-steam-gold font-semibold">world champion</span>.
        </p>

        {/* Where to get it. "Out now" is an eyebrow here, the size of every
            other section label. A framed banner over the wordmark was tried
            first and Nathan turned it down. The Android tile's "Get
            notified" is the hero's way to the mailing list, so there is no
            separate link. */}
        <div
          className="animate-fade-up flex flex-col items-center mb-10"
          style={{ animationDelay: "1.4s" }}
        >
          <p className="mb-5 flex items-center justify-center gap-3 font-pixel text-pixel-xs uppercase tracking-[0.2em] text-steam-gold">
            <span className="h-px w-6 bg-steam-gold/40" />
            <LiveDot size={6} />
            Out now
            <span className="h-px w-6 bg-steam-gold/40" />
          </p>
          <StoreButtons />
        </div>

        {/* Belt-rank gradient strip. w-full because a flex item with auto
            margins shrinks to its content, and the strip has none. */}
        <div
          className="animate-fade-in w-full max-w-md mx-auto max-xl:order-2"
          style={{ animationDelay: "1.6s" }}
        >
          <BeltStrip height={9} />
        </div>
      </div>
    </section>
  );
}

/** Stat icons arranged in a ring with a VS badge in the center */
function StatRing() {
  const RADIUS = 110; // px from center
  const ICON_TILE = 58;
  const CENTER_SIZE = 72;
  return (
    <div
      className="relative"
      style={{ width: RADIUS * 2 + ICON_TILE + 16, height: RADIUS * 2 + ICON_TILE + 16 }}
    >
      {STAT_RING.map((stat, i) => {
        const angle = (i / STAT_RING.length) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * RADIUS;
        const y = Math.sin(angle) * RADIUS;
        return (
          <div
            key={stat}
            className="icon-tile icon-tile-hero absolute top-1/2 left-1/2 rounded-full border-2 border-steam-gold"
            style={{
              width: ICON_TILE,
              height: ICON_TILE,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          >
            <StatIcon name={stat} size={40} />
          </div>
        );
      })}

      {/* Center VS badge */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-md border-2 border-mat-red bg-steam-navy-3 font-pixel text-steam-gold"
        style={{
          width: CENTER_SIZE,
          height: CENTER_SIZE,
          fontSize: "1.1rem",
          // Bespoke: the one red-cast element on the page. Inner highlight
          // alpha matches --shadow-tile so it stays in the same family.
          boxShadow: "0 0 20px rgba(200,55,45,0.45), inset 0 1px 0 rgba(232,194,92,0.15)",
        }}
      >
        VS
      </div>
    </div>
  );
}
