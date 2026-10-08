import Script from "next/script";
import { getGtmContainerIds } from "@/lib/analytics";

/**
 * Google Tag Manager: every container in `NEXT_PUBLIC_GTM_IDS`. When GA4 is
 * configured inside a container, don't also set `NEXT_PUBLIC_GA4_ID`, or every
 * pageview is counted twice.
 */
export function GoogleTagManager(): React.ReactElement | null {
  const ids = getGtmContainerIds();
  if (ids.length === 0) return null;

  return (
    <>
      {ids.map((id) => (
        <Script key={id} id={`gtm-${id}`} strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`}
        </Script>
      ))}
    </>
  );
}
