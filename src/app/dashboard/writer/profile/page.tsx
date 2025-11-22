"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { writerNavItems } from "@/constants/dashboard";
import { useSupabase } from "@/lib/supabase/client";

const defaultProfile = {
  bio: "Festival odaklı drama senaryoları yazarım.",
  genres: "Drama, Thriller",
  location: "İstanbul",
  website: "https://ducktylo.writers.me",
  instagram: "@ducktylo.writer",
  imdb_url: "https://imdb.com/name/nm0000001",
  represented_by: "Independent",
  languages: "Türkçe, İngilizce",
};

export default function WriterProfilePage() {
  const supabase = useSupabase();
  const [formState, setFormState] = useState(defaultProfile);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (key: keyof typeof defaultProfile, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setMessage(null);

    try {
      const { error } = await supabase.from("writer_profiles").upsert({
        bio: formState.bio,
        genres: formState.genres.split(",").map((item) => item.trim()),
        location: formState.location,
        website: formState.website,
        instagram: formState.instagram,
        imdb_url: formState.imdb_url,
        represented_by: formState.represented_by,
        languages: formState.languages.split(",").map((item) => item.trim()),
      });

      if (error) {
        throw error;
      }

      setStatus("saved");
      setMessage("Profil başarıyla güncellendi.");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Profil güncellenirken bir sorun oluştu. RLS izinlerini kontrol edin.");
    }
  };

  return (
    <AuthGuard allowedRoles={["writer"]}>
      <DashboardShell
        title="Profilim"
        description="Black List My Profile alanı: bio, tür tercihi ve bağlantılarınızı güncelleyin."
        navItems={writerNavItems}
      >
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Yazar profili</CardTitle>
            <CardDescription>Bu bilgiler search writers ve producer görünürlük kartlarında kullanılır.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bio">Biyografi</Label>
                  <Textarea
                    id="bio"
                    value={formState.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={4}
                    placeholder="Kısa bir bio yazın"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genres">Türler</Label>
                  <Input
                    id="genres"
                    value={formState.genres}
                    onChange={(e) => handleChange("genres", e.target.value)}
                    placeholder="Drama, Thriller"
                  />
                  <p className="text-xs text-forest-600">Virgülle ayırın.</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="location">Konum</Label>
                  <Input
                    id="location"
                    value={formState.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="İstanbul"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languages">Diller</Label>
                  <Input
                    id="languages"
                    value={formState.languages}
                    onChange={(e) => handleChange("languages", e.target.value)}
                    placeholder="Türkçe, İngilizce"
                  />
                  <p className="text-xs text-forest-600">Çoklu dil desteği aramalar için kullanılır.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="represented_by">Temsilci</Label>
                  <Input
                    id="represented_by"
                    value={formState.represented_by}
                    onChange={(e) => handleChange("represented_by", e.target.value)}
                    placeholder="Ajans / menajer"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formState.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    placeholder="https://"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formState.instagram}
                    onChange={(e) => handleChange("instagram", e.target.value)}
                    placeholder="@kullanici"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imdb_url">IMDb</Label>
                  <Input
                    id="imdb_url"
                    value={formState.imdb_url}
                    onChange={(e) => handleChange("imdb_url", e.target.value)}
                    placeholder="IMDb linki"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-forest-700">Güncellemeler RLS kurallarına göre writer_id = auth.uid() şeklinde kaydedilir.</div>
                <Button type="submit" disabled={status === "saving"}>
                  {status === "saving" ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </div>
            </form>

            {message ? (
              <Alert className="mt-4" variant={status === "error" ? "destructive" : "default"}>
                <AlertTitle>{status === "error" ? "Hata" : "Bilgi"}</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>
      </DashboardShell>
    </AuthGuard>
  );
}
