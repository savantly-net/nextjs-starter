import type { Metadata } from "next";
import { WebPageStructuredData } from "@/components/seo/web-page-structured-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({ path: "/" });

export default function Home() {
  return (
    <>
    <WebPageStructuredData path="/" name="Next.js Starter" />
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Next.js Starter</CardTitle>
          <CardDescription>
            A starter template with shadcn/ui, Tailwind CSS, and TypeScript.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse Components
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
