import { getGtmContainerIds } from "@/lib/analytics";

/** The `<noscript>` half of the GTM snippet. Belongs right after `<body>`. */
export function GoogleTagManagerNoScript(): React.ReactElement | null {
  const ids = getGtmContainerIds();
  if (ids.length === 0) return null;

  return (
    <noscript>
      {ids.map((id) => (
        <iframe
          key={id}
          src={`https://www.googletagmanager.com/ns.html?id=${id}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      ))}
    </noscript>
  );
}
