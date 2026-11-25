import { getI18n, type Locale } from "@/lib/i18n";
import Watermark from "./Watermark";

const REEL = "/media/clips/android-launch.mp4";
const POSTER = "/media/clips/android-launch-poster.jpg";
const INSTAGRAM = "https://www.instagram.com/submission_saga/";

/**
 * Why the game exists, in Nate's words, beside his launch reel.
 *
 * The note is the first paragraph of the in-game DEVELOPER'S NOTE
 * (developers_note_overlay.gd), word for word, and its Portuguese is the
 * game's own translation. The second paragraph there thanks a player for
 * finishing and asks for a review, which is for someone who has played, not
 * someone deciding to. Nate's copy: fix typos only, and keep the two in step.
 *
 * This replaced the Reel section, whose heading promised "why I made it" and
 * left the answer inside a narrated video. It also retires the FAQ's "Who made
 * it?", since the signature now says it once.
 *
 * The reel is a 9:16 Instagram cut, framed phone-sized rather than stretched
 * into the page's 16:9 panel. preload is "none" behind a poster: the clip is
 * 6.7MB, fine to spend on someone who chooses to watch and wasteful on
 * everyone else. Controls are on because it is narrated.
 */
export default function DevelopersNote({ locale = "en" }: { locale?: Locale }) {
  const { t } = getI18n(locale);
  return (
    <section className="relative isolate section-rhythm px-6 overflow-hidden bg-pixel-grid md:px-12">
      <Watermark name="doubleleg" className="-left-24 top-20 h-[380px] w-[500px]" />
      <Watermark name="underhookthrow" className="-right-20 bottom-12 h-[420px] w-[336px]" />

      <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-[300px_1fr] md:gap-14">
        <div className="mx-auto w-full max-w-[300px]">
          <div className="steam-panel border-cream relative aspect-[9/16] overflow-hidden">
            <video
              src={REEL}
              poster={POSTER}
              aria-label={t("Nate's launch reel: what the game is, why he made it, and where to play it")}
              controls
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <div className="mb-6 flex items-center justify-center gap-3 font-pixel text-pixel-xs uppercase tracking-[0.2em] text-steam-gold md:justify-start">
            <span className="h-px w-6 bg-steam-gold/40" />
            {t("Developer's Note")}
          </div>
          <p className="mb-6 text-lg leading-relaxed text-cream/85">
            {/* Never "jiu / jitsu" across a line: the Portuguese split there at 375px. */}
            {t("Jiu jitsu is essentially a game. With Submission Saga, I wanted to create a simplified version of that game, celebrating all the weird and funny things we all love about the journey of jiu jitsu. I think these elements, and the ability to create your own style, make doing jiu jitsu a really unique and amazing experience.").replace(/(jiu) (jitsu)/gi, "$1\u00a0$2")}
          </p>
          <p className="mb-8 font-pixel text-pixel-xs uppercase leading-relaxed tracking-[0.1em] text-steam-gold">
            {t("Solo developed by Nate Markham")}
          </p>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-pixel text-pixel-xs uppercase tracking-[0.1em] text-cream/55 transition-colors hover:text-steam-gold"
          >
            {t("Follow on Instagram")}<span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
