import type { RedirectRule } from "@/types/site";

export interface RedirectMatch {
  destination: string;
  permanent: boolean;
}

/**
 * Find the first redirect rule whose source regex matches the given pathname.
 * Returns the resolved destination (with capture group substitution) or null.
 */
export function matchRedirect(
  pathname: string,
  rules: RedirectRule[]
): RedirectMatch | null {
  for (const rule of rules) {
    const regex = new RegExp(rule.source);
    const match = pathname.match(regex);
    if (match) {
      // Replace capture group placeholders ($1, $2, ...) in destination
      let destination = rule.destination;
      for (let i = 1; i < match.length; i++) {
        destination = destination.replaceAll(`$${i}`, match[i] ?? "");
      }
      return { destination, permanent: rule.permanent };
    }
  }
  return null;
}
