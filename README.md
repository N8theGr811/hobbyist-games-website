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

`/shop` embeds a Shopify Buy Button collection. With no complete configuration it
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

The SDK loads only when the configured shop is visited. Shopify handles the cart
and checkout; its cart can remain available after navigating elsewhere on the
site. Loading failures offer a retry instead of displaying an empty catalog.
Prices and currency formatting are owned by Shopify. International shipping does
not imply that the embed localizes currencies; check the actual checkout for the
markets enabled in the store.

Setup references: [Buy Button](https://help.shopify.com/en/manual/online-sales-channels/buy-button)
and [Printful connection](https://help.printful.com/hc/en-us/articles/50262260641297-How-do-I-connect-my-Shopify-store-to-Printful).
