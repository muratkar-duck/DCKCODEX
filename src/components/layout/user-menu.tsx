"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { cn } from "@/utils/cn";
import { getBrowserClient } from "@/lib/supabase/client";

type UserMenuProps = {
  orientation?: "horizontal" | "vertical";
};

export function UserMenu({ orientation = "horizontal" }: UserMenuProps) {
  const { session, profile } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (!session?.user) {
    return (
      <div className={cn("flex items-center gap-3", orientation === "vertical" && "flex-col items-stretch")}> 
        <Button asChild variant="ghost">
          <Link href="/auth/sign-in">Giriş Yap</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/sign-up-writer">Yazar Ol</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/auth/sign-up-producer">Yapımcı Ol</Link>
        </Button>
      </div>
    );
  }

  const role = profile?.role ?? (session.user.user_metadata.role as string) ?? "producer";
  const quickLinks =
    role === "writer"
      ? [
          { href: "/dashboard/writer/scripts", label: "Senaryolarım" },
          { href: "/dashboard/writer/applications", label: "Başvurularım" },
        ]
      : [
          { href: "/dashboard/producer/listings", label: "İlanlarım" },
          { href: "/dashboard/producer/applications", label: "Başvurular" },
        ];

  async function handleSignOut() {
    const supabase = getBrowserClient();
    await supabase?.auth.signOut();
    router.push("/auth/sign-in");
  }

  return (
    <div className="relative" data-test-id="user-menu">
      <Button
        variant="ghost"
        className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-forest-900 shadow-sm"
        onClick={() => setOpen((state) => !state)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-700 text-sun-200">
          {session.user.email?.slice(0, 2).toUpperCase()}
        </span>
        <span className="hidden text-left text-sm font-medium md:flex md:flex-col">
          <span>{session.user.email}</span>
          <span className="text-xs text-forest-600">{role === "writer" ? "Yazar" : "Yapımcı"}</span>
        </span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-xl border border-forest-100 bg-white p-3 text-sm shadow-xl"
        >
          <div className="mb-3 flex flex-col gap-1">
            <span className="font-semibold text-forest-900">Hızlı Erişim</span>
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-1 text-forest-700 hover:bg-forest-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-md px-2 py-1 text-forest-700 hover:bg-forest-50"
              onClick={() => setOpen(false)}
            >
              <Settings className="h-4 w-4" /> Profilim
            </Link>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-2 py-1 text-left text-rose-600 hover:bg-rose-50"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" /> Çıkış Yap
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
