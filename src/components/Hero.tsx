/** A compact introduction that keeps the game and store links together. */
import Image from "next/image";
import StoreButtons from "./StoreButtons";
import styles from "./Hero.module.css";

/**
 * Colours are the hero handoff's own, written out rather than mapped to the
 * site tokens: its gold (#e8be3f) and cream (#f4ebd0) are a shade off
 * steam-gold and cream, and the design is meant to match exactly.
 */
const GOLD = "#e8be3f";
const CREAM = "#f4ebd0";

export default function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#0b1230] text-[#f4ebd0]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 38%, rgba(232,190,63,0.08), transparent 55%), radial-gradient(rgba(244,235,208,0.05) 1px, transparent 1px)",
        backgroundSize: "auto, 14px 14px",
      }}
    >
      {/* Clear the fixed header, then leave the height budget to the image. */}
      <div className="mx-auto grid max-w-[1280px] items-center justify-items-center gap-4 px-4 pt-20 pb-8 text-center sm:px-6 sm:pt-22 lg:grid-cols-[0.85fr_1.15fr] lg:gap-x-8 lg:gap-y-6">
        <div className="flex min-w-0 max-w-full flex-col items-center gap-4">
          <Image
            src="/hero/wordmark.png"
            alt="Submission Saga"
            width={2160}
            height={580}
            priority
            sizes="(max-width: 550px) 80vw, 440px"
            className="animate-title-reveal block h-auto w-[min(440px,80vw)] max-w-full"
            style={{ animationDelay: "0.2s" }}
          />

          {/* Pulled up under the wordmark, whose PNG carries its own shadow. */}
          <p
            className="animate-fade-up -mt-4 flex items-center gap-3 whitespace-nowrap font-[family-name:var(--font-vt323)] text-[clamp(22px,2.6vw,28px)] leading-none tracking-[0.18em] [text-shadow:2px_2px_0_rgba(0,0,0,0.5)] sm:gap-5 sm:tracking-[0.32em] lg:gap-3 lg:text-2xl lg:tracking-[0.18em]"
            style={{ animationDelay: "0.4s" }}
          >
            <span aria-hidden="true" className="h-[3px] w-5 flex-none sm:w-[34px]" style={{ background: GOLD }} />
            {/* The tracking trails the last letter; pull it back so the
                ticks sit evenly on both sides. Phones get tighter tracking
                and shorter ticks so the line never wraps. */}
            <span className="-mr-[0.18em] sm:-mr-[0.32em] lg:-mr-[0.18em]">THE JIU JITSU RPG</span>
            <span aria-hidden="true" className="h-[3px] w-5 flex-none sm:w-[34px]" style={{ background: GOLD }} />
          </p>

          <p
            className="animate-fade-up m-0 text-[clamp(18px,1.8vw,24px)] font-normal"
            style={{ animationDelay: "0.6s" }}
          >
            From white belt to{" "}
            <span className="font-semibold" style={{ color: GOLD }}>
              world champion
            </span>
            .
          </p>
        </div>

        {/* Reserve room for the title and stores before sizing the screenshot.
            Its natural ratio stays intact; short windows can still scroll. */}
        <div className="animate-fade-up flex w-full justify-center" style={{ animationDelay: "0.6s" }}>
          {/* Pre-sized WebPs keep the gameplay image quick on a cold cache. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero/screenshot-knee-on-belly-1280.webp"
            srcSet="/hero/screenshot-knee-on-belly-800.webp 800w, /hero/screenshot-knee-on-belly-1280.webp 1280w, /hero/screenshot-knee-on-belly-1960.webp 1960w"
            sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), (max-width: 1280px) 55vw, 690px"
            alt="Submission Saga gameplay: a knee-on-belly position mid-match"
            width={2096}
            height={1180}
            fetchPriority="high"
            decoding="async"
            className={`${styles.screenshot} block h-auto w-auto max-w-full rounded-[14px] border-2 md:rounded-[18px]`}
            style={{
              borderColor: CREAM,
              boxShadow: "0 0 0 6px rgba(244,235,208,0.06), 0 20px 50px rgba(0,0,0,0.5)",
            }}
          />
        </div>

        <div className="animate-fade-up flex w-full justify-center lg:col-span-2" style={{ animationDelay: "0.8s" }}>
          <StoreButtons />
        </div>
      </div>
    </section>
  );
}
