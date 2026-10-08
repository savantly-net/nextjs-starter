import siteConfig from "@/data/site.json";
import type { SiteConfig } from "@/types/site";

const site = siteConfig as SiteConfig;

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * The origin this deployment serves, without a trailing slash.
 *
 * `NEXT_PUBLIC_SITE_URL` (set per environment, inlined at build time), falling
 * back to `data/site.json#url`, the production origin. Canonical tags, `og:url`,
 * the sitemap and JSON-LD are all built from this.
 */
export function getSiteUrl(): string {
  return stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL?.trim() || site.url);
}

/**
 * True only for the production deployment. Drives `robots.txt` and the robots
 * meta tag.
 *
 * Default-deny: indexing requires `NEXT_PUBLIC_SITE_URL` to equal
 * `data/site.json#url`. Unset means "not production", so previews and staging
 * are never indexed. The flip side: production must have `NEXT_PUBLIC_SITE_URL`
 * at BUILD time, or it ships `Disallow: /`.
 *
 * Platform flags such as `VERCEL_ENV` are deliberately not used: a staging
 * project's production branch reports "production" too.
 */
export function isIndexable(): boolean {
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true") return true;

  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return false;

  return stripTrailingSlash(configured) === stripTrailingSlash(site.url);
}

/**
 * Apply the site's trailing-slash convention to a path. Use it for every
 * internal link, `redirect()` target and form action, so none of them costs a
 * redirect hop. Query strings, hashes and file paths are left alone.
 */
export function href(path: string): string {
  if (!path.startsWith("/")) return path;

  const match = /^([^?#]*)(.*)$/.exec(path);
  const pathname = match?.[1] ?? path;
  const rest = match?.[2] ?? "";

  if (pathname === "/" || /\.[^/]*$/.test(pathname)) return path;

  const bare = pathname.replace(/\/+$/, "");
  return `${site.trailingSlash ? `${bare}/` : bare}${rest}`;
}

/** Join a route path onto the site origin, with the site's trailing-slash convention. */
export function absoluteUrl(path: string): string {
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${href(withLeading)}`;
}

/** Same page? Compares paths ignoring the trailing slash. */
export function isSamePath(a: string, b: string): boolean {
  const bare = (path: string): string => path.replace(/\/+$/, "") || "/";
  return bare(a) === bare(b);
}
