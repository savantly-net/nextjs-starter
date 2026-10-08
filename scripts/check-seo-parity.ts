/**
 * SEO parity: every page in data/legacy-seo.json must carry the signals the
 * previous site published: title, meta description, canonical, robots and
 * og:image. Compares against the JSON, never the old origin, so it works in a
 * sandbox and after cutover.
 *
 *   pnpm check:seo-parity --base=http://localhost:3100
 *   pnpm check:seo-parity --base=http://localhost:3100 --json          # JSON to stdout
 *   pnpm check:seo-parity --base=http://localhost:3100 --json=out.json
 *
 * Build the target as production (NEXT_PUBLIC_SITE_URL = data/site.json#url),
 * or every page is correctly noindex and robots will not match.
 * Exit 1 on any mismatch.
 */
import { writeFileSync } from "node:fs";
import { getAllLegacySeo } from "../lib/legacy-seo";
import type { LegacySeo } from "../types/site";
import { arg, flag, mapWithConcurrency, toPath } from "./lib/cli";
import { extractSignals, type PageSignals } from "./lib/page-signals";

const CONCURRENCY = 6;

export interface SeoFinding {
  path: string;
  field: keyof PageSignals | "status";
  expected: string;
  actual: string;
}

const bare = (path: string): string => path.replace(/\/+$/, "") || "/";

/** Compare what a page serves against what the previous site published. */
export function compareSignals(path: string, legacy: LegacySeo, served: PageSignals): SeoFinding[] {
  const findings: SeoFinding[] = [];
  const add = (field: SeoFinding["field"], expected: string, actual: string): void => {
    findings.push({ path, field, expected, actual });
  };

  if (served.title !== legacy.title.trim()) add("title", legacy.title, served.title);

  const description = legacy.description?.trim() ?? "";
  if (served.description !== description) add("description", description, served.description);

  const canonical = legacy.canonicalPath ?? path;
  if (bare(toPath(served.canonical)) !== bare(canonical)) {
    add("canonical", canonical, served.canonical);
  }

  const shouldIndex = !legacy.noIndex;
  if (served.indexable !== shouldIndex) {
    add("indexable", String(shouldIndex), String(served.indexable));
  }

  if (legacy.ogImage && toPath(served.ogImage) !== toPath(legacy.ogImage)) {
    add("ogImage", legacy.ogImage, served.ogImage);
  }

  return findings;
}

/** Findings for one page, or null when it now redirects (url-parity's concern). */
async function check(base: string, path: string, legacy: LegacySeo): Promise<SeoFinding[] | null> {
  try {
    const response = await fetch(new URL(path, base), { redirect: "manual" });
    if (response.status >= 300 && response.status < 400) return null;
    if (response.status !== 200) {
      return [{ path, field: "status", expected: "200", actual: String(response.status) }];
    }
    return compareSignals(path, legacy, extractSignals(await response.text()));
  } catch (error) {
    return [{ path, field: "status", expected: "200", actual: String(error) }];
  }
}

async function main(): Promise<void> {
  const base = arg("base", "").replace(/\/+$/, "");
  if (!base) {
    console.error("Pass --base=<origin of the Next.js deployment>, e.g. --base=http://localhost:3100");
    process.exitCode = 2;
    return;
  }

  const pages = getAllLegacySeo();
  const results = await mapWithConcurrency(pages, CONCURRENCY, ([path, legacy]) =>
    check(base, path, legacy)
  );
  const redirected = results.filter((result) => result === null).length;
  const findings = results.flatMap((result) => result ?? []);

  const json = arg("json", "");
  if (flag("json")) {
    console.log(JSON.stringify({ checked: pages.length, redirected, findings }, null, 2));
  } else {
    const byField = Map.groupBy(findings, (finding) => finding.field);
    for (const [field, group] of byField) {
      console.log(`\n── ${field} (${group.length})`);
      for (const finding of group) {
        console.log(`   ${finding.path}\n      expected: ${finding.expected}\n      actual:   ${finding.actual}`);
      }
    }
    console.log(
      `\n${pages.length} pages checked against ${base}: ${findings.length} differences` +
        ` (${redirected} now redirect; see check:url-parity).`
    );
    if (json) writeFileSync(json, `${JSON.stringify(findings, null, 2)}\n`);
  }

  process.exitCode = findings.length > 0 ? 1 : 0;
}

if (process.argv[1]?.endsWith("check-seo-parity.ts")) void main();
