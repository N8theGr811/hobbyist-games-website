const socials = [
  {
    label: "YT",
    href: "https://www.youtube.com/@Submission_Saga",
    aria: "YouTube — Submission Saga",
  },
  {
    label: "JJ",
    href: "https://www.youtube.com/@natemarkhamjj",
    aria: "YouTube — Nate Markham BJJ",
  },
  {
    label: "IG",
    href: "https://www.instagram.com/submission_saga/",
    aria: "Instagram — Submission Saga",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-steam-gold/15 bg-steam-navy">
      <div className="max-w-[900px] mx-auto px-6 py-10 flex items-center justify-between md:px-12">
        <div className="flex items-center gap-4">
          <span className="font-pixel text-[0.5rem] tracking-[0.1em] text-cream/30">
            © 2026 Hobbyist Games
          </span>
          <a
            href="/credits"
            className="font-pixel text-[0.5rem] tracking-[0.1em] text-cream/30 hover:text-steam-gold transition-colors"
          >
            Credits
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
              className="w-9 h-9 flex items-center justify-center border border-steam-gold/25 text-cream/50 text-[0.7rem] font-semibold hover:bg-steam-gold hover:text-steam-navy hover:border-steam-gold transition-all cursor-pointer rounded-md"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
