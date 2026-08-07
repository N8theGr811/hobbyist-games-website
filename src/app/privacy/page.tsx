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
 * ADDING APPLE OR GOOGLE SIGN-IN (mobile)
 *
 * Update this page in the same change that ships the feature, not after. As of
 * this writing the server has exactly one auth endpoint, /auth/steam, and
 * steam_links is the only identity table, so none of the below is true yet.
 *
 * What actually changes, in order of how much it matters:
 *
 * 1. "What we never ask for" stops being true. Both providers return an email
 *    address. Sign in with Apple returns either the real one or a private
 *    relay address ending @privaterelay.appleid.com, and relay mail still
 *    reaches a real person, so it is personal data either way. Move "No email
 *    address" out of that list and say what is stored and for how long.
 * 2. Google returns a display name and profile picture URL too, depending on
 *    the scopes requested. Only list what is actually requested.
 * 3. "Who else touches your data" gains Apple and Google as recipients.
 * 4. "Deleting your account" needs the new identity rows named, alongside
 *    steam_links, or the deletion description becomes incomplete.
 * 5. The short version at the top says "your Steam ID". Widen it.
 *
 * Two Apple App Store rules that bear on this page: offering any third-party
 * sign-in obliges you to offer Sign in with Apple as well, and the App Privacy
 * label must match what this page says. A mismatch either way is a review
 * problem. In-app account deletion is also required, and already exists.
 * ---------------------------------------------------------------------------
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
      "Your chosen username, and the time you last changed it",
      "Your belt rank, ladder rating, division, and the two numbers the rating system uses to track how certain it is about you",
      "Your match history: who you fought, whether you won, how it ended, and when",
      "What each player did on each turn of a match, which is how we detect cheating",
      "Your daily and weekly reward claim counts",
      "When your account was created, and when you last played a match",
    ],
  },
  {
    label: "What we collect",
    title: "What we never ask for",
    body: [
      "On Steam there is no account signup, so there is nothing to fill in and nothing for us to lose.",
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
      "Nothing that identifies you outside the game is shown to other players. Your Steam ID is not, and if we add other sign-in options later, those will not be either.",
    ],
  },
  {
    label: "Third parties",
    title: "Who else touches your data",
    items: [
      "Valve. When you sign in, we send Steam a ticket from your game to confirm you are who you say you are. Steam sends back your Steam ID",
      "Google Firebase. This issues the token your game uses to prove it is signed in. Firebase only ever receives our internal id, never your Steam ID",
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
      "The link between you and your Steam account is destroyed, so nothing left in our database points back to your Steam identity",
      "Your ladder record is destroyed: belt, rating, division, and last played time",
      "Your reward claim counters are destroyed",
      "Your past matches stay, but your id in them is replaced with an anonymous placeholder, so they no longer point to you",
      "Your username is retained and permanently retired",
    ],
    note: "The username is kept on purpose. Handles appear on leaderboards, and if a retired one could be claimed again, somebody could convincingly impersonate a player who left. Nobody can take your handle after you go, including you. One exception: if an account was banned, we keep its Steam link so the ban cannot be shed by deleting and starting over.",
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
    title: "Players under 13",
    body: [
      "Submission Saga is intended for players aged 13 and over. We do not knowingly collect data from anyone under 13.",
      `If you believe a child under 13 has created an online account, email ${CONTACT} and we will delete it.`,
    ],
  },
  {
    label: "Changes",
    title: "If this policy changes",
    body: [
      "If we change what we collect or who we share it with, we will update this page and change the date at the top. Material changes will also be announced on the game's Steam page.",
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
              Playing on your own sends us nothing. Playing ranked online stores your
              Steam ID, your username, and your fight record, so the ladder works. We
              never see your email, your password, or your payment details. You can
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
