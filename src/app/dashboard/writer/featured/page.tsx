import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { writerNavItems } from "@/constants/dashboard";

const featuredProjects = [
  {
    id: "1",
    title: "Göbeklitepe Günlükleri",
    reason: "Editoryal seçim",
    window: "1-30 Haziran",
  },
  {
    id: "2",
    title: "Sahildeki Düşler",
    reason: "Festival shortlist'i",
    window: "15-30 Mayıs",
  },
];

export default function WriterFeaturedPage() {
  return (
    <AuthGuard allowedRoles={["writer"]}>
      <DashboardShell
        title="Featured Projects"
        description="Black List editorial highlight mantığıyla öne çıkarılan senaryolar."
        navItems={writerNavItems}
      >
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Öne çıkarılan senaryolar</CardTitle>
            <CardDescription>featured_projects tablosu üzerinden okunur; zaman penceresine göre filtrelenir.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {featuredProjects.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-forest-100 p-4">
                <div>
                  <p className="text-sm font-semibold text-forest-900">{item.title}</p>
                  <p className="text-xs text-forest-600">{item.window}</p>
                </div>
                <Badge variant="outline" className="text-forest-900">
                  {item.reason}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </DashboardShell>
    </AuthGuard>
  );
}
