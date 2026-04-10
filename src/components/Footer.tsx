const socials = [
  { label: "X", href: "#", aria: "X (Twitter)" },
  { label: "YT", href: "#", aria: "YouTube" },
  { label: "DC", href: "#", aria: "Discord" },
];

export default function Footer() {
  return (
    <footer className="max-w-[900px] mx-auto px-6 py-10 flex items-center justify-between border-t border-ink/8 md:px-12">
      <span className="font-mono text-[0.6rem] tracking-[0.08em] text-ink/25">
        © 2026 Hobbyist Games
      </span>
      <div className="flex gap-2">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.aria}
            className="w-9 h-9 flex items-center justify-center border border-ink/10 text-ink text-[0.7rem] font-semibold opacity-40 hover:opacity-100 hover:bg-ink hover:text-cream hover:border-ink transition-all cursor-pointer"
          >
            {s.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
