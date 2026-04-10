export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-cream">
      {/* ─── Background layers ─── */}

      {/* Warm glow top-right */}
      <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(200,55,45,0.05)_0%,transparent_65%)] pointer-events-none" />

      {/* Cool glow bottom-left */}
      <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(30,53,83,0.04)_0%,transparent_60%)] pointer-events-none" />

      {/* Gold accent glow center */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[radial-gradient(ellipse,rgba(232,179,57,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(27,22,18,0.2) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(27,22,18,0.2) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ─── Content ─── */}
      <div className="relative z-20 text-center px-6 pt-24 pb-32">
        {/* Coming Soon badge */}
        <div
          className="animate-fade-in flex items-center justify-center gap-4 mb-10"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="animate-line-expand w-14 h-px bg-mat-red/40" style={{ animationDelay: "0.8s" }} />
          <span className="font-mono text-[0.85rem] font-bold tracking-[0.3em] uppercase text-mat-red">
            Coming Soon
          </span>
          <span className="animate-line-expand w-14 h-px bg-mat-red/40" style={{ animationDelay: "0.8s" }} />
        </div>

        {/* Studio credit */}
        <p
          className="animate-fade-up font-mono text-[0.75rem] tracking-[0.2em] uppercase text-ink/25 mb-8"
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
            <span className="block text-[clamp(3.5rem,12vw,7rem)] text-ink tracking-tight">
              Jiu-Jitsu
            </span>
            <span className="block text-[clamp(3rem,10vw,6.5rem)] text-mat-red tracking-tight mt-[-0.05em]">
              RPG
            </span>
          </h1>

          {/* Decorative line under title */}
          <div
            className="animate-line-expand mx-auto mt-6 w-24 h-px bg-gradient-to-r from-transparent via-ink/20 to-transparent"
            style={{ animationDelay: "1.2s" }}
          />
        </div>

        {/* Tagline */}
        <p
          className="animate-fade-up font-display text-[clamp(1.1rem,2.5vw,1.5rem)] text-ink/70 mb-3"
          style={{ animationDelay: "0.9s" }}
        >
          Train. Fight. Build Your <em className="text-mat-red">Legacy.</em>
        </p>

        <p
          className="animate-fade-up text-[0.9rem] text-ink/40 max-w-sm mx-auto mb-14 leading-relaxed"
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
            className="group relative inline-flex items-center gap-3 font-mono text-[0.7rem] font-bold tracking-[0.15em] uppercase px-10 py-4 bg-espresso text-cream hover:bg-mat-red transition-all duration-300 hover:shadow-[0_8px_30px_rgba(200,55,45,0.2)]"
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
                  belt === "white" ? "rgba(27,22,18,0.15)" :
                  belt === "blue" ? "rgba(59,130,246,0.5)" :
                  belt === "purple" ? "rgba(147,51,234,0.5)" :
                  belt === "brown" ? "rgba(161,98,7,0.5)" :
                  "rgba(27,22,18,0.6)",
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
        <span className="font-mono text-[0.5rem] tracking-[0.25em] uppercase text-ink/20">
          Explore
        </span>
        <div className="w-px h-8 bg-ink/15 animate-scroll-line" />
      </div>
    </section>
  );
}
