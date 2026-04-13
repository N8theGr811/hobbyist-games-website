// src/components/FeatureHighlights.tsx
// Five feature cards showcasing game mechanics.

const BELT_GOLD = "#E8B339";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

// ─── Inline SVG Icons (48px, Belt Gold stroke) ───

function GrappleIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 20C14 14 20 10 26 14M34 28C34 34 28 38 22 34"
        stroke={BELT_GOLD}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M26 14L30 10M26 14L22 10"
        stroke={BELT_GOLD}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M22 34L18 38M22 34L26 38"
        stroke={BELT_GOLD}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 32C10 22 16 14 24 14C32 14 38 22 38 32"
        stroke={BELT_GOLD}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="32" r="3" fill={BELT_GOLD} />
      <line
        x1="24"
        y1="32"
        x2="18"
        y2="20"
        stroke={BELT_GOLD}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line x1="12" y1="36" x2="36" y2="36" stroke={BELT_GOLD} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="10" height="10" rx="2" stroke={BELT_GOLD} strokeWidth="2.5" />
      <rect x="28" y="10" width="10" height="10" rx="2" stroke={BELT_GOLD} strokeWidth="2.5" />
      <rect x="10" y="28" width="10" height="10" rx="2" stroke={BELT_GOLD} strokeWidth="2.5" />
      <rect x="28" y="28" width="10" height="10" rx="2" stroke={BELT_GOLD} strokeWidth="2.5" fill={BELT_GOLD} fillOpacity="0.2" />
    </svg>
  );
}

function CardSparkleIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="22" height="32" rx="3" stroke={BELT_GOLD} strokeWidth="2.5" />
      <path
        d="M36 12L38 16L42 18L38 20L36 24L34 20L30 18L34 16Z"
        fill={BELT_GOLD}
      />
      <line x1="16" y1="18" x2="26" y2="18" stroke={BELT_GOLD} strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="24" x2="22" y2="24" stroke={BELT_GOLD} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SkillTreeIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="38" r="4" stroke={BELT_GOLD} strokeWidth="2.5" />
      <circle cx="14" cy="24" r="3.5" stroke={BELT_GOLD} strokeWidth="2.5" />
      <circle cx="34" cy="24" r="3.5" stroke={BELT_GOLD} strokeWidth="2.5" />
      <circle cx="10" cy="12" r="3" stroke={BELT_GOLD} strokeWidth="2.5" />
      <circle cx="20" cy="12" r="3" stroke={BELT_GOLD} strokeWidth="2.5" />
      <circle cx="34" cy="12" r="3" stroke={BELT_GOLD} strokeWidth="2.5" />
      <line x1="24" y1="34" x2="14" y2="27.5" stroke={BELT_GOLD} strokeWidth="2" />
      <line x1="24" y1="34" x2="34" y2="27.5" stroke={BELT_GOLD} strokeWidth="2" />
      <line x1="14" y1="20.5" x2="10" y2="15" stroke={BELT_GOLD} strokeWidth="2" />
      <line x1="14" y1="20.5" x2="20" y2="15" stroke={BELT_GOLD} strokeWidth="2" />
      <line x1="34" y1="20.5" x2="34" y2="15" stroke={BELT_GOLD} strokeWidth="2" />
    </svg>
  );
}

// ─── Feature Data ───

const FEATURES: Feature[] = [
  {
    title: "Custom Submission Creator",
    description:
      "Design your own finishing moves. Combine positions, grips, and pressure angles to create signature submissions that only you can execute.",
    icon: <GrappleIcon />,
  },
  {
    title: "Submission Gauge & Timing",
    description:
      "Land the perfect squeeze. An 11-zone oscillating timing gauge tests your precision \u2014 nail the PERFECT zone for maximum damage, or miss and give your opponent a chance to escape.",
    icon: <GaugeIcon />,
  },
  {
    title: "Move & Position Prioritization",
    description:
      "Every position opens different options. Choose between attacks, defenses, transitions, and submissions \u2014 each with real success probabilities based on your stats and your opponent\u2019s weaknesses.",
    icon: <GridIcon />,
  },
  {
    title: "Mystery Move Draws",
    description:
      "Unlock rare techniques as you progress. Mystery draws reward you with new moves from Common to Legendary rarity \u2014 expanding your arsenal with every belt promotion.",
    icon: <CardSparkleIcon />,
  },
  {
    title: "Skill Tree",
    description:
      "Shape your fighter\u2019s growth. Invest in 7 skill categories across 5 tiers to specialize your stats \u2014 become a guard specialist, wrestling powerhouse, or balanced all-rounder.",
    icon: <SkillTreeIcon />,
  },
];

// ─── Component ───

export default function FeatureHighlights() {
  return (
    <section className="relative py-28 px-6 bg-espresso md:px-12">
      {/* Section header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6 font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-belt-gold">
          <span className="w-6 h-px bg-belt-gold/30" />
          Features
          <span className="w-6 h-px bg-belt-gold/30" />
        </div>
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.4rem)] text-cream leading-tight">
          What makes it special
        </h2>
      </div>

      {/* Feature list */}
      <div className="max-w-2xl mx-auto">
        {FEATURES.map((feature, i) => (
          <div key={feature.title}>
            <div className="flex gap-6 items-start py-8">
              {/* Icon */}
              <div className="shrink-0 mt-1">{feature.icon}</div>
              {/* Text */}
              <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-cream mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-cream/50">
                  {feature.description}
                </p>
              </div>
            </div>
            {/* Divider (skip after last) */}
            {i < FEATURES.length - 1 && (
              <div className="h-px bg-cream/10" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
