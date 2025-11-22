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

const writers = [
  { id: "1", username: "writer@ducktylo.test", bio: "Festival odaklı drama", genres: ["Drama", "Thriller"], location: "İstanbul", languages: ["Türkçe", "İngilizce"] },
  { id: "2", username: "elif@ducktylo.test", bio: "Romantik komedi yazarım", genres: ["Romantik"], location: "İzmir", languages: ["Türkçe"] },
];

export default function SearchWritersPage() {
  const [genre, setGenre] = useState("all");
  const [location, setLocation] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return writers.filter((writer) => {
      const matchesGenre = genre === "all" || writer.genres.includes(genre);
      const matchesLocation = location === "all" || writer.location === location;
      const matchesQuery = query === "" || writer.username.toLowerCase().includes(query.toLowerCase());
      return matchesGenre && matchesLocation && matchesQuery;
    });
  }, [genre, location, query]);

  return (
    <AuthGuard allowedRoles={["writer", "producer"]}>
      <DashboardShell
        title="Yazarları Ara"
        description="Black List writer search mantığı: bio, tür ve lokasyon filtreleri."
        navItems={[]}
      >
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Filtreler</CardTitle>
            <CardDescription>writer_profiles tablosundaki genres, location, languages alanlarına göre filtreleme.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="query">Kullanıcı</Label>
              <Input id="query" placeholder="Yazar ara" value={query} onChange={(e) => setQuery(e.target.value)} />
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
                  <SelectItem value="Thriller">Thriller</SelectItem>
                  <SelectItem value="Romantik">Romantik</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lokasyon</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Lokasyon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Hepsi</SelectItem>
                  <SelectItem value="İstanbul">İstanbul</SelectItem>
                  <SelectItem value="İzmir">İzmir</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Sonuçlar</CardTitle>
            <CardDescription>Public profil sayfasına yönlendiren linkler.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filtered.map((writer) => (
              <div key={writer.id} className="flex flex-col gap-2 rounded-xl border border-forest-100 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-forest-900">{writer.username}</p>
                  <p className="text-xs text-forest-600">{writer.bio}</p>
                  <div className="flex flex-wrap gap-1">
                    {writer.genres.map((genreTag) => (
                      <Badge key={genreTag} variant="secondary">{genreTag}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{writer.location}</Badge>
                  <Badge variant="outline">{writer.languages.join(", ")}</Badge>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/writers/${writer.username}`}>Profil</Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </DashboardShell>
    </AuthGuard>
  );
}
