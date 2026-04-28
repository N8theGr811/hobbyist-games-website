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
      <div className="relative z-20 text-center px-6 pt-24 pb-24">
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
            <span className="block text-[clamp(2.8rem,10vw,6rem)] text-ink tracking-tight">
              Submission
            </span>
            <span className="block text-[clamp(2.8rem,10vw,6rem)] text-mat-red tracking-tight mt-[-0.05em]">
              Saga
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-up mt-6 font-mono text-[clamp(0.95rem,2vw,1.3rem)] font-bold tracking-[0.2em] uppercase text-ink/70"
            style={{ animationDelay: "1.0s" }}
          >
            The Jiu Jitsu RPG
          </p>

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
          From white belt to <em className="text-mat-red">world champion.</em>
        </p>

        <p
          className="animate-fade-up text-[0.9rem] text-ink/40 max-w-sm mx-auto mb-10 leading-relaxed"
          style={{ animationDelay: "1.1s" }}
        >
          A pixel-art RPG where Brazilian Jiu-Jitsu meets
          the adventure games you grew up with.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up flex flex-col items-center gap-3"
          style={{ animationDelay: "1.3s" }}
        >
          {/* Primary: Download Beta heading */}
          <p className="font-mono text-[0.55rem] tracking-[0.25em] uppercase text-ink/40">
            Download the Beta
          </p>

          {/* Download buttons: Windows + Mac */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/N8theGr811/hobbyist-games-website/releases/download/v2.1-beta/JJRPGv2.1.zip"
              className="group relative inline-flex items-center gap-2.5 font-mono text-[0.7rem] font-bold tracking-[0.15em] uppercase px-7 py-3.5 rounded-full border-2 border-espresso bg-espresso text-cream hover:bg-mat-red hover:border-mat-red transition-all duration-300 shadow-[0_4px_20px_rgba(59,42,31,0.2)] hover:shadow-[0_4px_24px_rgba(200,55,45,0.25)]"
            >
              <span>Windows</span>
              <span className="text-[0.5rem] tracking-[0.08em] normal-case font-semibold text-belt-gold border border-belt-gold/30 bg-belt-gold/10 px-2 py-0.5 rounded-full">
                v2.1
              </span>
            </a>

            <a
              href="https://github.com/N8theGr811/hobbyist-games-website/releases/download/v2.1-beta/JJRPGv2.1.mac.zip"
              className="group relative inline-flex items-center gap-2.5 font-mono text-[0.7rem] font-bold tracking-[0.15em] uppercase px-7 py-3.5 rounded-full border-2 border-espresso bg-espresso text-cream hover:bg-mat-red hover:border-mat-red transition-all duration-300 shadow-[0_4px_20px_rgba(59,42,31,0.2)] hover:shadow-[0_4px_24px_rgba(200,55,45,0.25)]"
            >
              <span>macOS</span>
              <span className="text-[0.5rem] tracking-[0.08em] normal-case font-semibold text-belt-gold border border-belt-gold/30 bg-belt-gold/10 px-2 py-0.5 rounded-full">
                v2.1
              </span>
            </a>
          </div>

          {/* Secondary: Mailing list link */}
          <a
            href="#signup"
            className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-ink/35 hover:text-mat-red transition-colors"
          >
            Join the mailing list for updates →
          </a>
        </div>

        {/* Belt rank decorative element */}
        <div
          className="animate-fade-in flex items-center justify-center gap-2 mt-10"
          style={{ animationDelay: "1.6s" }}
        >
          {["white", "blue", "purple", "brown", "black"].map((belt, i) => (
            <div
              key={belt}
              className="animate-gentle-pulse h-1.5 w-7 rounded-full border border-ink/40"
              style={{
                animationDelay: `${1.8 + i * 0.15}s`,
                backgroundColor:
                  belt === "white" ? "rgba(244,233,210,0.9)" :
                  belt === "blue" ? "rgba(59,130,246,0.9)" :
                  belt === "purple" ? "rgba(147,51,234,0.9)" :
                  belt === "brown" ? "rgba(161,98,7,0.9)" :
                  "rgba(27,22,18,0.85)",
              }}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
