import { absoluteUrl, getSiteUrl, href, isIndexable, isSamePath } from "./site-url";

// data/site.json: url https://example.com, trailingSlash false.
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isIndexable", () => {
  it("denies when NEXT_PUBLIC_SITE_URL is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(isIndexable()).toBe(false);
  });

  it("denies a preview origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview-123.example.app");
    expect(isIndexable()).toBe(false);
  });

  it("allows the production origin, trailing slash or not", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/");
    expect(isIndexable()).toBe(true);
  });

  it("honours the escape hatch", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    expect(isIndexable()).toBe(true);
  });
});

describe("getSiteUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL, without its trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.app/");
    expect(getSiteUrl()).toBe("https://preview.example.app");
  });

  it("falls back to site.json", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBe("https://example.com");
  });
});

describe("href (trailingSlash: false)", () => {
  it("strips the slash", () => {
    expect(href("/about/")).toBe("/about");
  });

  it("keeps the root, files, queries and external URLs", () => {
    expect(href("/")).toBe("/");
    expect(href("/brochure.pdf")).toBe("/brochure.pdf");
    expect(href("/search/?q=x#top")).toBe("/search?q=x#top");
    expect(href("https://other.com/a/")).toBe("https://other.com/a/");
  });
});

describe("absoluteUrl", () => {
  it("joins onto the origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(absoluteUrl("/about/")).toBe("https://example.com/about");
    expect(absoluteUrl("/")).toBe("https://example.com/");
  });
});

describe("isSamePath", () => {
  it("ignores the trailing slash", () => {
    expect(isSamePath("/about", "/about/")).toBe(true);
    expect(isSamePath("/", "/")).toBe(true);
    expect(isSamePath("/about", "/team")).toBe(false);
  });
});
