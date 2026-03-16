import type { ExternalScript } from "@/types/site";
import scriptsData from "@/data/scripts.json";

const scripts = scriptsData as ExternalScript[];

/**
 * Returns scripts that should load on the given pathname.
 * Scripts with an empty urlPatterns array load on all pages.
 */
export function getScriptsForPath(pathname: string): ExternalScript[] {
  return scripts.filter((script) => {
    if (script.urlPatterns.length === 0) return true;
    return script.urlPatterns.some((pattern) =>
      new RegExp(pattern).test(pathname)
    );
  });
}
