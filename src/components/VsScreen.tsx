import Image from "next/image";

export default function VsScreen() {
  return (
    <section className="relative py-20 px-6 bg-cream text-center md:px-12 overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-ink/8" />

      <p className="font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-ink/25 mb-4">
        Matchup
      </p>
      <h2 className="font-display text-3xl text-ink mb-4">
        Know your opponent
      </h2>
      <p className="text-sm text-ink/40 mb-10 max-w-md mx-auto leading-relaxed">
        Every fight begins with the VS screen — stats, archetypes, belt ranks. Size up the gap, then step on the mat.
      </p>

      {/* Framed VS screenshot — espresso border to separate dark image from cream page */}
      <div className="max-w-[900px] mx-auto">
        <div
          className="relative rounded-lg overflow-hidden"
          style={{
            border: "3px solid #3B2A1F",
            boxShadow:
              "0 8px 32px rgba(27,22,18,0.18), 0 2px 8px rgba(27,22,18,0.12), inset 0 0 0 1px rgba(244,233,210,0.08)",
          }}
        >
          <Image
            src="/media/screenshots/CombatVsScreen.png"
            alt="Combat VS screen showing stat comparison between two fighters"
            width={1274}
            height={714}
            className="w-full h-auto block"
            priority={false}
          />
        </div>

        {/* Bottom caption */}
        <div className="mt-4 flex justify-between items-center px-1">
          <span className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-ink/20">
            Pre-match VS screen
          </span>
          <span className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-ink/20">
            8 stats · 6 archetypes · 5 belts
          </span>
        </div>
      </div>
    </section>
  );
}
