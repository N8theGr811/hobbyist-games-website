# Advertising measurement

The website forwards non-personal campaign labels to the three stores. It sends
page visits and store clicks to Meta and Reddit only after advertising consent.
A store click is never sent as a purchase. This does not add an in-game SDK.

## Campaign links

Use a different campaign token for each channel and campaign. Keep the token
stable for the life of the campaign. Allowed labels are lowercase letters,
numbers, dots, underscores and hyphens. Source, medium and campaign are required,
at most 30 characters each. Optional content is at most 64 characters. Invalid
campaigns are rejected rather than truncated, so two campaigns cannot collide.

Prepared landing links:

- Reddit: `https://www.submissionsaga.com/?utm_source=reddit&utm_medium=paid_social&utm_campaign=reddit-bjj-20261102&utm_content=hook1`
- Meta: `https://www.submissionsaga.com/?utm_source=meta&utm_medium=paid_social&utm_campaign=meta-bjj-20261102&utm_content=hook1`
- Organic example: `https://www.submissionsaga.com/?utm_source=instagram&utm_medium=organic_social&utm_campaign=ig-reel-20261102&utm_content=hook1`

These are prepared names, not claims that the ad-account URLs have been changed.
Use the same campaign token in the reporting workbook. The content label can
distinguish creatives without splitting Apple's campaign totals into tiny groups.

Apple's verified public provider token is `129278373`. It was obtained from App
Store Connect's campaign generator for Submission Saga on 2026-11-02. The optional
`NEXT_PUBLIC_APPLE_PROVIDER_TOKEN` build-time variable overrides it; an empty or
invalid override disables Apple tagging rather than sending a guessed token.
Reddit's public pixel ID `a2_jyde3sib7c49` was checked in the account's Events
Manager. Meta retains pixel `1050915077930277`.

## Behaviour and consent

- The header, hero and FAQ share the same store-identification and tagging rules.
- Steam receives UTM labels. Apple receives provider, campaign and media tokens.
  Play receives UTM labels and a URL-encoded referrer payload.
- Only allowlisted labels reach stores. No `fbclid`, `rdt_cid`, arbitrary query
  fields or customer details are forwarded by this code.
- Current-page aggregate labels can be forwarded without browser storage. With
  consent, labels persist in that tab for 30 minutes after a tagged page is read.
  A new tagged campaign replaces the previous one. Invalid explicit tags clear
  stored attribution. Untagged visits after expiry receive no invented source.
- Global Privacy Control disables pixels and campaign forwarding. Withdrawing
  consent clears saved campaign labels. The page reloads if Reddit was loaded,
  removing the SDK's listeners. Already-sent events cannot be recalled.
- Consent is versioned because Reddit is a new recipient. Previous refusals are
  retained; previous Meta-only acceptance is not treated as Reddit consent.
- Local and preview hosts never load production advertising pixels.
- English and Brazilian Portuguese consent and privacy copy are updated together.

## Reporting workbook

Use `Submission-Saga-Ad-Report.xlsx`, delivered with this change. It has two tabs:
Inputs and Campaigns. It is a manual entry workbook, not a vendor CSV importer.
Keep each original export unchanged beside that period's workbook and record its
filename and filters in the source cells. Never paste an entire vendor CSV over
the workbook's formulas.

1. Save a copy for the period. Enter start/end dates, extraction date and an
   optional spending cap. Use USD and align report time zones to UTC where
   possible. Document any remaining time-zone differences in the source cells.
2. In Meta Ads Manager and Reddit Ads, export campaign spending for that period.
   Record each campaign's spend once, even if it sends people to all three stores.
3. From each store, obtain base-game paid units and net proceeds in USD. Exclude
   DLC, IAP, keys, free acquisitions and redownloads. Net proceeds must already
   account for store fees, transaction taxes, discounts and refunds. Do not
   subtract fees twice. The workbook estimates net value per paid sale from these.
4. Enter store-attributed paid sales for each campaign. Steam uses purchases,
   not visits, wishlists or activations. For Apple and Play, verify that the
   selected metric represents paid sales; listing clicks, first-time downloads
   and acquisitions alone are not a transaction ledger. If unavailable, use
   Pending or Suppressed and leave the count blank. A confirmed zero is numeric 0.
5. Not targeted is only for a store excluded from that campaign. It is not a way
   to bypass missing data. Complete rows calculate estimated net proceeds, proceeds
   less ad spend, cost per sale, and net proceeds divided by spending.
6. Allow the attribution window plus reporting lag before reviewing. Apple's
   first-download window is 24 hours and Steam's is 72 hours. Refresh later for
   late reporting and refunds. Mark Reviewed only after checking source coverage.
7. Read unallocated proceeds separately. They include organic sales and missed
   attribution. Negative amounts can indicate mismatched dates or double counting.

The workbook's returns are estimates of store-attributed activity, not proof of
incremental profit or cash received. Store reporting windows differ. Mixed-country
campaigns can differ from a store's average sale value. Missing store results block
the combined return instead of being silently counted as zero. Additional sales
caused by ads require a controlled experiment. The spending cap is informational;
it does not change budgets or stop ads automatically.

## Validation and rollout

Run `sh tools/test-campaign.sh`, the targeted ESLint checks and `npm run build`.
The pure logic checks cover all three stores, invalid labels, no click-ID leakage,
exact store matching, consented persistence, expiry, replacement, withdrawal and
unavailable storage.

Local browser checks should cover all nine store links, a trip to the guide and
back, withdrawal, a language switch and the Portuguese privacy copy. Before
increasing spending, production checks still need to establish:

- the new website is deployed;
- the actual ad destination URLs use the chosen campaign tags;
- Meta Test Events and Reddit Event Testing receive PageView/PageVisit and
  StoreClick only after consent, without duplicate page visits;
- no purchase event is generated for a store click;
- the store reports show the campaign after enough real traffic and reporting lag.

No ad budgets, delivery switches, targeting or campaign objectives are changed by
the website code. Reddit's current custom StoreClick event is for website interest,
not a replacement for mobile purchase attribution.

## References

- [Apple campaign links](https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links/)
- [Steam UTM analytics](https://partner.steamgames.com/doc/marketing/utm_analytics)
- [Play acquisition reporting](https://support.google.com/googleplay/android-developer/answer/9859173?hl=en)
- [Reddit manual pixel events](https://business.reddithelp.com/articles/Knowledge/manual-conversion-events-with-the-reddit-pixel)
