import { cn } from "./utils";

// Seed test — proves the harness runs green on the untouched starter.
// Uses vitest globals (no import); see vitest-globals.d.ts for the type ref.
describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("merges conflicting tailwind utilities (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
