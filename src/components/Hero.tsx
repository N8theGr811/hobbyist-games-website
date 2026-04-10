export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Radial gradient accents */}
      <div className="absolute -top-[30%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(200,55,45,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(30,53,83,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Coming Soon badge */}
      <div className="flex items-center gap-3 mb-6 font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-mat-red">
        <span className="w-8 h-px bg-mat-red/40" />
        Coming Soon
        <span className="w-8 h-px bg-mat-red/40" />
      </div>

      {/* Studio credit */}
      <p className="font-mono text-[0.55rem] tracking-[0.15em] uppercase text-ink/30 mb-6">
        A Hobbyist Games Production
      </p>

      {/* Game title */}
      <h1 className="font-display mb-2 relative">
        <span className="block text-[clamp(2.5rem,8vw,4.5rem)] text-mat-red leading-none">
          Jiu-Jitsu
        </span>
        <span className="block text-[clamp(2rem,6vw,4rem)] text-ink leading-none">
          RPG
        </span>
        <span className="block font-mono text-xs font-bold tracking-[0.4em] uppercase text-ink/35 mt-1">
          Role Playing Game
        </span>
      </h1>

      {/* Tagline */}
      <p className="font-display text-[clamp(1.2rem,3vw,1.6rem)] text-ink mt-8 mb-2">
        Train. Fight. Build Your <em className="text-mat-red">Legacy.</em>
      </p>
      <p className="text-base text-ink/50 max-w-md mb-10 leading-relaxed">
        A pixel-art RPG where Brazilian Jiu-Jitsu meets adventure. Rise from
        white belt to world champion.
      </p>

      {/* CTA */}
      <a
        href="#signup"
        className="group inline-flex items-center gap-2.5 font-mono text-[0.7rem] font-bold tracking-[0.12em] uppercase px-10 py-4 bg-ink text-cream hover:bg-mat-red hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(200,55,45,0.2)] transition-all duration-300"
      >
        Join the Beta
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </a>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[0.6rem] tracking-[0.15em] uppercase font-medium">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-ink to-transparent animate-pulse" />
      </div>
    </section>
  );
}
