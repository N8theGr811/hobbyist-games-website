import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Hobbyist Games",
  description:
    "What data Submission Saga collects when you play online, who can see it, and how to delete your account.",
};

/** Shown in the header and at the foot of the policy. */
const LAST_UPDATED = "6 August 2026";
const CONTACT = "info@submissionsaga.com";

interface Section {
  label: string;
  title: string;
  /** Paragraphs of plain prose. */
  body?: string[];
  /** Bulleted facts. Kept short: one concrete thing per line. */
  items?: string[];
  /** Trailing note, smaller and dimmer. */
  note?: string;
}

/**
 * Every claim here was checked against the PvP server's D1 migrations and
 * against deleteAccount() in src/accounts.ts. Nothing is aspirational: if the
 * code does not do it today, it is not written here.
 *
 * ---------------------------------------------------------------------------
 * DO NOT MERGE UNTIL THE MOBILE BUILD SHIPS WITH THESE PROVIDERS.
 *
 * This page now describes Apple and Google sign-in. As of 7 August 2026 the
 * server has one auth endpoint, /auth/steam, and one identity table,
 * steam_links, so none of it is true yet. Describing collection that does not
 * happen is as wrong as omitting collection that does.
 *
 * Before merging, confirm all four against the shipped code, then set
 * LAST_UPDATED:
 *
 * 1. Apple is requested with neither the name nor the email scope, so no
 *    address arrives, not even an @privaterelay.appleid.com relay.
 * 2. No column anywhere stores the Google email address or display name that
 *    arrive in the token. If either is stored, say so here and drop the
 *    "No email address" line below.
 * 3. Account linking is still out of scope, so one person on Steam and iOS has
 *    two unconnected accounts. The page says so. If linking ever ships, that
 *    note and the deletion wording both change.
 * 4. The deletion cascade drops every provider row, not only steam_links.
 *    A one-line omission there is invisible until someone audits it.
 *
 * Apple also requires the App Store privacy label to agree with this page.
 *
 * TWO THINGS THAT WOULD FORCE ANOTHER REVISION
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
 * ---------------------------------------------------------------------------
 */
const SECTIONS: Section[] = [
  {
    label: "What we collect",
    title: "Only when you play online",
    body: [
      "Single player needs no account and sends us nothing. Everything below applies only if you play ranked online matches, which sign you in through Steam on the Steam version, or through Apple or Google on mobile.",
    ],
    items: [
      "An id from whichever service you signed in with, which we map to an internal id that means nothing outside our server",
      "Your chosen username, and the time you last changed it",
      "Your belt rank, ladder rating, division, and the two numbers the rating system uses to track how certain it is about you",
      "Your match history: who you fought, whether you won, how it ended, and when",
      "What each player did on each turn of a match, which is how we detect cheating",
      "Your daily and weekly reward claim counts",
      "When your account was created, and when you last played a match",
    ],
    note: "Accounts are not joined across platforms. Playing on Steam and on mobile gives you two separate accounts, with separate ladder records, and we do not connect them to each other.",
  },
  {
    label: "What we collect",
    title: "What we never ask for",
    body: [
      "There is no account signup on any platform, so there is nothing to fill in and nothing for us to lose.",
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
    note: "That holds on mobile too, which is worth spelling out. Sign in with Apple is asked for an identifier and nothing else, so no address reaches us, not even a private relay one. Google hands over an email address and display name whether they are wanted or not: we read the account id, ignore the rest, and store neither. The game has no passwords, sends no mail of any kind, and never handles payment, so an address would have no job to do.",
  },
  {
    label: "What we collect",
    title: "IP addresses",
    body: [
      "When your game asks our server to sign you in, we read your IP address to stop that one endpoint being hammered by bots. It is used for that check and then discarded. It is never written to our database, and it is not linked to your account.",
    ],
  },
  {
    label: "Visibility",
    title: "What other players can see",
    body: [
      "Ranked play is public by design. Other players can see your username, your belt, your ladder rating and where you sit on the ladder, and the results of matches you have played.",
      "Nothing that identifies you outside the game is shown to other players. Whichever service you signed in with, that id stays between you and us.",
    ],
  },
  {
    label: "Third parties",
    title: "Who else touches your data",
    items: [
      "Valve, on the Steam version. We send Steam a ticket from your game to confirm you are who you say you are, and Steam sends back your Steam ID",
      "Apple, on mobile. We ask Apple to confirm who you are and receive an identifier that is unique to this app and meaningless outside it. We request nothing else",
      "Google, on mobile, when you choose Google sign-in. We receive a token confirming who you are, read the account id from it, and ignore the rest",
      "Google Firebase, a separate relationship from Google sign-in above. It issues the token your game uses to prove it is signed in, and only ever receives our internal id, never your Steam, Apple, or Google one",
      "Cloudflare. This hosts our game server and our database",
    ],
    note: "We do not sell your data, and we do not share it with advertisers. There is no advertising or analytics tracking in the game.",
  },
  {
    label: "Your rights",
    title: "Deleting your account",
    body: [
      "You can delete your online account from inside the game at any time. It happens immediately, and it is not a request that we review.",
      "This is what deletion actually does, precisely, because it is worth being exact about.",
    ],
    items: [
      "The sign-in link is destroyed, whichever service it was, so nothing left in our database points back to your Steam, Apple or Google identity",
      "Your ladder record is destroyed: belt, rating, division, and last played time",
      "Your reward claim counters are destroyed",
      "Your past matches stay, but your id in them is replaced with an anonymous placeholder, so they no longer point to you",
      "Your username is retained and permanently retired",
    ],
    note: "The username is kept on purpose. Handles appear on leaderboards, and if a retired one could be claimed again, somebody could convincingly impersonate a player who left. Nobody can take your handle after you go, including you. One exception: if an account was banned, we keep its sign-in link so the ban cannot be shed by deleting and starting over.",
  },
  {
    label: "Your rights",
    title: "How long we keep things",
    body: [
      "While your account exists, we keep the data above. There is no automatic expiry, because a ladder rating and a match record are only meaningful as a continuous history.",
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

          {/* The short version, so a player who reads nothing else still knows
              the three things that matter most. */}
          <div className="surface-card mb-16 border border-steam-gold/25 bg-steam-navy-2/60 p-6">
            <p className="font-pixel text-pixel-xs uppercase tracking-[0.15em] text-steam-gold mb-3">
              The short version
            </p>
            <p className="text-sm leading-relaxed text-cream/70">
              Playing on your own sends us nothing. Playing ranked online stores an id
              from however you signed in, your username, and your fight record, so the
              ladder works. We never see your email, your password, or your payment
              details. You can
              delete your account from inside the game whenever you like.
            </p>
          </div>

          <div className="space-y-12">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <p className="font-pixel text-pixel-xs tracking-[0.15em] uppercase text-steam-gold mb-2">
                  {section.label}
                </p>
                <h2 className="font-pixel text-sm text-cream mb-4 tracking-wider">
                  {section.title}
                </h2>

                {section.body?.map((p) => (
                  <p key={p} className="text-sm leading-relaxed text-cream/70 mb-3">
                    {p}
                  </p>
                ))}

                {section.items && (
                  <div className="space-y-1.5 mt-3">
                    {section.items.map((item) => (
                      <div key={item} className="flex items-baseline gap-2">
                        <div className="w-5 h-px bg-steam-gold/40 mt-2 shrink-0" />
                        <span className="text-sm leading-relaxed text-cream/70">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {section.note && (
                  <p className="text-xs text-cream/55 mt-4 leading-relaxed italic">
                    {section.note}
                  </p>
                )}
              </section>
            ))}

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
