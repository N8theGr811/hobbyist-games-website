# Combat Demo & Feature Highlights — Design Spec

## Overview

Two new sections for the Hobbyist Games landing page:

1. **Interactive Combat Demo** — a full port of the game's turn-based BJJ combat engine to TypeScript/React, playable inline on the landing page. Replaces the current Preview section.
2. **Feature Highlights** — 5 feature cards with stylized icons showcasing game systems.

## Page Flow (updated)

1. Header
2. Hero (Jiu-Jitsu RPG title, Coming Soon)
3. **Combat Demo** — "Try the Combat" *(replaces Preview)*
4. **Feature Highlights** — 5 game feature cards
5. Trailer video
6. The Game (3 pillars)
7. Email Signup
8. Footer

---

## Part 1: Combat Demo

### Combat Engine (TypeScript)

A pure state-machine port of the game's combat system in `src/lib/combat/`. No React dependencies — just TypeScript logic that can be tested independently.

#### Positions (19, gap at enum value 1)

All 19 positions with dominance values, position pairs, and available moves per position. Exact values from `CombatData.POSITIONS` in the game.

| Position | Dominance | Pair |
|----------|-----------|------|
| Standing | 5 | — |
| Guard Top | 6 | Guard Bottom |
| Guard Bottom | 5 | Guard Top |
| Half Guard Top | 6 | Half Guard Bottom |
| Half Guard Bottom | 4 | Half Guard Top |
| Side Control Top | 8 | Side Control Bottom |
| Side Control Bottom | 2 | Side Control Top |
| Mount Top | 9 | Mount Bottom |
| Mount Bottom | 1 | Mount Top |
| Back Control | 10 | Back Exposed |
| Back Exposed | 0 | Back Control |
| Turtle Top | 7 | Turtle Bottom |
| Turtle Bottom | 3 | Turtle Top |
| Front Headlock Attack | 7 | Front Headlock Defend |
| Front Headlock Defend | 3 | Front Headlock Attack |
| Single Leg X Offense | 6 | Single Leg X Defense |
| Single Leg X Defense | 4 | Single Leg X Offense |
| Saddle Offense | 7 | Saddle Defense |
| Saddle Defense | 3 | Saddle Offense |

#### Move Types & Interaction Table

4 move types: ATK, DEF, TRN, SUB

Interaction table (10 interaction types):

|  | ATK | DEF | TRN | SUB |
|---|---|---|---|---|
| ATK | SCRAMBLE | CONTESTED | SCRAMBLE | SCRAMBLE |
| DEF | COUNTER | STALL | REPOSITION | SUB_DEFENDED |
| TRN | CAUGHT_TRANSITIONING | REPOSITION | POSITIONAL_SCRAMBLE | CAUGHT_TRANSITIONING |
| SUB | SUB_GAMBLE | SUB_DEFENDED | SUB_GAMBLE | DOUBLE_SUB |

Each interaction type has: attacker_mod, defender_mod, sub_chance_mod, auto_punish, counter_bonus, stamina_recovery.

#### Move Resolution

- Stat-based success probability (same formula as game)
- Stamina costs: SUB 16, ATK 10, DEF/TRN 5
- Points scoring: matches real BJJ rules
- Advantage pips: 0-5, chain moves at 3+ pips (cost 2 pips)

#### Submission Timing Gauge

Port the full 11-zone oscillating gauge:
- Zones: MISS, POOR, OK, GOOD, GREAT, PERFECT (symmetric layout)
- Needle sweeps left-to-right, bounces back, speed ramps 0.85x each bounce
- Max 4 bounces
- PERFECT zone pulses (alpha 0.35-0.6)
- Player clicks to stop needle
- Result: zone determines submission success modifier (+25% for PERFECT)

#### AI Opponent

- Purple belt intelligence: 0.60
- Weighted random move selection with stat awareness
- Avoids suicide moves, prefers advantageous positions
- Fixed stats within purple belt range (50-75)

#### Fighters

**Player ("You"):**
- Purple belt, stats: guard 68, passing 65, submissions 72, escapes 60, wrestling 67, cardio 65, strength 62, leg_entanglements 55
- ~25 moves including 2-3 legendary rarity moves across all 19 positions

**Opponent ("Carlos"):**
- Purple belt, stats: guard 62, passing 70, submissions 60, escapes 66, wrestling 72, cardio 68, strength 70, leg_entanglements 50
- ~20 moves, no legendary, more wrestling/pressure focused

**Match:** 14 turns (purple belt tournament length), starting at Standing.

#### Sprites

Two spritesheets in `public/media/Player Sprites/`:
- `Purple1_Website_Sprite.png` — Player character
- `Purple2_Website_Sprite.png` — Opponent character

Spritesheet: 832×3456px, 64×64 frames (13 columns × 54 rows).
Front idle animation: row 24 (y=1536), columns 0-1, 2 frames at 5fps.

Render at 4× scale (256×256) with `image-rendering: pixelated`.

---

### Combat UI (React Components)

The visual layer, built as React components that consume the combat engine state.

#### Visual Theme — Dark Industrial with Neon Accents

Match the game's aesthetic exactly. The combat demo section uses a dark background — NOT the cream page background. This is a self-contained dark UI that feels like the actual game.

**Core palette:**
```
Panel backgrounds:
  Dark panel:      #1A1F32 (primary surface)
  HUD panel:       #141424 (secondary surface)
  Gauge BG:        #0D0D1A (deepest)
  Button BG:       #1A1F32 (normal)
  Button hover:    #242C42
  Button pressed:  #141A28

Borders:
  Gold:            #C0A040
  Secondary:       #404073
  Muted:           #4D4D4D

Text:
  Title gold:      #F2CC40
  Body:            #DDE0EB
  Button text:     #F2E6BF
  Secondary:       #9FAA7D

Fighter accents:
  Player (blue):   #61A5FA
  Opponent (red):  #F77171

Feedback:
  Success (green): #4ADF80
  Fail (orange):   #FB9238
  Momentum (gold): #FFC00A

Move type colors:
  Attack:          #D93333 (red neon)
  Defense:         #408CE0 (blue neon)
  Transition:      (use secondary blue)
  Submission:      #BF8CFF (purple)

Stamina:
  Fill (green):    #4CBE5C
  Bar BG:          #262832
  Low pulse:       #FF9999

Dominance scale (5 levels):
  Green:           #178642
  Yellow-green:    #66A40D
  Amber:           #CA8902
  Orange:          #EB5909
  Red:             #DB2626
```

#### Layout Sections

**Pre-match state:**
- Dark panel with heading: "Think you can hang at purple belt?"
- Brief rules summary (3 bullet points)
- "Start Match" button (gold accent, styled like game buttons)
- Player and opponent sprites visible, facing each other

**In-match layout (top to bottom):**

1. **Scoreboard bar** — full width, darkest BG
   - Left: Player name + "Purple Belt" badge (blue tint player glow)
   - Center: Turn counter ("Turn 3/14") with gold title color, pulses on final turns
   - Right: Opponent name + "Purple Belt" badge (red tint opponent glow)
   - Score for each side with glow behind numbers

2. **Stamina bars** — below scoreboard
   - Player bar left, opponent bar right
   - Green fill (#4CBE5C), dark BG (#262832)
   - Smooth tween on drain (0.4s ease-out)
   - Low stamina: hurt pulse effect (red tint, 0.5-0.8s cycle)

3. **Advantage pips** — row of 5 dots per fighter
   - Filled = active (gold #FFC00A), empty = border only
   - At max pips: gold aura glow behind sprite (radial gradient, 0.15 alpha)

4. **Position display** — center, prominent
   - Current position name in large text
   - Dominance spectrum bar below (5px, colored by dominance level)
   - "Stadium sign" styling: border top/bottom only, no left/right

5. **Fighter area** — sprites with pixel art rendering
   - Player left, opponent right (mirrored)
   - 256×256 rendered size
   - Front idle animation (2 frames, 5fps)
   - Dominance aura when at max advantage pips
   - Hurt pulse tint when stamina ≤ 30%

6. **Move selection** — bottom panel
   - Available moves for current position
   - Each move button shows: name, type badge (colored), success % 
   - Legendary moves: gold border accent
   - Move type color on bottom border (2px accent)
   - Button styling: dark BG, thick bottom border, 3px corner radius
   - Hover: lighten BG + border
   - Press animation: scale 0.93→1.0 with brightness flash

7. **Turn timer** — visual countdown bar (10 seconds per turn)
   - Gold fill that drains left-to-right
   - Final 3 seconds: pulsing red

**Turn resolution overlay:**
- Dim background (0.5 alpha black)
- Show both moves chosen
- Pulsing dots animation while "resolving" (2.3s sequence)
- Interaction type result popup (e.g. "COUNTER!" in feedback color)
- Pop-in animation: scale 1.5→1.0, 0.15s, ease-out back
- Position change shown, points awarded, stamina changes

**Submission gauge overlay:**
- Full cinematic sequence from the game:
  1. DIM phase (0.3s): darken screen, dim other elements
  2. STRUGGLE phase (0.75-1.5s): sprites oscillate ±2px, escape % label pops in
  3. FREEZE (0.15s): snap sprites back, brief stillness
  4. GAUGE appears: pill-shaped bar, neon accent lines, hash marks
     - 11 zones with correct alpha values
     - PERFECT zone pulses (0.35-0.6 alpha, 1s cycle)
     - Perfect zone borders: 2px lines with inner 4px glow
     - White needle (3px × 32px) with 9px semi-transparent halo
     - Neon accent line below gauge (red for attack, blue for defend, 2px)
     - Hash tick marks between zones
  5. SQUEEZE/FIGHT IT button appears
  6. Player clicks → result popup (scale 1.3→1.0, zone color)
  7. Screen shake on result (intensity varies by zone quality)

**Turn warnings:**
- 3 turns left: amber popup, yellow border + text
- 2 turns left: orange popup
- 1 turn left: red popup, white text, pulse animation
- Pop-in scale 1.15→1.0, hold 0.5s, fade 0.5s

**Match end screen:**
- Result: "VICTORY" or "DEFEAT" in large title gold text
- Win method: "by Submission" / "by Points" / "by Decision"
- Final score display
- "Play Again" button
- "Sign up for early access →" CTA below (links to #signup)

#### Screen Shake

```
intensity: 2.0-4.0 (momentum-scaled)
duration: 0.08-0.25s
steps: 4 with linear decay
CSS: transform translate with random ±intensity×decay
Respects reduced-motion media query
```

#### Button Styling (match game exactly)

```
Normal:
  background: #1A1F32
  border-bottom: 3px solid [accent-color]
  border-radius: 6px
  padding: 8px 16px
  color: #F2E6BF
  font-size: 18px

Hover:
  background: #242C42
  border-color: accent.lighten(20%)

Pressed:
  background: #141A28
  border-color: accent.darken(20%)
  scale: 0.93 (0.08s) → 1.0 (0.12s ease-out back)
  brightness: 1.3 (0.05s) → 1.0 (0.1s)
```

#### Animations Summary

| Effect | Duration | Easing | Trigger |
|--------|----------|--------|---------|
| Pop-in | 0.15s | ease-out back | Result popups, warnings |
| Fade in | 0.3s | ease-out | Overlays, new states |
| Fade out | 0.5s | ease-out | Removing popups |
| Stamina drain | 0.4s | ease-out | After each turn |
| Button press | 0.08s + 0.12s | linear + back | On click |
| Needle sweep | 1.0s base, ×0.85 each bounce | linear | Submission gauge |
| Perfect pulse | 1.0s per phase | linear | Continuous in gauge |
| Hurt pulse | 0.5-0.8s cycle | linear | Low stamina |
| Turn warning | 0.15s in, 0.5s hold, 0.5s out | back / linear | Turn threshold |
| Resolve dots | 2.3s total | stepped | Turn resolution |
| Screen shake | 0.08-0.25s | linear decay | Hits, submissions |

---

## Part 2: Feature Highlights

### Section Design

Espresso background (#3B2A1F) — matches header bar and email signup section.

**Layout:** Vertical stack, max-width 800px centered.

**Section header:**
- "Features" mono label in Belt Gold with flanking lines
- "What makes it special" serif headline in cream

**5 feature cards, each containing:**
- Stylized SVG icon (inline, ~48px, Belt Gold color)
- Feature title (mono, uppercase, cream)
- Description (2-3 sentences, cream/50 opacity)
- Cards separated by subtle cream/10 dividers

### The 5 Features

1. **Custom Submission Creator**
   - Icon: interlocking arms/grapple symbol
   - "Design your own finishing moves. Combine positions, grips, and pressure angles to create signature submissions that only you can execute."

2. **Submission Gauge & Timing**
   - Icon: gauge/meter with needle
   - "Land the perfect squeeze. An 11-zone oscillating timing gauge tests your precision — nail the PERFECT zone for maximum damage, or miss and give your opponent a chance to escape."

3. **Move & Position Prioritization**
   - Icon: chess/strategy grid
   - "Every position opens different options. Choose between attacks, defenses, transitions, and submissions — each with real success probabilities based on your stats and your opponent's weaknesses."

4. **Mystery Move Draws**
   - Icon: card/mystery box with sparkle
   - "Unlock rare techniques as you progress. Mystery draws reward you with new moves from Common to Legendary rarity — expanding your arsenal with every belt promotion."

5. **Skill Tree**
   - Icon: branching tree/nodes
   - "Shape your fighter's growth. Invest in 7 skill categories across 5 tiers to specialize your stats — become a guard specialist, wrestling powerhouse, or balanced all-rounder."

---

## Technical Architecture

### File Structure (new/modified files)

```
src/
  lib/
    combat/
      types.ts          — all TypeScript types (Position, Move, Fighter, GameState, etc.)
      constants.ts      — positions, interaction table, stat names, belt configs
      moves.ts          — purple belt move pool (player + opponent)
      engine.ts         — pure combat engine (resolve turn, check win, AI logic)
      gauge.ts          — submission gauge logic (zones, needle, result)
  components/
    combat/
      CombatDemo.tsx       — top-level section component (pre-match / in-match / post-match states)
      Scoreboard.tsx       — player/opponent names, belt, scores, turn counter
      StaminaBar.tsx       — animated stamina bar with hurt pulse
      AdvantagePips.tsx    — 5 pips per fighter
      PositionDisplay.tsx  — current position name + dominance bar
      FighterSprite.tsx    — animated pixel art sprite (canvas or CSS sprite)
      MoveSelection.tsx    — move buttons grid with type colors
      TurnTimer.tsx        — countdown bar
      ResolveOverlay.tsx   — turn resolution animation
      SubmissionGauge.tsx  — full gauge mini-game (canvas-based)
      TurnWarning.tsx      — popup for final turns
      MatchResult.tsx      — end screen with CTA
    FeatureHighlights.tsx  — 5 feature cards section
  app/
    page.tsx              — MODIFY: replace Preview with CombatDemo, add FeatureHighlights
```

### Key Technical Decisions

- **Combat engine is pure TypeScript** — no React, no DOM. Functions take state in, return new state. Fully testable.
- **Submission gauge uses HTML Canvas** — the needle animation and zone rendering need per-frame control. Canvas gives us smooth 60fps without React re-renders.
- **Fighter sprites use CSS sprite technique** — `background-position` cycling on a `<div>` with `image-rendering: pixelated`. Simpler than canvas for a 2-frame idle.
- **Animations use CSS transitions + requestAnimationFrame** — CSS for simple transitions (opacity, transform), rAF for complex sequences (gauge needle, screen shake).
- **State management via useReducer** — combat state is complex with many fields. A reducer pattern keeps state transitions explicit and debuggable.
- **`prefers-reduced-motion` respected** — all shake/flash effects check this media query.

### Performance

- Combat engine is lightweight (no heavy computation)
- Canvas only used for submission gauge (not always visible)
- Sprites are small PNGs, loaded once
- No external animation libraries needed
