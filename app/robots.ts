import type { MetadataRoute } from "next";
import { getSiteUrl, isIndexable } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // Previews and staging must never be crawlable: two copies of a site
  // competing in the index is worse than neither being there.
  if (!isIndexable()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    // Keep noindex pages crawlable: a disallowed URL is never recrawled, so a
    // search engine would never see its noindex.
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
