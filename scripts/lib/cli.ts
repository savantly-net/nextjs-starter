import { readFileSync } from "node:fs";

/** `--name=value`, or `fallback`. */
export function arg(name: string, fallback: string): string {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

/** `--name` given with no value. */
export function flag(name: string): boolean {
  return process.argv.slice(2).includes(`--${name}`);
}

/** Pathname plus query of a URL or path; origin and hash dropped. */
export function toPath(url: string): string {
  if (!url) return "";
  try {
    const parsed = new URL(url, "http://placeholder");
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

/** One path or URL per line; `#` comments and blanks ignored. */
export function readList(file: string): string[] {
  return readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => (/^https?:\/\//.test(line) ? toPath(line) : line));
}

export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await fn(items[index]!);
      }
    })
  );
  return results;
}
