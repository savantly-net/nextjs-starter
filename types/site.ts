export interface RedirectRule {
  /** Regex pattern to match against the request pathname */
  source: string;
  /** Replacement string — supports $1, $2 capture groups */
  destination: string;
  /** true = 308 (permanent), false = 307 (temporary) */
  permanent: boolean;
}

export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
  /** Optional icon identifier for rendering */
  icon?: string;
  /** When true, link opens in a new tab */
  external?: boolean;
}

export interface SiteNavigation {
  items: NavItem[];
}

export interface SiteConfig {
  name: string;
  description: string;
  /** Canonical production origin, no trailing slash. Indexing is allowed only here. */
  url: string;
  locale: string;
  /** Whether URLs end with "/". Match the original site's URLs (WordPress: true). */
  trailingSlash?: boolean;
  /** Applied to page titles; "%s" is the page title. "%s" alone uses titles verbatim. */
  titleTemplate?: string;
  /** Search engine ownership meta tags. */
  verification?: SiteVerification;
  /** Organization details for the site-wide JSON-LD graph. */
  organization?: OrganizationConfig;
  /** Twitter/X handle, with the "@". */
  twitter?: string;
  socialLinks?: SocialLink[];
  copyright?: string;
}

export interface SiteVerification {
  /** google-site-verification */
  google?: string;
  /** msvalidate.01 */
  bing?: string;
}

export interface OrganizationConfig {
  /** Defaults to the site name. */
  name?: string;
  /** Root-relative or absolute URL. */
  logo?: string;
  email?: string;
  telephone?: string;
  address?: PostalAddress;
}

export interface PostalAddress {
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface ExternalScript {
  /** Unique identifier for this script */
  id: string;
  /** Script source URL */
  src: string;
  /** Next.js script loading strategy */
  strategy: "beforeInteractive" | "afterInteractive" | "lazyOnload";
  /** Regex patterns for URLs where this script should load. Empty array = all pages. */
  urlPatterns: string[];
}

export interface PageMeta {
  /** The route, e.g. "/about/". Drives the canonical tag, og:url and the legacy SEO lookup. */
  path?: string;
  /** Wrapped in the site's titleTemplate unless `rawTitle`. */
  title?: string;
  /** Use `title` verbatim. */
  rawTitle?: boolean;
  /** `null` omits the description tag rather than falling back to the site default. */
  description?: string | null;
  /** Canonicalise to another page instead of `path`. */
  canonicalPath?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  /** ISO 8601 */
  publishedTime?: string;
  /** ISO 8601 */
  modifiedTime?: string;
}

/**
 * What the original site published for a URL, extracted from its HTML.
 * See docs/CONVERSION-CONTRACT.md.
 */
export interface LegacySeo {
  /** The full <title>, used verbatim. */
  title: string;
  description?: string;
  /** Set only when the page canonicalised to another page. */
  canonicalPath?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}
