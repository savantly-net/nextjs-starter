/**
 * The path in the site's trailing-slash form, or null when it already is.
 * The root and file paths (anything with an extension) are left alone.
 */
export function slashRedirect(pathname: string, withSlash: boolean): string | null {
  if (pathname === "/" || /\.[^/]*$/.test(pathname)) return null;
  if (withSlash) return pathname.endsWith("/") ? null : `${pathname}/`;
  return pathname.endsWith("/") ? pathname.replace(/\/+$/, "") : null;
}
