import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { writerNavItems } from "@/constants/dashboard";

const summaryCards = [
  { title: "Toplam Senaryo", value: "8", description: "Supabase realtime ile güncel tutulur." },
  { title: "Toplam Gelir", value: "₺18.200", description: "orders tablosu üzerinden hesaplanır." },
  { title: "Bekleyen Başvurular", value: "2", description: "applications.status = 'pending'." },
];

export default function WriterDashboardPage() {
  return (
    <AuthGuard allowedRoles={["writer"]}>
      <DashboardShell
        title="Yazar Paneli"
        description="Gelirlerinizi ve başvurularınızı tek yerden takip edin."
        navItems={writerNavItems}
      >
        <section className="grid gap-6 md:grid-cols-3">
          {summaryCards.map((card) => (
            <Card key={card.title} className="bg-white/90">
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-forest-900">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </DashboardShell>
    </AuthGuard>
  );
}
