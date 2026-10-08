vi.mock("@/data/site.json", () => ({
  default: {
    name: "Example",
    description: "Site default",
    url: "https://example.com",
    locale: "en-US",
    trailingSlash: true,
    titleTemplate: "%s | Example",
    verification: { google: "g-token", bing: "b-token" },
  },
}));

vi.mock("@/data/legacy-seo.json", () => ({
  default: {
    "/": { title: "Example | Home" },
    "/about/": {
      title: "About Us - Example",
      description: "Who we are",
      ogImage: "/wp-content/uploads/about.jpg",
      publishedTime: "2020-01-01T00:00:00+00:00",
    },
    "/no-description/": { title: "Bare" },
    "/page/2/": { title: "Blog - Page 2", canonicalPath: "/blog/" },
    "/thanks/": { title: "Thanks", noIndex: true },
  },
}));

const { buildMetadata } = await import("./metadata");

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("buildMetadata", () => {
  it("uses the legacy title verbatim and a self canonical", () => {
    const metadata = buildMetadata({ path: "/about" });
    expect(metadata.title).toBe("About Us - Example");
    expect(metadata.description).toBe("Who we are");
    expect(metadata.alternates?.canonical).toBe("https://example.com/about/");
    expect(metadata.openGraph).toMatchObject({
      url: "https://example.com/about/",
      images: [{ url: "/wp-content/uploads/about.jpg" }],
      publishedTime: "2020-01-01T00:00:00+00:00",
    });
  });

  it("lets explicit values win, with the title template", () => {
    const metadata = buildMetadata({ path: "/about/", title: "About", description: "New" });
    expect(metadata.title).toBe("About | Example");
    expect(metadata.description).toBe("New");
    expect(buildMetadata({ title: "Raw", rawTitle: true }).title).toBe("Raw");
  });

  it("keeps a legacy page without a description without one", () => {
    expect(buildMetadata({ path: "/no-description/" }).description).toBeUndefined();
    expect(buildMetadata({ path: "/brand-new/" }).description).toBe("Site default");
    expect(buildMetadata({ path: "/brand-new/", description: null }).description).toBeUndefined();
  });

  it("carries a legacy canonical to another page", () => {
    expect(buildMetadata({ path: "/page/2/" }).alternates?.canonical).toBe("https://example.com/blog/");
  });

  it("indexes production pages, and keeps noindex pages followable", () => {
    expect(buildMetadata({ path: "/about/" }).robots).toMatchObject({ index: true, follow: true });
    expect(buildMetadata({ path: "/thanks/" }).robots).toEqual({ index: false, follow: true });
  });

  it("noindexes every page on a preview", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.app");
    const metadata = buildMetadata({ path: "/about/" });
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.alternates?.canonical).toBe("https://preview.example.app/about/");
  });

  it("emits the verification tags", () => {
    expect(buildMetadata({ path: "/" }).verification).toEqual({
      google: "g-token",
      other: { "msvalidate.01": "b-token" },
    });
  });
});

export {};
