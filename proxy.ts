import { NextRequest, NextResponse } from "next/server";
import { matchRedirect } from "@/lib/redirects";
import redirectRules from "@/data/redirects.json";
import type { RedirectRule } from "@/types/site";

export function proxy(request: NextRequest): NextResponse | undefined {
  const match = matchRedirect(
    request.nextUrl.pathname,
    redirectRules as RedirectRule[]
  );

  if (match) {
    const url = request.nextUrl.clone();
    url.pathname = match.destination;
    return NextResponse.redirect(url, match.permanent ? 308 : 307);
  }

  return undefined;
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
