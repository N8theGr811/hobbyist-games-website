import Image from "next/image";
import StoreButtons from "./StoreButtons";

/**
 * Colours are the hero handoff's own, written out rather than mapped to the
 * site tokens: its gold (#e8be3f) and cream (#f4ebd0) are a shade off
 * steam-gold and cream, and the design is meant to match exactly.
 */
const GOLD = "#e8be3f";
const CREAM = "#f4ebd0";

/** One row, never wrapping, in the game's own stat order. */
const STATS = [
  { file: "guard", label: "Guard" },
  { file: "passing", label: "Passing" },
  { file: "submissions", label: "Submissions" },
  { file: "escapes", label: "Escapes" },
  { file: "wrestling", label: "Wrestling" },
  { file: "cardio", label: "Cardio" },
  { file: "strength", label: "Strength" },
  { file: "leglocks", label: "Leg Locks" },
] as const;

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
      {/* pt clears the fixed header (~64px) before the design's own 48px. */}
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-7 px-6 pt-28 pb-14 text-center">
        <Image
          src="/hero/wordmark.png"
          alt="Submission Saga"
          width={2160}
          height={580}
          priority
          sizes="(max-width: 674px) 92vw, 620px"
          className="animate-title-reveal block h-auto w-[min(620px,92%)]"
          style={{ animationDelay: "0.2s" }}
        />

        {/* Pulled up under the wordmark, whose PNG carries its own shadow. */}
        <p
          className="animate-fade-up -mt-[22px] flex items-center gap-3 whitespace-nowrap font-[family-name:var(--font-vt323)] text-[clamp(22px,2.6vw,32px)] leading-none tracking-[0.18em] [text-shadow:2px_2px_0_rgba(0,0,0,0.5)] sm:gap-5 sm:tracking-[0.32em]"
          style={{ animationDelay: "0.4s" }}
        >
          <span aria-hidden="true" className="h-[3px] w-5 flex-none sm:w-[34px]" style={{ background: GOLD }} />
          {/* The tracking trails the last letter; pull it back so the
              ticks sit evenly on both sides. Phones get tighter tracking
              and shorter ticks so the line never wraps. */}
          <span className="-mr-[0.18em] sm:-mr-[0.32em]">THE JIU JITSU RPG</span>
          <span aria-hidden="true" className="h-[3px] w-5 flex-none sm:w-[34px]" style={{ background: GOLD }} />
        </p>

        {/* Screenshot framed edge to edge. The phone bezel this had showed
            a dark band inside the outline, and its inner radius clipped the
            gold move tray that runs along the screenshot's bottom edge. */}
        <div className="animate-fade-up w-full max-w-[980px]" style={{ animationDelay: "0.6s" }}>
          <div
            className="overflow-hidden rounded-[14px] border-2 md:rounded-[18px]"
            style={{
              borderColor: CREAM,
              boxShadow: "0 0 0 6px rgba(244,235,208,0.06), 0 30px 70px rgba(0,0,0,0.6)",
            }}
          >
            {/* Pre-sized WebPs (42–123KB) rather than next/image: run through
                the optimizer, the 1.2MB source PNG arrived noticeably after
                the rest of the hero on a cold cache. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/screenshot-knee-on-belly-1280.webp"
              srcSet="/hero/screenshot-knee-on-belly-800.webp 800w, /hero/screenshot-knee-on-belly-1280.webp 1280w, /hero/screenshot-knee-on-belly-1960.webp 1960w"
              sizes="(max-width: 1028px) calc(100vw - 48px), 980px"
              alt="Submission Saga gameplay: a knee-on-belly position mid-match"
              width={2096}
              height={1180}
              fetchPriority="high"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
        </div>

        <p
          className="animate-fade-up m-0 text-[clamp(18px,1.8vw,24px)] font-normal"
          style={{ animationDelay: "0.8s" }}
        >
          From white belt to{" "}
          <span className="font-semibold" style={{ color: GOLD }}>
            world champion
          </span>
          .
        </p>

        <div className="animate-fade-up flex w-full justify-center" style={{ animationDelay: "1.0s" }}>
          <StoreButtons />
        </div>

        <ul
          className="animate-fade-in m-0 flex max-w-full list-none flex-nowrap justify-center gap-[clamp(6px,1.4vw,18px)] p-0"
          style={{ animationDelay: "1.3s" }}
          aria-label="Stats you train"
        >
          {STATS.map(({ file, label }, i) => (
            // Focusable so a tap on a phone, or Tab on a keyboard, shows the
            // name as well as a mouse hover does.
            <li
              key={file}
              tabIndex={0}
              className="group relative grid aspect-square w-[clamp(28px,8vw,64px)] flex-none place-items-center rounded-full border transition-colors hover:bg-[rgba(232,190,63,0.12)] focus-visible:bg-[rgba(232,190,63,0.12)] focus-visible:outline-none"
              style={{ borderColor: GOLD }}
            >
              <Image
                src={`/hero/stat-${file}.png`}
                alt={label}
                width={128}
                height={128}
                className="block h-[80%] w-[80%]"
              />
              {/* Centred over its icon, except at the ends of the row,
                  where it hangs inward so a phone screen never clips it. */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-[calc(100%+10px)] whitespace-nowrap rounded-md border bg-[#06091a] px-2.5 py-2 font-pixel text-[10px] leading-none tracking-[0.12em] uppercase opacity-0 translate-y-1 transition-[opacity,translate] duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100 ${
                  i < 2 ? "left-0" : i > STATS.length - 3 ? "right-0" : "left-1/2 -translate-x-1/2"
                }`}
                style={{ borderColor: GOLD, color: CREAM }}
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
