import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

export type DashboardShellProps = {
  title: string;
  description?: string;
  navItems: { href: string; label: string }[];
  children: React.ReactNode;
};

export function DashboardShell({ title, description, navItems, children }: DashboardShellProps) {
  const pathname = usePathname();
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-8 px-4 py-10 md:px-6">
      <aside className="sticky top-28 hidden h-fit min-w-[220px] rounded-2xl border border-forest-100 bg-white/80 p-4 shadow-sm md:block">
        <nav data-test-id="dashboard-nav" className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-forest-100 text-forest-900"
                    : "text-forest-700 hover:bg-forest-50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 space-y-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-forest-900">{title}</h1>
          {description ? <p className="text-sm text-forest-700">{description}</p> : null}
        </header>
        <div className="space-y-8">{children}</div>
        <footer className="border-t border-forest-100 pt-6 text-xs text-forest-500">
          ducktylo © {new Date().getFullYear()} – Güvenli senaryo ticareti.
        </footer>
      </main>
    </div>
  );
}
