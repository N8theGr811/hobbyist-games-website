import { getI18n, type Locale } from "@/lib/i18n";
import { MomentMedia } from "./MomentRows";
import Watermark from "./Watermark";

/**
 * The items and mechanics only people who train will get.
 *
 * TheGame argues the systems; this is the reason the game exists. No captions:
 * every shot already carries its own words (the Brew card's warning, the
 * washing machine, INJURED), and the bag is a list every grappler recognises
 * on sight. Two across rather than more, because these are dense UI and stop
 * reading at a quarter of the column.
 *
 * The injury card was rendered from the game's own ConditionModal in an
 * isolated project clone, over an empty scene, so the fighter is the default.
 */
const SHOTS: { src: string; alt: string }[] = [
  {
    src: "/media/screenshots/mechanic-injury.png",
    alt: "The INJURED card: a leg injury that cuts leg locks by 50% and movement by 40%, and heals overnight",
  },
  {
    src: "/media/screenshots/item-bag.png",
    alt: "The bag: a yerba mate gourd, two tubes of cream, a fishing rod, an electrolyte bottle, an acai bowl and a pint of B-Team Brew",
  },
  {
    src: "/media/screenshots/mechanic-laundromat.png",
    alt: "The laundromat washing your gear: a pixel washing machine mid-cycle with the WASH bar half full",
  },
  {
    src: "/media/screenshots/item-b-team-brew.png",
    alt: "The B-Team Brew item card: +5 to all stats for the next fight and -40 Cardio. Two in a day brings a hangover.",
  },
];

export default function GrapplersOnly({ locale = "en" }: { locale?: Locale }) {
  const { t } = getI18n(locale);
  return (
    <section className="relative isolate section-rhythm px-6 bg-pixel-grid bg-pixel-grid-alt overflow-hidden md:px-12">
      <Watermark name="kimura" className="-left-24 top-24 h-[320px] w-[560px]" />
      <Watermark name="singleleg" className="-right-28 bottom-16 h-[320px] w-[440px]" />

      <h2 className="max-w-3xl mx-auto mb-16 text-center font-pixel text-pixel-lg text-cream leading-tight tracking-wide">
        {t("Items And Mechanics Only Grapplers Will Understand.")}
      </h2>

      <div className="max-w-5xl mx-auto grid gap-x-12 gap-y-10 sm:grid-cols-2">
        {SHOTS.map((shot) => (
          <MomentMedia key={shot.src} media={{ kind: "image", ...shot }} locale={locale} />
        ))}
      </div>
    </section>
  );
}
