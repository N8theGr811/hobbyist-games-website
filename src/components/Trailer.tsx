"use client";

import { useRef, useState } from "react";

export default function Trailer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function handlePlay() {
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.controls = true;
      setIsPlaying(true);
    }
  }

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

      {/* Video frame */}
      <div className="relative max-w-[800px] mx-auto">
        <div className="relative border-2 border-ink/10 shadow-[0_12px_40px_rgba(27,22,18,0.1)] aspect-video bg-ink overflow-hidden">
          <video
            ref={videoRef}
            src="/media/trailers/walkthrough.mp4"
            preload="metadata"
            playsInline
            className="w-full h-full object-cover"
          />
          {!isPlaying && (
            <button
              onClick={handlePlay}
              className="group absolute inset-0 flex items-center justify-center bg-ink/40 hover:bg-ink/25 transition-colors cursor-pointer"
              aria-label="Play video"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-2 border-cream rounded-full flex items-center justify-center group-hover:scale-110 group-hover:border-belt-gold transition-all">
                  <div className="w-0 h-0 border-l-[20px] border-l-cream group-hover:border-l-belt-gold border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1 transition-colors" />
                </div>
                <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-cream/50 group-hover:text-cream/80 transition-colors">
                  Watch Gameplay
                </span>
              </div>
            </button>
          )}
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
