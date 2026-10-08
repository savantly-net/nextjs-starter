import legacySeoData from "@/data/legacy-seo.json";
import type { LegacySeo } from "@/types/site";

/** `/foo` and `/foo/` are the same page. */
function key(path: string): string {
  return path.replace(/\/+$/, "") || "/";
}

const entries = Object.entries(legacySeoData as Record<string, LegacySeo>);
const byKey = new Map(entries.map(([path, seo]) => [key(path), seo]));

/**
 * What the previous site published for `path`: title, description, canonical,
 * og:image, robots and dates (data/legacy-seo.json). Undefined for routes that
 * did not exist there.
 */
export function getLegacySeo(path: string): LegacySeo | undefined {
  return byKey.get(key(path));
}

/** Every path the previous site served, keyed as it served them, with its SEO. */
export function getAllLegacySeo(): [string, LegacySeo][] {
  return entries;
}
