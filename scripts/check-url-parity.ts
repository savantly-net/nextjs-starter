/**
 * Legacy-URL parity: every URL the previous site served must still resolve —
 * served directly, or redirected in ONE hop to the page that replaced it.
 *
 *   pnpm check:url-parity --base=http://localhost:3100
 *   pnpm check:url-parity --base=https://preview.example.app --list=gsc-urls.txt
 *   pnpm check:url-parity --base=http://localhost:3100 --json          # JSON to stdout
 *   pnpm check:url-parity --base=http://localhost:3100 --json=out.json
 *
 * The list (default data/legacy-urls.txt) is one path or URL per line; `#`
 * comments and blanks are ignored. Exit 1 when any URL needs attention.
 */
import { writeFileSync } from "node:fs";
import { arg, flag, mapWithConcurrency, readList, toPath } from "./lib/cli";

const CONCURRENCY = 8;
const MAX_HOPS = 10;

type Verdict = "ok" | "redirect" | "chain" | "missing" | "broken" | "error";

export interface UrlResult {
  source: string;
  verdict: Verdict;
  status: number;
  final: string;
  hops: number;
}

const LABEL: Record<Verdict, string> = {
  ok: "OK        served directly",
  redirect: "REDIRECT  one hop to another page",
  chain: "CHAIN     reaches a page in more than one hop",
  missing: "MISSING   4xx",
  broken: "BROKEN    5xx",
  error: "ERROR     request failed",
};

const PASSING: Verdict[] = ["ok", "redirect"];

const bare = (path: string): string => path.replace(/\/+$/, "") || "/";

async function probe(base: string, source: string): Promise<UrlResult> {
  let status = 0;
  let hops = 0;
  let current = new URL(source, base).toString();

  try {
    // Walk redirects by hand: `redirect: "follow"` hides the hop count.
    for (; hops <= MAX_HOPS; hops++) {
      const response = await fetch(current, { redirect: "manual" });
      status = response.status;
      const location = response.headers.get("location");
      if (status < 300 || status >= 400 || !location) break;
      current = new URL(location, current).toString();
    }
  } catch (error) {
    return { source, verdict: "error", status: 0, final: String(error), hops };
  }

  const final = toPath(current);
  // A slash-only redirect (/about → /about/) is still the same page, but costs a hop.
  const samePage = bare(final) === bare(source);
  const verdict: Verdict =
    status >= 500
      ? "broken"
      : status >= 400
        ? "missing"
        : hops === 0
          ? "ok"
          : hops === 1 && !samePage
            ? "redirect"
            : "chain";

  return { source, verdict, status, final, hops };
}

async function main(): Promise<void> {
  const base = arg("base", process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
  if (!base) {
    console.error("Pass --base=<origin of the Next.js deployment>, e.g. --base=http://localhost:3100");
    process.exitCode = 2;
    return;
  }

  const sources = readList(arg("list", "data/legacy-urls.txt"));
  const results = await mapWithConcurrency(sources, CONCURRENCY, (source) => probe(base, source));
  const failures = results.filter((result) => !PASSING.includes(result.verdict));

  const json = arg("json", "");
  if (flag("json")) {
    console.log(JSON.stringify({ checked: results.length, failures, results }, null, 2));
  } else {
    for (const verdict of ["missing", "broken", "chain", "error", "redirect", "ok"] as Verdict[]) {
      const group = results.filter((result) => result.verdict === verdict);
      if (group.length === 0) continue;
      console.log(`\n── ${LABEL[verdict]} (${group.length})`);
      for (const result of group) {
        const detail =
          result.verdict === "ok"
            ? ""
            : `  →  ${result.final} [${result.status}, ${result.hops} hop${result.hops === 1 ? "" : "s"}]`;
        console.log(`   ${result.source}${detail}`);
      }
    }
    console.log(
      `\n${results.length} checked against ${base}: ${failures.length} need attention.`
    );
    if (json) writeFileSync(json, `${JSON.stringify(results, null, 2)}\n`);
  }

  process.exitCode = failures.length > 0 ? 1 : 0;
}

void main();
