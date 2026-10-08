# Next.js Starter

A starter template built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and shadcn/ui.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Commands

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Project Structure

```
app/              # Next.js App Router pages and layouts
components/
  layout/         # Page structure components
    header.tsx    # Site header driven by navigation.json
    footer.tsx    # Site footer with copyright and social links
    page-shell.tsx # Header + main + footer wrapper
  ui/             # Base UI components
    button.tsx    # shadcn/ui button
    card.tsx      # shadcn/ui card
    input.tsx     # shadcn/ui input
    raw-html.tsx  # HTML string renderer for legacy/CMS content
    responsive-image.tsx  # next/image wrapper with fill and sized modes
    external-scripts.tsx  # Loads third-party scripts by URL pattern
  seo/            # JSON-LD: site graph, WebPage, Article, BreadcrumbList
  analytics/      # GTM, GA4, Clarity, HubSpot, CallRail — each env-gated
  features/       # Feature-specific components
data/             # JSON-driven site configuration
  site.json       # Global site config (origin, trailing slashes, title template, verification)
  legacy-seo.json # What a previous site published per URL (titles, descriptions, canonicals…)
  legacy-urls.txt # Every URL a previous site exposed; checked by check:url-parity
  scripts.json    # Third-party scripts with URL pattern matching
  redirects.json  # URL redirect rules (regex-matched)
  navigation.json # Site hierarchy and navigation tree
lib/              # Utility functions and shared logic
  metadata.ts     # buildMetadata({ path }): canonical, robots, legacy SEO
  site-url.ts     # Origin, default-deny indexing, trailing-slash-aware href()
  routes.ts       # Indexable routes, for the sitemap
  scripts.ts      # Script filtering by URL regex patterns
  redirects.ts    # Redirect matching engine
  navigation.ts   # Navigation, breadcrumb, and active-state helpers
  utils.ts        # General utilities (cn, etc.)
hooks/            # Custom React hooks
types/
  site.ts         # All site-related types
public/           # Static assets
scripts/          # check:url-parity, check:seo-parity
proxy.ts          # Next.js 16 proxy — redirects, then trailing-slash normalisation
```

## SEO and indexing

Read [docs/CONVERSION-CONTRACT.md](docs/CONVERSION-CONTRACT.md) before converting an existing site.

- **Indexing is default-deny.** A deployment is indexable only when `NEXT_PUBLIC_SITE_URL`
  equals `data/site.json#url`. Previews serve `Disallow: /` and `noindex` with no setup;
  production must have `NEXT_PUBLIC_SITE_URL` set **at build time**.
- **Every page calls `buildMetadata({ path })`.** `path` sets the canonical and `og:url`
  and pulls in the previous site's SEO from `data/legacy-seo.json`.
- **Unknown URLs 404.** Dynamic routes use `dynamicParams = false` and `notFound()`.
- **Trailing slashes** follow `data/site.json#trailingSlash`; build internal links with `href()`.
- `app/robots.ts` and `app/sitemap.ts` are generated; the sitemap lists `lib/routes.ts#getAllRoutes`.

```bash
NEXT_PUBLIC_SITE_URL=https://www.example.com pnpm build && PORT=3100 pnpm start
pnpm check:url-parity --base=http://localhost:3100   # every legacy URL → 200 in ≤ 1 hop
pnpm check:seo-parity --base=http://localhost:3100   # titles, descriptions, canonicals, robots
```

## Analytics

Each tag renders only when its variable is set (see `.env.example`); set them on
production only. `NEXT_PUBLIC_GTM_IDS`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_CLARITY_ID`,
`NEXT_PUBLIC_HUBSPOT_PORTAL_ID`, `NEXT_PUBLIC_CALLRAIL_SCRIPT_URL`. Other third-party
scripts go in `data/scripts.json`, which ships empty.

## Redirects

URL redirects are defined in `data/redirects.json` and processed by the Next.js proxy on every request, before trailing-slash normalisation, so an old URL reaches its destination in one hop. Sources are regexes matched against the pathname without its trailing slash. The proxy skips paths with a dot, so a rule for a file path (`/sitemap_index.xml`, `/wp-content/uploads/…`) also needs that path in the `legacy file matchers` block of `proxy.ts`. Destinations support capture groups:

```json
[
  {
    "source": "^/old-path$",
    "destination": "/new-path",
    "permanent": true
  },
  {
    "source": "^/docs/v1/(.*)",
    "destination": "/docs/v2/$1",
    "permanent": false
  }
]
```

## Navigation

Site hierarchy is defined in `data/navigation.json` and supports nested children. Helper functions in `lib/navigation.ts` provide:

- `getNavigation()` — returns the full nav tree
- `getBreadcrumbs(pathname)` — builds a breadcrumb trail to the current page
- `isNavItemActive(item, pathname)` — checks if a nav item or its children match the current path

## Site Configuration

Global site settings live in `data/site.json` — name, description, URL, social links, and copyright text. These are used by the layout components and the metadata builder.

`lib/metadata.ts` provides `buildMetadata(page?)`, which merges site defaults, the previous site's SEO for `path` (if any) and per-page overrides. Always pass `path`:

```ts
// app/about/page.tsx
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  path: "/about",
  title: "About", // wrapped in site.json#titleTemplate
  description: "Learn more about us",
});
```

## Third-Party Scripts

Scripts not covered by the analytics components are defined in `data/scripts.json` (empty by default) with URL pattern matching. Each script specifies regex patterns for which pages it should load on. An empty `urlPatterns` array loads the script on all pages.

```json
[
  {
    "id": "analytics",
    "src": "https://example.com/analytics.js",
    "strategy": "afterInteractive",
    "urlPatterns": []
  },
  {
    "id": "checkout-widget",
    "src": "https://example.com/checkout.js",
    "strategy": "lazyOnload",
    "urlPatterns": ["^/shop", "^/cart"]
  }
]
```

Strategies: `beforeInteractive`, `afterInteractive`, `lazyOnload` (maps to Next.js `<Script>` strategy).

## Layout Components

The `PageShell` component provides the standard page structure (header, main content, footer) and is applied in the root layout. The header renders navigation from `navigation.json` with active-state highlighting. The footer displays copyright and social links from `site.json`.

## UI Utilities

- **`RawHtml`** — Renders an HTML string into the DOM. Useful for legacy content or CMS output. Accepts a custom tag and className.
- **`ResponsiveImage`** — Wrapper around `next/image`. Pass `width`/`height` for sized mode, or omit them for fill mode with an `aspectRatio` container (defaults to 16/9).

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, shadcn/ui, Radix UI
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript 5 (strict mode)
- **Package Manager:** pnpm
