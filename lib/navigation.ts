import type { NavItem } from "@/types/site";
import navigationData from "@/data/navigation.json";

/**
 * Returns the full navigation tree.
 */
export function getNavigation(): NavItem[] {
  return navigationData.items as NavItem[];
}

/**
 * Build a breadcrumb trail from the root to the item matching `pathname`.
 * Returns an empty array if the path isn't found in the navigation tree.
 */
export function getBreadcrumbs(pathname: string): NavItem[] {
  const trail: NavItem[] = [];

  function walk(items: NavItem[]): boolean {
    for (const item of items) {
      trail.push(item);
      if (item.href === pathname) {
        return true;
      }
      if (item.children && walk(item.children)) {
        return true;
      }
      trail.pop();
    }
    return false;
  }

  walk(getNavigation());
  return trail;
}

function isPathPrefix(pathname: string, href: string): boolean {
  return pathname === href || (pathname.startsWith(href) && pathname[href.length] === "/");
}

/**
 * Check whether `pathname` is within the subtree rooted at `item`.
 * Useful for highlighting active nav sections.
 */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (isPathPrefix(pathname, item.href)) return true;
  return item.children?.some((child) => isNavItemActive(child, pathname)) ?? false;
}
