import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureHighlights from "@/components/FeatureHighlights";
import ExploreTheRegion from "@/components/ExploreTheRegion";
import Reel from "@/components/Reel";
import GameInfo from "@/components/GameInfo";
import EmailSignup from "@/components/EmailSignup";
import Footer from "@/components/Footer";

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
        <FeatureHighlights />
        <ExploreTheRegion />
        <Reel />
        <GameInfo />
        <EmailSignup />
      </main>
      <Footer />
    </>
  );
}
