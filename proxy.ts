import { NextRequest, NextResponse } from "next/server";
import { matchRedirect } from "@/lib/redirects";
import { slashRedirect } from "@/lib/slash-redirect";
import redirectRules from "@/data/redirects.json";
import siteConfig from "@/data/site.json";
import type { RedirectRule, SiteConfig } from "@/types/site";

const rules = redirectRules as RedirectRule[];
const trailingSlash = (siteConfig as SiteConfig).trailingSlash ?? false;

/**
 * Redirect to `pathname`, keeping the query string.
 *
 * A plain `URL`, not `request.nextUrl.clone()`: `NextURL` re-applies the incoming
 * request's trailing-slash form when it serialises.
 */
function redirectTo(request: NextRequest, pathname: string, status: 307 | 308): NextResponse {
  const url = new URL(request.url);
  url.pathname = pathname;
  return NextResponse.redirect(url, status);
}

export function proxy(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;

  // 1) Legacy redirects, BEFORE trailing-slash normalisation
  //    (`skipTrailingSlashRedirect` in next.config.ts lets the proxy see the raw
  //    path), so an old URL reaches its destination in one hop, not two.
  const match = matchRedirect(pathname, rules);
  if (match) {
    return redirectTo(request, match.destination, match.permanent ? 308 : 307);
  }

  // 2) Trailing-slash normalisation, which Next.js no longer does for us. Only
  //    reached when no rule matched, so it never adds a hop to one.
  const normalized = slashRedirect(pathname, trailingSlash);
  if (normalized) {
    return redirectTo(request, normalized, 308);
  }

  return undefined;
}

export const config = {
  // Everything except Next.js build output. Dotted paths are included on
  // purpose: old URLs such as /page.html, /sitemap_index.xml or
  // /wp-content/uploads/… may need redirects too.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
