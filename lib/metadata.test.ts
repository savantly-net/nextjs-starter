import { buildMetadata } from "./metadata";

describe("buildMetadata", () => {
  it("omits description when none is provided", () => {
    const metadata = buildMetadata({});

    expect(metadata).not.toHaveProperty("description");
    expect(metadata.openGraph).not.toHaveProperty("description");
  });

  it("omits description when an empty string is provided", () => {
    const metadata = buildMetadata({ description: "" });

    expect(metadata).not.toHaveProperty("description");
    expect(metadata.openGraph).not.toHaveProperty("description");
  });
});
