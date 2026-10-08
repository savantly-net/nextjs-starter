vi.mock("@/data/legacy-seo.json", () => ({
  default: {
    "/": { title: "Home" },
    "/about/": { title: "About", modifiedTime: "2024-01-01T00:00:00Z" },
    "/moved/": { title: "Moved" },
    "/thanks/": { title: "Thanks", noIndex: true },
    "/blog/page/2/": { title: "Blog 2", canonicalPath: "/blog/" },
  },
}));

vi.mock("@/data/redirects.json", () => ({
  default: [{ source: "^/moved$", destination: "/about/", permanent: true }],
}));

const { getAllRoutes } = await import("./routes");

describe("getAllRoutes", () => {
  it("lists indexable, self-canonical legacy pages that still exist", () => {
    expect(getAllRoutes()).toEqual([
      { path: "/" },
      { path: "/about/", lastModified: "2024-01-01T00:00:00Z" },
    ]);
  });
});

export {};
