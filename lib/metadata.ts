import type { Metadata } from "next";
import type { PageMeta, SiteConfig } from "@/types/site";
import siteConfig from "@/data/site.json";
import { getLegacySeo } from "@/lib/legacy-seo";
import { absoluteUrl, getSiteUrl, isIndexable } from "@/lib/site-url";

const site = siteConfig as SiteConfig;

function applyTemplate(title: string): string {
  return (site.titleTemplate ?? "%s").replace("%s", title);
}

/**
 * Build a Next.js Metadata object for a page. Pass `path` on every page:
 *
 *   export const metadata = buildMetadata({ path: "/about/" });
 *
 * `path` drives the canonical tag and `og:url`, and pulls in what the previous
 * site published for that URL (data/legacy-seo.json): title, description,
 * og:image, robots and dates, so rankings don't churn at cutover. Anything set
 * on `page` wins. Without `path` the canonical is the home page, which is wrong
 * for every page but the home page.
 */
export function buildMetadata(page?: PageMeta): Metadata {
  const legacy = page?.path ? getLegacySeo(page.path) : undefined;

  const title = page?.title
    ? page.rawTitle
      ? page.title
      : applyTemplate(page.title)
    : (legacy?.title ?? site.name);

  // A legacy page without a description keeps having none: one site-wide
  // fallback on dozens of pages is a duplicate-description warning.
  const description =
    page?.description !== undefined
      ? (page.description ?? undefined)
      : legacy
        ? legacy.description
        : site.description;

  const canonical = absoluteUrl(page?.canonicalPath ?? legacy?.canonicalPath ?? page?.path ?? "/");
  const ogImage = page?.ogImage ?? legacy?.ogImage;
  const publishedTime = page?.publishedTime ?? legacy?.publishedTime;
  const modifiedTime = page?.modifiedTime ?? legacy?.modifiedTime;
  const indexable = isIndexable() && !(page?.noIndex ?? legacy?.noIndex ?? false);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site.name,
      locale: site.locale.replace("-", "_"),
      type: page?.ogType ?? legacy?.ogType ?? "website",
      ...(ogImage && { images: [{ url: ogImage }] }),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      ...(site.twitter && { site: site.twitter }),
    },
    // A noindex page on production still passes link equity ("noindex, follow").
    robots: indexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: isIndexable() },
    ...((site.verification?.google || site.verification?.bing) && {
      verification: {
        ...(site.verification.google && { google: site.verification.google }),
        ...(site.verification.bing && { other: { "msvalidate.01": site.verification.bing } }),
      },
    }),
  };
}

/**
 * Returns the site configuration.
 */
export function getSiteConfig(): SiteConfig {
  return site;
}
