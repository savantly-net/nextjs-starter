import redirectRules from "@/data/redirects.json";
import { getAllLegacySeo } from "@/lib/legacy-seo";
import { matchRedirect } from "@/lib/redirects";
import type { RedirectRule } from "@/types/site";

export interface SiteRoute {
  path: string;
  /** W3C Datetime of the last content change, when known */
  lastModified?: string;
}

/**
 * Indexable routes that are not in data/legacy-seo.json: everything on a new
 * site, and pages added after a conversion.
 */
const ADDITIONAL_ROUTES: SiteRoute[] = [{ path: "/" }];

/**
 * Previous-site URLs deliberately kept out of the sitemap (e.g. a form "thank
 * you" page that is now noindex). Keyed as in data/legacy-seo.json.
 */
const EXCLUDED = new Set<string>([]);

const bare = (path: string): string => path.replace(/\/+$/, "") || "/";

/**
 * Every indexable route, for the sitemap.
 *
 * Every legacy URL the previous site served as indexable and self-canonical
 * and that is not now redirected, plus ADDITIONAL_ROUTES. Derived from data rather than the filesystem: the
 * sitemap is a contract with search engines, and a route appearing in it by
 * accident is worse than one missing from it.
 */
export function getAllRoutes(): SiteRoute[] {
  const routes = new Map<string, SiteRoute>();

  for (const [path, seo] of getAllLegacySeo()) {
    if (seo.noIndex || seo.canonicalPath || EXCLUDED.has(path)) continue;
    if (matchRedirect(path, redirectRules as RedirectRule[])) continue;
    const lastModified = seo.modifiedTime ?? seo.publishedTime;
    routes.set(bare(path), { path, ...(lastModified && { lastModified }) });
  }
  for (const route of ADDITIONAL_ROUTES) {
    if (!routes.has(bare(route.path))) routes.set(bare(route.path), route);
  }

  return [...routes.values()];
}
