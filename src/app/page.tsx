import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CombatDemo from "@/components/combat/CombatDemo";
import FeatureHighlights from "@/components/FeatureHighlights";
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
        <CombatDemo />
        <FeatureHighlights />
        <Trailer />
        <GameInfo />
        <EmailSignup />
      </main>
      <Footer />
    </>
  );
}
