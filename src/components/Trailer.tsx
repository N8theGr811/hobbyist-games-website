export default function Trailer() {
  return (
    <section className="relative py-28 px-6 bg-cream text-center md:px-12 overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-ink/8" />

      <p className="font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-ink/25 mb-4">
        Gameplay
      </p>
      <h2 className="font-display text-3xl text-ink mb-4">
        See it in action
      </h2>
      <p className="text-sm text-ink/40 mb-12 max-w-md mx-auto leading-relaxed">
        Explore the world, train at gyms, and fight your way to the top.
      </p>

      {/* YouTube embed */}
      <div className="relative max-w-[800px] mx-auto">
        <div className="relative border-2 border-ink/10 shadow-[0_12px_40px_rgba(27,22,18,0.1)] aspect-video bg-ink overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/b0dxWsDm2xI?rel=0"
            title="Jiu-Jitsu RPG Gameplay"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Bottom caption */}
        <div className="mt-4 flex justify-between items-center px-1">
          <span className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-ink/20">
            Full walkthrough
          </span>
          <span className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-ink/20">
            Sound on for best experience
          </span>
        </div>
      </div>
    </section>
  );
}
