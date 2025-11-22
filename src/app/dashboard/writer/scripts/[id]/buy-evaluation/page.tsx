"use client";

import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { writerNavItems } from "@/constants/dashboard";
import { useSupabase } from "@/lib/supabase/client";

const packages = [
  { id: "pkg-standard", name: "Standard Evaluation", price: 1500, currency: "TRY" },
  { id: "pkg-premium", name: "Premium Evaluation", price: 2900, currency: "TRY" },
];

export default function BuyEvaluationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const supabase = useSupabase();
  const scriptId = params?.id as string;
  const preselected = searchParams?.get("package");
  const [selectedPackage, setSelectedPackage] = useState(preselected ?? packages[0].id);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const currentPackage = useMemo(() => packages.find((pkg) => pkg.id === selectedPackage) ?? packages[0], [selectedPackage]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setMessage(null);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("evaluation_orders")
        .insert({
          script_id: scriptId,
          package_id: selectedPackage,
          price_cents: currentPackage.price,
          currency: currentPackage.currency,
          status: "paid",
        })
        .select();
      if (orderError) throw orderError;
      const orderId = orderData?.[0]?.id;

      const { error: evaluationError } = await supabase.from("evaluations").insert({
        script_id: scriptId,
        package_id: selectedPackage,
        status: "pending",
      });
      if (evaluationError) throw evaluationError;

      setStatus("idle");
      setMessage(`Sipariş ${orderId ?? "oluşturuldu"}. Değerlendirme kuyruğa alındı.`);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Sipariş oluşturulamadı. RLS buyer_id ya da writer_id alanlarını doğrulayın.");
    }
  };

  return (
    <AuthGuard allowedRoles={["writer"]}>
      <DashboardShell
        title="Evaluation Satın Al"
        description="Ödeme simülasyonu: order.status = paid, evaluation.status = pending olarak kaydedilir."
        navItems={writerNavItems}
      >
        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Senaryo</CardTitle>
            <CardDescription>Script ID: {scriptId}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2 md:w-1/3">
                <Label>Paket</Label>
                <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Paket seç" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} — {pkg.price} {pkg.currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-xl border border-dashed border-forest-100 p-4 text-sm text-forest-700">
                Ödeme sağlayıcısı henüz entegre değil. Order status doğrudan “paid” işaretlenir ve evaluation kaydı açılır.
              </div>

              <Button type="submit" disabled={status === "saving"}>
                {status === "saving" ? "Sipariş İşleniyor" : "Satın Al"}
              </Button>
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
