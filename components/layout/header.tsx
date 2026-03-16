"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavigation, isNavItemActive } from "@/lib/navigation";
import { getSiteConfig } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const navigation = getNavigation();
  const site = getSiteConfig();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold">
          {site.name}
        </Link>
        <nav className="flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                isNavItemActive(item, pathname)
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
