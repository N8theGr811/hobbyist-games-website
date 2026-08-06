import Watermark from "./Watermark";

const REEL = "/media/clips/announcement-reel.mp4";
const POSTER = "/media/clips/announcement-reel-poster.jpg";
const INSTAGRAM = "https://www.instagram.com/submission_saga/";

/**
 * The announcement reel, replacing the outdated YouTube walkthrough section.
 *
 * The source is a 9:16 Instagram cut, so it is framed phone-sized rather than
 * stretched into the 16:9 panel the rest of the page uses. At roughly 300px
 * wide the 360x640 encode still reads sharp, and the vertical shape signals
 * what it is.
 *
 * preload is "none" behind a poster: the clip is 7.9MB, which is fine to spend
 * on someone who chooses to watch and wasteful to spend on everyone else.
 * Controls are on because the reel is narrated, so muted autoplay would throw
 * away half of it.
 */
export default function Reel() {
  return (
    <section className="relative isolate section-rhythm px-6 overflow-hidden bg-pixel-grid md:px-12">
      <Watermark name="doubleleg" className="-left-24 top-20 h-[380px] w-[500px]" />

      <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-[300px_1fr] md:gap-14">
        <div className="mx-auto w-full max-w-[300px]">
          <div className="steam-panel relative aspect-[9/16] overflow-hidden">
            <video
              src={REEL}
              poster={POSTER}
              controls
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="text-center md:text-left">
          <div className="mb-6 flex items-center justify-center gap-3 font-pixel text-pixel-xs uppercase tracking-[0.2em] text-steam-gold md:justify-start">
            <span className="h-px w-6 bg-steam-gold/40" />
            The Reel
          </div>
          <h2 className="mb-4 font-pixel text-pixel-lg leading-tight tracking-wide text-cream">
            The Whole Pitch In Thirty Seconds
          </h2>
          <p className="mb-8 max-w-md text-base leading-relaxed text-cream/70 md:mb-6">
            What it is, why it exists, and when you can play it.
          </p>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-pixel text-pixel-xs uppercase tracking-[0.1em] text-cream/55 transition-colors hover:text-steam-gold"
          >
            Follow on Instagram
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
