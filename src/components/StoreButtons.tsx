import { COMING_SOON, STORES, type Store } from "@/lib/stores";
import { DeviceGlyph, HourglassGlyph, PixelArrow } from "./PixelGlyphs";

/**
 * The hero's ways to get the game. Neither store is the main one, so both
 * take the filled, pressable style the single Wishlist button used to have,
 * at the same width. Platforms that are announced but not on sale follow as
 * dashed tiles.
 *
 * The icons are pixel-drawn devices, not store logos. Apple's marketing
 * guidelines allow its logo only inside the official App Store badge, and a
 * Steam logo beside a plain phone would be the odd one out.
 */
export default function StoreButtons() {
  return (
    <div className="grid w-full max-w-[320px] gap-3 sm:w-[528px] sm:max-w-none sm:grid-cols-2 sm:gap-4">
      {STORES.map((store) => (
        <StoreButton key={store.id} store={store} />
      ))}
      {COMING_SOON.map((platform) => (
        <ComingSoonTile key={platform} platform={platform} />
      ))}
    </div>
  );
}

/**
 * Dashed and unfilled, so it reads as an empty slot beside the two filled
 * buttons rather than as a third store, and full width from sm, so it sits
 * under the pair instead of competing with it. It goes to the mailing list.
 */
function ComingSoonTile({ platform }: { platform: string }) {
  return (
    <a
      href="#signup"
      className="group flex items-center gap-4 rounded-md border-2 border-dashed border-steam-gold/45 bg-steam-navy-3/40 py-3.5 pl-5 pr-5 text-left text-steam-gold transition-colors duration-200 hover:border-steam-gold hover:bg-steam-gold/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream sm:col-span-2"
    >
      <HourglassGlyph />
      <span className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
        <span className="font-pixel text-pixel-sm uppercase leading-none tracking-[0.1em]">
          {platform}
        </span>{" "}
        <span className="text-xs font-semibold leading-none tracking-[0.06em] text-cream/70">
          Coming soon
          <span aria-hidden="true"> · </span>
          <span className="sr-only">. </span>
          Get notified
        </span>
      </span>
      <PixelArrow scale={2} className="transition-transform duration-200 group-hover:translate-x-1" />
    </a>
  );
}

function StoreButton({ store }: { store: Store }) {
  const [first, second] = store.platforms;
  return (
    <a
      href={store.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-md border-2 border-steam-gold bg-steam-gold py-3.5 pl-5 pr-5 text-left text-steam-navy transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.4),0_8px_24px_rgba(212,165,60,0.35)] hover:-translate-y-px hover:border-steam-gold-2 hover:bg-steam-gold-2 hover:shadow-[0_2px_0_rgba(0,0,0,0.4),0_4px_16px_rgba(212,165,60,0.55)] active:translate-y-px active:shadow-[0_0_0_rgba(0,0,0,0.4)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
    >
      <DeviceGlyph device={store.device} />
      <span className="flex flex-1 flex-col gap-2">
        <span className="font-pixel text-pixel-sm uppercase leading-none tracking-[0.1em]">
          {store.name}
        </span>{" "}
        {/* navy/80 on gold is 5.6:1. The dot is for the eye; a screen
            reader hears "Windows and macOS". */}
        <span className="text-xs font-semibold leading-none tracking-[0.06em] text-steam-navy/80">
          {first}
          <span aria-hidden="true"> · </span>
          <span className="sr-only"> and </span>
          {second}
        </span>
      </span>
      <PixelArrow scale={2} className="transition-transform duration-200 group-hover:translate-x-1" />
    </a>
  );
}
