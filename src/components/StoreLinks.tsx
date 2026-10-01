import { STORES } from "@/lib/stores";
import LiveDot from "./LiveDot";

/** Compact store navigation; phones use the full buttons in the hero. */
export default function StoreLinks() {
  return (
    <div className="hidden items-center gap-4 sm:flex">
      <span className="hidden items-center gap-2.5 whitespace-nowrap font-pixel text-pixel-xs uppercase tracking-[0.15em] text-steam-gold xl:inline-flex">
        <LiveDot size={6} />
        Out now
      </span>
      <div className="flex divide-x divide-steam-gold/40 overflow-hidden rounded-md border border-steam-gold/50 bg-steam-gold/15">
        {STORES.map((store) => (
          <a
            key={store.id}
            href={store.href}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-2 py-2.5 font-pixel text-pixel-xs tracking-[0.1em] text-steam-gold transition-colors hover:bg-steam-gold hover:text-steam-navy focus-visible:bg-steam-gold focus-visible:text-steam-navy focus-visible:outline-none sm:px-4 sm:tracking-[0.15em]"
          >
            <span className="lg:hidden">{store.shortLabel}</span>
            <span className="hidden uppercase lg:inline">{store.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
