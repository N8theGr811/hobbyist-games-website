import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureHighlights from "@/components/FeatureHighlights";
import ExploreTheRegion from "@/components/ExploreTheRegion";
import Reel from "@/components/Reel";
import GameInfo from "@/components/GameInfo";
import LearnTheGame from "@/components/LearnTheGame";
import Faq from "@/components/Faq";
import EmailSignup from "@/components/EmailSignup";
import Footer from "@/components/Footer";
import { BeltBar } from "@/components/BeltStrip";

/**
 * Canonical is declared per page, never in the root layout -- an inherited
 * "/" would tell Google that /privacy and /credits duplicate the homepage.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SectionBreak />
        <FeatureHighlights />
        <SectionBreak />
        <ExploreTheRegion />
        <SectionBreak />
        <Reel />
        <SectionBreak />
        <GameInfo />
        <SectionBreak />
        <LearnTheGame />
        <SectionBreak />
        <Faq />
        <SectionBreak />
        <EmailSignup />
      </main>
      <SectionBreak />
      <Footer />
    </>
  );
}

/**
 * The hero's belt bar, straddling the seam between two sections. It takes no
 * height of its own, so section spacing is unchanged, and sits above both
 * neighbours (each is its own stacking context via `isolate`).
 */
function SectionBreak() {
  return (
    <div aria-hidden="true" className="relative z-10 flex h-0 items-center justify-center">
      <BeltBar />
    </div>
  );
}
