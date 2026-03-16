import Link from "next/link";
import { getSiteConfig } from "@/lib/metadata";

export function Footer() {
  const site = getSiteConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex flex-col items-center gap-4 py-6 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8 max-w-7xl">
        <p className="text-sm text-muted-foreground">
          &copy; {year} {site.name}. {site.copyright}
        </p>
        {site.socialLinks && site.socialLinks.length > 0 && (
          <nav className="flex gap-4">
            {site.socialLinks.map((link) => (
              <Link
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
