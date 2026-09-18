import { STORES } from "@/lib/stores";
import LiveDot from "./LiveDot";

/**
 * The header's version of the store buttons: one segmented control, so the
 * pair reads as a single "where to get it" instead of two buttons competing
 * with the hero's.
 *
 * Width decides the labels. Beside the logo on a 375px phone there is 147px,
 * which holds "STEAM" and "iOS" at the 11px pixel floor, on tight padding,
 * with about 15px to spare, and nothing longer. So the full names wait for sm,
 * and "Out now", which needs another 110px, waits for lg.
 */
export default function StoreLinks() {
  return (
    <div className="flex items-center gap-4">
      <span className="hidden items-center gap-2.5 whitespace-nowrap font-pixel text-pixel-xs uppercase tracking-[0.15em] text-steam-gold lg:inline-flex">
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
            <span className="sm:hidden">{store.shortLabel}</span>
            <span className="hidden uppercase sm:inline">{store.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
