import MomentRows, { type Moment } from "./MomentRows";
import Watermark from "./Watermark";

/**
 * The region the fights happen in.
 *
 * This section replaced a full-width VS screenshot headed "Know Your
 * Opponent". The problem it solves is that nothing on the page showed the
 * overworld: GameInfo claims "Explore — cities, gyms, rivals, and secrets" in
 * prose, and every screenshot above it was combat or a menu, so the claim went
 * unevidenced. A visitor could reasonably have finished the page thinking this
 * was a fighting game with no map in it.
 *
 * The two lines are written from the game, not from the two screenshots.
 * "Locked until your belt is high enough" is a real placed obstacle, not a
 * flourish: BeltGatedObstacle sits on explore_area_pathway at purple and
 * black, and on forest_thicket at brown. The gym line is the actual loop from
 * BadgeData and GymLeaderMoveData — four badge gyms, two leaders each, and
 * clearing both teaches that gym's move.
 *
 * Both shots are phone captures. The game renders 16:9 inside a 2556x1179
 * screen, so each had 230px black pillars that were cropped off; what is left
 * is exactly 2096x1179 and drops into the aspect-video panel with nothing
 * trimmed. They are PNG rather than JPEG, and full-colour rather than
 * palette-reduced: the town shot carries 30k colours across its foliage and
 * roof tiles, and quantising it to 256 shifted a tenth of the pixels far
 * enough to band.
 */
const MOMENTS: Moment[] = [
  {
    headline: "Towns, farms, and forest trails",
    line: "Numbered routes connect villages, forest, and mountain. Some stay locked until your belt is high enough.",
    media: {
      kind: "image",
      src: "/media/screenshots/region-town.png",
      alt: "Overworld town with a tiled-roof house, a crop field, a shop building and forest paths",
    },
  },
  {
    headline: "Gyms, medals, and training partners",
    line: "Train with the partners on the mat, then beat both gym leaders for the badge and the move they teach.",
    media: {
      kind: "image",
      src: "/media/screenshots/region-gym.png",
      alt: "Gym interior with blue mats, a dozen training partners, medals on the wall and a trophy shelf",
    },
  },
];

export default function ExploreTheRegion() {
  return (
    <section className="relative isolate section-rhythm px-6 md:px-12 overflow-hidden bg-pixel-grid border-y border-steam-gold/20">
      <Watermark name="kimura" className="-left-24 top-24 h-[320px] w-[560px]" />
      <Watermark name="singleleg" className="-right-28 bottom-16 h-[320px] w-[440px]" />

      <div className="max-w-3xl mx-auto text-center mb-16">
        {/* Eyebrow was "Beyond The Mat", which stopped being true the moment a
            gym interior became the second row — a gym is the mat. */}
        <div className="flex items-center justify-center gap-3 mb-6 font-pixel text-pixel-xs tracking-[0.2em] uppercase text-steam-gold">
          <span className="w-6 h-px bg-steam-gold/40" />
          The World
          <span className="w-6 h-px bg-steam-gold/40" />
        </div>
        <h2 className="font-pixel text-pixel-lg text-cream leading-tight tracking-wide">
          Explore The Region
        </h2>
      </div>

      {/* Opens on the right: How It Plays ends on a left-media row. */}
      <MomentRows moments={MOMENTS} startSide="right" />
    </section>
  );
}
