import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { producerNavItems } from "@/constants/dashboard";

const metrics = [
  {
    title: "Bu Ayki Satın Almalar",
    value: "₺12.500",
    description: "Siparişler tablosundan gerçek zamanlı olarak çekilir.",
  },
  {
    title: "Bekleyen Başvurular",
    value: "4",
    description: "applications.status = 'pending' filtrelenir.",
  },
  {
    title: "Yeni İlgiler",
    value: "7",
    description: "interests tablosu ve notification_queue senkron çalışır.",
  },
];

export default function ProducerDashboardPage() {
  return (
    <AuthGuard allowedRoles={["producer"]}>
      <DashboardShell
        title="Yapımcı Paneli"
        description="Satın almalarınızı, ilanlarınızı ve başvurularınızı yönetin."
        navItems={producerNavItems}
      >
        <section className="grid gap-6 md:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.title} className="bg-white/90">
              <CardHeader>
                <CardTitle>{metric.title}</CardTitle>
                <CardDescription>{metric.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-forest-900">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </DashboardShell>
    </AuthGuard>
  );
}
