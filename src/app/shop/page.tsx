import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopifyCollection from "@/components/ShopifyCollection";
import { getShopConfig } from "@/lib/shop";

/** The collection stays in Shopify; this page provides the studio's shop front. */
export function generateMetadata(): Metadata {
  return {
    title: "Merch | Submission Saga",
    description: "Submission Saga merch. Two-sided Comfort Colors tees from Hobbyist Games.",
    alternates: { canonical: "/shop" },
    robots: getShopConfig() ? undefined : { index: false, follow: true },
  };
}

export default function ShopPage() {
  const config = getShopConfig();

  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-[#f4f1ea] text-[#26291f]">
        <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-28 md:px-12 md:pt-36 lg:px-20">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#65685f]">Submission Saga</p>
          <h1 className="mt-3 text-5xl font-medium tracking-[-0.055em] md:text-7xl">Merch</h1>
          <section aria-label="Shop collection" className="mt-10 md:mt-14">
            {config ? (
              <ShopifyCollection {...config} />
            ) : (
              <div className="py-10 md:py-16">
                <h2 className="font-display text-3xl">The first collection is on its way.</h2>
                <p className="mt-4 max-w-md text-[#65685f]">We&apos;re getting our shirts ready. Check back soon.</p>
                <Link href="/" className="mt-8 inline-flex min-h-11 items-center text-sm text-[#26291f] underline underline-offset-4">
                  Explore Submission Saga
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
