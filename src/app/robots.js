import { getSiteUrl } from "@/lib/siteUrl";

/**
 * @returns {import("next").MetadataRoute.Robots}
 */
export default function robots() {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
