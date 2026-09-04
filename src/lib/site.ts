/**
 * The one origin the site is allowed to call itself.
 *
 * Every absolute URL we emit — canonical tags, OG images, sitemap entries —
 * is built from this. hobbyistgames.com permanently redirects here; the
 * redirect lives in next.config.ts and must be updated alongside this.
 */
export const SITE_URL = "https://www.submissionsaga.com";
