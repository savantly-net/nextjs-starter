# Conversion contract

What a site converted into this starter (by hand or by site2next) must provide, and
what the starter does with it. site2next's crawler, analysis step and conversion
prompts code against this file; change both sides together.

## Environment

| Variable | Set where | Meaning |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | every deployment | The origin this deployment serves, no trailing slash (`https://www.example.com`). Inlined at **build** time. |
| `NEXT_PUBLIC_ALLOW_INDEXING` | rarely | `true` forces indexing on. Escape hatch only. |
| `NEXT_PUBLIC_GTM_IDS` | production | Comma-separated GTM container IDs. |
| `NEXT_PUBLIC_GA4_ID` | production | GA4 measurement ID, for sites that load gtag.js directly (not via GTM). |
| `NEXT_PUBLIC_CLARITY_ID` | production | Microsoft Clarity project ID. |
| `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` | production | HubSpot tracking code portal. |
| `NEXT_PUBLIC_CALLRAIL_SCRIPT_URL` | production | CallRail swap.js URL. |

Every analytics tag renders nothing when its variable is unset, so previews stay clean.

**Indexing is default-deny.** A deployment is indexable only when
`NEXT_PUBLIC_SITE_URL` equals `data/site.json#url` (the canonical production origin),
or `NEXT_PUBLIC_ALLOW_INDEXING=true`. Everything else serves `Disallow: /` and
`noindex`. Previews therefore need no special handling, but **production must have
`NEXT_PUBLIC_SITE_URL` present at build time**, or production ships `noindex`.

## `data/site.json`

```jsonc
{
  "name": "Example Co",
  "description": "Default meta description",
  "url": "https://www.example.com",   // canonical production origin, no trailing slash
  "locale": "en-US",
  "trailingSlash": true,              // match the original site's URLs (WordPress: true)
  "titleTemplate": "%s | Example Co", // "%s" alone = titles used verbatim (conversions)
  "verification": { "google": "…", "bing": "…" },  // optional ownership meta tags
  "organization": { "logo": "/logo.png", "email": "…", "telephone": "…" }, // optional
  "socialLinks": [],
  "copyright": "All rights reserved."
}
```

## `data/legacy-seo.json`

What the original site published per URL. Keys are pathnames as the original site
served them (`/`, `/about/`); lookups ignore the trailing slash.

```ts
interface LegacySeo {
  title: string;            // the full <title>, used verbatim
  description?: string;
  canonicalPath?: string;   // set only when the page canonicalised elsewhere
  ogType?: string;          // "website" | "article"
  ogImage?: string;         // absolute URL or root-relative path
  noIndex?: boolean;        // robots meta contained noindex
  publishedTime?: string;   // ISO 8601
  modifiedTime?: string;
}
```

`buildMetadata({ path })` reads it; anything passed explicitly wins.

## `data/legacy-urls.txt`

One pathname per line (`#` comments allowed): every URL the old site exposed —
its sitemap(s), the crawl, and ideally a Search Console export. Each must resolve
on the new site to a 200, in at most one redirect.

## `data/redirects.json`

```ts
interface RedirectRule {
  source: string;       // regex, matched against the pathname WITHOUT its trailing slash
  destination: string;  // $1… capture groups; include the trailing slash if trailingSlash
  permanent: boolean;   // 308 vs 307
}
```

`proxy.ts` applies rules **before** trailing-slash normalisation, so every legacy URL
resolves in one hop. The proxy runs on every path except `/_next/static`,
`/_next/image` and `/favicon.ico`, so file paths (`/sitemap_index.xml`, `/old.html`,
`/wp-content/uploads/…`) can be redirected too. Query strings are not matched.

## Routes

- Every page exports `metadata = buildMetadata({ path: "/the/route/" })` (or
  `generateMetadata` doing the same). Never hand-build `Metadata`: canonical and
  `og:url` come from `path`.
- Dynamic routes export `dynamicParams = false` and call `notFound()` for unknown
  params. No root catch-all (`app/[...slug]`): an unknown URL must 404.
- Internal links end with a slash when `trailingSlash` is true. Use `href()` from
  `lib/site-url.ts` when building paths.
- `lib/routes.ts#getAllRoutes` lists indexable routes for the sitemap: every
  `legacy-seo.json` entry that is not `noIndex`, has no `canonicalPath` and isn't
  matched by a redirect, plus `ADDITIONAL_ROUTES`.

## Components

Kebab-case files, PascalCase exports.

| Symbol | File | Use |
|---|---|---|
| `buildMetadata(page?: PageMeta)` | `lib/metadata.ts` | Every page. `PageMeta` = `{ path?, title?, rawTitle?, description?: string \| null, canonicalPath?, ogImage?, ogType?, noIndex?, publishedTime?, modifiedTime? }` |
| `getSiteUrl()`, `isIndexable()`, `absoluteUrl(path)`, `href(path)`, `isSamePath(a, b)` | `lib/site-url.ts` | |
| `getLegacySeo(path)`, `getAllLegacySeo()` | `lib/legacy-seo.ts` | |
| `getAllRoutes()` | `lib/routes.ts` | Sitemap |
| `WebPageStructuredData({ path, name, type? })` | `components/seo/web-page-structured-data.tsx` | Pages. `type`: `WebPage` \| `CollectionPage` \| `AboutPage` \| `ContactPage`. Adds Home → page breadcrumbs |
| `ArticleStructuredData({ path, headline, datePublished?, dateModified?, authorName?, image?, keywords?, section? })` | `components/seo/article-structured-data.tsx` | Blog posts |
| `BreadcrumbStructuredData({ entries })` | `components/seo/breadcrumb-structured-data.tsx` | Deeper trails |
| `SiteStructuredData` | `components/seo/site-structured-data.tsx` | Already in the layout |
| `Analytics`, `GoogleTagManagerNoScript` | `components/analytics/` | Already in the layout |

## Checks

```bash
pnpm build && pnpm start -p 3100 &
pnpm check:url-parity  --base=http://localhost:3100 [--list=data/legacy-urls.txt]
pnpm check:seo-parity  --base=http://localhost:3100
```

- `check:url-parity`: every listed URL → 200 in ≤ 1 hop. Exit 1 otherwise.
- `check:seo-parity`: for every `legacy-seo.json` entry that doesn't redirect, the
  served title, description, canonical, robots and og:image match. Offline: compares
  against the JSON, never the origin. Exit 1 on any mismatch. Build the target as
  production (`NEXT_PUBLIC_SITE_URL` = `site.json#url`) or robots won't match.
- Both accept `--json` (JSON to stdout) or `--json=<file>`.
