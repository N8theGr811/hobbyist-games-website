import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopifyCollection from "@/components/ShopifyCollection";
import { getShopConfig } from "@/lib/shop";
import { getI18n, pageMetadata } from "@/lib/i18n";
import shopDictionary from "@/lib/i18n/shop.pt-BR.json";

/** The collection stays in Shopify; this page provides the studio's shop front. */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale, t } = getI18n((await params).locale, shopDictionary);
  return {
    ...pageMetadata(locale, "/shop", {
      title: t("Shop | Submission Saga"),
      description: t("Shop Submission Saga apparel. Two-sided Comfort Colors tees from Hobbyist Games."),
    }),
    robots: getShopConfig() ? undefined : { index: false, follow: true },
  };
}

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t, path } = getI18n((await params).locale, shopDictionary);
  const config = getShopConfig();
  const heading = <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
    <h1 className="font-pixel text-2xl leading-relaxed tracking-wide md:text-[27px]">{t("Shop")}</h1>
    <p className="text-sm text-steam-gold">Submission Saga</p>
  </div>;

  return (
    <>
      <Header locale={locale} />
      <main className="min-h-[80vh] bg-steam-navy text-cream">
        <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-28 md:px-12 md:pt-28 lg:px-20">
          <section aria-label={t("Shop collection")}>
            {config ? (
              <ShopifyCollection {...config} heading={heading} />
            ) : (
              <div>
                {heading}
                <h2 className="mt-10 font-pixel text-pixel-lg leading-relaxed">{t("The first collection is on its way.")}</h2>
                <p className="mt-4 max-w-md text-cream/70">{t("We're getting our shirts ready. Check back soon.")}</p>
                <Link href={path("/")} className="mt-8 inline-flex min-h-11 items-center text-sm text-steam-gold underline underline-offset-4">
                  {t("Explore Submission Saga")}
                </Link>
              </div>
            )}
          </section>

        </div>
      </main>
      <Footer locale={locale} />
    </>
  );
}
