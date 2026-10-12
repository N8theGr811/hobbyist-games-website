/** Brand logos distinguish the stores while the buttons stay in one row. */
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
      className="flex min-h-24 min-w-0 flex-col items-center justify-center gap-1.5 rounded-[10px] border border-[#e8be3f] bg-[rgba(6,9,26,0.5)] px-0.5 py-2 text-center text-[#f4ebd0] transition-colors duration-[120ms] hover:border-[#e8be3f] hover:bg-[#e8be3f] hover:text-[#0b1230] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8be3f] @min-[600px]:min-h-[68px] @min-[600px]:flex-row @min-[600px]:gap-2 @min-[600px]:px-2 @min-[600px]:py-4 @min-[600px]:text-left @min-[900px]:gap-4 @min-[900px]:px-5"
    >
      <StoreLogo id={store.id} />
      <span className="flex w-full min-w-0 flex-col gap-1.5 @min-[600px]:w-auto @min-[600px]:flex-1">
        <span className="flex min-h-7 items-center justify-center font-pixel text-pixel-xs uppercase leading-tight @min-[420px]:min-h-0 @min-[600px]:justify-start @min-[600px]:leading-none @min-[900px]:text-sm @min-[900px]:tracking-[0.08em]">
          {store.name}
        </span>{" "}
        {/* The separator is visual; a screen reader hears "Windows and macOS". */}
        <span className="text-[11px] leading-tight opacity-75 @min-[600px]:text-xs @min-[600px]:leading-none @min-[900px]:text-sm">
          {first}
          {second && (
            <>
              <span aria-hidden="true"> / </span>
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

/** Simple Icons brand paths (CC0-1.0): https://github.com/simple-icons/simple-icons */
const STORE_LOGOS: Record<Store["id"], string> = {
  "app-store": "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701",
  "google-play": "M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z",
  steam: "M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z",
};

/** Decorative logos inherit the button color, including hover and focus. */
function StoreLogo({ id }: { id: Store["id"] }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6 flex-none"
    >
      <path d={STORE_LOGOS[id]} />
    </svg>
  );
}
