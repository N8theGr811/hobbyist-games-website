/** Three equally prominent store links, kept in one row on phones too. */
import { STORES, type Store } from "@/lib/stores";
export default function StoreButtons() {
  return (
    <div className="grid w-full max-w-[780px] grid-cols-3 gap-2 sm:gap-4">
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
      className="flex min-h-16 min-w-0 items-center justify-center rounded-[10px] border border-[#e8be3f] bg-[rgba(6,9,26,0.5)] px-1 py-3 text-center text-[#f4ebd0] transition-colors duration-[120ms] hover:bg-[#e8be3f] hover:text-[#0b1230] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8be3f] sm:px-3"
    >
      <span className="flex flex-col gap-2">
        <span className="text-sm font-semibold leading-none sm:font-pixel sm:text-pixel-xs sm:font-normal sm:uppercase sm:tracking-[0.08em]">
          {store.name}
        </span>{" "}
        {/* The dot is for the eye; a screen reader hears "Windows and macOS". */}
        <span className="text-xs leading-tight opacity-75 sm:text-sm">
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
    </a>
  );
}
