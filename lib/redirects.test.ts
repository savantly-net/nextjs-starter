import type { RedirectRule } from "@/types/site";
import { matchRedirect } from "./redirects";

describe("matchRedirect", () => {
  it("expands capture placeholders in the destination for every occurrence", () => {
    const rules: RedirectRule[] = [
      {
        source: "^/docs/v1/(.*)$",
        destination: "/docs/v2/$1/$1",
        permanent: false,
      },
    ];

    expect(matchRedirect("/docs/v1/api", rules)).toEqual({
      destination: "/docs/v2/api/api",
      permanent: false,
    });
  });
});
