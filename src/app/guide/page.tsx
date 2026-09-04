import type { Metadata } from "next";
import Link from "next/link";

import { COUNTS, FAMILIES } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "A Beginner's Guide to Jiu Jitsu — Hobbyist Games",
  description:
    "What guard, passing, sweeping and tapping actually mean, and what the ten positions of jiu jitsu feel like from both sides. Written for someone who has never trained.",
  alternates: { canonical: "/guide" },
};

interface Term {
  word: string;
  meaning: string;
}

/** The vocabulary the rest of the page assumes. Nothing below is defined twice. */
const TERMS: Term[] = [
  {
    word: "Position",
    meaning:
      "Where the two of you are relative to each other. Almost everything in jiu jitsu is named after one, and positions are ranked. Some are much better than others.",
  },
  {
    word: "Guard",
    meaning:
      "You are underneath with your legs between you and them. Bottom, but not losing. This is the idea the whole sport is built on.",
  },
  {
    word: "Pass",
    meaning:
      "Getting around someone's legs so you can pin them. The top fighter's job whenever the bottom fighter has guard.",
  },
  {
    word: "Sweep",
    meaning: "Turning the position over from the bottom so that you end up on top.",
  },
  {
    word: "Escape",
    meaning:
      "Getting out from underneath a pin. Not the same as a sweep. A sweep puts you on top. An escape just stops you losing.",
  },
  {
    word: "Submission",
    meaning:
      "A hold on a joint or the neck. Chokes, armlocks, leglocks. Applied slowly enough that the other person can quit.",
  },
  {
    word: "Tap",
    meaning:
      "Two taps on your opponent, or a word, and everything stops. You concede before anything is damaged. A tap ends the match on the spot no matter who was winning.",
  },
];

interface Rung {
  label: string;
  tone: "good" | "neutral" | "bad";
}

/**
 * The positional hierarchy, best to worst for you. This is the single idea a
 * beginner is missing when a match looks like wriggling: the positions are
 * ranked, and both people are climbing the same ladder in opposite directions.
 */
const LADDER: Rung[] = [
  { label: "You have their back", tone: "good" },
  { label: "You are mounted on them", tone: "good" },
  { label: "You have side control", tone: "good" },
  { label: "You are on top in half guard", tone: "good" },
  { label: "Standing, or either side of guard", tone: "neutral" },
  { label: "You are on the bottom in half guard", tone: "bad" },
  { label: "You are under side control", tone: "bad" },
  { label: "You are mounted", tone: "bad" },
  { label: "They have your back", tone: "bad" },
];

interface Mistake {
  who?: string;
  text: string;
}

interface Section {
  /** Matches a position group id in the glossary, so the link cannot rot. */
  family: string;
  name: string;
  what: string[];
  topWants?: string;
  bottomWants?: string;
  feels: string;
  mistakes: Mistake[];
  /** Rendered plainly. Not everything worth saying is a mistake. */
  note?: string;
}

const SECTIONS: Section[] = [
  {
    family: "standing",
    name: "Standing",
    what: [
      "Both of you on your feet. Every match starts here and neither of you has an advantage yet.",
      "Jiu jitsu is fought on the ground, so somebody has to put it there. You can take them down, or you can sit down and pull them into your guard on purpose. Pulling guard is legal and normal. You are giving up the takedown to get the position you want.",
    ],
    feels: "An arm wrestle you do standing up. Your grip and your neck get tired first.",
    mistakes: [
      {
        text: "Standing tall and reaching with straight arms. You get snapped down, or your legs get taken. Bend your knees, keep your elbows in, and make contact on your terms.",
      },
    ],
  },
  {
    family: "guard",
    name: "Guard",
    what: [
      "You are on your back with your legs between you and them. In most sports that is losing. Here it is a fighting position, and about half of jiu jitsu happens in it.",
      "The person on top cannot do much until they get past your legs. So the two jobs are simple and opposite.",
    ],
    topWants: "Get past the legs. That is passing.",
    bottomWants: "Turn it over, or attack a submission. Turning it over is sweeping.",
    feels: "A leg press that fights back. On top you get tired long before anything happens.",
    mistakes: [
      {
        text: "Lying flat with your legs loose. Guard is not lying down. Your knees, feet and hands should all be pushing into them. Flat and passive, you are about to be passed.",
      },
    ],
  },
  {
    family: "half-guard",
    name: "Half Guard",
    what: [
      "Guard with only one of their legs trapped between yours. The pass is half finished and both of you are still in it.",
      "Top is one leg away from side control. Bottom is one leg away from having full guard back.",
    ],
    topWants: "Free that last leg and finish the pass.",
    bottomWants: "Recover the other leg, or come up and sweep.",
    feels: "A stalemate that is quietly moving. Whoever is more comfortable being squashed tends to win it.",
    mistakes: [
      {
        who: "Bottom",
        text: "Lying flat on your back. Get on your side, face them, and get an underhook. Flat and square, you get crossfaced and passed.",
      },
    ],
  },
  {
    family: "side-control",
    name: "Side Control",
    what: [
      "The top fighter has cleared the legs and lies across their opponent's chest, no legs in the way.",
      "This is the first properly dominant position, and the first where the person underneath has nothing to attack with. Their only job is to get out, because the next stop is mount or the back.",
    ],
    topWants: "Stay heavy, then climb to mount or take the back.",
    bottomWants: "Get out. That is the whole list.",
    feels: "Someone has parked a car on your ribs. Breathing becomes the problem before anything else does.",
    mistakes: [
      {
        who: "Bottom",
        text: "Pushing them away with straight arms. That is how you get armbarred, and how you get mounted. Frame with your forearms, get on your side, and work a knee back in.",
      },
      { who: "Top", text: "Staying high and light. Chest down, hips heavy, or they will recover guard." },
    ],
  },
  {
    family: "mount",
    name: "Mount",
    what: [
      "Sitting on their chest with a knee either side.",
      "One of the two best places to be in the sport. Your hands are free and your weight is on them. Neither of those is true for them, so from the bottom anything other than escaping is a wasted moment.",
    ],
    topWants: "Stay on, climb higher, attack the neck and the arms.",
    bottomWants: "Get back to at least half guard.",
    feels: "From underneath, genuinely unpleasant. You are bench pressing someone who is also working on your neck.",
    mistakes: [
      {
        who: "Bottom",
        text: "Pressing them off with straight arms. Straight arms get taken. Keep your elbows tight, bridge hard into them, and shrimp your hips out.",
      },
      { who: "Top", text: "Sitting bolt upright too early, then getting rolled straight over." },
    ],
  },
  {
    family: "back",
    name: "Back",
    what: [
      "Chest against their back, heels hooked inside their thighs, arms wrapped around one shoulder and their neck.",
      "The strongest position in jiu jitsu. They cannot see you, cannot reach you, and their neck is right in front of you.",
    ],
    topWants: "Keep the chest connection and finish the strangle.",
    bottomWants: "Get your back to the floor before the strangle arrives.",
    feels: "From the front, like being chased by something you cannot turn around to face.",
    mistakes: [
      {
        who: "Defending",
        text: "Tucking your chin and waiting it out. That buys you seconds, not the position. Put your back on the mat, slide out over one leg, and fight the arm that is going for your neck rather than the one across your chest.",
      },
      { who: "Attacking", text: "Chasing the choke so hard that your heels slide off their thighs." },
    ],
  },
  {
    family: "turtle",
    name: "Turtle",
    what: [
      "Curled up on your hands and knees with your neck protected.",
      "Not a losing position by itself, and a perfectly sensible place to spend a moment. But it is a waiting room, not somewhere to live. The person on top is hunting for your back or your neck, and staying long enough hands them one.",
    ],
    feels: "Safe. For about five seconds.",
    mistakes: [
      {
        text: "Turtling every time you get in trouble and then staying there. Turtle, then immediately do something: stand up, or roll back to guard.",
      },
    ],
  },
  {
    family: "front-headlock",
    name: "Front Headlock",
    what: [
      "They have your head and one of your arms, from the front. This is usually where a takedown attempt ends up when it does not finish.",
      "It is a narrow window that goes one of two ways: a strangle, or they circle round behind you and take your back.",
    ],
    topWants: "Strangle, or get behind them.",
    bottomWants: "Get your head back to the inside.",
    feels: "Your neck is doing work your neck should not be doing.",
    mistakes: [
      {
        text: "Shooting a takedown with your head down and then staying there to think about it. Head inside, hand on their hip, and move.",
      },
    ],
  },
  {
    family: "single-leg-x",
    name: "Single Leg X",
    what: [
      "A guard built around one of their legs. You are on the ground with your legs wrapped around it while they are still standing.",
      "Two uses. Break their balance and sweep them, or use it as the doorway into leg attacks.",
    ],
    topWants: "Rip the leg out and pass, or stand them up off you.",
    bottomWants: "Off balance them into a sweep, or enter the legs.",
    feels: "Sitting underneath someone and steering them.",
    mistakes: [
      {
        text: "Hanging on with no tension. If you are not off balancing them, you are just holding a leg while they pull it free.",
      },
    ],
  },
  {
    family: "saddle",
    name: "Saddle",
    what: [
      "One of their legs trapped between both of yours with their knee turned inwards. You will also hear it called the 411, the honey hole, or inside sankaku.",
      "One of the strongest attacking positions in the sport and a bad one to be caught in. This is leg lock territory.",
    ],
    topWants: "Attack the leg.",
    bottomWants: "Clear your trapped knee, before anything else.",
    feels: "Completely fine, right up until it is not.",
    mistakes: [
      {
        text: "Spinning the wrong way when you are caught, which finishes the heel hook for them. Get the knee line back first.",
      },
    ],
    note: "Heel hooks are banned in most white belt competition. You will still meet the position in the gym.",
  },
];

const TONE_CLASS: Record<Rung["tone"], string> = {
  good: "bg-steam-gold",
  neutral: "bg-cream/40",
  bad: "bg-[#C8372D]",
};

/** [2, 3, 4] reads as "2, 3 or 4". Joining with commas alone produced a non-sentence. */
function listWithOr(values: number[]): string {
  if (values.length <= 1) return String(values[0] ?? "");
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}

function familyHref(family: string): string | null {
  return FAMILIES.some((f) => f.id === family) ? `/glossary#${family}` : null;
}

export default function GuidePage() {
  return (
    <>
      <header className="bg-steam-navy border-b-2 border-steam-gold/40 px-6 py-4 md:px-12">
        <Link
          href="/"
          className="font-pixel text-pixel-xs tracking-[0.1em] uppercase text-cream/60 hover:text-steam-gold transition-colors"
        >
          ← Back to Hobbyist Games
        </Link>
      </header>

      <main className="bg-pixel-grid min-h-screen px-6 section-rhythm md:px-12">
        <article className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-pixel text-pixel-xs tracking-[0.2em] uppercase text-steam-gold mb-4">
              Beginner&apos;s Guide
            </p>
            <h1 className="font-pixel text-2xl text-cream mb-5">Jiu Jitsu, From Scratch</h1>
            <p className="text-sm text-cream/55">
              No striking, no experience needed. Read this and a match stops looking like two
              people wriggling.
            </p>
          </div>

          <section className="mb-14">
            <p className="text-base text-cream/80 leading-relaxed mb-3">
              Jiu jitsu is a grappling sport. You win by controlling someone until they have to
              quit, or by out positioning them on points if nobody quits.
            </p>
            <p className="text-base text-cream/80 leading-relaxed">
              All of it happens in positions. There are about ten worth knowing. Learn those and
              the rest of the sport hangs off them.
            </p>
          </section>

          {/* Vocabulary */}
          <section className="mb-14">
            <h2 className="font-pixel text-pixel-lg text-steam-gold mb-5">Words you need</h2>
            <dl className="space-y-4">
              {TERMS.map((term) => (
                <div key={term.word}>
                  <dt className="font-pixel text-pixel-sm text-cream mb-1.5 tracking-wide">
                    {term.word}
                  </dt>
                  <dd className="text-sm text-cream/70 leading-relaxed">{term.meaning}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* The ladder */}
          <section className="mb-14">
            <h2 className="font-pixel text-pixel-lg text-steam-gold mb-4">Positions are ranked</h2>
            <p className="text-sm text-cream/70 leading-relaxed mb-6">
              This is the thing that makes a match readable. Every position sits somewhere on one
              ladder, and both people are climbing it in opposite directions. The higher you are,
              the more you can do and the less they can.
            </p>

            <div className="steam-panel p-5 md:p-6">
              <ul className="space-y-0">
                {LADDER.map((rung) => (
                  <li key={rung.label} className="flex items-center gap-3 py-1.5">
                    <span
                      aria-hidden="true"
                      className={`w-1 h-6 rounded-[1px] shrink-0 ${TONE_CLASS[rung.tone]}`}
                    />
                    <span
                      className={`text-sm ${rung.tone === "neutral" ? "text-cream/55 italic" : "text-cream"}`}
                    >
                      {rung.label}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-cream/55 mt-4 pt-4 border-t border-steam-gold/15">
                Best at the top, worst at the bottom. Getting a submission is not the only way to
                win. Climbing is worth points on its own.
              </p>
            </div>
          </section>

          {/* The ten positions */}
          <section className="mb-14">
            <h2 className="font-pixel text-pixel-lg text-steam-gold mb-6">The ten positions</h2>

            <div className="space-y-10">
              {SECTIONS.map((section, index) => {
                const href = familyHref(section.family);
                return (
                  <div key={section.family}>
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="font-mono text-xs text-steam-gold/70 shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-pixel text-pixel-sm text-cream tracking-wide">
                        {section.name}
                      </h3>
                    </div>

                    {section.what.map((para) => (
                      <p key={para} className="text-sm text-cream/70 leading-relaxed mb-3">
                        {para}
                      </p>
                    ))}

                    {(section.topWants || section.bottomWants) && (
                      <div className="grid gap-3 sm:grid-cols-2 my-4">
                        {section.topWants && (
                          <div className="border-l-2 border-steam-gold/40 pl-3">
                            <p className="font-pixel text-pixel-xs uppercase tracking-[0.12em] text-steam-gold mb-1.5">
                              Top wants
                            </p>
                            <p className="text-sm text-cream/70">{section.topWants}</p>
                          </div>
                        )}
                        {section.bottomWants && (
                          <div className="border-l-2 border-steam-gold/40 pl-3">
                            <p className="font-pixel text-pixel-xs uppercase tracking-[0.12em] text-steam-gold mb-1.5">
                              Bottom wants
                            </p>
                            <p className="text-sm text-cream/70">{section.bottomWants}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-sm text-cream/70 leading-relaxed mb-2">
                      <span className="text-cream">Feels like: </span>
                      {section.feels}
                    </p>

                    <div className="space-y-2">
                      {section.mistakes.map((mistake) => (
                        <p key={mistake.text} className="text-sm text-cream/70 leading-relaxed">
                          <span className="text-cream">
                            {mistake.who ? `Common mistake, ${mistake.who.toLowerCase()}: ` : "Common mistake: "}
                          </span>
                          {mistake.text}
                        </p>
                      ))}
                    </div>

                    {section.note && (
                      <p className="text-sm text-cream/55 leading-relaxed mt-2 italic">
                        {section.note}
                      </p>
                    )}

                    {href && (
                      <p className="mt-3">
                        <Link
                          href={href}
                          className="text-xs text-cream/55 underline underline-offset-2 decoration-cream/20 hover:text-steam-gold hover:decoration-steam-gold transition-colors"
                        >
                          {section.name} moves in the glossary →
                        </Link>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* The abstraction layer */}
          <section className="mb-14">
            <h2 className="font-pixel text-pixel-lg text-steam-gold mb-4">
              How the game abstracts all this
            </h2>
            <p className="text-sm text-cream/70 leading-relaxed mb-4">
              Submission Saga is a turn based RPG, not a simulator. It sorts everything you can do
              into four kinds, and those four words are not the ones a gym uses. One of them is
              actively misleading, so it is worth spelling out.
            </p>

            <div className="steam-panel p-5 md:p-6 mb-4">
              <dl className="space-y-4">
                <div>
                  <dt className="font-pixel text-pixel-xs uppercase tracking-[0.12em] text-[#F2685C] mb-1.5">
                    Attack ({COUNTS.byType.Attack})
                  </dt>
                  <dd className="text-sm text-cream/70 leading-relaxed">
                    Not striking. There is no striking in the game at all. Attack means a scoring
                    action: takedowns, sweeps, guard passes. {COUNTS.scoringMoves} of the{" "}
                    {COUNTS.byType.Attack} score, worth {listWithOr(COUNTS.pointValues)} points.
                    The other {COUNTS.byType.Attack - COUNTS.scoringMoves} are entries that put
                    you somewhere better without scoring.
                  </dd>
                </div>
                <div>
                  <dt className="font-pixel text-pixel-xs uppercase tracking-[0.12em] text-[#7EE39A] mb-1.5">
                    Transition ({COUNTS.byType.Transition})
                  </dt>
                  <dd className="text-sm text-cream/70 leading-relaxed">
                    Repositioning. Scores nothing.
                  </dd>
                </div>
                <div>
                  <dt className="font-pixel text-pixel-xs uppercase tracking-[0.12em] text-[#C48CF0] mb-1.5">
                    Submission ({COUNTS.byType.Submission})
                  </dt>
                  <dd className="text-sm text-cream/70 leading-relaxed">
                    A finish. Scores nothing, and ends the match.
                  </dd>
                </div>
                <div>
                  <dt className="font-pixel text-pixel-xs uppercase tracking-[0.12em] text-[#6FC5F2] mb-1.5">
                    Defense ({COUNTS.byType.Defense})
                  </dt>
                  <dd className="text-sm text-cream/70 leading-relaxed">
                    Surviving the turn. Scores nothing, so you cannot win on it alone.
                  </dd>
                </div>
              </dl>
            </div>

            <p className="text-sm text-cream/70 leading-relaxed mb-3">
              Only an Attack scores. The real vocabulary cuts straight across those four. A sweep
              is an Attack, and so is a pass. An escape is usually a Transition. Which lines up
              with competition, where takedowns, sweeps and passes are exactly what a referee
              gives points for.
            </p>
            <p className="text-sm text-cream/70 leading-relaxed">
              A tap still ends it on the spot, whatever the score says.
            </p>
          </section>

          {/* Where to go next */}
          <section className="border-t border-steam-gold/15 pt-8">
            <p className="text-sm text-cream/70 leading-relaxed mb-4">
              Every position and move, with what each one does, is listed in the{" "}
              <Link
                href="/glossary"
                className="text-cream underline underline-offset-2 decoration-cream/30 hover:text-steam-gold hover:decoration-steam-gold transition-colors"
              >
                glossary
              </Link>
              . That is {COUNTS.positions} positions and {COUNTS.uniqueMoves} moves, read straight
              from the game.
            </p>
            <p className="text-sm text-cream/55 leading-relaxed">
              If you want to play with it rather than read about it,{" "}
              <Link
                href="/"
                className="text-cream underline underline-offset-2 decoration-cream/30 hover:text-steam-gold hover:decoration-steam-gold transition-colors"
              >
                Submission Saga
              </Link>{" "}
              is an RPG built on these positions.
            </p>
          </section>

          <div className="mt-12 text-center">
            <Link
              href="/glossary"
              className="font-pixel text-pixel-xs tracking-[0.12em] uppercase text-cream/55 hover:text-steam-gold transition-colors"
            >
              Glossary →
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
