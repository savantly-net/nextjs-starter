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
  features/       # Feature-specific components
data/             # JSON-driven site configuration
  site.json       # Global site config (name, description, social links)
  scripts.json    # Third-party scripts with URL pattern matching
  redirects.json  # URL redirect rules (regex-matched)
  navigation.json # Site hierarchy and navigation tree
lib/              # Utility functions and shared logic
  metadata.ts     # Next.js Metadata builder with site defaults
  scripts.ts      # Script filtering by URL regex patterns
  redirects.ts    # Redirect matching engine
  navigation.ts   # Navigation, breadcrumb, and active-state helpers
  utils.ts        # General utilities (cn, etc.)
hooks/            # Custom React hooks
types/
  site.ts         # All site-related types
public/           # Static assets
proxy.ts          # Next.js 16 proxy — processes redirects at the edge
```

## Redirects

URL redirects are defined in `data/redirects.json` and processed by the Next.js proxy on every request. Rules use regex patterns with capture group support:

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

`lib/metadata.ts` provides `buildMetadata(page?)` which merges site defaults with per-page overrides:

```ts
// app/about/page.tsx
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "About",
  description: "Learn more about us",
});
```

## Third-Party Scripts

Scripts are defined in `data/scripts.json` with URL pattern matching. Each script specifies regex patterns for which pages it should load on. An empty `urlPatterns` array loads the script on all pages.

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
