import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureHighlights from "@/components/FeatureHighlights";
import VsScreen from "@/components/VsScreen";
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
        <FeatureHighlights />
        <VsScreen />
        <Trailer />
        <GameInfo />
        <EmailSignup />
      </main>
      <Footer />
    </>
  );
}
