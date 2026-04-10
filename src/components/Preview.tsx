import Image from "next/image";

const screenshots = [
  { src: "/media/screenshots/combat.jpg", alt: "Combat system", label: "Combat" },
  { src: "/media/screenshots/character-customization.jpg", alt: "Character customization", label: "Customize" },
  { src: "/media/screenshots/choose-style.jpg", alt: "Choose your fighting style", label: "Fighting Styles" },
];

const clips = [
  { src: "/media/clips/submission-clip.mp4", label: "Submissions" },
  { src: "/media/clips/mystery-move-unlock.mp4", label: "Move Unlocks" },
];

export default function Preview() {
  return (
    <section id="preview" className="relative py-24 px-6 bg-ink overflow-hidden md:px-12">
      {/* Radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(30,53,83,0.3)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative max-w-[900px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-cream/30 mb-3">
              Preview
            </p>
            <h2 className="font-display text-3xl text-cream">
              A glimpse of the world
            </h2>
          </div>
          <p className="font-mono text-[0.65rem] text-cream/25 tracking-wide">
            More coming soon
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:grid-rows-2">
          {/* Row 1: 3 screenshots */}
          {screenshots.map((shot) => (
            <div
              key={shot.label}
              className="group relative aspect-video bg-cream/5 border border-cream/5 overflow-hidden cursor-pointer hover:border-cream/10 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-400"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <span className="absolute bottom-2 left-2 font-mono text-[0.5rem] tracking-[0.1em] uppercase text-cream bg-ink/70 backdrop-blur-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {shot.label}
              </span>
            </div>
          ))}

          {/* Row 2: 1 clip (1 col) + 1 clip (2 col) */}
          {clips.map((clip, i) => (
            <div
              key={clip.label}
              className={`group relative aspect-video bg-cream/5 border border-cream/5 overflow-hidden cursor-pointer hover:border-cream/10 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-400 ${
                i === 1 ? "sm:col-span-2" : ""
              }`}
            >
              <video
                src={clip.src}
                muted
                autoPlay
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 font-mono text-[0.5rem] tracking-[0.1em] uppercase text-cream bg-ink/70 backdrop-blur-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {clip.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
