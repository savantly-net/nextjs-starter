/**
 * GTM container IDs from `NEXT_PUBLIC_GTM_IDS` (comma-separated). Unset on
 * previews so they never pollute production analytics.
 */
export function getGtmContainerIds(): string[] {
  return (process.env.NEXT_PUBLIC_GTM_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => /^GTM-[A-Z0-9]+$/.test(id));
}
