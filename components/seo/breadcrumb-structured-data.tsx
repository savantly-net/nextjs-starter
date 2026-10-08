import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/site-url";

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

interface BreadcrumbStructuredDataProps {
  entries: BreadcrumbEntry[];
}

/** BreadcrumbList, Home first, the current page last. */
export function BreadcrumbStructuredData({
  entries,
}: BreadcrumbStructuredDataProps): React.ReactElement {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        // Referenced as `breadcrumb` by the page's WebPage node.
        "@id": `${absoluteUrl(entries[entries.length - 1]?.path ?? "/")}#breadcrumb`,
        itemListElement: entries.map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: entry.name,
          item: absoluteUrl(entry.path),
        })),
      }}
    />
  );
}
