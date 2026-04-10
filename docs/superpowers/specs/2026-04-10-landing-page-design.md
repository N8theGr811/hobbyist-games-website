# Hobbyist Games — Landing Page Design Spec

## Overview

Single-page "coming soon" landing site for Hobbyist Games, showcasing the Jiu-Jitsu RPG game. Built with Next.js + TypeScript + Tailwind CSS, hosted on Vercel. Email signups stored in a separate Firebase project (Firestore).

## Aesthetic Direction

**Hybrid modern-editorial with pixel art content.** Cream-dominant warmth, clean typography, generous whitespace. Pixel art appears as *content* (screenshots, clips) framed by refined modern UI — not as UI chrome.

### Brand Palette (from `brand/colors/`)

| Name       | Hex       | Usage                                      |
|------------|-----------|----------------------------------------------|
| Ink        | `#1B1612` | Text, borders, dark sections (gallery)       |
| Cream      | `#F4E9D2` | Primary background, dominant surface         |
| Paper      | `#FBF6EA` | Input fields, trailer section, subtle lift    |
| Mat Red    | `#C8372D` | Accent — CTAs, italic headline words, badges |
| Gi Navy    | `#1E3553` | Gallery radial gradient accent               |
| Belt Gold  | `#E8B339` | Rare accent — pillar lines, play btn hover   |

### Typography

| Role     | Font              | Weight     | Usage                          |
|----------|-------------------|------------|--------------------------------|
| Display  | DM Serif Display  | Regular/Italic | Headlines, taglines         |
| Body     | Outfit            | 300–700    | Paragraphs, descriptions       |
| Mono     | JetBrains Mono    | 500, 700   | Labels, CTAs, nav, badges      |

### Texture & Effects

- Subtle SVG grain overlay on body (fractalNoise, 3% opacity)
- Soft radial gradients for depth (hero, gallery)
- No hard borders between cream sections — use 1px rgba dividers or vertical line connectors
- Frosted glass header (backdrop-filter blur)

## Brand Assets

From `brand/` in the Jiu Jitsu RPG Working Folder (copy needed assets to website `public/brand/`):

| Asset | Source | Usage |
|-------|--------|-------|
| V4 Working logo | `wordmarks/svg/v4-working/hobbyist-games-v4-working.svg` | Header |
| V1 Hero logo | `wordmarks/svg/v1-hero/hobbyist-games-v1-hero.svg` | (available if needed) |
| Favicon | `favicon/favicon-32.png`, `favicon-180.png`, `favicon.svg` | Browser tab, Apple touch |
| OG image | `wordmarks/png/v1-hero/hobbyist-games-v1-hero-social-og-1200x630.png` | Social link previews |

## Page Sections (top to bottom)

### 1. Header (sticky)

- Fixed top, frosted cream background (`rgba(244,233,210,0.85)` + `backdrop-filter: blur(20px)`)
- Left: V4 Working logo (SVG, horizontal wordmark)
- Right: nav links (Preview, About) + "Get Early Access" CTA button (Ink bg, cream text)
- Smooth-scroll anchor links

### 2. Hero (full viewport)

- "Coming Soon" badge — Mat Red mono text with flanking lines
- "A Hobbyist Games Production" — small mono label above title
- Game title: "Jiu-Jitsu" in large DM Serif Display (Mat Red) + "RPG" below + "Role Playing Game" small mono subtitle
- Tagline: "Train. Fight. Build Your *Legacy.*" — DM Serif, italic "Legacy" in Mat Red
- Sub-tagline: one line describing the game
- "Join the Beta" CTA button (Ink bg, arrow, hover → Mat Red with shadow)
- Scroll hint animation at bottom (pulsing vertical line)
- Subtle radial gradient accents (Mat Red top-right, Gi Navy bottom-left)

### 3. Preview Gallery (dark section)

- Background: Ink (`#1B1612`) with Gi Navy radial gradient accent
- Header: "Preview" mono label + "A glimpse of the world" serif headline + "More coming soon" count
- 3-column grid, 2 rows:
  - Row 1 (3 items): Combat screenshot | Character customization | Choose style
  - Row 2 (2 items): Submission clip (1 col) | Mystery move unlock (2 col wide)
- Screenshots: `<img>` with `object-fit: cover`
- Clips: `<video>` muted autoplay loop playsinline
- Hover: lift, border glow, label fade-in overlay (bottom-left)
- Items have 16:10 aspect ratio

### 4. Trailer (Paper background)

- "Gameplay" mono label + "See it in action" serif headline
- Full-width (max 800px) video player with Ink border and box-shadow
- Play button overlay (circle + triangle, cream, hover → Belt Gold)
- Click dismisses overlay, starts video with native controls
- Video source: `walkthrough.mp4` (35MB) — consider optimizing/compressing for web

### 5. The Game (Cream background)

- Centered layout, vertical line connector from top
- "The Game" mono label in Mat Red with flanking lines
- Headline: "White belt to world champion. Every roll *matters.*" — DM Serif, italic Mat Red
- One-line body text at 50% opacity
- Three pillars side-by-side:
  - **Fight** — "70+ real techniques across 19 positions"
  - **Explore** — "Cities, gyms, rivals, and secrets"
  - **Build** — "Your skills, your academy, your legacy"
- Each pillar: Belt Gold top line (28px), mono label, muted description

### 6. Email Signup (Cream background)

- Vertical line connector from top (1px, Ink, 12% opacity)
- "Early Access" mono label in Mat Red with flanking lines
- Headline: "Be the first to *step on the mat*" — DM Serif, italic Mat Red
- Sub: "Sign up for beta testing updates and early access."
- Form: email input (Paper bg) + "Sign Up" button (Mat Red bg) in single bordered container
  - 2px Ink border wrapping both
  - Hover: subtle box-shadow
  - Button hover: Ink bg
- Privacy note: "No spam. Unsubscribe anytime." — small, 25% opacity

### 7. Footer

- Max-width 900px, centered, top border divider
- Left: "2026 Hobbyist Games" mono text
- Right: social icon links (X, YT, DC) — bordered squares, hover fill Ink

## Email Signup Backend

### Firebase Setup

- **Separate Firebase project** (not the game's leaderboard project)
- Firestore collection: `subscribers`
- Document fields:
  - `email: string`
  - `subscribed_at: Timestamp`
  - `source: string` ("website")
- Firestore access via Firebase Admin SDK in Next.js API route (server-side only — no client-side Firebase SDK exposed)
- Optional: Firebase function for double opt-in email (future enhancement)

### API Route

- Next.js API route: `POST /api/subscribe`
- Validates email format server-side
- Checks for duplicate before writing
- Returns success/error JSON
- Rate limiting via Vercel Edge or simple in-memory (basic protection)

## Media Assets

Organized in `public/media/`:

```
public/media/
  screenshots/
    combat.jpg              (102KB)
    character-customization.jpg  (93KB)
    choose-style.jpg        (99KB)
  clips/
    mystery-move-unlock.mp4 (5.8MB)
    submission-clip.mp4     (6.3MB)
  trailers/
    combat-gameplay.mp4     (29MB)
    walkthrough.mp4         (35MB)
```

**Optimization needed:** Trailers are large (29-35MB). Compress to ~5-10MB for web delivery, or consider hosting on YouTube/Vimeo and embedding. Clips should be compressed to ~1-2MB each.

## Technical Notes

- **Framework:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Hosting:** Vercel (free tier)
- **Fonts:** Google Fonts (DM Serif Display, Outfit, JetBrains Mono)
- **No CMS** — content is hardcoded, easy to update by editing components
- **Responsive:** mobile-first, single column on mobile, grid adjustments at breakpoints
- **SEO:** meta tags, OG image from brand assets, structured page title
- **`.gitignore`:** add `.superpowers/` and ensure `node_modules/` is covered
- **Video hosting consideration:** 35MB walkthrough will be slow on Vercel's free tier CDN. Recommend compressing aggressively or using YouTube embed for the trailer section.
