import { matchRedirect, normalizePathname } from "./redirects";

const rules = [
  { source: "^/old$", destination: "/new/", permanent: true },
  { source: "^/category/([^/]+)$", destination: "/$1/", permanent: true },
  { source: "^/(\\d+)/(\\d+)/x$", destination: "/a/$2/$1/$2/", permanent: false },
  { source: "^/wp-content/uploads/(.+)$", destination: "/media/$1", permanent: true },
  { source: "^/sitemap_index\\.xml$", destination: "/sitemap.xml", permanent: true },
];

describe("normalizePathname", () => {
  it("strips trailing slashes but keeps the root", () => {
    expect(normalizePathname("/a/")).toBe("/a");
    expect(normalizePathname("/a//")).toBe("/a");
    expect(normalizePathname("/")).toBe("/");
  });
});

describe("matchRedirect", () => {
  it("matches with or without the trailing slash", () => {
    expect(matchRedirect("/old", rules)).toEqual({ destination: "/new/", permanent: true });
    expect(matchRedirect("/old/", rules)?.destination).toBe("/new/");
  });

  it("substitutes every capture group occurrence", () => {
    expect(matchRedirect("/category/news/", rules)?.destination).toBe("/news/");
    expect(matchRedirect("/2020/05/x", rules)).toEqual({
      destination: "/a/05/2020/05/",
      permanent: false,
    });
  });

  it("matches dotted paths", () => {
    expect(matchRedirect("/wp-content/uploads/2021/a.png", rules)?.destination).toBe(
      "/media/2021/a.png"
    );
    expect(matchRedirect("/sitemap_index.xml", rules)?.destination).toBe("/sitemap.xml");
  });

  it("returns null when nothing matches", () => {
    expect(matchRedirect("/older", rules)).toBeNull();
  });
});
