import { STORES, type Store } from "@/lib/stores";
import { PixelArrow } from "./PixelGlyphs";

/**
 * Thin gold-outlined store buttons that fill gold on hover. They sit three
 * across from ~960px and wrap to a centred stack below that.
 */
export default function StoreButtons() {
  return (
    <div className="flex w-full max-w-[980px] flex-wrap justify-center gap-4">
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
      className="flex max-w-[310px] flex-[1_1_280px] items-center gap-4 rounded-[10px] border border-[#e8be3f] bg-[rgba(6,9,26,0.5)] px-5 py-4 text-left text-[#f4ebd0] transition-colors duration-[120ms] hover:border-[#e8be3f] hover:bg-[#e8be3f] hover:text-[#0b1230] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8be3f]"
    >
      <DeviceOutline device={store.device} />
      <span className="flex flex-1 flex-col gap-1.5">
        <span className="font-pixel text-sm uppercase leading-none tracking-[0.08em]">
          {store.name}
        </span>{" "}
        {/* The dot is for the eye; a screen reader hears "Windows and macOS". */}
        <span className="text-sm leading-none opacity-75">
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
      <PixelArrow scale={2} />
    </a>
  );
}

/** A plain outline of the device: a portrait phone or a landscape monitor. */
function DeviceOutline({ device }: { device: Store["device"] }) {
  return (
    <span
      aria-hidden="true"
      className={
        device === "phone"
          ? "h-[30px] w-[22px] flex-none rounded-[4px] border-2 border-current"
          : "h-[22px] w-[30px] flex-none rounded-[2px] border-2 border-current"
      }
    />
  );
}
