"use client";

import { useMemo, useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { writerNavItems } from "@/constants/dashboard";

const snapshots = [
  {
    id: "weekly-21",
    label: "2025-Week-21",
    period: "weekly",
    data: [
      { rank: 1, script: "Kule", score: 88 },
      { rank: 2, script: "Deniz Feneri", score: 84 },
      { rank: 3, script: "Göbeklitepe Günlükleri", score: 82 },
    ],
  },
  {
    id: "monthly-05",
    label: "2025-May",
    period: "monthly",
    data: [
      { rank: 1, script: "Karanlık Sokaklar", score: 85 },
      { rank: 2, script: "Sahildeki Düşler", score: 81 },
      { rank: 3, script: "Göbeklitepe Günlükleri", score: 79 },
    ],
  },
];

export default function WriterToplistsPage() {
  const [selectedId, setSelectedId] = useState(snapshots[0].id);
  const current = useMemo(() => snapshots.find((item) => item.id === selectedId) ?? snapshots[0], [selectedId]);

  return (
    <AuthGuard allowedRoles={["writer"]}>
      <DashboardShell
        title="Top Listeler"
        description="Black List top list mantığı: dönemsel snapshot verilerini Supabase toplist_snapshots tablosundan okuyun."
        navItems={writerNavItems}
      >
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Top list snapshot</CardTitle>
            <CardDescription>Snapshot JSON’u parse edilerek script adı ve skorları listelenir.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 md:w-1/3">
              <Label>Periyot</Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Snapshot seçin" />
                </SelectTrigger>
                <SelectContent>
                  {snapshots.map((snapshot) => (
                    <SelectItem key={snapshot.id} value={snapshot.id}>
                      {snapshot.label} ({snapshot.period})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {current.data.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between rounded-xl border border-forest-100 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-forest-900">#{item.rank} {item.script}</p>
                    <p className="text-xs text-forest-600">{current.label} • {current.period}</p>
                  </div>
                  <Badge variant={item.script === "Göbeklitepe Günlükleri" ? "default" : "secondary"}>
                    {item.score}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    </AuthGuard>
  );
}
