import type { Metadata } from "next";
import type { PageMeta, SiteConfig } from "@/types/site";
import siteConfig from "@/data/site.json";

const site = siteConfig as SiteConfig;

/**
 * Build a Next.js Metadata object by merging site defaults with per-page overrides.
 */
export function buildMetadata(page?: PageMeta): Metadata {
  const title = page?.title ? `${page.title} | ${site.name}` : site.name;
  const description = page?.description;

  return {
    title,
    ...(description && { description }),
    openGraph: {
      title,
      ...(description && { description }),
      url: site.url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      ...(page?.ogImage && {
        images: [{ url: page.ogImage }],
      }),
    },
    ...(page?.noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}

/**
 * Returns the site configuration.
 */
export function getSiteConfig(): SiteConfig {
  return site;
}
