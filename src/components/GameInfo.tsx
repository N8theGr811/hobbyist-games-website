const pillars = [
  { title: "Fight", description: "70+ real techniques across 19 positions" },
  { title: "Explore", description: "Cities, gyms, rivals, and secrets" },
  { title: "Build", description: "Your academy, your business empire, your legacy" },
];

export default function GameInfo() {
  return (
    <section id="about" className="relative py-20 px-6 text-center">
      {/* Vertical connector line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-ink/10" />

      <div className="flex items-center justify-center gap-3 mb-8 font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-mat-red">
        <span className="w-6 h-px bg-mat-red/30" />
        The Game
        <span className="w-6 h-px bg-mat-red/30" />
      </div>

      <h2 className="font-display text-[clamp(1.6rem,4vw,2.2rem)] text-ink leading-tight max-w-xl mx-auto mb-5">
        White belt to world champion.
        <br />
        Every roll <em className="text-mat-red">matters.</em>
      </h2>

      <p className="text-base text-ink/50 max-w-md mx-auto mb-8 leading-relaxed">
        A pixel-art RPG where real Brazilian Jiu-Jitsu strategy meets the
        adventure games you grew up with.
      </p>

      <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-10 max-w-[700px] mx-auto">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="flex-1 text-center">
            <div className="w-7 h-0.5 bg-belt-gold mx-auto mb-4" />
            <h4 className="font-mono text-[0.6rem] font-bold tracking-[0.15em] uppercase text-ink mb-1.5">
              {pillar.title}
            </h4>
            <p className="text-sm text-ink/35 leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
