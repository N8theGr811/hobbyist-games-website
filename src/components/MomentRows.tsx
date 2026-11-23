import { getI18n, type Locale } from "@/lib/i18n";

export interface Moment {
  headline: string;
  line: string;
  media: MomentMediaSpec;
}

export type MomentMediaSpec =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; label: string };

/** Alternating headline/media rows, media on the left first. */
export default function MomentRows({
  moments,
  locale = "en",
}: {
  moments: Moment[];
  locale?: Locale;
}) {
  const { t } = getI18n(locale);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-16 md:gap-20">
      {moments.map((moment, i) => {
        const mediaRight = i % 2 === 1;
        return (
          <div
            key={t(moment.headline)}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
          >
            <div className={mediaRight ? "md:order-2" : undefined}>
              <MomentMedia media={moment.media} locale={locale} />
            </div>
            <div className={mediaRight ? "md:order-1" : undefined}>
              <h3 className="font-pixel text-pixel-md uppercase tracking-[0.1em] text-steam-gold mb-4 leading-relaxed">
                {t(moment.headline)}
              </h3>
              <p className="text-base leading-relaxed text-cream/70">
                {t(moment.line)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Screenshot or looping clip, in the panel frame with a cream outline. */
export function MomentMedia({ media, locale }: { media: MomentMediaSpec; locale: Locale }) {
  const { t } = getI18n(locale);
  return (
    <div className="steam-panel border-cream relative aspect-video overflow-hidden">
      {media.kind === "video" ? (
        <video
          src={media.src}
          aria-label={t(media.label)}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        /* Plain img rather than next/image: this is a fixed decorative frame
           and object-cover already handles the fit. */
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={media.src}
          alt={t(media.alt)}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
