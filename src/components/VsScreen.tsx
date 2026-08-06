import Image from "next/image";
import Watermark from "./Watermark";

export default function VsScreen() {
  return (
    <section className="relative isolate section-rhythm px-6 text-center md:px-12 overflow-hidden bg-pixel-grid border-y border-steam-gold/20">
      <Watermark name="kimura" className="-left-24 top-24 h-[320px] w-[560px]" />

      <p className="font-pixel text-pixel-xs tracking-[0.2em] uppercase text-steam-gold mb-4">
        Matchup
      </p>
      <h2 className="font-pixel text-pixel-lg text-cream mb-4 leading-snug">
        Know Your Opponent
      </h2>
      <p className="text-sm text-cream/55 mb-10 max-w-md mx-auto leading-relaxed">
        Every fight begins with the VS screen — stats, archetypes, belt ranks. Size up the gap, then step on the mat.
      </p>

      {/* Gold-bordered Steam-style frame */}
      <div className="max-w-[900px] mx-auto">
        <div className="steam-panel relative overflow-hidden">
          <Image
            src="/media/screenshots/vs-screen-stats.jpg"
            alt="Pre-match VS screen comparing eight stats, belt ranks and archetypes for two fighters"
            width={1920}
            height={1080}
            className="w-full h-auto block"
            priority={false}
          />
        </div>

        {/* Bottom caption */}
        <div className="mt-4 flex justify-between items-center px-1">
          <span className="text-xs tracking-[0.1em] uppercase text-cream/55">
            Pre-Match VS Screen
          </span>
          <span className="text-xs tracking-[0.1em] uppercase text-cream/55">
            8 Stats · 6 Archetypes · 5 Belts
          </span>
        </div>
      </div>
    </section>
  );
}
