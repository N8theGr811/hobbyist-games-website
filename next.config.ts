import type { NextConfig } from "next";

/**
 * Hosts that used to serve this site and now fold into the canonical origin.
 * Kept in sync by hand with SITE_URL in src/lib/site.ts, which next.config.ts
 * cannot import — the config is loaded outside the tsconfig path aliases.
 */
const CANONICAL_ORIGIN = "https://www.submissionsaga.com";
const RETIRED_HOSTS = ["hobbyistgames.com", "www.hobbyistgames.com"];

/**
 * Where players talk to each other, and the only place its address is written.
 * The footer links to /community rather than to Reddit, and a link in the game
 * should too: then moving the community is this one line, with no game build.
 * Temporary (307) on purpose: browsers cache a permanent redirect forever and
 * would keep sending returning visitors to the old place.
 */
const COMMUNITY_URL = "https://www.reddit.com/r/SubmissionSaga/";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...RETIRED_HOSTS.map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        permanent: true,
      })),
      { source: "/community", destination: COMMUNITY_URL, permanent: false },
    ];
  },
};

export default nextConfig;
