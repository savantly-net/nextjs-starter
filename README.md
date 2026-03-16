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
  ui/             # shadcn/ui base components (Button, Card, Input)
  features/       # Feature-specific components
data/             # JSON-driven site configuration
  redirects.json  # URL redirect rules (regex-matched)
  navigation.json # Site hierarchy and navigation tree
lib/              # Utility functions and shared logic
  redirects.ts    # Redirect matching engine
  navigation.ts   # Navigation, breadcrumb, and active-state helpers
  utils.ts        # General utilities (cn, etc.)
hooks/            # Custom React hooks
types/            # TypeScript type definitions
  site.ts         # Redirect and navigation types
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

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, shadcn/ui, Radix UI
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript 5 (strict mode)
- **Package Manager:** pnpm
