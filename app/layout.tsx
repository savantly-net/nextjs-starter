import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics/analytics";
import { GoogleTagManagerNoScript } from "@/components/analytics/google-tag-manager-no-script";
import { PageShell } from "@/components/layout/page-shell";
import { SiteStructuredData } from "@/components/seo/site-structured-data";
import { ExternalScripts } from "@/components/ui/external-scripts";
import { buildMetadata, getSiteConfig } from "@/lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Defaults for routes without their own metadata. Every page should still call
// buildMetadata({ path }), or it inherits the home page's canonical.
export const metadata: Metadata = buildMetadata({ path: "/" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={getSiteConfig().locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleTagManagerNoScript />
        <PageShell>{children}</PageShell>
        <SiteStructuredData />
        <Analytics />
        <ExternalScripts />
      </body>
    </html>
  );
}
