import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { producerNavItems } from "@/constants/dashboard";

export default function ProducerBillingPage() {
  return (
    <AuthGuard allowedRoles={["producer"]}>
      <DashboardShell title="Faturalandırma" description="Plan yükseltme ve ödeme özetleri burada yer alır." navItems={producerNavItems}>
        <div className="rounded-3xl border border-forest-100 bg-white/90 p-6 text-sm text-forest-700 shadow-sm">
          Bu modül, Supabase sorguları ve React Query cache’i ile etkileşimli hale getirilmek üzere yapılandırıldı.
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}
