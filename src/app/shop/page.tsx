import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopifyCollection from "@/components/ShopifyCollection";
import { getShopConfig } from "@/lib/shop";

/** The collection stays in Shopify; this page provides the studio's shop front. */
export function generateMetadata(): Metadata {
  return {
    title: "Shop | Submission Saga",
    description: "Shop Submission Saga apparel. Two-sided Comfort Colors tees from Hobbyist Games.",
    alternates: { canonical: "/shop" },
    robots: getShopConfig() ? undefined : { index: false, follow: true },
  };
}

export default function ShopPage() {
  const config = getShopConfig();
  const heading = <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
    <h1 className="font-pixel text-2xl leading-relaxed tracking-wide md:text-[27px]">Shop</h1>
    <p className="text-sm text-steam-gold">Submission Saga</p>
  </div>;

  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-steam-navy text-cream">
        <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-28 md:px-12 md:pt-28 lg:px-20">
          <section aria-label="Shop collection">
            {config ? (
              <ShopifyCollection {...config} heading={heading} />
            ) : (
              <div>
                {heading}
                <h2 className="mt-10 font-pixel text-pixel-lg leading-relaxed">The first collection is on its way.</h2>
                <p className="mt-4 max-w-md text-cream/70">We&apos;re getting our shirts ready. Check back soon.</p>
                <Link href="/" className="mt-8 inline-flex min-h-11 items-center text-sm text-steam-gold underline underline-offset-4">
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
