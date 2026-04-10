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
    <section className="py-24 px-6 bg-paper text-center md:px-12">
      <p className="font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-ink/25 mb-4">
        Gameplay
      </p>
      <h2 className="font-display text-3xl text-ink mb-10">
        See it in action
      </h2>

      <div className="relative max-w-[800px] mx-auto border-2 border-ink shadow-[0_12px_40px_rgba(27,22,18,0.12)] aspect-video bg-ink overflow-hidden">
        <video
          ref={videoRef}
          src="/media/trailers/walkthrough.mp4"
          preload="metadata"
          className="w-full h-full object-cover"
        />
        {!isPlaying && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-ink/40 hover:bg-ink/25 transition-colors cursor-pointer"
            aria-label="Play video"
          >
            <div className="w-16 h-16 border-2 border-cream rounded-full flex items-center justify-center hover:scale-110 hover:border-belt-gold transition-all">
              <div className="w-0 h-0 border-l-[20px] border-l-cream border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
