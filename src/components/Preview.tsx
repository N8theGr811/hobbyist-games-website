"use client";

import Image from "next/image";
import { useState } from "react";

const screenshots = [
  {
    src: "/media/screenshots/combat.jpg",
    alt: "Combat system",
    title: "Turn-Based Combat",
    description: "Strategic BJJ positions & techniques",
  },
  {
    src: "/media/screenshots/character-customization.jpg",
    alt: "Character customization",
    title: "Create Your Fighter",
    description: "Customize your appearance & style",
  },
  {
    src: "/media/screenshots/choose-style.jpg",
    alt: "Choose your fighting style",
    title: "Choose Your Style",
    description: "6 archetypes with unique stat profiles",
  },
];

const clips = [
  {
    src: "/media/clips/submission-clip.mp4",
    title: "Submissions",
    description: "Timing-based finishing system",
  },
  {
    src: "/media/clips/mystery-move-unlock.mp4",
    title: "Unlock Moves",
    description: "Discover new techniques as you progress",
  },
];

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className="w-10 h-10 border border-cream/15 flex items-center justify-center text-cream/40 hover:text-cream hover:border-cream/30 hover:bg-cream/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
    >
      <span className="text-sm font-mono">
        {direction === "prev" ? "←" : "→"}
      </span>
    </button>
  );
}

export default function Preview() {
  const [shotIndex, setShotIndex] = useState(0);
  const [clipIndex, setClipIndex] = useState(0);

  const shot = screenshots[shotIndex];
  const clip = clips[clipIndex];

  return (
    <section id="preview" className="relative py-24 px-6 bg-ink overflow-hidden md:px-12">
      {/* Radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(30,53,83,0.3)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative max-w-[800px] mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p className="font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-cream/30 mb-3">
            Preview
          </p>
          <h2 className="font-display text-3xl text-cream">
            A glimpse of the world
          </h2>
        </div>

        {/* ─── Screenshots Carousel ─── */}
        <div className="mb-20">
          {/* Title bar */}
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="font-mono text-[0.55rem] font-bold tracking-[0.2em] uppercase text-cream/25 mb-1.5">
                Screenshots
              </p>
              <h3 className="font-display text-xl text-cream leading-tight">
                {shot.title}
              </h3>
              <p className="text-sm text-cream/35 mt-1">
                {shot.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.55rem] text-cream/20 mr-2">
                {shotIndex + 1}/{screenshots.length}
              </span>
              <ArrowButton
                direction="prev"
                onClick={() => setShotIndex((i) => i - 1)}
                disabled={shotIndex === 0}
              />
              <ArrowButton
                direction="next"
                onClick={() => setShotIndex((i) => i + 1)}
                disabled={shotIndex === screenshots.length - 1}
              />
            </div>
          </div>

          {/* Screenshot frame */}
          <div className="relative aspect-video border border-cream/10 overflow-hidden bg-gi-navy/20">
            <Image
              key={shot.src}
              src={shot.src}
              alt={shot.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority={shotIndex === 0}
            />
          </div>
        </div>

        {/* ─── Video Clips Carousel ─── */}
        <div>
          {/* Title bar */}
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="font-mono text-[0.55rem] font-bold tracking-[0.2em] uppercase text-cream/25 mb-1.5">
                Gameplay Clips
              </p>
              <h3 className="font-display text-xl text-cream leading-tight">
                {clip.title}
              </h3>
              <p className="text-sm text-cream/35 mt-1">
                {clip.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.55rem] text-cream/20 mr-2">
                {clipIndex + 1}/{clips.length}
              </span>
              <ArrowButton
                direction="prev"
                onClick={() => setClipIndex((i) => i - 1)}
                disabled={clipIndex === 0}
              />
              <ArrowButton
                direction="next"
                onClick={() => setClipIndex((i) => i + 1)}
                disabled={clipIndex === clips.length - 1}
              />
            </div>
          </div>

          {/* Video frame */}
          <div className="relative aspect-video border border-cream/10 overflow-hidden bg-gi-navy/20">
            <video
              key={clip.src}
              src={clip.src}
              muted
              autoPlay
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
