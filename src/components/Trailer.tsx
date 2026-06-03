export default function Trailer() {
  return (
    <section className="relative py-20 px-6 text-center md:px-12 overflow-hidden bg-pixel-grid">
      <p className="font-pixel text-[0.6rem] tracking-[0.2em] uppercase text-steam-gold mb-4">
        Gameplay
      </p>
      <h2 className="font-pixel text-[clamp(1.1rem,2.6vw,1.7rem)] text-cream mb-4 leading-snug">
        See It In Action
      </h2>
      <p className="text-sm text-cream/55 mb-8 max-w-md mx-auto leading-relaxed">
        Explore the world, train at gyms, and fight your way to the top.
      </p>

      {/* Gold-bordered Steam-style frame */}
      <div className="relative max-w-[800px] mx-auto">
        <div className="steam-panel relative aspect-video overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/Y5ZYra3CYhw?rel=0"
            title="Submission Saga Gameplay"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Bottom caption */}
        <div className="mt-4 flex justify-between items-center px-1">
          <span className="font-pixel text-[0.5rem] tracking-[0.1em] uppercase text-cream/30">
            Full Walkthrough
          </span>
          <span className="font-pixel text-[0.5rem] tracking-[0.1em] uppercase text-cream/30">
            Sound On For Best Experience
          </span>
        </div>
      </div>
    </section>
  );
}
