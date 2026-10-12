/** The wordmark sits beside one group containing the game, slogan and stores. */
import Image from "next/image";
import StoreButtons from "./StoreButtons";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Submission Saga">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <h1 className={`${styles.wordmark} animate-title-reveal`}>
            <Image
              src="/hero/wordmark.png"
              alt="Submission Saga"
              width={2160}
              height={580}
              priority
              sizes="(min-width: 1400px) 675px, (min-width: 1024px) 50vw, (max-height: 680px) 385px, (max-width: 399px) 128vw, 513px"
              className={styles.wordmarkImage}
            />
          </h1>
        </div>

        <div className={styles.content}>
          <p className={`${styles.subtitle} animate-fade-up`} style={{ animationDelay: "0.15s" }}>
            THE JIU JITSU RPG
          </p>

          <div className={`${styles.gameplay} animate-fade-up`} style={{ animationDelay: "0.3s" }}>
            {/* Pre-sized WebPs keep the gameplay image quick on a cold cache. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/screenshot-knee-on-belly-1280.webp"
              srcSet="/hero/screenshot-knee-on-belly-800.webp 800w, /hero/screenshot-knee-on-belly-1280.webp 1280w, /hero/screenshot-knee-on-belly-1960.webp 1960w"
              sizes="(min-width: 1400px) 875px, (min-width: 1024px) 63vw, (max-width: 639px) calc(100vw - 32px), (max-height: 680px) min(calc(100vw - 48px), calc((100svh - 344px) * 1.776)), min(924px, calc(100vw - 48px), calc((100svh - 360px) * 1.776))"
              alt="Submission Saga gameplay: a knee-on-belly position mid-match"
              width={2096}
              height={1180}
              fetchPriority="high"
              decoding="async"
              className={styles.screenshot}
            />
          </div>

          <div className={`${styles.stores} animate-fade-up`} style={{ animationDelay: "0.45s" }}>
            <p className={styles.tagline}>
              From white belt to <strong>world champion</strong>.
            </p>
            <StoreButtons />
          </div>
        </div>
      </div>
    </section>
  );
}
