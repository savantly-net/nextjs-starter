import Script from "next/script";

/**
 * CallRail dynamic number insertion, from `NEXT_PUBLIC_CALLRAIL_SCRIPT_URL`
 * (account-specific; copy it from CallRail or the previous site's source).
 */
export function CallRail(): React.ReactElement | null {
  const src = process.env.NEXT_PUBLIC_CALLRAIL_SCRIPT_URL;
  if (!src) return null;

  return <Script id="callrail-swap" strategy="afterInteractive" src={src} />;
}
