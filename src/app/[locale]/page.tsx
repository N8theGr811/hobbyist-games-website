import { getI18n, pageMetadata } from "@/lib/i18n";
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
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t } = getI18n((await params).locale);
  return pageMetadata(locale, "/", {
    title: t("Submission Saga — Hobbyist Games"),
    description: t("A pixel-art RPG where Brazilian Jiu-Jitsu meets adventure. Train, fight, and build your legacy. Out now on Steam and the App Store."),
  });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = getI18n((await params).locale);
  return (
    <>
      <Header locale={locale} />
      <main>
        <Hero locale={locale} />
        <SectionBreak />
        <FeatureHighlights locale={locale} />
        <SectionBreak />
        <ExploreTheRegion locale={locale} />
        <SectionBreak />
        <Reel locale={locale} />
        <SectionBreak />
        <GameInfo locale={locale} />
        <SectionBreak />
        <LearnTheGame locale={locale} />
        <SectionBreak />
        <Faq locale={locale} />
        <SectionBreak />
        <EmailSignup />
      </main>
      <SectionBreak />
      <Footer locale={locale} />
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
