import { getI18n, type Locale } from "@/lib/i18n";
import MomentRows, { type Moment } from "./MomentRows";
import Watermark from "./Watermark";

/**
 * The page's argument, told as the order you play it in.
 *
 * This replaced three sections that listed what the game has: How It Plays
 * (three combat rows), Explore The Region (two world rows) and The Game (three
 * pillar columns). Between them "90+ techniques across 19 positions" was said
 * three times and combat was shown twice in a row under a combat hero. Here
 * there is one claim, that jiu jitsu already works like a game, and four rows
 * that walk through it: style, then the stats it needs, then the moves, then
 * the people in your way. The hero carries the move-selection screen, so no
 * row repeats it; the last row shows the finish instead.
 *
 * The four headlines are Nate's lines and read as one sentence top to bottom.
 */
const CHAPTERS: Moment[] = [
  {
    headline: "Pick a style that's yours",
    line: "Six styles, from wrestler to guard player. Each starts strong somewhere and has room to grow everywhere else.",
    media: {
      kind: "image",
      src: "/media/screenshots/belt-card-black.png",
      alt: "A black belt career card for Marcelo, a Guard Player at level 41: guard 74, submissions 71, 58 wins, 9 losses, favourite move the triangle choke",
    },
  },
  {
    headline: "Train the stats you need",
    line: "Take class, drill positions, book a private lesson. Close the holes in your game one session at a time.",
    media: {
      kind: "image",
      src: "/media/screenshots/region-gym.png",
      alt: "Gym interior with blue mats, a dozen training partners, medals on the wall and a trophy shelf",
    },
  },
  {
    headline: "Unlock the moves you love",
    line: "Spend your points on the skill tree and build toward a submission you name yourself.",
    media: {
      kind: "image",
      src: "/media/screenshots/move-card-rear-naked-choke.png",
      alt: "The Legendary Rear Naked Choke move card from back control: 45% to land, 55% to finish, strong against Clear Hooks and Get to Guard",
    },
  },
  {
    headline: "Submit everyone in your way",
    line: "Beat both gym leaders for the badge and the move they teach, then earn your next belt.",
    media: {
      kind: "image",
      src: "/media/screenshots/submission-great.png",
      alt: "A buggy choke locked in from bottom side control, with the timing gauge stopped inside the GREAT band",
    },
  },
];

export default function TheGame({ locale = "en" }: { locale?: Locale }) {
  const { t } = getI18n(locale);
  return (
    <section id="about" className="relative isolate section-rhythm px-6 bg-pixel-grid bg-pixel-grid-alt overflow-hidden md:px-12">
      <Watermark name="backcontrol" className="-right-24 top-32 h-[440px] w-[440px]" />
      <Watermark name="granbyroll" className="-left-28 bottom-24 h-[420px] w-[336px]" />

      <h2 className="max-w-3xl mx-auto mb-16 text-center font-pixel text-pixel-lg text-cream leading-tight tracking-wide">
        {t("Jiu Jitsu Was Always A Game.")}
      </h2>

      {/* Alternating rows. Three across would shrink each frame to ~380px,
          and these are dense UI screenshots that stop being readable there. */}
      <MomentRows locale={locale} moments={CHAPTERS} />
    </section>
  );
}
