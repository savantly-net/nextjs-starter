import { slashRedirect } from "./slash-redirect";

describe("slashRedirect", () => {
  it("adds the slash when the site uses them", () => {
    expect(slashRedirect("/about", true)).toBe("/about/");
    expect(slashRedirect("/about/", true)).toBeNull();
  });

  it("removes it when the site doesn't", () => {
    expect(slashRedirect("/about/", false)).toBe("/about");
    expect(slashRedirect("/about", false)).toBeNull();
  });

  it("never touches the root or files", () => {
    expect(slashRedirect("/", true)).toBeNull();
    expect(slashRedirect("/", false)).toBeNull();
    expect(slashRedirect("/robots.txt", true)).toBeNull();
    expect(slashRedirect("/img/a.png", false)).toBeNull();
  });
});
