/**
 * Where the game is sold. Every store link on the site reads from here.
 *
 * Both ids were checked against the live stores on 2026-09-18 rather than
 * copied from a draft (the launch-day email still carries an [APP_STORE_URL]
 * placeholder):
 *
 * - Steam 4690760 is steam_appid.txt in the game repo. Steam's appdetails API
 *   reports it released on Sep 17, 2026, for Windows and macOS.
 * - App Store 6801609003 is what Apple's lookup API returns for the iOS export
 *   preset's bundle id, com.hobbyistgames.submissionsaga. Its device list
 *   covers iPhone and iPad.
 *
 * The App Store URL has no country segment on purpose. Without one, Apple
 * sends each visitor to their own storefront instead of the US one.
 *
 * Google Play was verified publicly available on 2026-10-01 at $9.99 US.
 * Its package matches the Android release preset; omit region parameters.
 *
 * No prices here. The game hardcodes none either (steam_dlc_data.gd and
 * gold_pack_data.gd explain why), and a price on a button is wrong during
 * every sale and in every other currency.
 */
export const STEAM_APP_ID = "4690760";
export const APP_STORE_ID = "6801609003";

export const STEAM_URL = `https://store.steampowered.com/app/${STEAM_APP_ID}`;
export const APP_STORE_URL = `https://apps.apple.com/app/submission-saga/id${APP_STORE_ID}`;

export const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.hobbyistgames.submissionsaga";

export interface Store {
  id: "steam" | "app-store" | "google-play";
  /** Set in the pixel face, which the site always uppercases. */
  name: string;
  /**
   * The header's compact label on tablets, where the full name does not fit.
   * Shown exactly as written, never uppercased, because "IOS" is not a name.
   */
  shortLabel: string;
  /** Spelled the way their owners spell them, and never uppercased either. */
  platforms: readonly [string, string?];
  device: "desktop" | "phone";
  href: string;
}

export const STORES: readonly Store[] = [
  {
    id: "app-store",
    name: "App Store",
    shortLabel: "iOS",
    platforms: ["iPhone", "iPad"],
    device: "phone",
    href: APP_STORE_URL,
  },
  {
    id: "google-play",
    name: "Google Play",
    shortLabel: "Android",
    platforms: ["Android"],
    device: "phone",
    href: GOOGLE_PLAY_URL,
  },
  {
    id: "steam",
    name: "Steam",
    shortLabel: "STEAM",
    platforms: ["Windows", "macOS"],
    device: "desktop",
    href: STEAM_URL,
  },
];
