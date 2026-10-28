import { STORES } from "@/lib/stores";

/** Compact store navigation; phones use the full buttons in the hero. */
export default function StoreLinks() {
  return (
    <div className="hidden items-center gap-4 lg:flex">
      <div className="flex divide-x divide-steam-gold/40 overflow-hidden rounded-md border border-steam-gold/50 bg-steam-gold/15">
        {STORES.map((store) => (
          <a
            key={store.id}
            href={store.href}
            aria-label={store.name}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-2 py-2.5 font-pixel text-pixel-xs tracking-[0.1em] text-steam-gold transition-colors hover:bg-steam-gold hover:text-steam-navy focus-visible:bg-steam-gold focus-visible:text-steam-navy focus-visible:outline-none 2xl:px-4 2xl:tracking-[0.15em]"
          >
            <span className="2xl:hidden">{store.shortLabel}</span>
            <span className="hidden uppercase 2xl:inline">{store.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
