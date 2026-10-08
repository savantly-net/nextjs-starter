import { CallRail } from "@/components/analytics/call-rail";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";
import { HubSpotTracking } from "@/components/analytics/hubspot-tracking";
import { MicrosoftClarity } from "@/components/analytics/microsoft-clarity";

/**
 * Every tracking tag, each rendered only when its environment variable is set.
 * Set them on production only, so previews never pollute real analytics.
 */
export function Analytics(): React.ReactElement {
  return (
    <>
      <GoogleTagManager />
      <GoogleAnalytics />
      <MicrosoftClarity />
      <HubSpotTracking />
      <CallRail />
    </>
  );
}
