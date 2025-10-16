"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { useAuth } from "@/components/auth/auth-context";
import { UserMenu } from "@/components/layout/user-menu";

const guestLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/about", label: "Hakkımızda" },
  { href: "/how-it-works", label: "Nasıl Çalışır" },
  { href: "/plans", label: "Planlar" },
  { href: "/contact", label: "İletişim" },
];

const roleLinks: Record<string, { href: string; label: string }[]> = {
  writer: [
    { href: "/browse", label: "Keşfet" },
    { href: "/dashboard/writer", label: "Panel" },
    { href: "/dashboard/writer/messages", label: "Mesajlar" },
  ],
  producer: [
    { href: "/browse", label: "Senaryolar" },
    { href: "/dashboard/producer", label: "Panel" },
    { href: "/dashboard/producer/messages", label: "Mesajlar" },
  ],
};

export function AppHeader() {
  const { session, profile } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLinks = session?.user
    ? roleLinks[profile?.role ?? (session.user.user_metadata.role as string) ?? "producer"] ?? guestLinks
    : guestLinks;

  return (
    <header
      className="sticky top-0 z-30 border-b border-forest-100 bg-krem/90 backdrop-blur supports-[backdrop-filter]:bg-krem/70"
      data-test-id="app-header"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-forest-900">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest-700 text-sun-200">d</span>
          ducktylo
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-forest-800 md:flex" data-test-id="desktop-nav">
          {currentLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-forest-950",
                  isActive ? "text-forest-950" : "text-forest-700"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <UserMenu />
        </div>

        <Button
          className="md:hidden"
          size="icon"
          variant="ghost"
          aria-label="Menüyü aç"
          onClick={() => setMobileOpen((state) => !state)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-forest-100 bg-krem/95 px-6 py-4 md:hidden" data-test-id="mobile-nav">
          <nav className="flex flex-col gap-4">
            {currentLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-base font-medium transition-colors",
                    isActive ? "text-forest-900" : "text-forest-700"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6">
            <UserMenu orientation="vertical" />
          </div>
        </div>
      ) : null}
    </header>
  );
}
