import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
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
  );
}
