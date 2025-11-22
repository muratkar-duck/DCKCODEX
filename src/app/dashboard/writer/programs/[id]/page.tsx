"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
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

export default function ProgramDetailPage() {
  const params = useParams();
  const programId = params?.id as string;
  const supabase = useSupabase();
  const [scriptId, setScriptId] = useState("");
  const [notes, setNotes] = useState("Başvuru gerekçenizi paylaşın.");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setMessage(null);
    try {
      const { error } = await supabase.from("program_applications").insert({
        program_id: programId,
        script_id: scriptId || null,
        status: "submitted",
        notes,
      });
      if (error) throw error;
      setStatus("idle");
      setMessage("Başvurunuz oluşturuldu.");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Başvuru kaydedilemedi. RLS ve writer_id bağlamını doğrulayın.");
    }
  };

  return (
    <AuthGuard allowedRoles={["writer"]}>
      <DashboardShell
        title="Program Detayı"
        description="Başvuru formu program_applications tablosuna yazar."
        navItems={writerNavItems}
      >
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Başvuru Formu</CardTitle>
            <CardDescription>Program ID: {programId}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="script">Hangi senaryo ile?</Label>
                <Input
                  id="script"
                  placeholder="Script UUID"
                  value={scriptId}
                  onChange={(e) => setScriptId(e.target.value)}
                />
                <p className="text-xs text-forest-600">scripts.id ile eşleşir; boş bırakılırsa sadece yazar başvurusu olarak kaydedilir.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notlar</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  rows={4}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-forest-700">Başvurular RLS nedeniyle sadece writer_id = auth.uid() için görünür.</p>
                <Button type="submit" disabled={status === "saving"}>
                  {status === "saving" ? "Gönderiliyor" : "Başvuru Yap"}
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
