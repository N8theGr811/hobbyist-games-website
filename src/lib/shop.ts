/** Public Buy Button settings, copied from Shopify's generated collection embed. */
export function getShopConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  const collectionId = process.env.SHOPIFY_COLLECTION_ID?.trim();

  if (!domain || !storefrontAccessToken || !collectionId) return null;
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain)) return null;
  if (!/^\d+$/.test(collectionId)) return null;

  return { domain, storefrontAccessToken, collectionId };
}
