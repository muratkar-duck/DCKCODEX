"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const scripts = [
  { id: "1", title: "Göbeklitepe Günlükleri", genre: "Drama", format: "Feature", location: "Şanlıurfa", language: "Türkçe", logline: "Kadim sırlarla dolu kazı alanı", owner: "writer@ducktylo.test" },
  { id: "2", title: "Sahildeki Düşler", genre: "Romantik", format: "Feature", location: "Ege", language: "Türkçe", logline: "Yaz kasabasında ikinci şans", owner: "writer@ducktylo.test" },
  { id: "3", title: "Karanlık Sokaklar", genre: "Thriller", format: "Series", location: "İstanbul", language: "Türkçe", logline: "Suç ağının içine sızan polis", owner: "writer@ducktylo.test" },
];

export default function SearchProjectsPage() {
  const [genre, setGenre] = useState("all");
  const [format, setFormat] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return scripts.filter((script) => {
      const matchesGenre = genre === "all" || script.genre === genre;
      const matchesFormat = format === "all" || script.format === format;
      const matchesQuery = query === "" || script.title.toLowerCase().includes(query.toLowerCase());
      return matchesGenre && matchesFormat && matchesQuery;
    });
  }, [genre, format, query]);

  return (
    <AuthGuard allowedRoles={["writer", "producer"]}>
      <DashboardShell
        title="Projeleri Ara"
        description="Black List arama akışının Ducktylo sürümü: genre/format filtreleri ve Supabase scripts aramaları."
        navItems={[]}
      >
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Filtreler</CardTitle>
            <CardDescription>Supabase tarafında GIN index ile hızlandırılmış text search planlanmıştır.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="query">Başlık</Label>
              <Input id="query" placeholder="Script ara" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tür</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Tür" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Hepsi</SelectItem>
                  <SelectItem value="Drama">Drama</SelectItem>
                  <SelectItem value="Romantik">Romantik</SelectItem>
                  <SelectItem value="Thriller">Thriller</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Hepsi</SelectItem>
                  <SelectItem value="Feature">Feature</SelectItem>
                  <SelectItem value="Series">Series</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Sonuçlar</CardTitle>
            <CardDescription>İlgi göster veya detay sayfasına git seçenekleri.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filtered.map((script) => (
              <div key={script.id} className="flex flex-col gap-2 rounded-xl border border-forest-100 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-forest-900">{script.title}</p>
                  <p className="text-xs text-forest-600">{script.genre} • {script.format} • {script.location}</p>
                  <p className="text-xs text-forest-600">{script.logline}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{script.language}</Badge>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/writer/scripts/${script.id}`}>Detay</Link>
                  </Button>
                  <Button size="sm" variant="default">İlgi Göster</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </DashboardShell>
    </AuthGuard>
  );
}
