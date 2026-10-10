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
  model?: { products?: unknown[] };
}

interface BuyUI {
  createComponent(type: "collection", config: Record<string, unknown>): Promise<BuyComponent | undefined>;
  components: { collection: BuyComponent[] };
}

declare global {
  interface Window {
    ShopifyBuy?: {
      buildClient(config: { domain: string; storefrontAccessToken: string }): unknown;
      UI: { onReady(client: unknown): Promise<BuyUI> };
    };
  }
}

/** Shopify owns product choices, prices, cart, and checkout; no catalog is duplicated here. */
export default function ShopifyCollection({ domain, storefrontAccessToken, collectionId }: ShopConfig) {
  const host = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
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
        ui.components.collection = ui.components.collection.filter((entry) => entry !== component);
      }
      node.remove();
    }

    const sdk = window.ShopifyBuy;
    const client = sdk.buildClient({ domain, storefrontAccessToken });
    sdk.UI.onReady(client).then(async (readyUI) => {
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
      component = await ui.createComponent("collection", {
        id: collectionId,
        node,
        options: {
          product: {
            buttonDestination: "modal",
            contents: { options: false },
            text: { button: "Choose options" },
            styles: {
              title: { color: "#F4E9D2" },
              price: { color: "#F4E9D2" },
              button,
            },
          },
          modalProduct: {
            contents: { img: false, imgWithCarousel: true, button: false, buttonWithQuantity: true },
            styles: { button },
            text: { button: "Add to cart" },
          },
          cart: { styles: { button }, text: { button: "Checkout" } },
          toggle: { styles: { toggle: button, count: { color: "#0E1530" }, iconPath: { fill: "#0E1530" } } },
        },
      });
      if (cancelled) {
        dispose();
        return;
      }
      // The SDK resolves undefined on errors instead of rejecting its promise.
      setStatus(component?.model?.products?.length ? "ready" : "error");
    }).catch(() => {
      if (!cancelled) setStatus("error");
    });

    return () => {
      cancelled = true;
      dispose();
    };
  }, [scriptReady, domain, storefrontAccessToken, collectionId]);

  return (
    <>
      <Script
        src="https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js"
        onReady={() => setScriptReady(true)}
        onError={() => setStatus("error")}
      />
      <div role="status" aria-live="polite">
        {status === "loading" && <p className="py-8 text-cream/70">Loading the collection...</p>}
        {status === "error" && (
          <div className="py-8">
            <p className="text-cream/70">The collection couldn&apos;t load. Please try again in a moment.</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-4 min-h-11 text-steam-gold underline underline-offset-4">Try again</button>
          </div>
        )}
      </div>
      <div ref={host} hidden={status === "error"} />
      <noscript><p className="py-8 text-cream/70">Please enable JavaScript to browse the collection and checkout.</p></noscript>
    </>
  );
}
