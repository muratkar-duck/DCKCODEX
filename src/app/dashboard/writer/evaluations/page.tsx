"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { writerNavItems } from "@/constants/dashboard";

const mockEvaluations = [
  { id: "1", script: "Göbeklitepe Günlükleri", packageName: "Premium Evaluation", score: 82, deliveredAt: "2025-06-05" },
  { id: "2", script: "Sahildeki Düşler", packageName: "Standard Evaluation", score: 76, deliveredAt: "2025-06-02" },
  { id: "3", script: "Karanlık Sokaklar", packageName: "Standard Evaluation", score: 71, deliveredAt: "2025-05-28" },
];

export default function WriterEvaluationsPage() {
  const grouped = useMemo(() => mockEvaluations, []);

  return (
    <AuthGuard allowedRoles={["writer"]}>
      <DashboardShell
        title="Değerlendirmeler"
        description="Black List coverage akışına paralel: paket, skor ve teslim tarihleri."
        navItems={writerNavItems}
      >
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Alınan değerlendirmeler</CardTitle>
            <CardDescription>Yeni bir coverage almak için herhangi bir senaryo detayından satın alma adımını başlatın.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {grouped.map((evaluation) => (
              <div
                key={evaluation.id}
                className="flex flex-col gap-2 rounded-xl border border-forest-100 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-forest-900">{evaluation.script}</p>
                  <p className="text-xs text-forest-600">{evaluation.packageName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-forest-900">
                    Skor: {evaluation.score}
                  </Badge>
                  <p className="text-xs text-forest-600">Teslim: {evaluation.deliveredAt}</p>
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/dashboard/writer/scripts/${evaluation.id}/buy-evaluation`}>Tekrar Satın Al</Link>
                  </Button>
                </div>
              </div>
            ))}
            <div className="rounded-xl border border-dashed border-forest-100 p-4 text-sm text-forest-700">
              Ödeme entegrasyonu ileride Stripe/İyzico ile bağlanacak; şimdilik siparişler status = &apos;paid&apos; simülasyonu ile açılır.
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    </AuthGuard>
  );
}
