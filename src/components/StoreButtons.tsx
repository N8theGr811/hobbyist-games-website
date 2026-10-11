/** Three prominent play buttons using the site's gold and pixel lettering. */
import { STORES, type Store } from "@/lib/stores";

export default function StoreButtons() {
  return (
    <div className="grid w-full grid-cols-3 gap-2">
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
      className="flex min-h-18 min-w-0 items-center justify-center rounded-md border border-steam-gold bg-steam-gold-2 px-1 py-3 text-center text-steam-navy shadow-[0_3px_0_var(--color-steam-gold)] transition-[background-color,border-color,box-shadow,transform] duration-150 hover:border-cream hover:bg-cream focus-visible:bg-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0.5 active:shadow-none"
    >
      <span className="flex flex-col gap-1.5">
        <span className="font-[family-name:var(--font-vt323)] text-[clamp(18px,5.3vw,22px)] uppercase leading-none">
          {store.name}
        </span>{" "}
        {/* The dot is for the eye; a screen reader hears "Windows and macOS". */}
        <span className="text-xs leading-tight opacity-80">
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
