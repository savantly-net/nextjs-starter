import type { MetadataRoute } from "next";
import { getAllRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllRoutes().map((route) => ({
    url: absoluteUrl(route.path),
    ...(route.lastModified && { lastModified: route.lastModified }),
  }));
}
