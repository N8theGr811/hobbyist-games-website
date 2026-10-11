"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cartQuery, catalogQuery, changeCart, groups, money, productGid, request, shortTitle, sizeOf, type Cart, type Product, type StorefrontConfig, type Variant } from "@/lib/storefront";
import styles from "./ShopifyCollection.module.css";

type Catalog = Record<string, Product>;

/** One accessible dialog foundation for product previews and the shopping bag. */
function ShopDialog({ label, drawer = false, close, children }: { label: string; drawer?: boolean; close: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={ref} aria-label={label} className={`${styles.dialog} ${drawer ? styles.drawer : styles.preview}`} onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div className={styles.dialogBody}>
      <button type="button" className={styles.close} onClick={close} aria-label={`Close ${label.toLowerCase()}`} autoFocus>×</button>
      {children}
    </div>
  </dialog>;
}

/** Live Shopify mockups share one restrained image treatment across every view. */
function Photo({ product, index, className = "" }: { product: Product; index: number; className?: string }) {
  const image = product.images.nodes[index] || product.images.nodes[0];
  // Shopify provides changing CDN URLs; use the original catalog media without copying it.
  // eslint-disable-next-line @next/next/no-img-element
  return image ? <img className={`${styles.photo} ${className}`} src={image.url} alt={`${shortTitle(product.title)}, ${index === 0 ? "front" : index === 1 ? "back" : "side"} view`} /> : null;
}

/** Fallback for a saved bag item that is no longer in the displayed collection. */
function CartPhoto({ url, title }: { url: string; title: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={styles.photo} src={url} alt={title} />;
}

/** Only plain text cells are extracted from Shopify's size guide, never arbitrary HTML. */
function SizeGuide({ html }: { html: string }) {
  const [metric, setMetric] = useState(false);
  const tables = new DOMParser().parseFromString(html, "text/html").querySelectorAll("table");
  const table = tables[metric ? 1 : 0] || tables[0];
  if (!table) return <p>Contact info@submissionsaga.com for sizing help.</p>;
  const rows = Array.from(table.rows).map(row => Array.from(row.cells).map(cell => cell.textContent?.trim() || ""));
  if (rows[0]?.length < (rows[1]?.length || 0)) rows[0].unshift("Size");
  return <>
    <div className={styles.units}><button type="button" aria-pressed={!metric} onClick={() => setMetric(false)}>Inches</button><button type="button" aria-pressed={metric} onClick={() => setMetric(true)}>Centimeters</button></div>
    <div className={styles.tableScroll}><table><caption className="sr-only">Garment measurements in {metric ? "centimeters" : "inches"}</caption><thead><tr>{rows[0]?.map((cell, i) => <th key={i} scope="col">{cell || "Size"}</th>)}</tr></thead><tbody>{rows.slice(1).map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
  </>;
}

/** The preview has a single purchase action and explicitly asks shoppers to choose a size. */
function ProductPreview({ product, title, design, choices, chooseDesign, busy, blocked, error, add, close }: {
  product: Product; title: string; design: string; choices: { name: string; id: string }[];
  chooseDesign: (id: string) => void; busy: boolean; blocked: boolean; error: string;
  add: (variant: Variant) => void; close: () => void;
}) {
  const [imageIndex, setImageIndex] = useState(1);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const price = variant?.price || product.variants.nodes[0]?.price;
  return <ShopDialog label={title} close={close}>
    <div className={styles.previewGrid}>
      <div className={styles.gallery}>
        <button type="button" className={`${styles.largePhoto} ${zoom ? styles.zoomed : ""}`} onClick={() => setZoom(!zoom)} aria-label={zoom ? "Zoom out" : "Zoom in on print"} aria-pressed={zoom}><Photo product={product} index={imageIndex} /></button>
        <div className={styles.thumbnails} aria-label="Product views">{product.images.nodes.map((image, index) => <button type="button" key={image.url} aria-pressed={imageIndex === index} aria-label={`Show ${["front", "back", "left", "right"][index] || `view ${index + 1}`}`} onClick={() => { setImageIndex(index); setZoom(false); }}><Photo product={product} index={index} /></button>)}</div>
        <p className={styles.galleryNote}>Front + back print <span>Tap image to zoom</span></p>
      </div>
      <div className={styles.productInfo}>
        <p className={styles.eyebrow}>Submission Saga</p>
        <h2>{title}</h2>
        <p className={styles.productPrice}>{price ? money(price) : "Unavailable"} <span>{price?.currencyCode || "USD"} · Shipping at checkout</span></p>
        <p className={styles.intro}>Comfort Colors 1717. Heavyweight, garment-dyed cotton with a relaxed fit.</p>
        {choices.length > 1 && <label className={styles.designLabel}>Design<select value={design} disabled={busy} onChange={event => chooseDesign(event.target.value)}>{choices.map(choice => <option value={choice.id} key={choice.id}>{choice.name}</option>)}</select></label>}
        <fieldset className={styles.sizes}><legend>Size <button type="button" onClick={() => setGuideOpen(!guideOpen)} aria-expanded={guideOpen}>Size guide</button></legend><div>{product.variants.nodes.map(item => <button type="button" key={item.id} disabled={!item.availableForSale || busy} aria-pressed={variant?.id === item.id} aria-label={`Size ${sizeOf(item)}${!item.availableForSale ? ", sold out" : ""}`} onClick={() => setVariant(item)}>{sizeOf(item)}</button>)}</div></fieldset>
        {guideOpen && <div className={styles.guide}><SizeGuide html={product.descriptionHtml} /></div>}
        <button type="button" className={styles.primary} disabled={!variant || busy || blocked} onClick={() => variant && add(variant)}>{busy ? "Adding to bag…" : variant ? "Add to bag" : "Select your size"}<span aria-hidden="true">↗</span></button>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <p className={styles.fulfillment}>Made to order. Printed and shipped by Printful.</p>
        <details className={styles.details}><summary>Product details</summary><p>{product.description.split("Size guide")[0]}</p></details>
        <details className={styles.details}><summary>Shipping & returns</summary><p>Shipping is calculated at checkout. Each tee is made to order, so check the size guide before purchasing. Wrong-size and change-of-mind returns are not offered, except where required by law. For damaged, defective, misprinted, or incorrect items, email info@submissionsaga.com within 14 days of delivery.</p></details>
      </div>
    </div>
  </ShopDialog>;
}

/** Native storefront views backed by Shopify catalog and Cart API, with hosted payment checkout. */
export default function ShopifyCollection({ domain, storefrontAccessToken }: StorefrontConfig) {
  const config = { domain, storefrontAccessToken };
  const [catalog, setCatalog] = useState<Catalog>({});
  const [loadError, setLoadError] = useState("");
  const [catalogReady, setCatalogReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [archetype, setArchetype] = useState(groups[0].designs[0].id);
  const [preview, setPreview] = useState<number | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [restoring, setRestoring] = useState(true);
  const [restoreFailed, setRestoreFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const cartKey = `submission-saga-cart:${domain}`;

  useEffect(() => {
    let active = true;
    request<{ nodes: (Product | null)[] }>({ domain, storefrontAccessToken }, catalogQuery, { ids: groups.flatMap(group => group.designs.map(design => productGid(design.id))) })
      .then(data => { if (active) { setCatalog(Object.fromEntries(data.nodes.filter((product): product is Product => !!product).map(product => [product.id, product]))); setLoadError(""); setCatalogReady(true); } })
      .catch(() => { if (active) setLoadError("The collection couldn't load. Please try again."); });
    return () => { active = false; };
  }, [domain, storefrontAccessToken, attempt]);

  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        let id: string | null = null;
        try { id = localStorage.getItem(cartKey); } catch { return; }
        if (id) {
          const data = await request<{ cart: Cart | null }>({ domain, storefrontAccessToken }, cartQuery, { id });
          if (active) setCart(data.cart);
          if (!data.cart) localStorage.removeItem(cartKey);
        }
      } catch { if (active) { setRestoreFailed(true); setError("We couldn't restore your saved bag. Refresh to reconnect before adding items."); } }
      finally { if (active) setRestoring(false); }
    }
    void restore();
    return () => { active = false; };
  }, [domain, storefrontAccessToken, cartKey]);

  function saveCart(next: Cart) {
    setCart(next);
    try { localStorage.setItem(cartKey, next.id); } catch { /* Shopping still works when storage is blocked. */ }
  }
  async function mutate(change: { variantId: string } | { lineId: string; quantity: number }) {
    if (locked.current || restoring || restoreFailed) return;
    locked.current = true; setBusy(true); setError(""); setNotice("");
    try {
      const result = await changeCart(config, cart, change);
      saveCart(result.cart); setNotice(result.warning || ("variantId" in change ? "Added to your bag" : ""));
      if ("variantId" in change) { setPreview(null); setBagOpen(true); }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update your bag. Please try again."); }
    finally { locked.current = false; setBusy(false); }
  }
  async function checkout() {
    if (!cart || locked.current) return;
    locked.current = true; setBusy(true); setError("");
    try {
      const data = await request<{ cart: Cart | null }>(config, cartQuery, { id: cart.id });
      if (!data.cart?.totalQuantity) throw new Error("Your bag has expired or is empty. Refresh and add your tee again.");
      saveCart(data.cart);
      window.location.assign(data.cart.checkoutUrl);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Checkout couldn't open. Please try again."); }
    finally { locked.current = false; setBusy(false); }
  }
  const activeGroup = preview === null ? null : groups[preview];
  const activeId = preview === 0 ? archetype : activeGroup?.designs[0].id;
  const activeProduct = activeId ? catalog[productGid(activeId)] : null;

  return <div className={styles.shop}>
    <div className={styles.toolbar}><span>Comfort Colors · 1717</span><button type="button" className={styles.bagButton} onClick={() => { setPreview(null); if (!restoreFailed) setError(""); setBagOpen(true); }} aria-label={`Open shopping bag, ${cart?.totalQuantity || 0} items`}><svg width="18" height="20" viewBox="0 0 20 22" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M3 7h14l1 13H2L3 7Z"/><path d="M6 8V5a4 4 0 0 1 8 0v3"/></svg>Bag <span>{cart?.totalQuantity || 0}</span></button></div>
    {loadError ? <div role="alert" className={styles.loadError}>{loadError}<button type="button" onClick={() => setAttempt(attempt + 1)}>Try again</button></div> : <div className={styles.products}>{groups.map((group, index) => {
      const id = index === 0 ? archetype : group.designs[0].id;
      const product = catalog[productGid(id)];
      return <article key={group.title} className={styles.card}>
        <button type="button" className={styles.cardPhoto} disabled={!product} onClick={() => { if (!restoreFailed) setError(""); setPreview(index); }} aria-label={`View ${group.title}`}>
          {product ? <Photo product={product} index={1} /> : <span className={styles.skeleton}>{catalogReady ? "Currently unavailable" : "Loading tee…"}</span>}
        </button>
        <div className={styles.cardHeading}><h2><button type="button" disabled={!product} onClick={() => { if (!restoreFailed) setError(""); setPreview(index); }}>{group.title}</button></h2><span>{product?.variants.nodes[0] ? money(product.variants.nodes[0].price) : ""}</span></div>
        {index === 0 ? <label className={styles.cardDesign}><span className="sr-only">Archetype design</span><select value={archetype} onChange={event => setArchetype(event.target.value)}>{group.designs.map(design => <option key={design.id} value={design.id}>{design.name}</option>)}</select></label> : <p className={styles.cardMeta}>Two-sided · Black</p>}
      </article>;
    })}</div>}
    {activeGroup && activeProduct && activeId && <ProductPreview key={activeId} product={activeProduct} title={activeGroup.title} choices={activeGroup.designs} design={activeId} chooseDesign={setArchetype} close={() => setPreview(null)} busy={busy} blocked={restoring || restoreFailed} error={error} add={variant => void mutate({ variantId: variant.id })} />}
    {bagOpen && <ShopDialog label="Shopping bag" drawer close={() => setBagOpen(false)}>
      <div className={styles.bagHeader}><p className={styles.eyebrow}>Submission Saga</p><h2>Your bag <span>{cart?.totalQuantity || 0}</span></h2></div>
      <div className={styles.bagLines}>
        {notice && <p role="status" className={styles.notice}>{notice}</p>}
        {restoring ? <p>Loading your bag…</p> : cart?.totalQuantity ? cart.lines.nodes.map(line => {
          const product = catalog[line.merchandise.product.id];
          return <article key={line.id} className={styles.bagLine}>
            <div className={styles.bagPhoto}>{product ? <Photo product={product} index={1} /> : line.merchandise.image && <CartPhoto url={line.merchandise.image.url} title={line.merchandise.product.title} />}</div>
            <div className={styles.lineInfo}><h3>{shortTitle(line.merchandise.product.title)}</h3><p>Black · {sizeOf(line.merchandise)}</p><strong>{money(line.cost.totalAmount)}</strong><div className={styles.lineActions}><div className={styles.quantity}><button type="button" disabled={busy || line.quantity <= 1} aria-label={`Decrease quantity of ${shortTitle(line.merchandise.product.title)}`} onClick={() => void mutate({ lineId: line.id, quantity: line.quantity - 1 })}>−</button><span aria-label="Quantity">{line.quantity}</span><button type="button" disabled={busy} aria-label={`Increase quantity of ${shortTitle(line.merchandise.product.title)}`} onClick={() => void mutate({ lineId: line.id, quantity: line.quantity + 1 })}>+</button></div><button type="button" className={styles.remove} disabled={busy} onClick={() => void mutate({ lineId: line.id, quantity: 0 })} aria-label={`Remove ${shortTitle(line.merchandise.product.title)}`}>Remove</button></div></div>
          </article>;
        }) : <div className={styles.empty}><span aria-hidden="true">↗</span><h3>Your bag is empty</h3><p>Explore the Submission Saga collection.</p><button type="button" className={styles.secondary} onClick={() => setBagOpen(false)}>Explore merch</button></div>}
      </div>
      <div className={styles.bagFooter}>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        {!!cart?.totalQuantity && <><div className={styles.subtotal}><span>Subtotal</span><strong>{money(cart.cost.subtotalAmount)}</strong></div><p className={styles.checkoutNote}>Shipping and any applicable taxes calculated at checkout.</p><button type="button" className={styles.primary} disabled={busy} onClick={() => void checkout()}>{busy ? "Updating…" : "Continue to checkout"}<span aria-hidden="true">↗</span></button><p className={styles.secure}>Secure checkout with Shopify</p><button type="button" className={styles.continue} onClick={() => setBagOpen(false)}>Continue shopping</button></>}
      </div>
    </ShopDialog>}
  </div>;
}
