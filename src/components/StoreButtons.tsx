/** The original outlined store buttons, kept in one row at every width. */
import { STORES, type Store } from "@/lib/stores";
import { PixelArrow } from "./PixelGlyphs";

export default function StoreButtons() {
  return (
    <div className="grid w-full grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
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
      className="flex min-h-[68px] min-w-0 items-center gap-2 rounded-[10px] border border-[#e8be3f] bg-[rgba(6,9,26,0.5)] px-1 py-2.5 text-center text-[#f4ebd0] transition-colors duration-[120ms] hover:border-[#e8be3f] hover:bg-[#e8be3f] hover:text-[#0b1230] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8be3f] sm:px-3 sm:py-4 md:text-left lg:gap-4 lg:px-5"
    >
      <DeviceOutline device={store.device} />
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="font-pixel text-pixel-xs uppercase leading-tight sm:leading-none lg:text-sm lg:tracking-[0.08em]">
          {store.name}
        </span>{" "}
        {/* The dot is for the eye; a screen reader hears "Windows and macOS". */}
        <span className="text-[11px] leading-tight opacity-75 sm:text-sm sm:leading-none">
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
      <PixelArrow scale={2} className="hidden md:block" />
    </a>
  );
}

/** Keep the original device outlines where the row has room for them. */
function DeviceOutline({ device }: { device: Store["device"] }) {
  return (
    <span
      aria-hidden="true"
      className={
        device === "phone"
          ? "hidden h-[30px] w-[22px] flex-none rounded-[4px] border-2 border-current md:block"
          : "hidden h-[22px] w-[30px] flex-none rounded-[2px] border-2 border-current md:block"
      }
    />
  );
}
