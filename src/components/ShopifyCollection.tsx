"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

interface ShopConfig {
  domain: string;
  storefrontAccessToken: string;
  collectionId: string;
}

interface BuyComponent {
  destroy(): void;
  model?: { id?: string };
}

interface BuyUI {
  createComponent(type: "product", config: Record<string, unknown>): void;
  components: { product: BuyComponent[] };
}

declare global {
  interface Window {
    ShopifyBuy?: {
      buildClient(config: { domain: string; storefrontAccessToken: string }): unknown;
      UI: { onReady(client: unknown): Promise<BuyUI> };
    };
  }
}

// These are fulfillment-linked product IDs, not copies of Shopify prices or sizes.
const groups = [
  { title: "Archetype Tee", designs: [
    { name: "Submission Specialist", id: "15400772534471" },
    { name: "Wrestler", id: "15400773419207" },
    { name: "Guard Player", id: "15400774238407" },
  ] },
  { title: "Moves Tee", designs: [{ name: "Moves", id: "15400771027143" }] },
  { title: "Logo Tee", designs: [{ name: "Logo", id: "15400769454279" }] },
];

type ProductConfig = Pick<ShopConfig, "domain" | "storefrontAccessToken"> & {
  productId: string;
  scriptReady: boolean;
};

/** Shopify owns live prices, sizes, availability, cart, and checkout. */
function ShopifyProduct({ domain, storefrontAccessToken, productId, scriptReady }: ProductConfig) {
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (status !== "loading") return;
    const timeout = window.setTimeout(() => setStatus("error"), 20000);
    return () => window.clearTimeout(timeout);
  }, [status]);

  useEffect(() => {
    if (!scriptReady || !host.current || !window.ShopifyBuy) return;
    let cancelled = false;
    let component: BuyComponent | undefined;
    let ui: BuyUI | undefined;
    // A dedicated node lets late SDK responses clean up without touching a new mount.
    const node = document.createElement("div");
    host.current.appendChild(node);

    function dispose() {
      component?.destroy();
      if (ui && component) {
        ui.components.product = ui.components.product.filter((entry) => entry !== component);
      }
      node.remove();
    }

    const sdk = window.ShopifyBuy;
    const client = sdk.buildClient({ domain, storefrontAccessToken });
    sdk.UI.onReady(client).then((readyUI) => {
      ui = readyUI;
      if (cancelled) return;
      const button = {
        "background-color": "#D4A53C",
        color: "#0E1530",
        "border-radius": "6px",
        "font-weight": "bold",
        ":hover": { "background-color": "#E8C25C", color: "#0E1530" },
        ":focus": { "background-color": "#E8C25C", color: "#0E1530" },
      };
      ui.createComponent("product", {
        id: productId,
        node,
        options: {
          product: {
            events: {
              afterInit: (rendered: BuyComponent) => {
                if (!cancelled) setStatus(rendered.model?.id ? "ready" : "error");
              },
            },
            buttonDestination: "modal",
            contents: { options: false, title: false },
            text: { button: "Choose options" },
            // Printful exports front, back, then side views. Feature the large back artwork.
            templates: {
              img: '<div class="{{data.classes.product.imgWrapper}}" data-element="product.imgWrapper"><img alt="{{data.title}} - back print" class="{{data.classes.product.img}}" data-element="product.img" src="{{#data.carouselImages.1}}{{src}}{{/data.carouselImages.1}}{{^data.carouselImages.1}}{{data.currentImage.srcLarge}}{{/data.carouselImages.1}}" /></div>',
            },
            styles: {
              product: { "max-width": "100%", "margin-left": "0", "margin-bottom": "0" },
              price: { color: "#F4E9D2" },
              button,
            },
          },
          modalProduct: {
            contents: { img: false, imgWithCarousel: true, button: false, buttonWithQuantity: true },
            styles: { button },
            text: { button: "Add to cart" },
          },
          cart: { popup: false, styles: { button }, text: { button: "Checkout" } },
          toggle: { styles: { toggle: button, count: { color: "#0E1530" }, iconPath: { fill: "#0E1530" } } },
        },
      });
      // The current SDK wrapper returns void; it registers the component synchronously.
      component = ui.components.product.at(-1);
    }).catch((error) => {
      console.error("Shopify collection could not load", error);
      if (!cancelled) setStatus("error");
    });

    return () => {
      cancelled = true;
      dispose();
    };
  }, [scriptReady, domain, storefrontAccessToken, productId]);

  return (
    <>
      <div role="status" aria-live="polite">
        {status === "loading" && <p className="py-8 text-cream/70">Loading tee...</p>}
        {status === "error" && (
          <div className="py-8">
            <p className="text-cream/70">This tee couldn&apos;t load. Please try again in a moment.</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-4 min-h-11 text-steam-gold underline underline-offset-4">Try again</button>
          </div>
        )}
      </div>
      <div ref={host} hidden={status === "error"} />
      <noscript><p className="py-8 text-cream/70">Please enable JavaScript to browse the collection and checkout.</p></noscript>
    </>
  );
}


/** Three storefront choices retain five separate Printful artwork mappings. */
export default function ShopifyCollection(config: ShopConfig) {
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);
  const [archetype, setArchetype] = useState(groups[0].designs[0].id);

  return (
    <>
      <Script
        src="https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js"
        onReady={() => setScriptReady(true)}
        onError={() => setScriptFailed(true)}
      />
      {scriptFailed ? (
        <p role="alert">The shop couldn&apos;t load. Please refresh and try again.</p>
      ) : (
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {groups.map((group, index) => {
            const productId = index === 0 ? archetype : group.designs[0].id;
            return (
              <article key={group.title}>
                <h2 className="font-display text-3xl">{group.title}</h2>
                <div className="my-5 md:min-h-12">
                  {group.designs.length > 1 ? (
                    <label className="flex items-center gap-3 text-sm text-cream/70">
                      Design
                      <select
                        value={archetype}
                        onChange={(event) => setArchetype(event.target.value)}
                        className="min-h-11 min-w-0 flex-1 rounded border border-steam-gold/30 bg-[#0E1530] px-3 text-cream"
                      >
                        {group.designs.map((design) => <option key={design.id} value={design.id}>{design.name}</option>)}
                      </select>
                    </label>
                  ) : <p className="flex min-h-11 items-center text-sm text-cream/70">Printed front and back</p>}
                </div>
                <ShopifyProduct key={productId} {...config} productId={productId} scriptReady={scriptReady} />
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
