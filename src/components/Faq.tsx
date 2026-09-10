import Link from "next/link";
import Watermark from "./Watermark";

/**
 * The questions a visitor actually arrives with, answered short.
 *
 * Every factual claim here was read out of the game repo rather than
 * remembered, and the ones worth naming because they are easy to get wrong:
 *
 * - 92 moves across 19 positions, counted from src/lib/glossary.json, which the
 *   exporter generates from combat_data.gd and move_tree_data.gd. Say "over 90"
 *   rather than the exact number so a balance pass cannot date this page.
 * - The seven ranked divisions and their order come from
 *   Scripts/Systems/Online/division_data.gd. No rating numbers appear here for
 *   the same reason they do not appear in that file: the server owns every
 *   band and rewrites the top three hourly, so any number written down is a
 *   second copy that can silently disagree with the live one.
 * - Single player needing no account is the same claim the privacy policy
 *   makes. If one changes, both change.
 * - The pack-exclusive kit caveat is real and deliberately stated. Nine
 *   cosmetics carry `steam_dlc_only` in GoldCosmeticData, which keeps them out
 *   of the Pro Shop on Steam. Saying "everything is earnable" without that
 *   sentence would be false for exactly those nine.
 *
 * Answers are ReactNode, not string, so the one link this section carries can
 * live inline in the copy instead of in the markup below.
 */
interface Faq {
  q: string;
  a: React.ReactNode;
}

const FAQS: Faq[] = [
  {
    q: "What kind of game is this?",
    a: "An RPG built on jiu jitsu. You make a fighter, train, explore the region, and work your way up from white belt.",
  },
  {
    q: "Do I need to know jiu jitsu to play?",
    a: (
      <>
        No. If you have never trained, start with the{" "}
        <Link
          href="/guide"
          className="text-steam-gold underline underline-offset-4 decoration-steam-gold/40 hover:decoration-steam-gold transition-colors"
        >
          beginner&rsquo;s guide
        </Link>
        . It covers the positions and the handful of terms the game uses. If you
        already train, you will read a position faster than a new player.
      </>
    ),
  },
  {
    q: "What does it cost, and where can I get it?",
    a: "$9.99 on Steam, for Windows and macOS. $9.99 on the App Store, for iPhone and iPad. Both on September 17, 2026.",
  },
  {
    q: "Is the fighting turn-based?",
    a: "Yes, with one exception. Both fighters choose at the same time and the turn resolves at once, so you are reading your opponent as much as picking your own move. When a submission lands, a timing gauge appears and you play that in real time: hit the sweet spot to finish it, or to escape if you are the one caught.",
  },
  {
    q: "Are the techniques real?",
    a: "Over 90 of them, across 19 positions, and they relate to each other the way they do on the mat. Many of the ideas are optimized for a game format and might differ a bit from the exact real life jiu jitsu situations. It is as close to real jiu jitsu as I could make it while maintaining a fun and playable game.",
  },
  {
    q: "Is there online play?",
    a: "Ranked matches run through seven divisions: Blue, Purple, Brown and Black, then Gold, Diamond and Champion above them. The first four are named after belts. The last three are not belts, they are ladder positions you hold for as long as your rating holds up. You bring one character online, and your rating, division, record and match history are kept on the server rather than in your save. A new account calibrates for its first few matches before it is placed.",
  },
  {
    q: "Can I move my Steam save to my phone?",
    a: "No. Signing in backs your progress up to the account you signed in with, and a Steam account and an Apple account are two separate accounts with no way to join them. A backup made on one cannot be restored by the other. If you want to play on both, plan on two characters.",
  },
  {
    q: "Do I need an account or an internet connection?",
    a: "Not for the single-player game. It needs no account and sends us nothing. You sign in only when you go online, which is Steam on the Steam version and Sign in with Apple on iPhone and iPad.",
  },
  {
    q: "Are there microtransactions?",
    a: "Steam has three cosmetic DLC packs, and on iPhone and iPad you can buy Gold, which is the currency the Pro Shop runs on. Neither one touches a fight. Gold is also paid out by belt promotions and trophies, so anything the Pro Shop sells can be earned instead of bought. The exception is each pack's exclusive kit, which on Steam is only in the pack.",
  },
  {
    q: "Who made it?",
    a: "Nate Markham, under Hobbyist Games.",
  },
];

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="relative isolate section-rhythm px-6 bg-pixel-grid overflow-hidden border-y border-steam-gold/20"
    >
      <Watermark name="granbyroll" className="-left-24 top-32 h-[340px] w-[480px]" />
      <Watermark name="uchimata" className="-right-24 bottom-24 h-[340px] w-[460px]" />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-6 font-pixel text-pixel-xs tracking-[0.2em] uppercase text-steam-gold">
            <span className="w-6 h-px bg-steam-gold/40" />
            Questions
            <span className="w-6 h-px bg-steam-gold/40" />
          </div>
          <h2 className="font-pixel text-pixel-lg text-cream leading-tight tracking-wide">
            Before You Roll
          </h2>
        </div>

        {/* Questions are set in the body face, not Press Start 2P. The pixel
            font carries a one-word pillar title, but a full sentence of it at
            13px is genuinely hard to read, and there are ten of them here.
            Weight and colour do the separating instead. */}
        <dl className="space-y-10">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="border-t border-steam-gold/15 pt-8 first:border-t-0 first:pt-0">
              <dt className="text-base sm:text-lg font-semibold text-cream mb-3 leading-snug">
                {q}
              </dt>
              <dd className="text-base text-cream/55 leading-relaxed">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
