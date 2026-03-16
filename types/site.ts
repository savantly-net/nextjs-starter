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
