import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * Unknown URLs must 404. Dynamic routes export `dynamicParams = false` and call
 * `notFound()` for unknown params; never answer every path with a catch-all.
 */
export default function NotFound(): React.ReactElement {
  return (
    <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">
        The page you were looking for doesn&apos;t exist or has moved.
      </p>
      <Button asChild>
        <Link href="/">Go to the home page</Link>
      </Button>
    </div>
  );
}
