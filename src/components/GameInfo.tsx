import StatIcon, { type StatName } from "./StatIcon";
import BeltStrip from "./BeltStrip";

interface Pillar {
  title: string;
  description: string;
  stat: StatName;
}

const pillars: Pillar[] = [
  { title: "Fight", description: "70+ real techniques across 19 positions", stat: "submissions" },
  { title: "Explore", description: "Cities, gyms, rivals, and secrets", stat: "wrestling" },
  { title: "Build", description: "Your academy, your business empire, your legacy", stat: "strength" },
];

export default function GameInfo() {
  return (
    <section id="about" className="relative section-rhythm px-6 text-center bg-pixel-grid">
      {/* Top belt strip divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32">
        <BeltStrip height={8} />
      </div>

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

      <div className="flex flex-col items-center gap-10 sm:flex-row sm:justify-center sm:gap-12 max-w-[800px] mx-auto">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="flex-1 text-center">
            <div
              className="icon-tile mx-auto mb-4 border border-steam-gold/30"
              style={{ width: 72, height: 72 }}
            >
              <StatIcon name={pillar.stat} size={44} />
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
