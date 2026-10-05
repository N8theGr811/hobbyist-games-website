import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Hobbyist Games",
  description:
    "What data Submission Saga collects when you play online, who can see it, and how to delete your account.",
  alternates: { canonical: "/privacy" },
};

/** Shown in the header and at the foot of the policy. */
const LAST_UPDATED = "5 October 2026";
const CONTACT = "info@submissionsaga.com";

/**
 * =============================================================================
 * Enabled on 26 September 2026 for the Android build in Google Play internal
 * testing. The provider notes below preserve the original pre-release audit.
 * =============================================================================
 *
 * This replaces the old MOBILE_SIGN_IN_LIVE, which bundled Apple and Google
 * behind one boolean. That was wrong, and dangerously so: Apple shipped and
 * Google did not, so the single flag had no correct position. True published a
 * Google sign-in that does not exist; false denied an Apple one that does.
 * Every provider gets its own flag from here on.
 *
 * The state of play, from the game repo's Scripts/Systems/Online/auth_provider.gd
 * and its Kind enum, which lists STEAM, APPLE, GOOGLE, EMAIL:
 *
 *   Steam   shipped. OS.has_feature("steam_build").
 *   Apple   shipped. OS.has_feature("ios"), via /auth/apple.
 *   Google  BUILT, NOT YET IN PLAYERS' HANDS (2026-09-23). OS.has_feature
 *           ("android"), through the system browser: /auth/google/openid/* on
 *           the PvP server, deployed as version 6d1e1357. No Android build is
 *           on Google Play yet, so this page must not claim it.
 *   Email   EDITOR ONLY, and it must stay that way. AuthProvider.current()
 *           returns EMAIL for OS.has_feature("editor") alone, so no exported
 *           build can reach the form. This is the only thing holding up "No
 *           password" and "No email address" below. If an email/password door
 *           ever opens in a shipped build, both of those lines are false the
 *           day it does.
 *
 * WHEN TO FLIP: in the commit that goes with submitting the first Android
 * build to Google Play for review, since the Play listing links here. Not
 * before, because until then no player can reach Google sign-in.
 *
 * THE THREE CHECKS BELOW WERE ANSWERED ON 2026-09-23, against the server's
 * src/google_oidc.ts and src/index.ts at commit 8c02377. Re-check them only if
 * those files change:
 *
 *   1. Scope is `openid` ALONE (buildGoogleAuthUrl). Google therefore sends
 *      no email address and no name at all, so the older draft of the Google
 *      note, "Google hands over an email address and display name whether
 *      they are wanted or not", was wrong for this build and is rewritten.
 *      The Google account id (`sub`) is stored in provider_links, and for up
 *      to ten minutes in openid_sessions, and nothing else from the token is.
 *   2. Google mints its own uid through uidForProvider("google", sub). There
 *      is no link route, so "accounts are not joined" stays true.
 *   3. Google is in the third-parties list below.
 *
 * The original checklist, kept because it says why each check matters:
 *
 * 1. Which scopes Google is actually asked for. Unlike Apple, Google returns an
 *    email address and display name whether or not they were wanted, so the
 *    question is not what arrives but what is stored. If any column holds
 *    either, "No email address" and "No real name" both have to go.
 * 2. Whether a Google credential mints its own uid, as uidForProvider does for
 *    every provider today. If a link route ever attaches a second provider to
 *    an existing uid, the "accounts are not joined across platforms" note is
 *    false and the deletion wording changes with it.
 * 3. That Google is added to the third-parties list below.
 *
 * Apple requires the App Store privacy label to agree with this page. Check
 * both when either changes.
 *
 * ONE THING THAT WOULD FORCE A REVISION WITH NO FLAG TO FLIP
 *
 * Sending mail. The note under "What we never ask for" argues no address is
 * needed because nothing sends mail. Receipts, notifications, anything that
 * emails a player, breaks that and needs a policy update shipped with it.
 */
const GOOGLE_SIGN_IN_LIVE = true;

interface Section {
  id?: string;
  label: string;
  title: string;
  /** Paragraphs of plain prose. */
  body?: string[];
  /** Bulleted facts. Kept short: one concrete thing per line. */
  items?: string[];
  /** Trailing note, smaller and dimmer. */
  note?: string;
  /**
   * What this section becomes once Google sign-in ships. Spread over the fields
   * above when GOOGLE_SIGN_IN_LIVE is true, so both wordings sit side by side
   * and neither can be edited without the other in view.
   */
  google?: Partial<Omit<Section, "google">>;
}

/**
 * Shared by both wordings: everything after the line naming the sign-in
 * service. Anything added here shows up in both, which is the point — the
 * Google variant overrides the whole items array, so a line added to only one
 * of them would silently vanish when the flag flips.
 */
const ONLINE_RECORD = [
  "Your chosen username, and the time you last changed it",
  "Your belt rank, ladder rating, division, and the two numbers the rating system uses to track how certain it is about you",
  "The highest division you reached at each belt, and the one-time division rewards you have been paid",
  "The result of every ranked match: who you fought, whether you won, how it ended, and when",
  "A separate turn-by-turn log of those same matches, recording what each player played on each turn, which is how we detect cheating. It is deleted after 14 days",
  "When an online match ends early because a connection dropped or the two games disagreed about what happened: the turn, the reason, and which game versions were playing. Connection records are deleted after 30 days; records of the two games disagreeing are kept as match records",
  "The fighter you bring to a match: archetype, stats, stamina, equipped moves, unlocked skills, appearance, cosmetics, active pet and any active buff",
  "Your daily and weekly reward claim counts, and which dated in-game events you collected a reward for",
  "When your account was created, and when you last played a match",
];

/** Hosting and infrastructure, shared so the two lists cannot drift apart. */
const INFRASTRUCTURE = [
  "Cloudflare. This hosts our game server and our database",
  "Vercel. This hosts this website, including the form that takes your email address if you join the mailing list",
];

/**
 * Every claim here was checked on 23 September 2026 against the PvP server's D1
 * migrations 0001 to 0026, against deleteAccount() in src/accounts.ts at
 * commit b11c72a (which added the ladder ledgers, diagnostics and disputes to
 * the cascade; the deletion wording below is only true once that is
 * DEPLOYED), and against the Godot client for the things only a shipped build
 * can prove. The server now has a test that fails when a table naming a
 * player is added without deciding what deletion does with it; when that
 * test changes, this page is the other half of the decision.
 * Nothing is aspirational: if the code does not do it today, it is not written
 * here — which is what GOOGLE_SIGN_IN_LIVE above is for.
 */
const SECTIONS: Section[] = [
  {
    id: "website-advertising",
    label: "Website",
    title: "Advertising cookies",
    body: [
      "If you choose Allow in the website's advertising cookie notice, we load Meta Pixel to measure page visits and clicks on our Steam, App Store and Google Play links. A store click does not tell us whether you installed or purchased the game.",
      "Meta receives these events, the page URL, browser and device information, your IP address and advertising cookie identifiers. Meta can use this information to attribute visits to ads and match activity to Meta accounts. We do not send mailing-list email addresses, game account details or payment information through the Pixel, and automatic advanced matching is disabled.",
      "Advertising tracking stays off until you opt in. You can decline or change your choice through Cookie settings on this website. We remember your choice in this browser and honor Global Privacy Control by keeping advertising tracking off. Withdrawing consent stops future events; it does not remove events already sent to Meta.",
    ],
    note: "This tracking applies to the website only. It is not installed inside the game. Meta handles the data it receives under its own privacy policy at https://www.facebook.com/privacy/policy/.",
  },
  {
    label: "What we collect",
    title: "Only when you play online",
    body: [
      "Single player needs no account and sends us nothing. Everything below applies only once you sign in for online play, which is Steam on the Steam version and Sign in with Apple on iPhone and iPad.",
    ],
    items: [
      "An id from the service you signed in with — your Steam ID, or the identifier Apple issues for this app alone — which we map to an internal id that means nothing outside our server",
      ...ONLINE_RECORD,
    ],
    note: "Accounts are not joined across platforms. Signing in on Steam and on an iPhone gives you two separate accounts, with separate ladder records, and nothing here connects them to each other.",
    google: {
      body: [
        "Single player needs no game account. The online records listed in this section are sent to our server once you sign in, using Steam on the Steam version, Sign in with Apple on iPhone and iPad, or Google on Android. Android billing services can communicate with Google separately, as described below.",
      ],
      items: [
        "An id from the service you signed in with — your Steam ID, or the identifier Apple or Google issues — which we map to an internal id that means nothing outside our server",
        ...ONLINE_RECORD,
      ],
    },
  },
  {
    label: "What we collect",
    title: "Your cloud save",
    body: [
      "Signing in backs your single-player save up to our server, so you can carry it between a computer and a phone. We store it as one opaque string and never look inside it: the game's save format changes often, and a server that understood it would corrupt saves rather than merely fail to read them.",
    ],
    items: [
      "The save itself, stored as text we do not parse, including your Gold balance and the identifiers of purchases already credited to that save",
      "The save format version, so an older build refuses a save it is too old to read",
      "A short summary the game writes for you to read: your belt, your in-game day, your playtime, and a device label",
      "An id for the install that wrote last, so the game can tell you the newer progress came from your other device",
      "Earlier copies of your save, so a bad save can be recovered: the ten most recent, plus the first save you made at each belt. They are erased along with the save",
    ],
    note: "That install id is the one device identifier we hold, and this page used to say we held none. It is generated by the game, it lives in this game's own settings, and it names an installation rather than your phone or your computer. It is not an advertising identifier, nothing outside this game can read it, and no server logic branches on it.",
  },
  {
    label: "What we collect",
    title: "Friends and challenges",
    body: [
      "If you add friends in game, we store the friendship and the requests that led to it. A challenge you send sits on the server for the minute it stays open, and it carries the fighter you are bringing, because the other player's game needs that to build the match.",
    ],
    items: [
      "Who you are friends with",
      "Friend requests you have sent or received, including ones that were declined",
      "Challenges you have sent or received, until they are accepted or expire",
    ],
    note: "A declined request is kept on purpose. There is no player search, so the only people who can reach you are people you have already played or who know your exact username, and a decline that sticks caps each of them at one attempt.",
  },
  {
    label: "What we collect",
    title: "Reporting and blocking",
    body: [
      "You can block another player, and you can report one for an offensive name, for impersonation, or for cheating. Both are stored, and reports are read by a person rather than acted on automatically.",
    ],
    items: [
      "Who you have blocked",
      "Reports you have filed: who, which of the three reasons, and when",
      "Reports other players have filed about you, on the same terms",
    ],
    note: "Deleting your account does not clear either of these in both directions, and the asymmetry is deliberate. It is described under what deletion does not remove, below.",
  },
  {
    label: "What we collect",
    title: "What we never ask for",
    body: [
      "There is no account signup on either platform. Steam signs you in because you are already signed in to Steam, and Sign in with Apple hands us an identifier. There is nothing to fill in, and so nothing for us to lose.",
    ],
    items: [
      "No email address",
      "No password",
      "No real name",
      "No payment information. Valve and Apple handle every purchase and we never see your card, billing address, or anything like it",
      "No location data",
      "No access to your phone's address book. In-game friendships are described above",
    ],
    note: "Sign in with Apple can return your name and your email address, or a private relay address that forwards to it. We request neither scope, so neither ever reaches us. The game has no passwords, sends no mail of any kind, and never handles payment, so an address would have no job to do here.",
    google: {
      body: [
        "There is no account signup on any platform. Steam signs you in because you are already signed in to Steam, Sign in with Apple hands us an identifier, and on Android you pick a Google account in your browser. There is nothing to fill in, and so nothing for us to lose.",
      ],
      items: [
        "No email address",
        "No password",
        "No real name",
        "No payment information. Valve, Apple and Google Play handle every purchase and we never see your card, billing address, or anything like it",
        "No location data",
        "No access to your phone's address book. In-game friendships are described above",
      ],
      note: "Sign in with Apple and Google sign-in can both return your name and your email address. We ask each of them for an account id and nothing else, so neither your name nor your address ever reaches us. The game has no passwords, sends no mail of any kind, and never handles payment, so an address would have no job to do here.",
    },
  },
  {
    label: "Android store services",
    title: "Google Play billing",
    body: [
      "The Android game initializes Google Play Billing when loading or saving progress so it can check for purchases that still need to be credited. This is separate from signing in to the game's online account and can happen even if you do not buy anything.",
      "The billing library can send billing diagnostics to Google, including operation results, error details and a billing-client session identifier. This supports the operation and diagnosis of the billing service. Signing out of online play does not turn this off.",
      "Google Play handles the payment itself. We do not receive your card number or billing address. The game keeps a local purchase record so the same purchase is not credited twice; purchase-claim identifiers are also included in your save and its optional cloud backup.",
    ],
    note: "Deleting your game account removes the game data described below. It does not delete your Google account or Google's separate payment and billing-service records, which Google handles under its own policies.",
  },
  {
    label: "Optional",
    title: "If you want game updates",
    body: [
      "You can give us your email address to hear about the game. That is entirely your choice, it is never required, and it has nothing to do with playing.",
    ],
    items: [
      "It goes to a mailing list on this website, held in Google Firebase, which is a different system from the game server. Your address and your game account are not connected, and cannot be",
      "We use it to tell you about the game and nothing else",
      "Every email has an unsubscribe link, and leaving removes your address",
      "We do not sell it or share it with anyone",
    ],
    note: "This is the only email address we ever hold, and you have to hand it over on purpose. Signing in to play never gives us one.",
  },
  {
    label: "What we collect",
    title: "IP addresses",
    body: [
      "When your game asks our server to sign you in, we read your IP address and use it as a rate-limit key, so those endpoints cannot be hammered by bots. The rate limiter holds it for the length of its window, which is one minute, and then it is gone. It is never written to our database and never attached to your account.",
      "What we will not claim is that no trace of it exists anywhere. Cloudflare, which runs our server, and Google Firebase, which issues your sign-in token, both log IP addresses as part of doing those jobs, the way any host and any login service does. That is their logging under their own policies, and not something we collect, keep, or can read back out.",
    ],
  },
  {
    label: "Visibility",
    title: "What other players can see",
    body: [
      "Ranked play is public by design. Other players can see your username, your belt, your ladder rating and where you sit on the ladder, and the results of matches you have played.",
      "Anyone you have played, and anyone who knows your exact username, can send you a friend request. There is no way to search for a player, so that is the whole of it.",
      "Nothing that identifies you outside the game is shown to other players. Your Steam ID is not, your Apple identifier is not, and your cloud save is visible to nobody but you.",
    ],
    google: {
      body: [
        "Ranked play is public by design. Other players can see your username, your belt, your ladder rating and where you sit on the ladder, and the results of matches you have played.",
        "Anyone you have played, and anyone who knows your exact username, can send you a friend request. There is no way to search for a player, so that is the whole of it.",
        "Nothing that identifies you outside the game is shown to other players. Your Steam ID is not, your Apple or Google identifier is not, and your cloud save is visible to nobody but you.",
      ],
    },
  },
  {
    label: "Third parties",
    title: "Who else touches your data",
    items: [
      "Valve, on the Steam version. We send Steam a ticket from your game to confirm you are who you say you are, and Steam sends back your Steam ID. If you sign in through a browser instead, that exchange holds a short-lived session on our server for ten minutes and then drops it",
      "Apple, on iPhone and iPad. We ask Apple to confirm who you are and receive an identifier unique to this app and meaningless outside it. We request nothing else. We also keep the refresh token Apple issues, for one purpose: Apple requires that deleting your account revokes your tokens with them, and that token is what the revocation call needs",
      "Google Firebase. This issues the token your game uses to prove it is signed in, and separately it holds this website's mailing list. Firebase only ever receives our internal id, never your Steam ID or your Apple identifier",
      ...INFRASTRUCTURE,
    ],
    note: "We do not sell your data or share it with advertisers. The game has no advertising. Online connection diagnostics and Google Play billing diagnostics are described separately above.",
    google: {
      items: [
        "Valve, on the Steam version. We send Steam a ticket from your game to confirm you are who you say you are, and Steam sends back your Steam ID. If you sign in through a browser instead, that exchange holds a short-lived session on our server for ten minutes and then drops it",
        "Apple, on iPhone and iPad. We ask Apple to confirm who you are and receive an identifier unique to this app and meaningless outside it. We request nothing else. We also keep the refresh token Apple issues, for one purpose: Apple requires that deleting your account revokes your tokens with them, and that token is what the revocation call needs",
        "Google, on Android. You sign in with Google in your browser, and our server receives a token carrying an account id and nothing else, because that is all we ask Google for. The exchange holds a short-lived session on our server for up to ten minutes and then drops it",
        "Google Firebase, a separate relationship from Google sign-in above. It issues the token your game uses to prove it is signed in, and separately it holds this website's mailing list. It only ever receives our internal id, never your Steam, Apple or Google one",
        ...INFRASTRUCTURE,
      ],
    },
  },
  {
    label: "Your rights",
    title: "Deleting your account",
    body: [
      "You can delete your online account from inside the game, on the account screen reached from the title menu. It happens immediately, and it is not a request that we review.",
      "This is what deletion actually does, precisely, because it is worth being exact about.",
    ],
    google: {
      body: [
        "You can delete your online account from inside the game, on the account screen reached from the title menu. It happens immediately, and it is not a request that we review.",
        `If you no longer have the game installed, email ${CONTACT} with your username and the platform you play on, and we will delete the account for you, with the same effect as deleting it in game.`,
        "This is what deletion actually does, precisely, because it is worth being exact about.",
      ],
    },
    items: [
      "Your account record is removed, and your username is released — you or anyone else can claim it again",
      "Your ladder record is destroyed: belt, rating, division, last played time, the highest division you reached at each belt, and the division rewards you were paid",
      "Your cloud save is destroyed, along with every earlier copy of it",
      "Your reward claim counters are destroyed, and so is the record of which dated events you collected",
      "Connection records about your matches are destroyed",
      "Your friendships are destroyed, on both sides, along with every friend request and challenge either of you sent the other, declined ones included",
      "Your own block list, and the reports you filed about other people, are destroyed",
      "On iPhone and iPad, your tokens are revoked with Apple first, and then the token we held is destroyed",
      "Your past matches, their turn-by-turn logs and any record of the two games disagreeing stay, but your id in them is replaced with an anonymous placeholder, so they no longer point to you",
    ],
  },
  {
    label: "Your rights",
    title: "What deletion does not remove",
    body: [
      "Two things survive on purpose, and they are worth stating plainly rather than leaving you to find out.",
      "The mapping from your sign-in to an internal id. Your Steam or Apple credential goes on resolving to the same internal id it always did. What deletion removes is the account on that identity, not the identity itself: no handle, no ladder record, no save, no friends, nothing about you is left attached to it. Signing in again puts you on that same empty id rather than a fresh one, and you start over from nothing.",
      "Other people's protection from you. Blocks that other players placed on you stay, because a block is the blocker's protection rather than your data, and it would be worth nothing if deleting your account walked you back through it. Reports other players filed about you stay for the same kind of reason: they are evidence in a queue that counts how many separate people complained, and clearing them would let someone reset their own tally on demand.",
    ],
    google: {
      body: [
        "Two things survive on purpose, and they are worth stating plainly rather than leaving you to find out.",
        "The mapping from your sign-in to an internal id. Your Steam, Apple or Google credential goes on resolving to the same internal id it always did. What deletion removes is the account on that identity, not the identity itself: no handle, no ladder record, no save, no friends, nothing about you is left attached to it. Signing in again puts you on that same empty id rather than a fresh one, and you start over from nothing.",
        "Other people's protection from you. Blocks that other players placed on you stay, because a block is the blocker's protection rather than your data, and it would be worth nothing if deleting your account walked you back through it. Reports other players filed about you stay for the same kind of reason: they are evidence in a queue that counts how many separate people complained, and clearing them would let someone reset their own tally on demand.",
      ],
    },
    note: "Banned accounts differ in one further way. A banned account is kept as a marker instead of being removed, and its username stays retired permanently, so that a ban cannot be shed by deleting the account and signing straight back up.",
  },
  {
    label: "Your rights",
    title: "How long we keep things",
    body: [
      "While your account exists, we keep the data above. Most of it has no automatic expiry, because a ladder rating and a match record are only meaningful as a continuous history.",
      "Three things do expire on their own: the turn-by-turn match log after 14 days, connection records after 30 days, and earlier copies of your save once they are older than the ten most recent, except the first save at each belt.",
      "Deleting your account is the way to end that, and it takes effect straight away.",
    ],
  },
  {
    label: "Age",
    title: "Younger players",
    body: [
      "Submission Saga is intended for players aged 13 and over, and we do not knowingly collect data from anyone younger. Some countries set that age higher, as far as 16, so the limit where you live may not be 13.",
      `If a child under the age that applies where you live has created an online account, email ${CONTACT} and we will delete it.`,
    ],
  },
  {
    label: "Changes",
    title: "If this policy changes",
    body: [
      "If we change what we collect or who we share it with, we will update this page and change the date at the top. Material changes will also be announced wherever you got the game.",
    ],
  },
];

/** The things a player who reads nothing else should still walk away with. */
const SHORT_VERSION = [
  "Single-player gameplay stays on your device unless you sign in for cloud backup. On Android, Google Play Billing can send billing diagnostics to Google even without an online game account.",
  `Signing in for online play stores an id from ${GOOGLE_SIGN_IN_LIVE ? "Steam, Apple or Google" : "Steam or Apple"}, your username, your fighter, your fight record and a backup of your save, so the ladder and your progress work across devices.`,
  "We never see your email, your password, or your payment details.",
  "You can delete your account from inside the game whenever you like.",
].join(" ");

export default function PrivacyPage() {
  return (
    <>
      {/* Header bar, matching /credits */}
      <header className="bg-steam-navy border-b-2 border-steam-gold/40 px-6 py-4 md:px-12">
        <Link
          href="/"
          className="font-pixel text-pixel-xs tracking-[0.1em] uppercase text-cream/60 hover:text-steam-gold transition-colors"
        >
          ← Back to Hobbyist Games
        </Link>
      </header>

      <main className="bg-pixel-grid min-h-screen px-6 section-rhythm md:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Page heading */}
          <div className="text-center mb-16">
            <p className="font-pixel text-pixel-xs tracking-[0.2em] uppercase text-steam-gold mb-4">
              Privacy
            </p>
            <h1 className="font-pixel text-2xl text-cream mb-4">Privacy Policy</h1>
            <p className="text-sm text-cream/55">Last updated {LAST_UPDATED}</p>
          </div>

          <div className="surface-card mb-16 border border-steam-gold/25 bg-steam-navy-2/60 p-6">
            <p className="font-pixel text-pixel-xs uppercase tracking-[0.15em] text-steam-gold mb-3">
              The short version
            </p>
            <p className="text-sm leading-relaxed text-cream/70">{SHORT_VERSION}</p>
          </div>

          <div className="space-y-12">
            {SECTIONS.map((section) => {
              // Keyed on the base title so the key survives the switch.
              const s =
                GOOGLE_SIGN_IN_LIVE && section.google
                  ? { ...section, ...section.google }
                  : section;

              return (
                <section key={section.title} id={s.id}>
                  <p className="font-pixel text-pixel-xs tracking-[0.15em] uppercase text-steam-gold mb-2">
                    {s.label}
                  </p>
                  <h2 className="font-pixel text-sm text-cream mb-4 tracking-wider">
                    {s.title}
                  </h2>

                  {s.body?.map((p) => (
                    <p key={p} className="text-sm leading-relaxed text-cream/70 mb-3">
                      {p}
                    </p>
                  ))}

                  {s.items && (
                    <div className="space-y-1.5 mt-3">
                      {s.items.map((item) => (
                        <div key={item} className="flex items-baseline gap-2">
                          <div className="w-5 h-px bg-steam-gold/40 mt-2 shrink-0" />
                          <span className="text-sm leading-relaxed text-cream/70">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {s.note && (
                    <p className="text-xs text-cream/55 mt-4 leading-relaxed italic">
                      {s.note}
                    </p>
                  )}
                </section>
              );
            })}

            {/* Who we are and how to reach us */}
            <section>
              <p className="font-pixel text-pixel-xs tracking-[0.15em] uppercase text-steam-gold mb-2">
                Contact
              </p>
              <h2 className="font-pixel text-sm text-cream mb-4 tracking-wider">
                Who we are
              </h2>
              <p className="text-sm leading-relaxed text-cream/70 mb-3">
                Submission Saga is made by Hobbyist Games LLC, based in California in
                the United States. That is who is responsible for the data described
                on this page.
              </p>
              <p className="text-sm leading-relaxed text-cream/70">
                For any question or request about your data, email{" "}
                <a
                  href={`mailto:${CONTACT}`}
                  className="text-cream underline underline-offset-2 decoration-cream/20 transition-colors hover:text-steam-gold hover:decoration-steam-gold"
                >
                  {CONTACT}
                </a>
                . Depending on where you live you may have additional rights over your
                data under local law, and you can use that address to exercise them.
              </p>
            </section>
          </div>

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-steam-gold/15 text-center">
            <Link
              href="/"
              className="font-pixel text-pixel-xs tracking-[0.12em] uppercase text-cream/55 hover:text-steam-gold transition-colors"
            >
              ← Back to Hobbyist Games
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
