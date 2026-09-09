import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Every indexable page. Add a route here when you add one to src/app. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/guide`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/credits`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
