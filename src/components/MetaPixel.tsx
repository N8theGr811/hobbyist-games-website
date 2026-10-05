"use client";

/** Website advertising measurement, enabled only after a visitor opts in. */
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { STORES } from "@/lib/stores";

const PIXEL_ID = "1050915077930277";
const CONSENT_KEY = "saga-advertising-consent";
const LIVE_HOSTS = new Set(["submissionsaga.com", "www.submissionsaga.com", "hobbyistgames.com", "www.hobbyistgames.com"]);
const CHANGE_EVENT = "saga-advertising-consent-change";
type Choice = "accepted" | "declined" | null;
type Pixel = (...args: unknown[]) => void;
declare global {
  interface Window { fbq?: Pixel; }
}

let memoryChoice: Choice = null;
function getChoice(): Choice {
  if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return "declined";
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored === "accepted" || stored === "declined" ? stored : memoryChoice;
  } catch { return memoryChoice; }
}
function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
function saveChoice(choice: Exclude<Choice, null>): void {
  memoryChoice = choice;
  try { localStorage.setItem(CONSENT_KEY, choice); } catch { /* Session choice still works. */ }
  if (choice === "declined") window.fbq?.("consent", "revoke");
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export default function MetaPixel() {
  const choice = useSyncExternalStore(subscribe, getChoice, () => null);
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (choice !== "accepted") {
      window.fbq?.("consent", "revoke");
      return;
    }
    if (!ready) return;
    window.fbq?.("consent", "grant");
    window.fbq?.("track", "PageView");
  }, [choice, pathname, ready]);

  useEffect(() => {
    if (choice !== "accepted" || !ready) return;
    const trackStoreClick = (event: MouseEvent): void => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a");
      if (!anchor) return;
      const destination = new URL(anchor.href);
      const store = STORES.find((entry) => {
        const expected = new URL(entry.href);
        return destination.origin === expected.origin && destination.pathname === expected.pathname &&
          (entry.id !== "google-play" || destination.searchParams.get("id") === expected.searchParams.get("id"));
      });
      if (store && getChoice() === "accepted") {
        window.fbq?.("trackCustom", "StoreClick", { store: store.id });
      }
    };
    document.addEventListener("click", trackStoreClick);
    return () => document.removeEventListener("click", trackStoreClick);
  }, [choice, ready]);

  const choose = (value: Exclude<Choice, null>): void => {
    saveChoice(value);
    setSettingsOpen(false);
  };

  return (
    <>
      {choice === "accepted" && LIVE_HOSTS.has(window.location.hostname) && (
        <Script id="meta-pixel" strategy="afterInteractive" onReady={() => setReady(true)}>
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
          (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('set','autoConfig',false,'${PIXEL_ID}');fbq('init','${PIXEL_ID}');`}
        </Script>
      )}
      {choice === null || settingsOpen ? (
        <section aria-label="Advertising cookie choices" className="fixed bottom-3 left-3 right-3 z-[100] mx-auto max-w-xl rounded-md border border-cream/20 bg-steam-navy p-4 text-sm text-cream shadow-lg">
          <p>Allow advertising cookies? We use Meta to measure visits and store clicks from our ads. <a href="/privacy#website-advertising" className="underline">Privacy details</a></p>
          <div className="mt-3 flex gap-3">
            <button type="button" onClick={() => choose("declined")} className="rounded border border-cream/40 px-4 py-2 hover:bg-cream/10">No thanks</button>
            <button type="button" onClick={() => choose("accepted")} className="rounded border border-cream/40 px-4 py-2 hover:bg-cream/10">Allow</button>
          </div>
        </section>
      ) : (
        <button type="button" onClick={() => setSettingsOpen(true)} className="fixed bottom-2 left-2 z-[100] rounded bg-steam-navy px-3 py-2 text-xs text-cream/70 underline">Cookie settings</button>
      )}
    </>
  );
}
