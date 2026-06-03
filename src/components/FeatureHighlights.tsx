import StatIcon, { type StatName } from "./StatIcon";
import BeltStrip from "./BeltStrip";

interface Feature {
  title: string;
  description: string;
  /** Icon — either a game stat icon name or a custom emoji char */
  iconKind: "stat" | "emoji";
  iconValue: StatName | string;
}

const FEATURES: Feature[] = [
  {
    title: "Custom Submission Creator",
    description:
      "Create your own signature submission. Choose the position it's performed from, name it, and write its description — then use it in combat as a unique finishing move only you have.",
    iconKind: "stat",
    iconValue: "submissions",
  },
  {
    title: "Submission Gauge & Timing",
    description:
      "Land the perfect squeeze. An 11-zone oscillating timing gauge tests your precision — nail the PERFECT zone for maximum damage, or miss and give your opponent a chance to escape.",
    iconKind: "emoji",
    iconValue: "🎯",
  },
  {
    title: "Move & Position Prioritization",
    description:
      "Every position opens different options. Choose between attacks, defenses, transitions, and submissions — each with real success probabilities based on your stats and your opponent’s weaknesses.",
    iconKind: "stat",
    iconValue: "guard",
  },
  {
    title: "Mystery Move Draws",
    description:
      "Unlock rare techniques as you progress. Mystery draws reward you with new moves from Common to Legendary rarity — expanding your arsenal with every belt promotion.",
    iconKind: "emoji",
    iconValue: "🎴",
  },
  {
    title: "Skill Tree",
    description:
      "Shape your fighter’s growth. Invest in 7 skill categories across 5 tiers to specialize your stats — become a guard specialist, wrestling powerhouse, or balanced all-rounder.",
    iconKind: "stat",
    iconValue: "strength",
  },
  {
    title: "Adopt a Pet Companion",
    description:
      "Adopt a pet that follows you on your journey. Choose from a loyal shiba, a curious cat, or a polar bear — each one joins you in the overworld and cheers you on during combat.",
    iconKind: "emoji",
    iconValue: "🐾",
  },
  {
    title: "Own & Upgrade Businesses",
    description:
      "Build your empire off the mats. Purchase and upgrade businesses across the city — earn passive income, unlock new opportunities, and fund your path to the championship.",
    iconKind: "emoji",
    iconValue: "🏢",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="relative py-16 px-6 bg-pixel-grid md:px-12 border-y border-steam-gold/20">
      {/* Section header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6 font-pixel text-[0.6rem] tracking-[0.2em] uppercase text-steam-gold">
          <span className="w-6 h-px bg-steam-gold/40" />
          Features
          <span className="w-6 h-px bg-steam-gold/40" />
        </div>
        <h2 className="font-pixel text-[clamp(1.1rem,2.6vw,1.7rem)] text-cream leading-tight tracking-wide">
          What Makes It Special
        </h2>
        <div className="mt-6 mx-auto max-w-[200px]">
          <BeltStrip height={8} />
        </div>
      </div>

      {/* Feature grid */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex gap-4 items-start p-5 rounded-md border border-steam-gold/15 bg-steam-navy-2/60 backdrop-blur-sm transition-colors hover:border-steam-gold/40"
            style={{ boxShadow: "inset 0 1px 0 rgba(232,194,92,0.06)" }}
          >
            {/* Icon */}
            <div
              className="shrink-0 flex items-center justify-center rounded-md border border-steam-gold/20 bg-steam-navy-3"
              style={{ width: 56, height: 56 }}
            >
              {feature.iconKind === "stat" ? (
                <StatIcon name={feature.iconValue as StatName} size={36} />
              ) : (
                <span className="text-2xl">{feature.iconValue}</span>
              )}
            </div>
            {/* Text */}
            <div>
              <h3 className="font-pixel text-[0.65rem] uppercase tracking-widest text-steam-gold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-cream/60">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
