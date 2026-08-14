import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Hobbyist Games",
  description:
    "What data Submission Saga collects when you play online, who can see it, and how to delete your account.",
};

/** Shown in the header and at the foot of the policy. */
const LAST_UPDATED = "14 August 2026";
const CONTACT = "info@submissionsaga.com";

/**
 * =============================================================================
 * FLIP THIS TO true IN THE SAME COMMIT THAT SHIPS A MOBILE BUILD WITH APPLE OR
 * GOOGLE SIGN-IN, AND BUMP LAST_UPDATED ABOVE IN THAT SAME COMMIT.
 * =============================================================================
 *
 * Every sentence the mobile version needs is already written below, sitting
 * next to the Steam sentence it replaces, on the `mobile` key of each section.
 * There is no branch to find and no second document to remember: the whole
 * switch is this one boolean.
 *
 * It is false because as of 14 August 2026 the server has one auth endpoint,
 * /auth/steam, and one identity table, steam_links. Publishing the mobile
 * wording today would tell players that Apple and Google receive their data
 * and that mobile accounts exist. Describing collection that does not happen
 * is as wrong as omitting collection that does.
 *
 * CONFIRM ALL FOUR AGAINST THE SHIPPED CODE BEFORE FLIPPING:
 *
 * 1. Apple is requested with neither the name nor the email scope, so no
 *    address arrives, not even an @privaterelay.appleid.com relay.
 * 2. No column anywhere stores the Google email address or display name that
 *    arrive in the token. If either is stored, say so below and drop the
 *    "No email address" line.
 * 3. Account linking is still out of scope, so one person on Steam and iOS has
 *    two unconnected accounts. The page says so. If linking ever ships, that
 *    note and the deletion wording both change.
 * 4. The deletion cascade drops every provider row, not only steam_links. A
 *    one-line omission there is invisible until someone audits it.
 *
 * Apple also requires the App Store privacy label to agree with this page, and
 * requires in-app account deletion — see SELF_SERVE_DELETION_LIVE below, which
 * has to be true before a mobile build can pass review at all.
 *
 * TWO THINGS THAT WOULD FORCE ANOTHER REVISION, FLAG OR NO FLAG
 *
 * Sending mail. The "never ask for" note argues no address is needed because
 * nothing sends mail. Adding receipts, notifications or anything else that
 * emails a player breaks that argument and means collecting an address, so it
 * needs a policy update shipped with it, not after. Keeping the claim strong
 * now costs nothing: it is true today and stays true until that changes.
 *
 * Google Play. An Android release needs a Data Safety form, which is separate
 * from Apple's label and worded differently. The page itself would barely
 * change; the form is the work.
 */
const MOBILE_SIGN_IN_LIVE = false;

/**
 * =============================================================================
 * FLIP THIS TO true IN THE SAME COMMIT THAT SHIPS A BUILD CONTAINING THE
 * IN-GAME DELETE ACCOUNT SCREEN, AND BUMP LAST_UPDATED ABOVE.
 * =============================================================================
 *
 * This page promised in-game deletion from the day it went up, and that was
 * wrong. DELETE /account/me has existed on the server since migration 0006 and
 * deleteAccount() in src/accounts.ts does everything described below, but no
 * released build has ever called it. As of 14 August 2026 the client screen,
 * Scripts/UI/account_overlay.gd, is not merely unreleased — it is untracked in
 * git. Its own header says it plainly: "DELETE /account/me has been built and
 * tested on the server since migration 0006, and nothing in the client ever
 * called it."
 *
 * So until that ships, the page describes the route that actually exists: mail
 * to CONTACT, done by hand. Which means CONTACT has to be a working mailbox
 * that somebody reads. It is the stated way to exercise a deletion right, and
 * in several jurisdictions that is an obligation with a clock on it, not a
 * courtesy.
 *
 * Three places read this flag, and all three are wrong if it drifts: the
 * deletion section, the retention section's "how fast", and the short version
 * at the top.
 */
const SELF_SERVE_DELETION_LIVE = false;

interface Section {
  label: string;
  title: string;
  /** Paragraphs of plain prose. */
  body?: string[];
  /** Bulleted facts. Kept short: one concrete thing per line. */
  items?: string[];
  /** Trailing note, smaller and dimmer. */
  note?: string;
  /**
   * What this section becomes once mobile sign-in ships. Spread over the
   * fields above when MOBILE_SIGN_IN_LIVE is true, so both wordings sit side
   * by side and neither can be edited without the other in view.
   */
  mobile?: Partial<Omit<Section, "mobile">>;
}

/**
 * Shared by both wordings: everything after the line naming the sign-in
 * service. Anything added here shows up on Steam and on mobile, which is the
 * point — the mobile variant overrides the whole items array, so a line added
 * to only one of them would silently vanish when the flag flips.
 */
const ONLINE_RECORD = [
  "Your chosen username, and the time you last changed it",
  "Your belt rank, ladder rating, division, and the two numbers the rating system uses to track how certain it is about you",
  "The result of every ranked match: who you fought, whether you won, how it ended, and when",
  "A separate turn-by-turn log of those same matches, recording what each player played on each turn, which is how we detect cheating",
  "The fighter you bring to a match: archetype, stats, stamina, equipped moves, unlocked skills, appearance, cosmetics, active pet and any active buff",
  "Your daily and weekly reward claim counts",
  "When your account was created, and when you last played a match",
];

/** Likewise: only the first line of the deletion list names the sign-in service. */
const DELETION_EFFECTS = [
  "Your ladder record is destroyed: belt, rating, division, and last played time",
  "Your reward claim counters are destroyed",
  "Your friendships are destroyed, on both sides, along with every friend request and challenge either of you sent the other, declined ones included, and any fighter we were holding for a challenge still open",
  "Your past matches stay, but your id in them is replaced with an anonymous placeholder, so they no longer point to you",
  "Your username is retained and permanently retired",
];

/** Hosting, shared by both wordings so the two lists cannot drift apart. */
const INFRASTRUCTURE = [
  "Cloudflare. This hosts our game server and our database",
  "Vercel. This hosts this website, including the form that takes your email address if you join the mailing list",
];

/**
 * Every claim here was checked against the PvP server's D1 migrations, against
 * deleteAccount() in src/accounts.ts, and against the Godot client for the
 * things only a shipped build can prove. Nothing is aspirational: if the code
 * does not do it today, it is not written here — which is what the two flags
 * above are for.
 */
const SECTIONS: Section[] = [
  {
    label: "What we collect",
    title: "Only when you play online",
    body: [
      "Single player needs no account and sends us nothing. Everything below applies only if you play ranked online matches, which signs you in through Steam.",
    ],
    items: [
      "Your Steam ID, which we map to an internal id that means nothing outside our server",
      ...ONLINE_RECORD,
    ],
    mobile: {
      body: [
        "Single player needs no account and sends us nothing. Everything below applies only if you play ranked online matches, which sign you in through Steam on the Steam version, or through Apple or Google on mobile.",
      ],
      items: [
        "An id from whichever service you signed in with, which we map to an internal id that means nothing outside our server",
        ...ONLINE_RECORD,
      ],
      note: "Accounts are not joined across platforms. Playing on Steam and on mobile gives you two separate accounts, with separate ladder records, and we do not connect them to each other.",
    },
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
    note: "A declined request is kept on purpose, and it is the only spam control there is. There is no player search, so the only people who can reach you are people you have already played or who know your exact username, and a decline that sticks caps each of them at one attempt. All of it is destroyed when you delete your account, declined requests included.",
  },
  {
    label: "What we collect",
    title: "What we never ask for",
    body: [
      "On Steam there is no account signup, so there is nothing to fill in and nothing for us to lose. Nothing in this list is collected to play, or held against your account.",
    ],
    items: [
      "No email address",
      "No password",
      "No real name",
      "No payment information. Valve handles every purchase and we never see your card, billing address, or anything like it",
      "No location data",
      "No contacts",
      "No device identifiers",
    ],
    note: "This list describes the Steam version, which is the only version released. If we release on mobile, signing in with Apple or Google would mean we receive an email address, and we will update this page and its date before that happens rather than after.",
    mobile: {
      body: [
        "There is no account signup on any platform, so there is nothing to fill in and nothing for us to lose. Nothing in this list is collected to play, or held against your account.",
      ],
      note: "That holds on mobile too, which is worth spelling out. Sign in with Apple is asked for an identifier and nothing else, so no address reaches us, not even a private relay one. Google hands over an email address and display name whether they are wanted or not: we read the account id, ignore the rest, and store neither. The game has no passwords, sends no mail of any kind, and never handles payment, so an address would have no job to do.",
    },
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
      "When your game asks our server to sign you in, we read your IP address and use it as a rate-limit key, so that one endpoint cannot be hammered by bots. The rate limiter holds it for the length of its window, which is one minute, and then it is gone. It is never written to our database and never attached to your account.",
      "What we will not claim is that no trace of it exists anywhere. Cloudflare, which runs our server, and Google Firebase, which issues your sign-in token, both log IP addresses as part of doing those jobs, the way any host and any login service does. That is their logging under their own policies, and not something we collect, keep, or can read back out.",
    ],
  },
  {
    label: "Visibility",
    title: "What other players can see",
    body: [
      "Ranked play is public by design. Other players can see your username, your belt, your ladder rating and where you sit on the ladder, and the results of matches you have played.",
      "Anyone you have played, and anyone who knows your exact username, can send you a friend request. There is no way to search for a player, so that is the whole of it.",
      "Nothing that identifies you outside the game is shown to other players. Your Steam ID is not, and if we add other sign-in options later, those will not be either.",
    ],
    mobile: {
      body: [
        "Ranked play is public by design. Other players can see your username, your belt, your ladder rating and where you sit on the ladder, and the results of matches you have played.",
        "Anyone you have played, and anyone who knows your exact username, can send you a friend request. There is no way to search for a player, so that is the whole of it.",
        "Nothing that identifies you outside the game is shown to other players. Whichever service you signed in with, that id stays between you and us.",
      ],
    },
  },
  {
    label: "Third parties",
    title: "Who else touches your data",
    items: [
      "Valve. When you sign in, we send Steam a ticket from your game to confirm you are who you say you are. Steam sends back your Steam ID",
      "Google Firebase. This issues the token your game uses to prove it is signed in, and separately it holds this website's mailing list. Firebase only ever receives our internal id, never your Steam ID",
      ...INFRASTRUCTURE,
    ],
    note: "We do not sell your data, and we do not share it with advertisers. There is no advertising or analytics tracking in the game.",
    mobile: {
      items: [
        "Valve, on the Steam version. We send Steam a ticket from your game to confirm you are who you say you are, and Steam sends back your Steam ID",
        "Apple, on mobile. We ask Apple to confirm who you are and receive an identifier that is unique to this app and meaningless outside it. We request nothing else",
        "Google, on mobile, when you choose Google sign-in. We receive a token confirming who you are, read the account id from it, and ignore the rest",
        "Google Firebase, a separate relationship from Google sign-in above. It issues the token your game uses to prove it is signed in, and separately it holds this website's mailing list. It only ever receives our internal id, never your Steam, Apple, or Google one",
        ...INFRASTRUCTURE,
      ],
    },
  },
  {
    label: "Your rights",
    title: "Deleting your account",
    body: [
      SELF_SERVE_DELETION_LIVE
        ? "You can delete your online account from inside the game at any time. It happens immediately, and it is not a request that we review."
        : `To delete your online account, email ${CONTACT} and tell us your in-game username. We hold no email address for your account, so we will ask you to confirm the request from the Steam account it belongs to, and then we run the deletion by hand. It is not a request we review or refuse; the checking is only to be sure the account is yours.`,
      "This is what deletion actually does, precisely, because it is worth being exact about.",
    ],
    items: [
      "The link between you and your Steam account is destroyed, so nothing left in our database points back to your Steam identity",
      ...DELETION_EFFECTS,
    ],
    note: "The username is kept on purpose. Handles appear on leaderboards and in other players' friends lists, and if a retired one could be claimed again, somebody could convincingly impersonate a player who left. Nobody can take your handle after you go, including you.",
    mobile: {
      items: [
        "The sign-in link is destroyed, whichever service it was, so nothing left in our database points back to your Steam, Apple or Google identity",
        ...DELETION_EFFECTS,
      ],
    },
  },
  {
    label: "Your rights",
    title: "One exception, for banned accounts",
    body: [
      "If an account was banned, deleting it does not remove the link to the Steam account it signed in with. Everything else on the list above still happens. That one link stays.",
      "It is there so that a ban cannot be shed by deleting the account and signing straight back up. It is the only thing deletion does not erase, and it applies only to accounts that were banned.",
    ],
    mobile: {
      body: [
        "If an account was banned, deleting it does not remove the link to the service it signed in with. Everything else on the list above still happens. That one link stays.",
        "It is there so that a ban cannot be shed by deleting the account and signing straight back up. It is the only thing deletion does not erase, and it applies only to accounts that were banned.",
      ],
    },
  },
  {
    label: "Your rights",
    title: "How long we keep things",
    body: [
      "While your account exists, we keep the data above. There is no automatic expiry, because a ladder rating and a match record are only meaningful as a continuous history.",
      SELF_SERVE_DELETION_LIVE
        ? "Deleting your account is the way to end that, and it takes effect straight away."
        : "Deleting your account is the way to end that. Once we have confirmed the account is yours, the erasure itself is immediate and cannot be undone.",
    ],
  },
  {
    label: "Age",
    title: "Players under 13",
    body: [
      "Submission Saga is intended for players aged 13 and over. We do not knowingly collect data from anyone under 13.",
      `If you believe a child under 13 has created an online account, email ${CONTACT} and we will delete it.`,
    ],
    // True on Steam today too: some EU states set the digital age of consent as
    // high as 16. Held back only because it is not worth a date bump on its own.
    mobile: {
      title: "Younger players",
      body: [
        "Submission Saga is intended for players aged 13 and over, and we do not knowingly collect data from anyone younger. Some countries set that age higher, as far as 16, so the limit where you live may not be 13.",
        `If a child under the age that applies where you live has created an online account, email ${CONTACT} and we will delete it.`,
      ],
    },
  },
  {
    label: "Changes",
    title: "If this policy changes",
    body: [
      "If we change what we collect or who we share it with, we will update this page and change the date at the top. Material changes will also be announced on the game's Steam page.",
    ],
    mobile: {
      body: [
        "If we change what we collect or who we share it with, we will update this page and change the date at the top. Material changes will also be announced wherever you got the game.",
      ],
    },
  },
];

/** The three things a player who reads nothing else should still walk away with. */
const SHORT_VERSION = [
  "Playing on your own sends us nothing.",
  MOBILE_SIGN_IN_LIVE
    ? "Playing ranked online stores an id from however you signed in, your username, your fighter and your fight record, so the ladder works."
    : "Playing ranked online stores your Steam ID, your username, your fighter and your fight record, so the ladder works.",
  "We never see your email, your password, or your payment details.",
  SELF_SERVE_DELETION_LIVE
    ? "You can delete your account from inside the game whenever you like."
    : `You can have your account deleted whenever you like, by emailing ${CONTACT}.`,
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
              // Keyed on the base title so the key survives the switch, since
              // one section renames itself once mobile ships.
              const s =
                MOBILE_SIGN_IN_LIVE && section.mobile
                  ? { ...section, ...section.mobile }
                  : section;

              return (
                <section key={section.title}>
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
                Submission Saga is made by Nathan Markham, trading as Hobbyist Games,
                based in the United States. That is who is responsible for the data
                described on this page.
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
