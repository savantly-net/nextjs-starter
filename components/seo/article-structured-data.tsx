import { BreadcrumbStructuredData } from "@/components/seo/breadcrumb-structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { getSiteConfig } from "@/lib/metadata";
import { getLegacySeo } from "@/lib/legacy-seo";
import { absoluteImageUrl, organizationId, websiteId } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/site-url";

interface ArticleStructuredDataProps {
  /** The post's route, as passed to buildMetadata. */
  path: string;
  /** The post title, as shown in its H1. */
  headline: string;
  /** ISO 8601; defaults to the previous site's article:published_time. */
  datePublished?: string;
  dateModified?: string;
  /** The byline. Omitted → the Organization is the author. */
  authorName?: string;
  /** Root-relative or absolute; defaults to the previous site's og:image. */
  image?: string;
  keywords?: string[];
  section?: string[];
}

/** Article + WebPage (+ primary image) and breadcrumbs, for a blog post. */
export function ArticleStructuredData({
  path,
  headline,
  datePublished,
  dateModified,
  authorName,
  image,
  keywords,
  section,
}: ArticleStructuredDataProps): React.ReactElement {
  const site = getSiteConfig();
  const url = absoluteUrl(path);
  const seo = getLegacySeo(path);
  const published = datePublished ?? seo?.publishedTime;
  const modified = dateModified ?? seo?.modifiedTime ?? published;
  const imageUrl = image ?? seo?.ogImage;
  const resolvedImage = imageUrl ? absoluteImageUrl(imageUrl) : undefined;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "@id": `${url}#article`,
              isPartOf: { "@id": url },
              mainEntityOfPage: { "@id": url },
              headline,
              ...(published && { datePublished: published }),
              ...(modified && { dateModified: modified }),
              author: authorName
                ? { "@type": "Person", name: authorName }
                : { "@id": organizationId() },
              publisher: { "@id": organizationId() },
              ...(resolvedImage && { image: { "@id": `${url}#primaryimage` } }),
              ...(keywords?.length && { keywords }),
              ...(section?.length && { articleSection: section }),
              inLanguage: site.locale,
            },
            {
              "@type": "WebPage",
              "@id": url,
              url,
              name: seo?.title ?? headline,
              ...(seo?.description && { description: seo.description }),
              isPartOf: { "@id": websiteId() },
              ...(published && { datePublished: published }),
              ...(modified && { dateModified: modified }),
              ...(resolvedImage && { primaryImageOfPage: { "@id": `${url}#primaryimage` } }),
              breadcrumb: { "@id": `${url}#breadcrumb` },
              inLanguage: site.locale,
            },
            ...(resolvedImage
              ? [
                  {
                    "@type": "ImageObject",
                    "@id": `${url}#primaryimage`,
                    url: resolvedImage,
                    contentUrl: resolvedImage,
                  },
                ]
              : []),
          ],
        }}
      />
      <BreadcrumbStructuredData
        entries={[
          { name: "Home", path: "/" },
          { name: headline, path },
        ]}
      />
    </>
  );
}
