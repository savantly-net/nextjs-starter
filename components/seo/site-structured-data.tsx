import { JsonLd } from "@/components/seo/json-ld";
import { getSiteConfig } from "@/lib/metadata";
import { absoluteImageUrl, organizationId, websiteId } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/site-url";

/** Organization and WebSite nodes, once per page from the root layout. */
export function SiteStructuredData(): React.ReactElement {
  const site = getSiteConfig();
  const origin = getSiteUrl();
  const organization = site.organization ?? {};
  const sameAs = site.socialLinks?.map((link) => link.url) ?? [];

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": organizationId(),
            name: organization.name ?? site.name,
            url: `${origin}/`,
            ...(organization.logo && {
              logo: { "@type": "ImageObject", url: absoluteImageUrl(organization.logo) },
            }),
            ...(organization.email && { email: organization.email }),
            ...(organization.telephone && { telephone: organization.telephone }),
            ...(organization.address && {
              address: { "@type": "PostalAddress", ...organization.address },
            }),
            ...(sameAs.length > 0 && { sameAs }),
          },
          {
            "@type": "WebSite",
            "@id": websiteId(),
            url: `${origin}/`,
            name: site.name,
            description: site.description,
            publisher: { "@id": organizationId() },
            inLanguage: site.locale,
          },
        ],
      }}
    />
  );
}
