import { matchRedirect } from "./redirects";

describe("matchRedirect", () => {
  it("substitutes every occurrence of the same capture placeholder", () => {
    const match = matchRedirect("/blog/post-123", [
      {
        source: "^/blog/(.*)$",
        destination: "/articles/$1/$1",
        permanent: true,
      },
    ]);

    expect(match).toEqual({
      destination: "/articles/post-123/post-123",
      permanent: true,
    });
  });
});
