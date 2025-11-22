import Link from "next/link";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { writerNavItems } from "@/constants/dashboard";

const programs = [
  {
    id: "1",
    name: "Anadolu Lab",
    description: "Genç yazarlar için 6 haftalık geliştirme programı",
    deadline: "30 Haziran 2025",
    status: "submitted",
  },
  {
    id: "2",
    name: "Festival Fellowship",
    description: "Festival öncesi script doktorluğu",
    deadline: "15 Temmuz 2025",
    status: "draft",
  },
];

export default function WriterProgramsPage() {
  return (
    <AuthGuard allowedRoles={["writer"]}>
      <DashboardShell
        title="Programlarım"
        description="Black List program/fellowship başvurularını Ducktylo program_applications akışına taşır."
        navItems={writerNavItems}
      >
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Program listesi</CardTitle>
            <CardDescription>programs tablosu herkese açık; başvurular writer_id = auth.uid() filtresiyle listelenir.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {programs.map((program) => (
              <div key={program.id} className="flex items-center justify-between rounded-xl border border-forest-100 p-4">
                <div>
                  <p className="text-sm font-semibold text-forest-900">{program.name}</p>
                  <p className="text-xs text-forest-600">Son başvuru: {program.deadline}</p>
                  <p className="text-xs text-forest-600">{program.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-forest-900 capitalize">{program.status}</Badge>
                  <Link className="text-sm font-semibold text-forest-900 hover:underline" href={`/dashboard/writer/programs/${program.id}`}>
                    Başvuru Detayı
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </DashboardShell>
    </AuthGuard>
  );
}
