import Image from "next/image";
import Watermark from "./Watermark";

interface Pillar {
  title: string;
  description: string;
  /** A cream icon in /public/hero, shared with the hero's stat row. */
  icon: string;
}

const pillars: Pillar[] = [
  { title: "Fight", description: "90+ real techniques across 19 positions", icon: "submissions" },
  { title: "Explore", description: "Cities, gyms, rivals, and secrets", icon: "wrestling" },
  { title: "Build", description: "Your academy, your business empire, your legacy", icon: "strength" },
];

export default function GameInfo() {
  return (
    <section id="about" className="relative isolate section-rhythm px-6 text-center bg-pixel-grid overflow-hidden">
      <Watermark name="openguard" className="-left-28 top-24 h-[400px] w-[520px] scale-x-[-1]" />
      <Watermark name="singlelegx" className="-right-24 bottom-16 h-[340px] w-[460px]" />

      <div className="flex items-center justify-center gap-3 mb-8 font-pixel text-pixel-xs tracking-[0.2em] uppercase text-steam-gold">
        <span className="w-6 h-px bg-steam-gold/40" />
        The Game
        <span className="w-6 h-px bg-steam-gold/40" />
      </div>

      <h2 className="font-pixel text-pixel-lg text-cream leading-snug max-w-2xl mx-auto mb-6">
        White Belt To World Champion.
        <br />
        Every Roll Matters.
      </h2>

      <p className="text-base text-cream/55 max-w-md mx-auto mb-12 leading-relaxed">
        A pixel-art RPG where real Brazilian Jiu-Jitsu strategy meets the
        adventure games you grew up with.
      </p>

      <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-center sm:gap-12 max-w-[800px] mx-auto">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="flex-1 text-center">
            {/* Same treatment as the hero's stat row: a thin gold ring,
                no fill, the art at 80% of it. */}
            <div className="mx-auto mb-4 grid h-[72px] w-[72px] place-items-center rounded-full border border-[#e8be3f]">
              <Image
                src={`/hero/stat-${pillar.icon}.png`}
                alt=""
                width={116}
                height={116}
                className="block h-[80%] w-[80%]"
              />
            </div>
            <h4 className="font-pixel text-pixel-sm tracking-[0.15em] uppercase text-steam-gold mb-2">
              {pillar.title}
            </h4>
            <p className="text-sm text-cream/55 leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
