This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Shop connection

`/shop` uses custom product previews and a shopping bag backed by the Shopify
Storefront API, followed by Shopify-hosted checkout. With no complete configuration it
shows a coming-soon message, is marked noindex, and stays out of the sitemap.
The header and footer link to it on desktop and mobile.

To connect the separate Hobbyist Games store:

1. Create the Shopify store and connect its Printful app. Create/sync the shirts
   through Printful so size and color variants have fulfillment mappings.
2. Install Shopify's Buy Button sales channel. Create a collection and publish
   its products to that channel, then generate a Collection Buy Button embed.
3. Copy these public values from the generated embed into `.env.local` for local
   work and the deployment environment for production:
   - `SHOPIFY_STORE_DOMAIN`: the `domain` value, such as `example.myshopify.com`.
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`: the public `storefrontAccessToken` value.
     Never use an Admin API token here; this value is sent to the browser.
   - `SHOPIFY_COLLECTION_ID`: the numeric collection `id` from `createComponent`.
4. Restart the local server or rebuild/redeploy after changing the settings.
5. Configure payments, target markets, shipping, policies, and Printful billing
   and automatic fulfillment in the respective dashboards.
6. Before launch, verify real product images, prices, variant choices, cart,
   checkout and shipping for a US address and each intended international market.
   Confirm the order reaches Printful. A local page preview cannot verify this.

The catalog loads only when the configured shop is visited. Loading failures offer
a retry instead of displaying an empty catalog. Three cards show Archetype, Moves,
and Logo tees. The Archetype selector switches between three separately synced
Printful products, preserving artwork mappings. Product IDs are in
`src/lib/storefront.ts`; add future designs there after publishing to Buy Button.

The gallery, product preview, and bag share the site's navy/gold palette, pixel
headings, Outfit body font, and rounded corners. Previews offer front/back/side
photos, tap-to-zoom, explicit size selection, and Shopify's size guide. The bag
supports quantity changes and removal, and restores its Shopify cart ID from local
storage on return. It is accessible from the shop page. Native dialogs handle
focus, Escape, backdrop dismissal, and scroll locking. Shopify validates cart
changes and provides the final checkout URL; payment details stay in its checkout.

Prices, sizes, availability, and currency come from Shopify. International shipping
does not imply currency localization; check checkout for each enabled market.

Setup references: [Buy Button](https://help.shopify.com/en/manual/online-sales-channels/buy-button)
and [Printful connection](https://help.printful.com/hc/en-us/articles/50262260641297-How-do-I-connect-my-Shopify-store-to-Printful).

### Launch status (October 10, 2026)

The five two-sided Comfort Colors tees are synced to Printful and published to
Buy Button at $38 across S–4XL. The website presents three cards, and groups the
three archetypes with a design selector. Production Shopify environment values
are saved in Vercel; a new deployment is still needed. Shopify's store name is
Hobbyist Games and automatic fulfillment requests and shipment notifications are
on. Printful automatically confirms fulfillment requests and updates stock;
its import override and product substitutions are off. High-risk orders are not
automatically fulfilled. Printful's US standard
shipping profile is $4.95; only the United States is an active market.

Before enabling live sales:
- Remove Shopify storefront password protection when ready to launch. The live
  Cart API checkout URL currently redirects to the store's Opening soon page.
- Add a Printful billing method.
- Confirm the merchant's sales-tax registrations; Shopify currently says US tax
  is not being collected. Do not infer registration from the LLC's existence.
- Return, shipping, contact, and automated privacy policies are published.
  Additional general terms of service have not been added.
- Confirm any additional countries before activating those markets.
- Deploy, then verify checkout and a merchant-authorized test order through to
  Printful. No paid order has been placed during setup.

The following return terms were approved by the merchant and published in
Shopify, along with the shipping information and support contact policy:

**Returns:** Each shirt is made to order. Please check the size guide before
ordering. We do not offer returns or exchanges for an incorrectly chosen size,
color, or change of mind, except where required by applicable law. If your order
arrives damaged, defective, misprinted, or incorrect, contact
info@submissionsaga.com within 14 days of delivery with your order number and
photos. We will review the issue and arrange an appropriate replacement or
refund. Contact us before sending anything back. This policy does not limit your
statutory rights.

**Shipping:** Shirts are printed to order. Production and transit are separate;
shipping charges are shown at checkout. Tracking is emailed when an order ships.
Delivery dates are estimates, not guarantees. For a delayed or missing package,
contact info@submissionsaga.com promptly with your order number. We currently
ship to the United States.
