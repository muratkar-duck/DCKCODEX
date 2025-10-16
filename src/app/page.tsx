export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Güçlü Matchmaking",
    description:
      "Tür, bütçe ve süre gibi filtrelerle senaryolarınızı hedeflediğiniz yapımcıların önüne çıkarın.",
  },
  {
    title: "Uçtan Uca Güven",
    description:
      "Supabase destekli rol bazlı erişim ve bildirim altyapısıyla güvenli bir pazaryeri deneyimi sunuyoruz.",
  },
  {
    title: "Gerçek Zamanlı İletişim",
    description:
      "Başvurular, mesajlaşma ve ilgi bildirimleri tek panelde senkronize şekilde akar.",
  },
];

const trustSignals = [
  "100+ kayıtlı senaryo",
  "Avrupa film marketlerinde test edildi",
  "GDPR uyumlu veri altyapısı",
];

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-krem to-white">
      <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-16 pt-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-forest-100 px-4 py-1 text-xs font-semibold text-forest-700">
            Türkiye’nin ilk senaryo pazaryeri
          </span>
          <h1 className="text-4xl font-semibold leading-tight text-forest-950 md:text-5xl">
            Hikayeleriniz doğru yapımcılarla {" "}
            <span className="text-sun-600">ducktylo</span> ile buluşsun.
          </h1>
          <p className="text-lg text-forest-700">
            Yazarlar için gelir odaklı yeni bir kanal, yapımcılar için aradıkları özgün projeleri keşfetme platformu.
            Güvenli satın alma, başvuru ve mesajlaşma modülleri tek çatı altında.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-forest-700 text-white hover:bg-forest-600">
              <Link href="/browse">Senaryoları İncele</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/plans">Planları Gör</Link>
            </Button>
          </div>
          <div className="grid gap-3 text-sm text-forest-600 md:grid-cols-3">
            {trustSignals.map((item) => (
              <div key={item} className="rounded-xl border border-forest-100 bg-white/80 px-4 py-3 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="hidden h-full min-h-[320px] rounded-3xl border border-forest-100 bg-gradient-to-br from-forest-700 via-forest-500 to-sun-500 p-6 text-left text-krem shadow-xl md:flex md:flex-col md:justify-end">
          <p className="text-sm uppercase tracking-[0.3em] text-sun-200">Sektör hazır</p>
          <p className="mt-3 text-2xl font-semibold">Supabase destekli güvenli altyapı</p>
          <p className="mt-2 text-sm text-forest-50/90">Rol bazlı erişim ve uçtan uca testler ile doğrulanmış deneyim.</p>
        </div>
      </section>

      <section className="bg-white/90 py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="h-full border-none bg-gradient-to-b from-white to-forest-50/50">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-forest-600">
                  Tüm süreç boyunca veri güvenliği, bildirim kuyruğu ve tanımlı RLS politikaları ile desteklenen kurumsal bir
                  altyapı kullanırız.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-forest-900 py-16 text-krem">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="text-3xl font-semibold">Demo hesaplarla hemen deneyin</h2>
          <p className="max-w-3xl text-base text-forest-200">
            writer@ducktylo.test / producer@ducktylo.test hesapları ile giriş yapın, senaryo satın alın, başvuru gönderin ve
            mesajlaşmayı test edin.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="rounded-xl border border-forest-600 bg-forest-800 px-4 py-3 text-left text-sm">
              <p className="font-semibold">Yazar</p>
              <p>writer@ducktylo.test</p>
              <p>Şifre: password</p>
            </div>
            <div className="rounded-xl border border-forest-600 bg-forest-800 px-4 py-3 text-left text-sm">
              <p className="font-semibold">Yapımcı</p>
              <p>producer@ducktylo.test</p>
              <p>Şifre: password</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
