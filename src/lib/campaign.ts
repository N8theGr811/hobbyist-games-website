/** Non-personal campaign labels shared by store links and reporting. Never copy click IDs. */
import { STORES, type Store } from "./stores";

export interface Campaign {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
}

const LABEL = /^[a-z0-9][a-z0-9._-]*$/;
function label(value: string | null, max: number): string | undefined {
  return value && value.length <= max && LABEL.test(value) ? value : undefined;
}

/** Campaign names are globally unique across channels and fit Apple's 30-character token. */
export function readCampaign(params: URLSearchParams): Campaign | null {
  const source = label(params.get("utm_source"), 30);
  const medium = label(params.get("utm_medium"), 30);
  const campaign = label(params.get("utm_campaign"), 30);
  if (!source || !medium || !campaign) return null;
  const content = label(params.get("utm_content"), 64);
  return { source, medium, campaign, ...(content ? { content } : {}) };
}

export function campaignParams(campaign: Campaign): URLSearchParams {
  const params = new URLSearchParams({
    utm_source: campaign.source, utm_medium: campaign.medium, utm_campaign: campaign.campaign,
  });
  if (campaign.content) params.set("utm_content", campaign.content);
  return params;
}

export function identifyStore(href: string): Store | undefined {
  let url: URL;
  try { url = new URL(href); } catch { return undefined; }
  return STORES.find((store) => {
    const expected = new URL(store.href);
    return url.origin === expected.origin && url.pathname.replace(/\/$/, "") === expected.pathname &&
      (store.id !== "google-play" || url.searchParams.get("id") === expected.searchParams.get("id"));
  });
}

export function storeCampaignUrl(store: Store, campaign: Campaign | null, appleProvider = ""): string {
  const url = new URL(store.href);
  if (!campaign) return url.href;
  if (store.id === "app-store") {
    // A guessed provider token silently breaks attribution. Leave the working store link intact.
    if (!/^\d+$/.test(appleProvider)) return url.href;
    url.searchParams.set("pt", appleProvider);
    url.searchParams.set("ct", campaign.campaign);
    url.searchParams.set("mt", "8");
  } else {
    const params = campaignParams(campaign);
    params.forEach((value, key) => url.searchParams.set(key, value));
    if (store.id === "google-play") url.searchParams.set("referrer", params.toString());
  }
  return url.href;
}

/** Retain only consented labels for 30 minutes; storage failures never prevent navigation. */
export function resolveCampaign(search: string, consent: boolean, storage: Pick<Storage, "getItem" | "setItem" | "removeItem">,
  key: string, now = Date.now()): Campaign | null {
  const params = new URLSearchParams(search);
  let campaign = readCampaign(params);
  try {
    if (!consent) storage.removeItem(key);
    else if (campaign) storage.setItem(key, JSON.stringify({ query: campaignParams(campaign).toString(), expires: now + 30 * 60 * 1000 }));
    else if ([...params.keys()].some((name) => name.startsWith("utm_"))) storage.removeItem(key);
    else {
      const saved = JSON.parse(storage.getItem(key) ?? "null");
      if (saved && typeof saved.query === "string" && typeof saved.expires === "number" && saved.expires > now) {
        campaign = readCampaign(new URLSearchParams(saved.query));
      } else storage.removeItem(key);
    }
  } catch { /* Current-page labels remain usable even when storage is unavailable. */ }
  return campaign;
}
