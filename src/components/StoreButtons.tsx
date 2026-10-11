/** One compact store chooser, with a full touch target for each platform. */
import { STORES, type Store } from "@/lib/stores";

export default function StoreButtons() {
  return (
    <div className="grid w-full grid-cols-3 divide-x divide-[#f4ebd0]/20 overflow-hidden rounded-lg border border-[#f4ebd0]/30 bg-[#06091a]/30">
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
      className="flex min-h-16 min-w-0 items-center justify-center px-1 py-3 text-center text-[#f4ebd0] transition-colors duration-150 hover:bg-[#e8be3f]/15 hover:text-[#e8be3f] focus-visible:bg-[#e8be3f]/15 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#e8be3f]"
    >
      <span className="flex flex-col gap-2">
        <span className="text-sm font-semibold leading-none">
          {store.name}
        </span>{" "}
        {/* The dot is for the eye; a screen reader hears "Windows and macOS". */}
        <span className="text-xs leading-tight opacity-75">
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
