import Script from "next/script";

/**
 * HubSpot tracking code, from `NEXT_PUBLIC_HUBSPOT_PORTAL_ID`.
 *
 * Needed even when the site only embeds HubSpot forms: the form embed doesn't
 * set the `hubspotutk` cookie, so without this script leads arrive with no
 * source or session attribution.
 */
export function HubSpotTracking(): React.ReactElement | null {
  const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
  if (!portalId || !/^\d+$/.test(portalId)) return null;

  return (
    <Script
      id="hs-script-loader"
      strategy="afterInteractive"
      src={`https://js.hs-scripts.com/${portalId}.js`}
    />
  );
}
