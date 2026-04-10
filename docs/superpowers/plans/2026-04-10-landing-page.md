# Hobbyist Games Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page "coming soon" landing site for Hobbyist Games with email signup backed by Firebase Firestore.

**Architecture:** Next.js App Router with a single page (`/`), one API route (`/api/subscribe`), and ~6 React components (one per page section). Firebase Admin SDK handles Firestore writes server-side. All styling via Tailwind CSS with CSS custom properties for the brand palette.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Firebase Admin SDK, Vercel hosting.

**Spec:** `docs/superpowers/specs/2026-04-10-landing-page-design.md`

---

## File Structure

```
src/
  app/
    globals.css            — MODIFY: brand palette CSS vars, font imports, grain overlay, remove defaults
    layout.tsx             — MODIFY: fonts (DM Serif Display, Outfit, JetBrains Mono), metadata, OG image
    page.tsx               — MODIFY: compose all section components
    api/
      subscribe/
        route.ts           — CREATE: POST handler, validates email, writes Firestore, returns JSON
  components/
    Header.tsx             — CREATE: sticky frosted header with V4 Working logo SVG + nav + CTA
    Hero.tsx               — CREATE: game title, tagline, coming soon badge, CTA, scroll hint
    Preview.tsx            — CREATE: dark gallery grid with screenshots + autoplay video clips
    Trailer.tsx            — CREATE: featured video with play overlay
    GameInfo.tsx           — CREATE: "The Game" section — headline + 3 pillars
    EmailSignup.tsx        — CREATE: email form + submit handler + success/error states
    Footer.tsx             — CREATE: copyright + social links
  lib/
    firebase-admin.ts      — CREATE: Firebase Admin SDK singleton init
public/
  brand/                   — CREATE: copy logo SVGs, favicons, OG image from game repo brand folder
  media/                   — EXISTS: screenshots/, clips/, trailers/ (already organized)
```

---

## Task 1: Project Setup — Tailwind, Fonts, Brand Assets

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `.gitignore`
- Create: `public/brand/` (copy from game repo)

- [ ] **Step 1: Copy brand assets into `public/brand/`**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website

# Logo SVGs
mkdir -p public/brand
cp "/c/Users/Natha/OneDrive/Desktop/Jiu jitsu RPG Working Folder/brand/wordmarks/svg/v4-working/hobbyist-games-v4-working.svg" public/brand/
cp "/c/Users/Natha/OneDrive/Desktop/Jiu jitsu RPG Working Folder/brand/wordmarks/svg/v4-working/hobbyist-games-v4-working-reverse.svg" public/brand/

# Favicons
cp "/c/Users/Natha/OneDrive/Desktop/Jiu jitsu RPG Working Folder/brand/favicon/favicon.svg" public/brand/
cp "/c/Users/Natha/OneDrive/Desktop/Jiu jitsu RPG Working Folder/brand/favicon/favicon-32.png" public/brand/
cp "/c/Users/Natha/OneDrive/Desktop/Jiu jitsu RPG Working Folder/brand/favicon/favicon-180.png" public/brand/

# OG image
cp "/c/Users/Natha/OneDrive/Desktop/Jiu jitsu RPG Working Folder/brand/wordmarks/png/v1-hero/hobbyist-games-v1-hero-social-og-1200x630.png" public/brand/og-image.png
```

- [ ] **Step 2: Add `.superpowers/` to `.gitignore`**

Append to `.gitignore`:
```
# superpowers brainstorm artifacts
.superpowers/
```

- [ ] **Step 3: Replace `globals.css` with brand palette and grain overlay**

Replace the entire contents of `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme inline {
  --color-ink: #1B1612;
  --color-cream: #F4E9D2;
  --color-paper: #FBF6EA;
  --color-mat-red: #C8372D;
  --color-gi-navy: #1E3553;
  --color-belt-gold: #E8B339;

  --font-display: "DM Serif Display", serif;
  --font-body: "Outfit", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

body {
  background: var(--color-cream);
  color: var(--color-ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

/* Subtle grain texture overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
}
```

- [ ] **Step 4: Update `layout.tsx` with fonts, metadata, and favicon**

Replace the entire contents of `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { DM_Serif_Display, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Hobbyist Games — Jiu-Jitsu RPG",
  description:
    "A pixel-art RPG where Brazilian Jiu-Jitsu meets adventure. Train, fight, and build your legacy. Coming soon.",
  icons: {
    icon: "/brand/favicon-32.png",
    apple: "/brand/favicon-180.png",
  },
  openGraph: {
    title: "Hobbyist Games — Jiu-Jitsu RPG",
    description:
      "A pixel-art RPG where Brazilian Jiu-Jitsu meets adventure. Coming soon.",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Verify build passes**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && npm run build
```

Expected: build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx public/brand/ .gitignore
git commit -m "feat: add brand assets, fonts, and palette setup"
```

---

## Task 2: Header Component

**Files:**
- Create: `src/components/Header.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/Header.tsx`**

```tsx
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-cream/85 backdrop-blur-xl border-b border-ink/5 md:px-12">
      <a href="#" className="block">
        <Image
          src="/brand/hobbyist-games-v4-working.svg"
          alt="Hobbyist Games"
          width={160}
          height={32}
          priority
        />
      </a>
      <nav className="flex items-center gap-6">
        <a
          href="#preview"
          className="hidden text-sm font-medium text-ink/50 hover:text-ink transition-colors sm:block"
        >
          Preview
        </a>
        <a
          href="#about"
          className="hidden text-sm font-medium text-ink/50 hover:text-ink transition-colors sm:block"
        >
          About
        </a>
        <a
          href="#signup"
          className="font-mono text-[0.65rem] font-bold tracking-widest uppercase px-5 py-2.5 bg-ink text-cream hover:bg-mat-red transition-colors"
        >
          Get Early Access
        </a>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Replace `page.tsx` with Header only (scaffold)**

Replace the entire contents of `src/app/page.tsx` with:

```tsx
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <div className="h-screen flex items-center justify-center font-display text-2xl text-ink/30">
          Sections coming soon…
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify build passes**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.tsx src/app/page.tsx
git commit -m "feat: add sticky header with brand logo and nav"
```

---

## Task 3: Hero Component

**Files:**
- Create: `src/components/Hero.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/Hero.tsx`**

```tsx
export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Radial gradient accents */}
      <div className="absolute -top-[30%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(200,55,45,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(30,53,83,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Coming Soon badge */}
      <div className="flex items-center gap-3 mb-6 font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-mat-red">
        <span className="w-8 h-px bg-mat-red/40" />
        Coming Soon
        <span className="w-8 h-px bg-mat-red/40" />
      </div>

      {/* Studio credit */}
      <p className="font-mono text-[0.55rem] tracking-[0.15em] uppercase text-ink/30 mb-6">
        A Hobbyist Games Production
      </p>

      {/* Game title */}
      <h1 className="font-display mb-2 relative">
        <span className="block text-[clamp(2.5rem,8vw,4.5rem)] text-mat-red leading-none">
          Jiu-Jitsu
        </span>
        <span className="block text-[clamp(2rem,6vw,4rem)] text-ink leading-none">
          RPG
        </span>
        <span className="block font-mono text-xs font-bold tracking-[0.4em] uppercase text-ink/35 mt-1">
          Role Playing Game
        </span>
      </h1>

      {/* Tagline */}
      <p className="font-display text-[clamp(1.2rem,3vw,1.6rem)] text-ink mt-8 mb-2">
        Train. Fight. Build Your <em className="italic text-mat-red">Legacy.</em>
      </p>
      <p className="text-base text-ink/50 max-w-md mb-10 leading-relaxed">
        A pixel-art RPG where Brazilian Jiu-Jitsu meets adventure. Rise from
        white belt to world champion.
      </p>

      {/* CTA */}
      <a
        href="#signup"
        className="group inline-flex items-center gap-2.5 font-mono text-[0.7rem] font-bold tracking-[0.12em] uppercase px-10 py-4 bg-ink text-cream hover:bg-mat-red hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(200,55,45,0.2)] transition-all duration-400"
      >
        Join the Beta
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </a>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[0.6rem] tracking-[0.15em] uppercase font-medium">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-ink to-transparent animate-pulse" />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add Hero to `page.tsx`**

Replace `src/app/page.tsx` with:

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify build passes**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx src/app/page.tsx
git commit -m "feat: add hero section with game title and CTA"
```

---

## Task 4: Preview Gallery Component

**Files:**
- Create: `src/components/Preview.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/Preview.tsx`**

```tsx
import Image from "next/image";

const screenshots = [
  { src: "/media/screenshots/combat.jpg", alt: "Combat system", label: "Combat" },
  { src: "/media/screenshots/character-customization.jpg", alt: "Character customization", label: "Customize" },
  { src: "/media/screenshots/choose-style.jpg", alt: "Choose your fighting style", label: "Fighting Styles" },
];

const clips = [
  { src: "/media/clips/submission-clip.mp4", label: "Submissions" },
  { src: "/media/clips/mystery-move-unlock.mp4", label: "Move Unlocks" },
];

export default function Preview() {
  return (
    <section id="preview" className="relative py-24 px-6 bg-ink overflow-hidden md:px-12">
      {/* Radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(30,53,83,0.3)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative max-w-[900px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-cream/30 mb-3">
              Preview
            </p>
            <h2 className="font-display text-3xl text-cream">
              A glimpse of the world
            </h2>
          </div>
          <p className="font-mono text-[0.65rem] text-cream/25 tracking-wide">
            More coming soon
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:grid-rows-2">
          {/* Row 1: 3 screenshots */}
          {screenshots.map((shot) => (
            <div
              key={shot.label}
              className="group relative aspect-video bg-cream/5 border border-cream/5 overflow-hidden cursor-pointer hover:border-cream/10 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-400"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <span className="absolute bottom-2 left-2 font-mono text-[0.5rem] tracking-[0.1em] uppercase text-cream bg-ink/70 backdrop-blur-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {shot.label}
              </span>
            </div>
          ))}

          {/* Row 2: 1 clip (1 col) + 1 clip (2 col) */}
          {clips.map((clip, i) => (
            <div
              key={clip.label}
              className={`group relative aspect-video bg-cream/5 border border-cream/5 overflow-hidden cursor-pointer hover:border-cream/10 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-400 ${
                i === 1 ? "sm:col-span-2" : ""
              }`}
            >
              <video
                src={clip.src}
                muted
                autoPlay
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 font-mono text-[0.5rem] tracking-[0.1em] uppercase text-cream bg-ink/70 backdrop-blur-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {clip.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add Preview to `page.tsx`**

Replace `src/app/page.tsx` with:

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Preview from "@/components/Preview";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Preview />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify build passes**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Preview.tsx src/app/page.tsx
git commit -m "feat: add preview gallery with screenshots and video clips"
```

---

## Task 5: Trailer Component

**Files:**
- Create: `src/components/Trailer.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/Trailer.tsx`**

This component needs client-side interactivity for the play button, so it must be a client component.

```tsx
"use client";

import { useRef, useState } from "react";

export default function Trailer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function handlePlay() {
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.controls = true;
      setIsPlaying(true);
    }
  }

  return (
    <section className="py-24 px-6 bg-paper text-center md:px-12">
      <p className="font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-ink/25 mb-4">
        Gameplay
      </p>
      <h2 className="font-display text-3xl text-ink mb-10">
        See it in action
      </h2>

      <div className="relative max-w-[800px] mx-auto border-2 border-ink shadow-[0_12px_40px_rgba(27,22,18,0.12)] aspect-video bg-ink overflow-hidden">
        <video
          ref={videoRef}
          src="/media/trailers/walkthrough.mp4"
          preload="metadata"
          className="w-full h-full object-cover"
        />
        {!isPlaying && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-ink/40 hover:bg-ink/25 transition-colors cursor-pointer"
            aria-label="Play video"
          >
            <div className="w-16 h-16 border-2 border-cream rounded-full flex items-center justify-center hover:scale-110 hover:border-belt-gold transition-all">
              <div className="w-0 h-0 border-l-[20px] border-l-cream border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1 hover:border-l-belt-gold" />
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add Trailer to `page.tsx`**

Replace `src/app/page.tsx` with:

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Preview from "@/components/Preview";
import Trailer from "@/components/Trailer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Preview />
        <Trailer />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify build passes**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Trailer.tsx src/app/page.tsx
git commit -m "feat: add trailer section with play overlay"
```

---

## Task 6: GameInfo Component

**Files:**
- Create: `src/components/GameInfo.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/GameInfo.tsx`**

```tsx
const pillars = [
  { title: "Fight", description: "70+ real techniques across 19 positions" },
  { title: "Explore", description: "Cities, gyms, rivals, and secrets" },
  { title: "Build", description: "Your skills, your academy, your legacy" },
];

export default function GameInfo() {
  return (
    <section id="about" className="relative py-28 px-6 text-center">
      {/* Vertical connector line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-ink/10" />

      <div className="flex items-center justify-center gap-3 mb-8 font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-mat-red">
        <span className="w-6 h-px bg-mat-red/30" />
        The Game
        <span className="w-6 h-px bg-mat-red/30" />
      </div>

      <h2 className="font-display text-[clamp(1.6rem,4vw,2.2rem)] text-ink leading-tight max-w-xl mx-auto mb-5">
        White belt to world champion.
        <br />
        Every roll <em className="italic text-mat-red">matters.</em>
      </h2>

      <p className="text-base text-ink/50 max-w-md mx-auto mb-14 leading-relaxed">
        A pixel-art RPG where real Brazilian Jiu-Jitsu strategy meets the
        adventure games you grew up with.
      </p>

      <div className="flex flex-col items-center gap-10 sm:flex-row sm:justify-center sm:gap-14 max-w-[700px] mx-auto">
        {pillars.map((pillar) => (
          <div key={pillar.title} className="flex-1 text-center">
            <div className="w-7 h-0.5 bg-belt-gold mx-auto mb-4" />
            <h4 className="font-mono text-[0.6rem] font-bold tracking-[0.15em] uppercase text-ink mb-1.5">
              {pillar.title}
            </h4>
            <p className="text-sm text-ink/35 leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add GameInfo to `page.tsx`**

Replace `src/app/page.tsx` with:

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Preview from "@/components/Preview";
import Trailer from "@/components/Trailer";
import GameInfo from "@/components/GameInfo";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Preview />
        <Trailer />
        <GameInfo />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify build passes**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/GameInfo.tsx src/app/page.tsx
git commit -m "feat: add game info section with three pillars"
```

---

## Task 7: EmailSignup Component

**Files:**
- Create: `src/components/EmailSignup.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/EmailSignup.tsx`**

```tsx
"use client";

import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }

      setState("success");
      setEmail("");
    } catch {
      setState("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <section id="signup" className="relative py-32 px-6 text-center">
      {/* Vertical connector */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-ink/10" />

      <div className="flex items-center justify-center gap-3 mb-6 font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-mat-red">
        <span className="w-6 h-px bg-mat-red/30" />
        Early Access
        <span className="w-6 h-px bg-mat-red/30" />
      </div>

      <h2 className="font-display text-[clamp(1.8rem,4vw,2.4rem)] text-ink mb-3 leading-tight">
        Be the first
        <br />
        to <em className="italic text-mat-red">step on the mat</em>
      </h2>

      <p className="text-base text-ink/45 mb-10">
        Sign up for beta testing updates and early access.
      </p>

      {state === "success" ? (
        <div className="max-w-md mx-auto">
          <p className="font-mono text-sm font-bold text-mat-red tracking-wide">
            You&apos;re on the list!
          </p>
          <p className="text-sm text-ink/40 mt-2">
            We&apos;ll reach out when the beta is ready.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-[460px] mx-auto">
          <div className="flex border-2 border-ink overflow-hidden hover:shadow-[0_4px_20px_rgba(27,22,18,0.08)] transition-shadow">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={state === "submitting"}
              className="flex-1 px-5 py-4 bg-paper text-ink font-body text-sm outline-none placeholder:text-ink/25 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={state === "submitting"}
              className="font-mono text-[0.65rem] font-bold tracking-[0.12em] uppercase px-8 py-4 bg-mat-red text-cream border-l-2 border-ink hover:bg-ink transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer"
            >
              {state === "submitting" ? "..." : "Sign Up"}
            </button>
          </div>

          {state === "error" && (
            <p className="mt-3 text-sm text-mat-red">{errorMsg}</p>
          )}
        </form>
      )}

      <p className="mt-4 text-[0.7rem] text-ink/25">
        No spam. Unsubscribe anytime.
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Add EmailSignup to `page.tsx`**

Replace `src/app/page.tsx` with:

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Preview from "@/components/Preview";
import Trailer from "@/components/Trailer";
import GameInfo from "@/components/GameInfo";
import EmailSignup from "@/components/EmailSignup";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Preview />
        <Trailer />
        <GameInfo />
        <EmailSignup />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify build passes**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/EmailSignup.tsx src/app/page.tsx
git commit -m "feat: add email signup section with form UI"
```

---

## Task 8: Footer Component

**Files:**
- Create: `src/components/Footer.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/Footer.tsx`**

```tsx
const socials = [
  { label: "X", href: "#" },
  { label: "YT", href: "#" },
  { label: "DC", href: "#" },
];

export default function Footer() {
  return (
    <footer className="max-w-[900px] mx-auto px-6 py-10 flex items-center justify-between border-t border-ink/8 md:px-12">
      <span className="font-mono text-[0.6rem] tracking-[0.08em] text-ink/25">
        © 2026 Hobbyist Games
      </span>
      <div className="flex gap-2">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="w-9 h-9 flex items-center justify-center border border-ink/10 text-ink text-[0.7rem] font-semibold opacity-40 hover:opacity-100 hover:bg-ink hover:text-cream hover:border-ink transition-all"
          >
            {s.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Add Footer to `page.tsx`**

Replace `src/app/page.tsx` with:

```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Preview from "@/components/Preview";
import Trailer from "@/components/Trailer";
import GameInfo from "@/components/GameInfo";
import EmailSignup from "@/components/EmailSignup";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Preview />
        <Trailer />
        <GameInfo />
        <EmailSignup />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify build passes**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.tsx src/app/page.tsx
git commit -m "feat: add footer with social links"
```

---

## Task 9: Firebase Admin SDK + Subscribe API Route

**Files:**
- Create: `src/lib/firebase-admin.ts`
- Create: `src/app/api/subscribe/route.ts`

- [ ] **Step 1: Install firebase-admin**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && npm install firebase-admin
```

- [ ] **Step 2: Create `.env.local` with Firebase config**

You need to create a Firebase project first. Go to https://console.firebase.google.com, create a new project (e.g. "hobbyist-games-website"), enable Firestore, then generate a service account key (Project Settings → Service Accounts → Generate new private key).

Create `.env.local` in the project root with values from the downloaded JSON key:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Note:** `.env*` is already in `.gitignore` so this file won't be committed.

- [ ] **Step 3: Create `src/lib/firebase-admin.ts`**

```ts
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getFirebaseApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
```

- [ ] **Step 4: Create `src/app/api/subscribe/route.ts`**

```ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const db = getDb();
    const subscribers = db.collection("subscribers");

    // Check for duplicate
    const existing = await subscribers.where("email", "==", email).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ message: "You're already on the list!" });
    }

    await subscribers.add({
      email,
      subscribed_at: Timestamp.now(),
      source: "website",
    });

    return NextResponse.json({ message: "Successfully subscribed!" });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 5: Verify build passes**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && npm run build
```

Expected: build succeeds. The API route will fail at runtime without Firebase credentials, but it should compile.

- [ ] **Step 6: Commit**

```bash
git add src/lib/firebase-admin.ts src/app/api/subscribe/route.ts package.json package-lock.json
git commit -m "feat: add Firebase subscribe API route"
```

---

## Task 10: Visual Polish and Responsive Fixes

**Files:**
- Modify: various components as needed

- [ ] **Step 1: Run dev server and check in browser**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && npm run dev
```

Open http://localhost:3000 in browser. Check:
- Header logo loads correctly (SVG may need size adjustments)
- Hero section fills viewport, text is legible on mobile and desktop
- Gallery images and clips render and autoplay
- Trailer play button works
- Email form shows error/success states (will fail without Firebase — that's expected)
- Footer renders at bottom
- Mobile responsiveness (resize browser to 375px width)

- [ ] **Step 2: Fix any Tailwind class issues**

If custom colors (e.g. `bg-cream`, `text-mat-red`) don't resolve, check that `globals.css` `@theme inline` block correctly maps the CSS variables. Tailwind v4 uses `--color-*` variables for automatic class generation.

Adjust any spacing, font sizes, or layout issues found during browser testing.

- [ ] **Step 3: Verify build passes**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: visual polish and responsive adjustments"
```

---

## Task 11: Final Build + Push

**Files:** none (verification only)

- [ ] **Step 1: Clean build**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && rm -rf .next && npm run build
```

Expected: build succeeds with no errors or warnings.

- [ ] **Step 2: Run lint**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && npm run lint
```

Expected: no errors.

- [ ] **Step 3: Push to GitHub**

```bash
cd /c/Users/Natha/OneDrive/Desktop/hobbyist-games-website && git push
```

- [ ] **Step 4: Connect Vercel**

Manual step: Go to https://vercel.com/new, import the `hobbyist-games-website` repo from GitHub, add environment variables (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`), deploy.
