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
 * No prices here. The game hardcodes none either (steam_dlc_data.gd and
 * gold_pack_data.gd explain why), and a price on a button is wrong during
 * every sale and in every other currency.
 */
export const STEAM_APP_ID = "4690760";
export const APP_STORE_ID = "6801609003";

export const STEAM_URL = `https://store.steampowered.com/app/${STEAM_APP_ID}`;
export const APP_STORE_URL = `https://apps.apple.com/app/submission-saga/id${APP_STORE_ID}`;

export interface Store {
  id: "steam" | "app-store";
  /** Set in the pixel face, which the site always uppercases. */
  name: string;
  /**
   * The header's label on a 375px phone, where the full name does not fit.
   * Shown exactly as written, never uppercased, because "IOS" is not a name.
   */
  shortLabel: string;
  /** Spelled the way their owners spell them, and never uppercased either. */
  platforms: readonly [string, string];
  device: "desktop" | "phone";
  href: string;
}

/**
 * Platforms announced but not on sale. Each gets a dashed "coming soon" tile
 * under the store buttons, linked to the mailing list, which is how players
 * hear when it ships. Android has an export preset in the game repo but no
 * store listing yet. On launch day, verify its link the way the two below
 * were, give it an entry in STORES, and take it out of here.
 */
export const COMING_SOON: readonly string[] = ["Android"];

export const STORES: readonly Store[] = [
  {
    id: "steam",
    name: "Steam",
    shortLabel: "STEAM",
    platforms: ["Windows", "macOS"],
    device: "desktop",
    href: STEAM_URL,
  },
  {
    id: "app-store",
    name: "App Store",
    shortLabel: "iOS",
    platforms: ["iPhone", "iPad"],
    device: "phone",
    href: APP_STORE_URL,
  },
];
