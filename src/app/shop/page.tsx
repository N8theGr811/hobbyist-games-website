import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopifyCollection from "@/components/ShopifyCollection";
import { getShopConfig } from "@/lib/shop";

/** The collection stays in Shopify; this page provides the studio's shop front. */
export function generateMetadata(): Metadata {
  return {
    title: "Shop | Hobbyist Games",
    description: "T-shirts and original designs from Hobbyist Games.",
    alternates: { canonical: "/shop" },
    robots: getShopConfig() ? undefined : { index: false, follow: true },
  };
}

export default function ShopPage() {
  const config = getShopConfig();

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[75vh] max-w-6xl px-6 pb-20 pt-32 md:px-12 md:pt-40">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-steam-gold">Hobbyist Games</p>
        <h1 className="mt-4 font-display text-5xl md:text-7xl">Off the mat.</h1>
        <p className="mt-5 max-w-lg text-lg text-cream/70">Original designs. Everyday tees.</p>
        <section aria-label="Shop collection" className="mt-12 border-t border-steam-gold/20 pt-10">
          {config ? (
            <ShopifyCollection {...config} />
          ) : (
            <div className="py-10 md:py-16">
              <h2 className="font-display text-3xl">The first collection is on its way.</h2>
              <p className="mt-4 max-w-md text-cream/70">We&apos;re getting our shirts ready. Check back soon.</p>
              <Link href="/" className="mt-8 inline-flex min-h-11 items-center text-sm text-steam-gold underline underline-offset-4 hover:text-cream">
                Explore Submission Saga
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
