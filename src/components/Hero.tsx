export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-ink">
      {/* ─── Background layers ─── */}

      {/* Base gradient: ink → deep navy */}
      <div className="absolute inset-0 bg-[linear-gradient(170deg,#1B1612_0%,#111218_30%,#1E3553_100%)]" />

      {/* Warm glow top-right */}
      <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(200,55,45,0.08)_0%,transparent_65%)] pointer-events-none" />

      {/* Cool glow bottom-left */}
      <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(30,53,83,0.2)_0%,transparent_60%)] pointer-events-none" />

      {/* Gold accent glow center */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[radial-gradient(ellipse,rgba(232,179,57,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(244,233,210,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(244,233,210,0.3) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Bottom fade — blends into dark preview section below */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink to-transparent z-10" />

      {/* ─── Content ─── */}
      <div className="relative z-20 text-center px-6 pt-24 pb-32">
        {/* Coming Soon badge */}
        <div
          className="animate-fade-in flex items-center justify-center gap-4 mb-10"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="animate-line-expand w-10 h-px bg-mat-red/50" style={{ animationDelay: "0.8s" }} />
          <span className="font-mono text-[0.6rem] font-bold tracking-[0.3em] uppercase text-mat-red">
            Coming Soon
          </span>
          <span className="animate-line-expand w-10 h-px bg-mat-red/50" style={{ animationDelay: "0.8s" }} />
        </div>

        {/* Studio credit */}
        <p
          className="animate-fade-up font-mono text-[0.55rem] tracking-[0.2em] uppercase text-cream/25 mb-8"
          style={{ animationDelay: "0.4s" }}
        >
          A Hobbyist Games Production
        </p>

        {/* ─── Game Title ─── */}
        <div className="mb-10">
          <h1
            className="animate-title-reveal font-display leading-[0.85] relative"
            style={{ animationDelay: "0.5s" }}
          >
            <span className="block text-[clamp(3.5rem,12vw,7rem)] text-cream tracking-tight">
              Jiu-Jitsu
            </span>
            <span className="block text-[clamp(3rem,10vw,6.5rem)] text-mat-red tracking-tight mt-[-0.05em]">
              RPG
            </span>
          </h1>

          {/* Decorative line under title */}
          <div
            className="animate-line-expand mx-auto mt-6 w-24 h-px bg-gradient-to-r from-transparent via-belt-gold/60 to-transparent"
            style={{ animationDelay: "1.2s" }}
          />
        </div>

        {/* Tagline */}
        <p
          className="animate-fade-up font-display text-[clamp(1.1rem,2.5vw,1.5rem)] text-cream/70 mb-3"
          style={{ animationDelay: "0.9s" }}
        >
          Train. Fight. Build Your <em className="text-belt-gold">Legacy.</em>
        </p>

        <p
          className="animate-fade-up text-[0.9rem] text-cream/30 max-w-sm mx-auto mb-14 leading-relaxed"
          style={{ animationDelay: "1.1s" }}
        >
          A pixel-art RPG where Brazilian Jiu-Jitsu meets
          the adventure games you grew up with.
        </p>

        {/* CTA */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: "1.3s" }}
        >
          <a
            href="#signup"
            className="group relative inline-flex items-center gap-3 font-mono text-[0.7rem] font-bold tracking-[0.15em] uppercase px-10 py-4 bg-mat-red text-cream hover:bg-cream hover:text-ink transition-all duration-300 hover:shadow-[0_0_40px_rgba(200,55,45,0.3)]"
          >
            Join the Beta
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </a>
        </div>

        {/* Belt rank decorative element */}
        <div
          className="animate-fade-in flex items-center justify-center gap-2 mt-16"
          style={{ animationDelay: "1.6s" }}
        >
          {["white", "blue", "purple", "brown", "black"].map((belt, i) => (
            <div
              key={belt}
              className="animate-gentle-pulse h-1 w-6 rounded-full"
              style={{
                animationDelay: `${1.8 + i * 0.15}s`,
                backgroundColor:
                  belt === "white" ? "rgba(244,233,210,0.6)" :
                  belt === "blue" ? "rgba(59,130,246,0.6)" :
                  belt === "purple" ? "rgba(147,51,234,0.6)" :
                  belt === "brown" ? "rgba(161,98,7,0.6)" :
                  "rgba(244,233,210,0.3)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="animate-fade-in absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        style={{ animationDelay: "2s" }}
      >
        <span className="font-mono text-[0.5rem] tracking-[0.25em] uppercase text-cream/20">
          Explore
        </span>
        <div className="w-px h-8 bg-cream/20 animate-scroll-line" />
      </div>
    </section>
  );
}
