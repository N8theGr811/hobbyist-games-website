/** One consent choice for the advertising integrations, including cross-tab withdrawal. */
export type Choice = "accepted" | "declined" | null;
export const CONSENT_KEY = "saga-advertising-consent-v2";
export const CAMPAIGN_KEY = "saga-campaign-session";
const CHANGE_EVENT = "saga-advertising-consent-change";
let memoryChoice: Choice = null;

export function getChoice(): Choice {
  if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return "declined";
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "declined") return stored;
    // Keep an old refusal; ask again before sharing with the newly added provider.
    if (localStorage.getItem("saga-advertising-consent") === "declined") return "declined";
  } catch { /* Storage can be unavailable in private browsers. */ }
  return memoryChoice;
}

export function subscribeConsent(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  window.addEventListener("pageshow", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
    window.removeEventListener("pageshow", callback);
  };
}

export function saveChoice(choice: Exclude<Choice, null>): void {
  memoryChoice = choice;
  try { localStorage.setItem(CONSENT_KEY, choice); } catch { /* Use the in-memory choice. */ }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
