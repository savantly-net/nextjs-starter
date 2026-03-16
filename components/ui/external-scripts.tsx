"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { getScriptsForPath } from "@/lib/scripts";

/**
 * Renders third-party scripts that match the current pathname.
 * Place this in the root layout to load scripts based on URL patterns.
 */
export function ExternalScripts() {
  const pathname = usePathname();
  const scripts = getScriptsForPath(pathname);

  if (scripts.length === 0) return null;

  return (
    <>
      {scripts.map((script) => (
        <Script
          key={script.id}
          id={script.id}
          src={script.src}
          strategy={script.strategy}
        />
      ))}
    </>
  );
}
