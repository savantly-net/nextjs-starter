import * as cheerio from "cheerio";

export interface PageSignals {
  title: string;
  description: string;
  canonical: string;
  indexable: boolean;
  ogImage: string;
}

const clean = (value: string | undefined): string => (value ?? "").replace(/\s+/g, " ").trim();

/** The on-page SEO signals of an HTML document. */
export function extractSignals(html: string): PageSignals {
  const $ = cheerio.load(html);
  return {
    title: clean($("title").first().text()),
    description: clean($('meta[name="description"]').attr("content")),
    canonical: clean($('link[rel="canonical"]').attr("href")),
    indexable: !/noindex/i.test($('meta[name="robots"]').attr("content") ?? ""),
    ogImage: clean($('meta[property="og:image"]').attr("content")),
  };
}
