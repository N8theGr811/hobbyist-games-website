/** Typed Shopify Storefront requests. All prices and variant IDs come from Shopify. */
export interface StorefrontConfig { domain: string; storefrontAccessToken: string }
export interface Money { amount: string; currencyCode: string }
export interface ProductImage { url: string; altText: string | null }
export interface Variant {
  id: string; title: string; availableForSale: boolean; price: Money;
  selectedOptions: { name: string; value: string }[];
}
export interface Product {
  id: string; title: string; description: string; descriptionHtml: string;
  images: { nodes: ProductImage[] }; variants: { nodes: Variant[] };
}
export interface CartLine {
  id: string; quantity: number; cost: { totalAmount: Money };
  merchandise: Variant & { image: ProductImage | null; product: { title: string; id: string } };
}
export interface Cart {
  id: string; checkoutUrl: string; totalQuantity: number;
  cost: { subtotalAmount: Money }; lines: { nodes: CartLine[] };
}

export const groups = [
  { title: "Archetype Tee", designs: [
    { name: "Guard Player", id: "15400774238407" },
    { name: "Wrestler", id: "15400773419207" },
    { name: "Submission Specialist", id: "15400772534471" },
  ] },
  { title: "Moves Tee", designs: [{ name: "Moves", id: "15400771027143" }] },
  { title: "Logo Tee", designs: [{ name: "Logo", id: "15400769454279" }] },
];
export const productGid = (id: string) => `gid://shopify/Product/${id}`;
export const money = (value: Money) => new Intl.NumberFormat("en-US", { style: "currency", currency: value.currencyCode }).format(Number(value.amount));
export const shortTitle = (title: string) => title.replace(/^Submission Saga\s*/, "");
export const sizeOf = (variant: Variant) => variant.selectedOptions.find(option => option.name.toLowerCase() === "size")?.value || variant.title;

export async function request<T>(config: StorefrontConfig, query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`https://${config.domain}/api/2026-07/graphql.json`, {
    method: "POST", headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": config.storefrontAccessToken },
    body: JSON.stringify({ query, variables }), signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("The shop couldn't connect. Please try again.");
  const result = await response.json();
  if (result.errors?.length || !result.data) throw new Error("The shop couldn't complete that request. Please try again.");
  return result.data as T;
}

export const catalogQuery = `query Catalog($ids: [ID!]!) { nodes(ids: $ids) { ... on Product {
  id title description descriptionHtml images(first: 8) { nodes { url altText } }
  variants(first: 50) { nodes { id title availableForSale price { amount currencyCode } selectedOptions { name value } } }
} } }`;
export const cartFields = `id checkoutUrl totalQuantity cost { subtotalAmount { amount currencyCode } }
  lines(first: 100) { nodes { id quantity cost { totalAmount { amount currencyCode } }
  merchandise { ... on ProductVariant { id title availableForSale price { amount currencyCode }
  selectedOptions { name value } image { url altText } product { id title } } } } }`;
export const cartQuery = `query Cart($id: ID!) { cart(id: $id) { ${cartFields} } }`;

/** Mutations are serialized by the UI; Shopify validates quantities and availability. */
export async function changeCart(config: StorefrontConfig, cart: Cart | null, change: { variantId: string } | { lineId: string; quantity: number }): Promise<{ cart: Cart; warning?: string }> {
  let name: string, args: string, invocation: string, variables: Record<string, unknown>;
  if ("variantId" in change) {
    const lines = [{ merchandiseId: change.variantId, quantity: 1 }];
    if (cart) {
      name = "cartLinesAdd"; args = "$cartId: ID!, $lines: [CartLineInput!]!"; invocation = "cartId: $cartId, lines: $lines"; variables = { cartId: cart.id, lines };
    } else {
      name = "cartCreate"; args = "$input: CartInput!"; invocation = "input: $input"; variables = { input: { lines } };
    }
  } else {
    if (!cart) throw new Error("Your bag is empty. Please add your tee again.");
    name = change.quantity === 0 ? "cartLinesRemove" : "cartLinesUpdate";
    args = change.quantity === 0 ? "$cartId: ID!, $lineIds: [ID!]!" : "$cartId: ID!, $lines: [CartLineUpdateInput!]!";
    invocation = change.quantity === 0 ? "cartId: $cartId, lineIds: $lineIds" : "cartId: $cartId, lines: $lines";
    variables = change.quantity === 0 ? { cartId: cart.id, lineIds: [change.lineId] } : { cartId: cart.id, lines: [{ id: change.lineId, quantity: change.quantity }] };
  }
  const result = await request<Record<string, { cart: Cart | null; userErrors: { message: string }[]; warnings: { message: string }[] }>>(config,
    `mutation Change(${args}) { ${name}(${invocation}) { cart { ${cartFields} } userErrors { message } warnings { message } } }`, variables);
  const payload = result[name];
  if (payload.userErrors.length) throw new Error(payload.userErrors.map(error => error.message).join(" "));
  if (!payload.cart) throw new Error("Your bag is no longer available. Refresh and try again.");
  return { cart: payload.cart, warning: payload.warnings.map(warning => warning.message).join(" ") || undefined };
}
