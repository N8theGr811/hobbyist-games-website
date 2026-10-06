interface Social {
  label: string;
  href: string;
  aria: string;
  /** Drawn in place of the text label when present. */
  icon?: React.ReactNode;
}

const socials: Social[] = [
  {
    label: "IG",
    href: "https://www.instagram.com/submission_saga/",
    aria: "Instagram — Submission Saga",
    icon: <InstagramGlyph />,
  },
  {
    label: "YT",
    href: "https://www.youtube.com/@Submission_Saga",
    aria: "YouTube — Submission Saga",
    icon: <YouTubeGlyph />,
  },
  {
    // The address lives in next.config.ts; /community redirects to it.
    label: "r/",
    href: "/community",
    aria: "Reddit: Submission Saga",
    icon: <RedditGlyph />,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-steam-gold/15 bg-steam-navy">
      {/* Wraps: four links plus the copyright do not fit one line on a phone. */}
      <div className="max-w-[900px] mx-auto px-6 py-10 flex flex-wrap items-center justify-between gap-y-4 md:px-12">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Body face at 12px. This was 8px Press Start 2P at 2.4:1 contrast,
              under the AA floor on both size and colour. */}
          <span className="text-xs tracking-[0.1em] text-cream/55">
            © 2026 Hobbyist Games
          </span>
          <a
            href="/guide"
            className="text-xs tracking-[0.1em] text-cream/55 hover:text-steam-gold transition-colors"
          >
            Beginner&apos;s Guide
          </a>
          <a
            href="/glossary"
            className="text-xs tracking-[0.1em] text-cream/55 hover:text-steam-gold transition-colors"
          >
            Move Glossary
          </a>
          <a
            href="/credits"
            className="text-xs tracking-[0.1em] text-cream/55 hover:text-steam-gold transition-colors"
          >
            Credits
          </a>
          {/* Steamworks stores this URL and players reach it from the store
              page, so /privacy must stay put once it ships. */}
          <a
            href="/privacy"
            className="text-xs tracking-[0.1em] text-cream/55 hover:text-steam-gold transition-colors"
          >
            Privacy
          </a>
        </div>
        <div className="flex gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.aria}
              className="w-9 h-9 flex items-center justify-center border border-steam-gold/25 text-cream/55 text-xs font-semibold hover:bg-steam-gold hover:text-steam-navy hover:border-steam-gold transition-all cursor-pointer rounded-md"
            >
              {s.icon ?? s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/** The camera outline: rounded square, lens, and flash dot, in currentColor. */
function InstagramGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A rounded screen with a play button, in currentColor. */
function YouTubeGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Reddit's alien, reduced to head, ears, antenna, eyes and smile. */
function RedditGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="14.5" rx="8" ry="5.5" />
      <circle cx="4.5" cy="10.5" r="1.6" />
      <circle cx="19.5" cy="10.5" r="1.6" />
      <path d="M12 9l1.5-5 4 1" />
      <circle cx="19" cy="5.3" r="1.4" />
      <circle cx="9" cy="13.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13.5" r="1" fill="currentColor" stroke="none" />
      <path d="M9.5 16.8c1.5 1 3.5 1 5 0" />
    </svg>
  );
}
