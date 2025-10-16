import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { producerNavItems } from "@/constants/dashboard";

export default function ProducerMessagesPage() {
  return (
    <AuthGuard allowedRoles={["producer"]}>
      <DashboardShell title="Mesajlar" description="ensure_conversation_with_participants fonksiyonu ile sohbetler yönetilir." navItems={producerNavItems}>
        <div className="rounded-3xl border border-forest-100 bg-white/90 p-6 text-sm text-forest-700 shadow-sm">
          Bu modül, Supabase sorguları ve React Query cache’i ile etkileşimli hale getirilmek üzere yapılandırıldı.
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}
