import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { writerNavItems } from "@/constants/dashboard";

export default function WriterMessagesPage() {
  return (
    <AuthGuard allowedRoles={["writer"]}>
      <DashboardShell title="Mesajlar" description="Konuşmalarınızı gerçek zamanlı takip edin." navItems={writerNavItems}>
        <div className="rounded-3xl border border-forest-100 bg-white/90 p-6 text-sm text-forest-700 shadow-sm">
          Bu bölüm, Supabase sorguları ve React Query patternleri ile tamamlanmak üzere hazırlandı.
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}
