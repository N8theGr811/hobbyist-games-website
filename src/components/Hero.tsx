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
        {/* Coming Soon badge */}
        <div
          className="animate-fade-in flex items-center justify-center gap-4 mb-8"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="animate-line-expand w-14 h-px bg-steam-gold/50" style={{ animationDelay: "0.8s" }} />
          <span className="font-pixel text-[0.65rem] tracking-[0.2em] uppercase text-steam-gold">
            Coming Soon
          </span>
          <span className="animate-line-expand w-14 h-px bg-steam-gold/50" style={{ animationDelay: "0.8s" }} />
        </div>

        {/* Studio credit */}
        <p
          className="animate-fade-up font-pixel text-[0.55rem] tracking-[0.2em] uppercase text-cream/30 mb-10"
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

        {/* CTA */}
        <div
          className="animate-fade-up flex justify-center mb-10"
          style={{ animationDelay: "1.4s" }}
        >
          <a
            href="#signup"
            className="group relative inline-flex items-center gap-3 font-pixel text-[0.65rem] tracking-[0.1em] uppercase px-8 py-4 rounded-md border-2 border-steam-gold bg-steam-navy-3 text-steam-gold hover:bg-steam-gold hover:text-steam-navy transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.4),0_8px_24px_rgba(212,165,60,0.2)] hover:shadow-[0_2px_0_rgba(0,0,0,0.4),0_4px_16px_rgba(212,165,60,0.4)] hover:-translate-y-px active:translate-y-px active:shadow-[0_0_0_rgba(0,0,0,0.4)]"
          >
            Join the Mailing List
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
            className="absolute top-1/2 left-1/2 flex items-center justify-center rounded-full border-2 border-steam-gold bg-steam-navy-2"
            style={{
              width: ICON_TILE,
              height: ICON_TILE,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              boxShadow:
                "inset 0 1px 0 rgba(232,194,92,0.3), 0 0 0 1px rgba(0,0,0,0.4), 0 4px 12px rgba(212,165,60,0.25)",
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
          boxShadow: "0 0 20px rgba(200,55,45,0.45), inset 0 1px 0 rgba(232,194,92,0.25)",
        }}
      >
        VS
      </div>
    </div>
  );
}
