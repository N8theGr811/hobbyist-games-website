"use client";

import Script from "next/script";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface ShopConfig {
  domain: string;
  storefrontAccessToken: string;
  collectionId: string;
}

interface BuyComponent {
  destroy(): void;
  openModal(): Promise<unknown>;
  formattedPrice: string;
  model?: { id?: string; title: string; images: { src: string }[] };
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
  title: string;
  children: ReactNode;
};

/** Shopify owns live prices, sizes, availability, cart, and checkout. */
function ShopifyProduct({ domain, storefrontAccessToken, productId, scriptReady, title, children }: ProductConfig) {
  const host = useRef<HTMLDivElement>(null);
  const product = useRef<BuyComponent | undefined>(undefined);
  const [details, setDetails] = useState<{ title: string; front?: string; back?: string; price: string }>();
  const [view, setView] = useState<"front" | "back">("back");
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
        "border-radius": "10px",
        "font-weight": "bold",
        "font-family": "Outfit, sans-serif",
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
                if (cancelled) return;
                product.current = rendered;
                const model = rendered.model;
                if (model?.id) {
                  setDetails({ title: model.title, front: model.images[0]?.src, back: model.images[1]?.src, price: rendered.formattedPrice });
                  setStatus("ready");
                } else setStatus("error");
              },
            },
            buttonDestination: "modal",
            contents: { img: false, title: false, price: false, options: false, button: false },
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
      product.current = undefined;
      dispose();
    };
  }, [scriptReady, domain, storefrontAccessToken, productId]);

  return (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-panel border border-steam-gold/25 bg-[#e8e5de]">
        {details ? (
          <>
            <button type="button" onClick={() => void product.current?.openModal()} className="group h-full w-full cursor-pointer p-5 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#383b31]" aria-label={`Choose size for ${details.title}`}>
              {/* Shopify supplies live mockup URLs; preserve the original artwork. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={(view === "back" ? details.back : details.front) || details.front} alt={`${details.title}, ${view} view`} className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 motion-safe:group-hover:scale-[1.035]" />
            </button>
            {details.back && <button type="button" onClick={() => setView(view === "back" ? "front" : "back")} className="absolute bottom-3 right-3 min-h-11 px-3 text-xs tracking-wide text-[#44483d] underline underline-offset-4 hover:text-black">View {view === "back" ? "front" : "back"}</button>}
          </>
        ) : (
          <div role="status" aria-live="polite" className="flex h-full items-center justify-center p-6 text-sm text-[#606357]">
            {status === "error" ? <button type="button" onClick={() => window.location.reload()} className="min-h-11 underline">Unable to load. Try again</button> : "Loading…"}
          </div>
        )}
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-3 md:flex-col md:gap-2 lg:flex-row lg:gap-3">
        <h2 className="font-pixel text-pixel-sm leading-relaxed text-cream">{title}</h2>
        <span className="text-sm tabular-nums text-cream/70">{details?.price}</span>
      </div>
      <div className="mt-2 flex min-h-12 items-center">{children}</div>
      <button type="button" disabled={status !== "ready"} onClick={() => void product.current?.openModal()} className="mt-4 flex min-h-12 w-full items-center justify-between rounded-md border border-steam-gold/40 bg-steam-gold/10 px-4 text-sm font-medium text-steam-gold transition-colors hover:bg-steam-gold/20 focus-visible:outline-2 focus-visible:outline-steam-gold disabled:opacity-40">
        Choose size <span aria-hidden="true">↗</span>
      </button>
      <div ref={host} hidden aria-hidden="true" />
      <noscript><p>Please enable JavaScript to shop.</p></noscript>
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
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-3 lg:gap-x-10">
          {groups.map((group, index) => {
            const productId = index === 0 ? archetype : group.designs[0].id;
            return (
              <article key={group.title}>
                <ShopifyProduct key={productId} {...config} productId={productId} scriptReady={scriptReady} title={group.title}>
                  {group.designs.length > 1 ? (
                    <label className="flex w-full items-center gap-3 text-sm text-cream/70">
                      <span className="sr-only">Archetype design</span>
                      <select
                        value={archetype}
                        onChange={(event) => setArchetype(event.target.value)}
                        className="min-h-11 w-full cursor-pointer rounded-md border border-steam-gold/25 bg-steam-navy-2 px-3 pr-6 text-sm text-cream focus-visible:outline-2 focus-visible:outline-steam-gold"
                      >
                        {group.designs.map((design) => <option key={design.id} value={design.id}>{design.name}</option>)}
                      </select>
                    </label>
                  ) : <p className="text-sm text-cream/70">Front + back print</p>}
                </ShopifyProduct>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
