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
  url: string;
  locale: string;
  socialLinks?: SocialLink[];
  copyright?: string;
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
  title?: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
}
