/** The original store buttons adapt to their column while staying in one row. */
import { STORES, type Store } from "@/lib/stores";
import { PixelArrow } from "./PixelGlyphs";

export default function StoreButtons() {
  return (
    <div className="@container w-full">
      <div className="grid w-full grid-cols-3 gap-2 @min-[900px]:gap-4">
        {STORES.map((store) => (
          <StoreButton key={store.id} store={store} />
        ))}
      </div>
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
      className="flex min-h-[68px] min-w-0 items-center gap-2 rounded-[10px] border border-[#e8be3f] bg-[rgba(6,9,26,0.5)] px-1 py-2.5 text-center text-[#f4ebd0] transition-colors duration-[120ms] hover:border-[#e8be3f] hover:bg-[#e8be3f] hover:text-[#0b1230] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8be3f] @min-[600px]:px-2 @min-[600px]:py-4 @min-[600px]:text-left @min-[900px]:gap-4 @min-[900px]:px-5"
    >
      <DeviceOutline device={store.device} />
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="font-pixel text-pixel-xs uppercase leading-tight @min-[600px]:leading-none @min-[900px]:text-sm @min-[900px]:tracking-[0.08em]">
          {store.name}
        </span>{" "}
        {/* The dot is for the eye; a screen reader hears "Windows and macOS". */}
        <span className="text-[11px] leading-tight opacity-75 @min-[600px]:text-xs @min-[600px]:leading-none @min-[900px]:text-sm">
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
      <PixelArrow scale={2} className="hidden @min-[600px]:block" />
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
          ? "hidden h-[30px] w-[22px] flex-none rounded-[4px] border-2 border-current @min-[600px]:block"
          : "hidden h-[22px] w-[30px] flex-none rounded-[2px] border-2 border-current @min-[600px]:block"
      }
    />
  );
}
