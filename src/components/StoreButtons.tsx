import { STORES, type Store } from "@/lib/stores";
import { DeviceGlyph, PixelArrow } from "./PixelGlyphs";

/** Every live store uses the same button, with the final odd tile centered. */
export default function StoreButtons() {
  return (
    <div className="grid w-full max-w-[320px] gap-3 sm:w-[576px] sm:max-w-none sm:grid-cols-2 sm:gap-4">
      {STORES.map((store) => (
        <StoreButton key={store.id} store={store} />
      ))}
    </div>
  );
}

function StoreButton({ store }: { store: Store }) {
  const [first, second] = store.platforms;
  return (
    <a
      href={store.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center sm:last:odd:col-span-2 sm:last:odd:w-[280px] sm:last:odd:justify-self-center gap-4 rounded-md border-2 border-steam-gold bg-steam-gold py-3.5 pl-5 pr-5 text-left text-steam-navy transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.4),0_8px_24px_rgba(212,165,60,0.35)] hover:-translate-y-px hover:border-steam-gold-2 hover:bg-steam-gold-2 hover:shadow-[0_2px_0_rgba(0,0,0,0.4),0_4px_16px_rgba(212,165,60,0.55)] active:translate-y-px active:shadow-[0_0_0_rgba(0,0,0,0.4)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
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
          {second && (
            <>
              <span aria-hidden="true"> · </span>
              <span className="sr-only"> and </span>
              {second}
            </>
          )}
        </span>
      </span>
      <PixelArrow scale={2} className="transition-transform duration-200 group-hover:translate-x-1" />
    </a>
  );
}
