import Image from "next/image";

const media = [
  {
    type: "image" as const,
    src: "/media/screenshots/combat.jpg",
    alt: "Combat system",
    title: "Turn-Based Combat",
    description: "Strategic BJJ positions & techniques",
  },
  {
    type: "image" as const,
    src: "/media/screenshots/character-customization.jpg",
    alt: "Character customization",
    title: "Create Your Fighter",
    description: "Customize your appearance & style",
  },
  {
    type: "image" as const,
    src: "/media/screenshots/choose-style.jpg",
    alt: "Choose your fighting style",
    title: "Choose Your Style",
    description: "6 archetypes with unique stat profiles",
  },
  {
    type: "video" as const,
    src: "/media/clips/submission-clip.mp4",
    alt: "",
    title: "Submissions",
    description: "Timing-based finishing system",
  },
  {
    type: "video" as const,
    src: "/media/clips/mystery-move-unlock.mp4",
    alt: "",
    title: "Unlock Moves",
    description: "Discover new techniques as you progress",
    wide: true,
  },
];

export default function Preview() {
  return (
    <section id="preview" className="relative py-24 px-6 bg-ink overflow-hidden md:px-12">
      {/* Radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(30,53,83,0.3)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative max-w-[960px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-cream/30 mb-3">
              Preview
            </p>
            <h2 className="font-display text-3xl text-cream">
              A glimpse of the world
            </h2>
          </div>
          <p className="hidden font-mono text-[0.65rem] text-cream/25 tracking-wide sm:block">
            More coming soon
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:grid-rows-2 md:gap-5">
          {media.map((item) => (
            <div
              key={item.title}
              className={`group ${
                "wide" in item && item.wide ? "sm:col-span-2" : ""
              }`}
            >
              {/* Media frame */}
              <div className="relative aspect-video bg-gi-navy/30 border border-cream/8 overflow-hidden transition-all duration-300 group-hover:border-cream/20 group-hover:-translate-y-1 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                {item.type === "image" ? (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, 300px"
                  />
                ) : (
                  <video
                    src={item.src}
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Top-left type badge */}
                <div className="absolute top-2.5 left-2.5 font-mono text-[0.45rem] font-bold tracking-[0.15em] uppercase text-cream/40 bg-ink/50 backdrop-blur-sm px-2 py-0.5 border border-cream/10">
                  {item.type === "video" ? "▶ clip" : "screenshot"}
                </div>
              </div>

              {/* Caption below frame */}
              <div className="mt-3 pl-0.5">
                <h3 className="font-mono text-[0.7rem] font-bold tracking-[0.08em] uppercase text-cream/80 mb-0.5">
                  {item.title}
                </h3>
                <p className="text-[0.75rem] text-cream/30 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
