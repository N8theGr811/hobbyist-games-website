import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureHighlights from "@/components/FeatureHighlights";
import VsScreen from "@/components/VsScreen";
import Reel from "@/components/Reel";
import GameInfo from "@/components/GameInfo";
import EmailSignup from "@/components/EmailSignup";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeatureHighlights />
        <VsScreen />
        <Reel />
        <GameInfo />
        <EmailSignup />
      </main>
      <Footer />
    </>
  );
}
