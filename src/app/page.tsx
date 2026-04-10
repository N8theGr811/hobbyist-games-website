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
