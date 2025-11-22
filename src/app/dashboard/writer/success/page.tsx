"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { writerNavItems } from "@/constants/dashboard";
import { useSupabase } from "@/lib/supabase/client";

const myStories = [
  { id: "1", title: "Festival seçkisi", body: "Sahildeki Düşler Cannes Short Film Corner'a seçildi.", verified: true },
  { id: "2", title: "Opsiyon anlaşması", body: "Göbeklitepe Günlükleri için opsiyon sözleşmesi imzaladım.", verified: false },
];

export default function WriterSuccessPage() {
  const supabase = useSupabase();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setMessage(null);
    try {
      const { error } = await supabase.from("success_stories").insert({
        title,
        body,
        verified: false,
      });
      if (error) throw error;
      setMessage("Başarı hikayen alındı, doğrulama sonrası yayınlanacak.");
      setStatus("idle");
      setTitle("");
      setBody("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Hikaye kaydedilemedi. RLS writer_id eşleşmesini doğrulayın.");
    }
  };

  return (
    <AuthGuard allowedRoles={["writer"]}>
      <DashboardShell
        title="Başarılar"
        description="Black List 'Share Good News' akışının Ducktylo uyarlaması."
        navItems={writerNavItems}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Hikaye paylaş</CardTitle>
              <CardDescription>success_stories tablosuna writer_id ile eklenir.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Detay</Label>
                  <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={4} required />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-forest-700">Doğrulama sonrası verified = true olarak herkese açılır.</p>
                  <Button type="submit" disabled={status === "saving"}>
                    {status === "saving" ? "Gönderiliyor" : "Paylaş"}
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

          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Gönderilerim</CardTitle>
              <CardDescription>RLS sayesinde sadece writer_id size ait kayıtlar listelenir.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {myStories.map((story) => (
                <div key={story.id} className="flex items-start justify-between rounded-xl border border-forest-100 p-4">
                  <div>
                    <p className="text-sm font-semibold text-forest-900">{story.title}</p>
                    <p className="text-xs text-forest-700">{story.body}</p>
                  </div>
                  <Badge variant={story.verified ? "default" : "secondary"}>{story.verified ? "Doğrulandı" : "Onay bekliyor"}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}
