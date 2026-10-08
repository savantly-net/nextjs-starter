import { getSiteUrl } from "@/lib/site-url";

/** `@id` of the site-wide Organization node (components/seo/site-structured-data.tsx). */
export function organizationId(): string {
  return `${getSiteUrl()}/#organization`;
}

/** `@id` of the site-wide WebSite node. */
export function websiteId(): string {
  return `${getSiteUrl()}/#website`;
}

/** Root-relative image paths become absolute; absolute URLs pass through. */
export function absoluteImageUrl(image: string): string {
  return image.startsWith("/") ? `${getSiteUrl()}${image}` : image;
}
