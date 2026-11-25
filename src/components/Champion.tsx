import { getI18n, type Locale } from "@/lib/i18n";
import { MomentMedia } from "./MomentRows";
import Watermark from "./Watermark";

/**
 * Where the four chapters lead: the black belt World Championship podium.
 *
 * One shot, set wider than any row above it, because this is the end of the
 * story and should read as the biggest moment on the page. The heading is the
 * game's own line from the World Champion medal card.
 */
export default function Champion({ locale = "en" }: { locale?: Locale }) {
  const { t } = getI18n(locale);
  return (
    <section className="relative isolate section-rhythm px-6 bg-pixel-grid overflow-hidden md:px-12">
      <Watermark name="openguard" className="-left-28 top-24 h-[400px] w-[520px] scale-x-[-1]" />
      <Watermark name="singlelegx" className="-right-24 bottom-16 h-[340px] w-[460px]" />

      <h2 className="max-w-3xl mx-auto mb-16 text-center font-pixel text-pixel-lg text-cream leading-tight tracking-wide">
        {t("Become The Best In The World.")}
      </h2>

      <div className="max-w-4xl mx-auto">
        <MomentMedia
          locale={locale}
          media={{
            kind: "image",
            src: "/media/screenshots/world-champion-podium.png",
            alt: "The black belt World Championship podium: you in first as World Champion, Gunner second, Linus third, with $10,000 and 2,200 XP awarded",
          }}
        />
      </div>
    </section>
  );
}
