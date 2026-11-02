/** Regression checks for money attribution: wrong credit is worse than missing credit. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readCampaign, storeCampaignUrl, identifyStore, resolveCampaign } = require(process.env.CAMPAIGN_TEST_BUILD + '/campaign.js');
const { STORES } = require(process.env.CAMPAIGN_TEST_BUILD + '/stores.js');
const query = 'utm_source=reddit&utm_medium=paid_social&utm_campaign=reddit-bjj-20261102&utm_content=hook1';
const campaign = readCampaign(new URLSearchParams(query));
const store = id => STORES.find(s => s.id === id);
const memory = () => { const data = new Map(); return { getItem: k => data.get(k) ?? null, setItem: (k,v) => data.set(k,v), removeItem: k => data.delete(k) }; };

test('Steam carries labels, never click identifiers or arbitrary query parameters', () => {
  const c = readCampaign(new URLSearchParams(query + '&fbclid=secret&rdt_cid=secret&email=a@b.com'));
  const u = new URL(storeCampaignUrl(store('steam'), c));
  assert.equal(u.searchParams.get('utm_campaign'), campaign.campaign);
  assert.equal(u.searchParams.size, 4);
});
test('Apple needs a genuine numeric provider token and a bounded campaign token', () => {
  assert.equal(storeCampaignUrl(store('app-store'), campaign), store('app-store').href);
  const u = new URL(storeCampaignUrl(store('app-store'), campaign, '12345'));
  assert.equal(u.searchParams.get('ct'), campaign.campaign);
  assert.equal(u.searchParams.get('pt'), '12345');
  assert.equal(u.searchParams.get('mt'), '8');
});
test('Google keeps package ID and decodes the complete referrer exactly once', () => {
  const u = new URL(storeCampaignUrl(store('google-play'), campaign));
  assert.equal(u.searchParams.get('id'), 'com.hobbyistgames.submissionsaga');
  assert.deepEqual(readCampaign(new URLSearchParams(u.searchParams.get('referrer'))), campaign);
});
test('Invalid labels are rejected without truncation or accidental identity leakage', () => {
  for (const suffix of ['a'.repeat(31), 'name@email.com', 'bad value', '{{campaign.name}}', '<script>']) {
    assert.equal(readCampaign(new URLSearchParams('utm_source=meta&utm_medium=paid_social&utm_campaign=' + suffix)), null);
  }
  assert.equal(readCampaign(new URLSearchParams('utm_source=meta')), null);
});
test('Only the exact game store links match, with or without a trailing slash', () => {
  for (const s of STORES) assert.equal(identifyStore(storeCampaignUrl(s, campaign, '12345')).id, s.id);
  assert.equal(identifyStore(store('steam').href + '/').id, 'steam');
  assert.equal(identifyStore('https://store.steampowered.com.evil.test/app/4690760'), undefined);
  assert.equal(identifyStore('https://play.google.com/store/apps/details?id=another.game'), undefined);
});
test('Consented source survives navigation, expires, and a new source replaces it', () => {
  const storage = memory();
  assert.deepEqual(resolveCampaign(query, true, storage, 'c', 100), campaign);
  assert.deepEqual(resolveCampaign('', true, storage, 'c', 200), campaign);
  assert.equal(resolveCampaign('', true, storage, 'c', 1800100), null);
  resolveCampaign(query, true, storage, 'c', 100);
  const next = query.replaceAll('reddit', 'meta');
  assert.equal(resolveCampaign(next, true, storage, 'c', 200).source, 'meta');
  assert.equal(resolveCampaign('utm_source=broken', true, storage, 'c', 300), null);
  assert.equal(resolveCampaign('', true, storage, 'c', 400), null);
});
test('Refusal clears persistence; a current-page aggregate label still works', () => {
  const storage = memory();
  resolveCampaign(query, true, storage, 'c', 100);
  assert.equal(resolveCampaign('', false, storage, 'c', 200), null);
  assert.equal(storage.getItem('c'), null);
  assert.deepEqual(resolveCampaign(query, false, storage, 'c', 300), campaign);
  assert.equal(storage.getItem('c'), null);
});
test('Corrupt or disabled browser storage does not break outbound links', () => {
  const storage = memory(); storage.setItem('c', '{bad json');
  assert.equal(resolveCampaign('', true, storage, 'c'), null);
  const blocked = { getItem(){throw Error();}, setItem(){throw Error();}, removeItem(){throw Error();} };
  assert.deepEqual(resolveCampaign(query, true, blocked, 'c'), campaign);
});
