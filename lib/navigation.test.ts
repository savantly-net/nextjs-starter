import type { NavItem } from "@/types/site";
import { isNavItemActive } from "./navigation";

describe("isNavItemActive", () => {
  it("marks a nav item active for nested descendant routes", () => {
    const item: NavItem = {
      title: "Docs",
      href: "/docs",
    };

    expect(isNavItemActive(item, "/docs/getting-started/advanced")).toBe(
      true
    );
  });

  it("does not match similar but unrelated prefixes", () => {
    const item: NavItem = {
      title: "Docs",
      href: "/docs",
    };

    expect(isNavItemActive(item, "/docs2")).toBe(false);
  });
});
