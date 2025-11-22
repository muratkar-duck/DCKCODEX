import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { writerNavItems } from "@/constants/dashboard";

const summaryCards = [
  { title: "Toplam Senaryo", value: "8", description: "Supabase realtime ile güncel tutulur." },
  { title: "Aktif Değerlendirmeler", value: "3", description: "Teslim bekleyen değerlendirmeler." },
  { title: "Bekleyen Başvurular", value: "2", description: "applications.status = 'pending'." },
];

const recentScripts = [
  { title: "Göbeklitepe Günlükleri", genre: "Drama", createdAt: "2 gün önce" },
  { title: "Sahildeki Düşler", genre: "Romantik", createdAt: "1 hafta önce" },
];

const latestEvaluations = [
  { script: "Göbeklitepe Günlükleri", score: 82, deliveredAt: "05 Haz" },
  { script: "Sahildeki Düşler", score: 76, deliveredAt: "02 Haz" },
  { script: "Karanlık Sokaklar", score: 71, deliveredAt: "28 May" },
];

export default function WriterDashboardPage() {
  return (
    <AuthGuard allowedRoles={["writer"]}>
      <DashboardShell
        title="Yazar Paneli"
        description="Black List mantığındaki özet panosu: son senaryolar, değerlendirmeler ve top list durumunuz."
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

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Son eklenen senaryolar</CardTitle>
              <CardDescription>Black List dashboard’ındaki “My Scripts” özetine denk.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentScripts.map((script) => (
                <div key={script.title} className="rounded-xl border border-forest-100 p-3">
                  <div className="flex items-center justify-between text-sm font-medium text-forest-900">
                    <span>{script.title}</span>
                    <span className="text-forest-600">{script.genre}</span>
                  </div>
                  <p className="text-xs text-forest-600">{script.createdAt}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Son değerlendirmeler</CardTitle>
              <CardDescription>Üst paketler ile gelen coverage skorları.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {latestEvaluations.map((evaluation) => (
                <div key={evaluation.script} className="flex items-center justify-between rounded-xl border border-forest-100 p-3">
                  <div>
                    <p className="text-sm font-semibold text-forest-900">{evaluation.script}</p>
                    <p className="text-xs text-forest-600">Teslim: {evaluation.deliveredAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-forest-900">{evaluation.score}</p>
                    <p className="text-xs text-forest-600">/100</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button asChild variant="secondary" size="sm">
                  <a href="/dashboard/writer/evaluations">Tüm değerlendirmeleri aç</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Top list durumu</CardTitle>
              <CardDescription>Toplist snapshot’larında yer alan senaryolarınız.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-forest-100 p-3">
                <div>
                  <p className="text-sm font-semibold text-forest-900">Göbeklitepe Günlükleri</p>
                  <p className="text-xs text-forest-600">2025-Week-21 listesinde</p>
                </div>
                <p className="text-sm font-semibold text-forest-900">#4</p>
              </div>
              <div className="rounded-xl border border-dashed border-forest-100 p-3 text-sm text-forest-700">
                Henüz top list’te olmayan senaryolarınız için premium evaluation paketlerini deneyin.
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Öne çıkan başarılar</CardTitle>
              <CardDescription>Success stories ve featured projects birleşik görünümü.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-forest-100 p-3 text-sm text-forest-900">
                “Sahildeki Düşler” Bodrum Film Festivali finalistleri arasında yer aldı.
              </div>
              <div className="rounded-xl border border-forest-100 p-3 text-sm text-forest-900">
                “Göbeklitepe Günlükleri” editoryal seçimle öne çıkarıldı.
              </div>
              <div className="flex justify-between text-sm text-forest-700">
                <a href="/dashboard/writer/featured" className="font-semibold text-forest-900 hover:underline">
                  Tüm featured projeler
                </a>
                <a href="/dashboard/writer/success" className="hover:underline">
                  Başarı hikayesi paylaş
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </DashboardShell>
    </AuthGuard>
  );
}
