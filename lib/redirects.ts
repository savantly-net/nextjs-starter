import type { RedirectRule } from "@/types/site";

export interface RedirectMatch {
  destination: string;
  permanent: boolean;
}

/**
 * Strip the trailing slash, so one rule matches both `/old` and `/old/`.
 * Rules are written without it; destinations carry the site's convention.
 */
export function normalizePathname(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") || "/" : pathname;
}

const compiled = new Map<string, RegExp>();

function regexFor(source: string): RegExp {
  let regex = compiled.get(source);
  if (!regex) {
    regex = new RegExp(source);
    compiled.set(source, regex);
  }
  return regex;
}

/**
 * Find the first redirect rule whose source regex matches the given pathname
 * (trailing slash ignored). Returns the resolved destination, with `$1`, `$2`…
 * replaced by capture groups, or null.
 */
export function matchRedirect(pathname: string, rules: RedirectRule[]): RedirectMatch | null {
  const normalized = normalizePathname(pathname);

  for (const rule of rules) {
    const match = regexFor(rule.source).exec(normalized);
    if (match) {
      const destination = rule.destination.replace(
        /\$(\d+)/g,
        (_, index: string) => match[Number(index)] ?? ""
      );
      return { destination, permanent: rule.permanent };
    }
  }
  return null;
}
