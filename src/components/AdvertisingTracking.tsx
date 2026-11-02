"use client";

import { useI18n } from "./LocaleProvider";

/** Website advertising measurement, enabled only after a visitor opts in. */
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { identifyStore } from "@/lib/campaign";
import { getChoice, saveChoice, subscribeConsent, type Choice } from "@/lib/advertising-consent";
import CampaignLinks from "./CampaignLinks";

const PIXEL_ID = "1050915077930277";
// Verified in this account's Events Manager on 2026-11-02. Public pixel ID, not a credential.
const REDDIT_PIXEL_ID = "a2_jyde3sib7c49";
const LIVE_HOSTS = new Set(["submissionsaga.com", "www.submissionsaga.com", "hobbyistgames.com", "www.hobbyistgames.com"]);
type Pixel = (...args: unknown[]) => void;
declare global {
  interface Window { fbq?: Pixel; rdt?: Pixel; }
}

export default function AdvertisingTracking() {
  const { t, path } = useI18n();
  const choice = useSyncExternalStore(subscribeConsent, getChoice, () => null);
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [redditReady, setRedditReady] = useState(false);

  useEffect(() => {
    if (choice !== "accepted") {
      window.fbq?.("consent", "revoke");
      // Reddit installs its own listeners. Reload on withdrawal so none remain active.
      if (window.rdt) window.location.reload();
      return;
    }
    if (!ready || getChoice() !== "accepted") return;
    window.fbq?.("consent", "grant");
    window.fbq?.("track", "PageView");
  }, [choice, pathname, search, ready]);

  useEffect(() => {
    if (choice === "accepted" && redditReady && getChoice() === "accepted") {
      window.rdt?.("track", "PageVisit");
    }
  }, [choice, pathname, search, redditReady]);

  useEffect(() => {
    if (choice !== "accepted" || (!ready && !redditReady)) return;
    const trackStoreClick = (event: MouseEvent): void => {
      if (event.button > 1 || !(event.target instanceof Element)) return;
      const anchor = event.target.closest("a");
      if (!anchor) return;
      const store = identifyStore(anchor.href);
      if (store && getChoice() === "accepted") {
        if (ready) window.fbq?.("trackCustom", "StoreClick", { store: store.id });
        if (redditReady) window.rdt?.("track", "Custom", { customEventName: "StoreClick", products: [{ id: store.id }] });
      }
    };
    document.addEventListener("click", trackStoreClick);
    document.addEventListener("auxclick", trackStoreClick);
    return () => {
      document.removeEventListener("click", trackStoreClick);
      document.removeEventListener("auxclick", trackStoreClick);
    };
  }, [choice, ready, redditReady]);

  const choose = (value: Exclude<Choice, null>): void => {
    saveChoice(value);
    setSettingsOpen(false);
  };

  return (
    <>
      <CampaignLinks />
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
      {choice === "accepted" && LIVE_HOSTS.has(window.location.hostname) && /^[a-zA-Z0-9_]+$/.test(REDDIT_PIXEL_ID) && (
        <Script id="reddit-pixel" strategy="afterInteractive" onReady={() => setRedditReady(true)}>
          {`!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?
          p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];
          var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js";t.async=true;
          var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
          rdt("init","${REDDIT_PIXEL_ID}");`}
        </Script>
      )}
      {choice === null || settingsOpen ? (
        <section data-cookie-consent aria-label={t("Advertising cookie choices")} className="fixed bottom-3 left-3 right-3 z-[100] mx-auto max-w-xl rounded-md border border-cream/20 bg-steam-navy p-4 text-sm text-cream shadow-lg">
          <p>{t("Allow advertising cookies? We use Meta and Reddit to measure visits and store clicks from our ads. ")}<a href={path("/privacy#website-advertising")} className="underline">{t("Privacy details")}</a></p>
          <div className="mt-3 flex gap-3">
            <button type="button" onClick={() => choose("declined")} className="rounded border border-cream/40 px-4 py-2 hover:bg-cream/10">{t("No thanks")}</button>
            <button type="button" onClick={() => choose("accepted")} className="rounded border border-cream/40 px-4 py-2 hover:bg-cream/10">{t("Allow")}</button>
          </div>
        </section>
      ) : (
        <button type="button" onClick={() => setSettingsOpen(true)} className="fixed bottom-2 left-2 z-[100] rounded bg-steam-navy px-3 py-2 text-xs text-cream/70 underline">{t("Cookie settings")}</button>
      )}
    </>
  );
}
