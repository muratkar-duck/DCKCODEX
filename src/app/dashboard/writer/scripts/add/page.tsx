"use client";

import { useState } from "react";
import Link from "next/link";
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

const evaluationPackages = [
  { id: "pkg-standard", name: "Standard Evaluation", price: "₺1.500", includesToplist: false },
  { id: "pkg-premium", name: "Premium Evaluation", price: "₺2.900", includesToplist: true },
];

export default function AddScriptPage() {
  const supabase = useSupabase();
  const [title, setTitle] = useState("");
  const [logline, setLogline] = useState("");
  const [genre, setGenre] = useState("Drama");
  const [format, setFormat] = useState("Feature");
  const [length, setLength] = useState("100");
  const [language, setLanguage] = useState("Türkçe");
  const [tags, setTags] = useState("festival, arthouse");
  const [visibility, setVisibility] = useState("private");
  const [createdScriptId, setCreatedScriptId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setMessage(null);
    try {
      const { data, error } = await supabase.from("scripts").insert({
        title,
        synopsis: logline,
        description: logline,
        genre,
        length: Number(length),
        price_cents: 0,
      }).select();
      if (error) throw error;
      const scriptId = data?.[0]?.id ?? "new-script";
      setCreatedScriptId(scriptId);
      setStatus("idle");
      setMessage("Senaryo oluşturuldu. Değerlendirme satın alabilir ya da senaryo listesine dönebilirsiniz.");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Senaryo kaydedilemedi. RLS owner_id = auth.uid() kontrol edin.");
    }
  };

  return (
    <AuthGuard allowedRoles={["writer"]}>
      <DashboardShell
        title="Yeni Proje"
        description="Black List Add Project akışının Ducktylo uyarlaması."
        navItems={writerNavItems}
      >
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Senaryo bilgileri</CardTitle>
            <CardDescription>Başlık, logline, tür, format, dil ve tag alanları.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Tür</Label>
                  <Input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logline">Logline</Label>
                <Textarea id="logline" value={logline} onChange={(e) => setLogline(e.target.value)} rows={3} />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Input id="format" value={format} onChange={(e) => setFormat(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length">Uzunluk (sayfa)</Label>
                  <Input id="length" type="number" value={length} onChange={(e) => setLength(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Dil</Label>
                  <Input id="language" value={language} onChange={(e) => setLanguage(e.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tags">Etiketler</Label>
                  <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Görünürlük</Label>
                  <Input id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)} />
                  <p className="text-xs text-forest-600">RLS kapsamında visibility alanı ileride kullanılacak.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Dosya</Label>
                <Input id="file" type="file" />
                <p className="text-xs text-forest-600">Storage entegrasyonu için placeholder.</p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-forest-700">Kaydedildiğinde scripts tablosuna insert yapılır.</p>
                <Button type="submit" disabled={status === "saving"}>
                  {status === "saving" ? "Kaydediliyor" : "Kaydet"}
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

        {createdScriptId ? (
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Değerlendirme Satın Al</CardTitle>
              <CardDescription>evaluation_packages listesinden paket seçin ve ödeme simülasyonuyla order oluşturun.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {evaluationPackages.map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between rounded-xl border border-forest-100 p-4">
                  <div>
                    <p className="text-sm font-semibold text-forest-900">{pkg.name}</p>
                    <p className="text-xs text-forest-600">{pkg.includesToplist ? "Top list eligibility dahil" : "Standart coverage"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-forest-900">{pkg.price}</p>
                    <Button asChild size="sm">
                      <Link href={`/dashboard/writer/scripts/${createdScriptId}/buy-evaluation?package=${pkg.id}`}>
                        Satın al
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </DashboardShell>
    </AuthGuard>
  );
}
