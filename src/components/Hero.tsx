import Image from "next/image";
import HeroSprite from "./HeroSprite";
import BeltStrip from "./BeltStrip";
import StatIcon, { type StatName } from "./StatIcon";

const PLAYER_SPRITE = "/sprites/purple1.png";
const OPPONENT_SPRITE = "/sprites/purple2.png";

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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-pixel-grid">
      {/* ─── Atmospheric glows ─── */}
      <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(212,165,60,0.10)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(74,134,224,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(212,165,60,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* ─── Flanking sprites — vertically aligned with the VS badge ─── */}
      <div
        className="hidden xl:block absolute top-1/2 z-10 animate-fade-in pointer-events-none"
        style={{ left: "10%", animationDelay: "0.6s", transform: "translateY(-30%)" }}
      >
        <HeroSprite
          spriteSheet={PLAYER_SPRITE}
          size={360}
          glowColor="rgba(74,134,224,0.25)"
        />
      </div>
      <div
        className="hidden xl:block absolute top-1/2 z-10 animate-fade-in pointer-events-none"
        style={{ right: "10%", animationDelay: "0.6s", transform: "translateY(-30%)" }}
      >
        <HeroSprite
          spriteSheet={OPPONENT_SPRITE}
          flip
          size={360}
          glowColor="rgba(200,55,45,0.25)"
        />
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-20 text-center px-6 pt-24 pb-16">
        {/* Release date badge. The flanking rules are desktop-only: at the
            larger date size they would push the row past a 375px viewport,
            and the date carries the line on its own without them. */}
        <div
          className="animate-fade-in flex items-center justify-center gap-4 mb-8"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="animate-line-expand hidden h-px w-14 bg-steam-gold/50 sm:block" style={{ animationDelay: "0.8s" }} />
          <span className="font-pixel text-pixel-md tracking-[0.2em] uppercase text-steam-gold whitespace-nowrap">
            September 17, 2026
          </span>
          <span className="animate-line-expand hidden h-px w-14 bg-steam-gold/50 sm:block" style={{ animationDelay: "0.8s" }} />
        </div>

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
            className="w-auto h-auto max-w-[520px] max-h-[200px] mx-auto"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* Stat-icon ring with VS centerpiece */}
        <div
          className="animate-fade-up flex justify-center mb-10"
          style={{ animationDelay: "1.0s" }}
        >
          <StatRing />
        </div>

        {/* Tagline */}
        <p
          className="animate-fade-up text-[clamp(0.95rem,2vw,1.15rem)] text-cream/70 mb-8 max-w-md mx-auto leading-relaxed"
          style={{ animationDelay: "1.2s" }}
        >
          From white belt to <span className="text-steam-gold font-semibold">world champion</span>.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up flex flex-col items-center gap-3 mb-10 sm:flex-row sm:justify-center sm:gap-4"
          style={{ animationDelay: "1.4s" }}
        >
          {/* Primary: Wishlist on Steam */}
          <a
            href="https://store.steampowered.com/app/4690760"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 font-pixel text-pixel-sm tracking-[0.1em] uppercase px-8 py-4 rounded-md border-2 border-steam-gold bg-steam-gold text-steam-navy hover:bg-steam-gold-2 hover:border-steam-gold-2 transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.4),0_8px_24px_rgba(212,165,60,0.35)] hover:shadow-[0_2px_0_rgba(0,0,0,0.4),0_4px_16px_rgba(212,165,60,0.55)] hover:-translate-y-px active:translate-y-px active:shadow-[0_0_0_rgba(0,0,0,0.4)]"
          >
            Wishlist on Steam
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>

          {/* Secondary: Mailing list */}
          <a
            href="#signup"
            className="group relative inline-flex items-center gap-3 font-pixel text-pixel-sm tracking-[0.1em] uppercase px-6 py-3.5 rounded-md border border-steam-gold/40 bg-steam-navy-3/60 text-cream/75 hover:border-steam-gold hover:text-steam-gold transition-colors duration-200"
          >
            Mailing List
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* Belt-rank gradient strip */}
        <div
          className="animate-fade-in max-w-md mx-auto"
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
