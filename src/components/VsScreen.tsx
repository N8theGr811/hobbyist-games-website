import Image from "next/image";

export default function VsScreen() {
  return (
    <section className="relative py-20 px-6 text-center md:px-12 overflow-hidden bg-pixel-grid border-y border-steam-gold/20">
      <p className="font-pixel text-[0.6rem] tracking-[0.2em] uppercase text-steam-gold mb-4">
        Matchup
      </p>
      <h2 className="font-pixel text-[clamp(1.1rem,2.6vw,1.7rem)] text-cream mb-4 leading-snug">
        Know Your Opponent
      </h2>
      <p className="text-sm text-cream/55 mb-10 max-w-md mx-auto leading-relaxed">
        Every fight begins with the VS screen — stats, archetypes, belt ranks. Size up the gap, then step on the mat.
      </p>

      {/* Gold-bordered Steam-style frame */}
      <div className="max-w-[900px] mx-auto">
        <div className="steam-panel relative overflow-hidden">
          <Image
            src="/media/screenshots/CombatVsScreenStats.png"
            alt="Combat VS screen showing stat comparison between two fighters"
            width={1920}
            height={1080}
            className="w-full h-auto block"
            priority={false}
          />
        </div>

        {/* Bottom caption */}
        <div className="mt-4 flex justify-between items-center px-1">
          <span className="font-pixel text-[0.5rem] tracking-[0.1em] uppercase text-cream/30">
            Pre-Match VS Screen
          </span>
          <span className="font-pixel text-[0.5rem] tracking-[0.1em] uppercase text-cream/30">
            8 Stats · 6 Archetypes · 5 Belts
          </span>
        </div>
      </div>
    </section>
  );
}
