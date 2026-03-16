import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface PageShellProps {
  children: React.ReactNode;
}

/**
 * Standard page layout: header, main content area, footer.
 * Use in app/layout.tsx to wrap {children}.
 */
export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
