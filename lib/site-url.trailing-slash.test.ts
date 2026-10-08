vi.mock("@/data/site.json", () => ({
  default: { name: "Test", description: "", url: "https://example.com", locale: "en-US", trailingSlash: true },
}));

const { absoluteUrl, href } = await import("./site-url");

describe("href (trailingSlash: true)", () => {
  it("adds the slash to pages", () => {
    expect(href("/about")).toBe("/about/");
    expect(href("/about/")).toBe("/about/");
    expect(href("/search?q=x")).toBe("/search/?q=x");
  });

  it("leaves files alone", () => {
    expect(href("/wp-content/uploads/a.png")).toBe("/wp-content/uploads/a.png");
  });

  it("applies to absolute URLs", () => {
    expect(absoluteUrl("/about")).toBe("https://example.com/about/");
  });
});

export {};
