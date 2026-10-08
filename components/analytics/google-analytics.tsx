import Script from "next/script";

/**
 * GA4 loaded directly with gtag.js, for sites that don't use GTM. Leave
 * `NEXT_PUBLIC_GA4_ID` unset when a GTM container already fires GA4.
 */
export function GoogleAnalytics(): React.ReactElement | null {
  const measurementId = process.env.NEXT_PUBLIC_GA4_ID;
  if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return null;

  return (
    <>
      <Script
        id="ga4-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${measurementId}');`}
      </Script>
    </>
  );
}
