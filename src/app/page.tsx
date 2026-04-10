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
