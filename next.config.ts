import type { NextConfig } from "next";
import siteConfig from "./data/site.json";

const nextConfig: NextConfig = {
  // URLs keep the form the previous site used (data/site.json#trailingSlash).
  trailingSlash: siteConfig.trailingSlash ?? false,
  // proxy.ts normalises slashes itself, AFTER legacy redirects, so an old URL
  // never takes two hops.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
