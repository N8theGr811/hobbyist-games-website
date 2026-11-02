"use client";

/** Decorate all store links, including header and FAQ, from one campaign definition. */
import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { identifyStore, readCampaign, resolveCampaign, storeCampaignUrl } from "@/lib/campaign";
import { CAMPAIGN_KEY, getChoice, subscribeConsent } from "@/lib/advertising-consent";

// Public pt= value generated in App Store Connect for Submission Saga on 2026-11-02.
const APPLE_PROVIDER = process.env.NEXT_PUBLIC_APPLE_PROVIDER_TOKEN ?? "129278373";

export default function CampaignLinks() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const choice = useSyncExternalStore(subscribeConsent, getChoice, () => null);
  useEffect(() => {
    const decorate = (): void => {
      let campaign = readCampaign(new URLSearchParams(window.location.search));
      try {
        campaign = resolveCampaign(window.location.search, getChoice() === "accepted", sessionStorage, CAMPAIGN_KEY);
      } catch { /* Current-page campaign links still work without browser storage. */ }
      // Global Privacy Control suppresses even aggregate campaign forwarding.
      if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) campaign = null;
      document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
        const store = identifyStore(anchor.href);
        if (store) anchor.href = storeCampaignUrl(store, campaign, APPLE_PROVIDER);
      });
    };
    decorate();
    window.addEventListener("popstate", decorate);
    window.addEventListener("pageshow", decorate);
    return () => {
      window.removeEventListener("popstate", decorate);
      window.removeEventListener("pageshow", decorate);
    };
  }, [pathname, search, choice]);
  return null;
}
