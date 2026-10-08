import { BreadcrumbStructuredData } from "@/components/seo/breadcrumb-structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { getSiteConfig } from "@/lib/metadata";
import { getLegacySeo } from "@/lib/legacy-seo";
import { absoluteImageUrl, websiteId } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/site-url";

interface WebPageStructuredDataProps {
  /** The route, as passed to buildMetadata. */
  path: string;
  /** The page's H1; the last breadcrumb. */
  name: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";
}

/**
 * WebPage (+ primary image) and a Home → page BreadcrumbList. Description,
 * image and dates come from what the previous site published at `path`.
 */
export function WebPageStructuredData({
  path,
  name,
  type = "WebPage",
}: WebPageStructuredDataProps): React.ReactElement {
  const site = getSiteConfig();
  const url = absoluteUrl(path);
  const seo = getLegacySeo(path);
  const image = seo?.ogImage ? absoluteImageUrl(seo.ogImage) : undefined;
  const isHome = path === "/";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": type,
              "@id": url,
              url,
              name: seo?.title ?? name,
              ...(seo?.description && { description: seo.description }),
              isPartOf: { "@id": websiteId() },
              ...(seo?.publishedTime && { datePublished: seo.publishedTime }),
              ...(seo?.modifiedTime && { dateModified: seo.modifiedTime }),
              ...(image && { primaryImageOfPage: { "@id": `${url}#primaryimage` } }),
              ...(!isHome && { breadcrumb: { "@id": `${url}#breadcrumb` } }),
              inLanguage: site.locale,
            },
            ...(image
              ? [{ "@type": "ImageObject", "@id": `${url}#primaryimage`, url: image, contentUrl: image }]
              : []),
          ],
        }}
      />
      {!isHome && (
        <BreadcrumbStructuredData
          entries={[
            { name: "Home", path: "/" },
            { name, path },
          ]}
        />
      )}
    </>
  );
}
