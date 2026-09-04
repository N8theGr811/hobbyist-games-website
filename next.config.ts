import type { NextConfig } from "next";

/**
 * Hosts that used to serve this site and now fold into the canonical origin.
 * Kept in sync by hand with SITE_URL in src/lib/site.ts, which next.config.ts
 * cannot import — the config is loaded outside the tsconfig path aliases.
 */
const CANONICAL_ORIGIN = "https://www.submissionsaga.com";
const RETIRED_HOSTS = ["hobbyistgames.com", "www.hobbyistgames.com"];

const nextConfig: NextConfig = {
  async redirects() {
    return RETIRED_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `${CANONICAL_ORIGIN}/:path*`,
      permanent: true,
    }));
  },
};

export default nextConfig;
