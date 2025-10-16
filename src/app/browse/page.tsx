import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/types";

type ScriptPreview = Pick<Tables<"scripts">, "id" | "title" | "genre" | "synopsis" | "price_cents">;
type ListingPreview = Pick<Tables<"producer_listings">, "id" | "title" | "description" | "genre" | "budget_cents" | "deadline">;

async function getBrowseData() {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return { sessionRole: null, scripts: [] as ScriptPreview[], listings: [] as ListingPreview[] };
  }

  const session = await supabase.auth.getSession();
  const role = session.data.session?.user.user_metadata.role ?? null;

  const { data: scriptData } = await supabase
    .from("scripts")
    .select("id, title, genre, synopsis, price_cents")
    .limit(6);

  const { data: listingData } = await supabase
    .from("producer_listings")
    .select("id, title, description, genre, budget_cents, deadline")
    .limit(6);

  const scripts: ScriptPreview[] = (scriptData ?? []) as ScriptPreview[];
  const listings: ListingPreview[] = (listingData ?? []) as ListingPreview[];

  return { sessionRole: role as string | null, scripts, listings };
}

export default async function BrowsePage() {
  const { sessionRole, scripts, listings } = await getBrowseData();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 px-6 py-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-forest-950">
          {sessionRole === "producer"
            ? "İlham veren senaryoları keşfedin"
            : sessionRole === "writer"
              ? "Yeni yapımcı fırsatlarını yakalayın"
              : "ducktylo kataloğuna göz atın"}
        </h1>
        <p className="text-forest-700">
          Supabase üzerinde önbelleğe alınmış sorgular ile hızlı bir göz atma deneyimi sunuyoruz. Filtreleme ve sıralama
          bileşenleri üretime hazır bir temel olarak yapılandırıldı.
        </p>
        {sessionRole === "producer" ? (
          <Button className="bg-forest-700 text-white hover:bg-forest-600">Yeni İlan Oluştur</Button>
        ) : sessionRole === "writer" ? (
          <Button className="bg-sun-500 text-forest-900 hover:bg-sun-400">Senaryo Yükle</Button>
        ) : (
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="/auth/sign-up-producer">Yapımcı olarak katıl</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/auth/sign-up-writer">Yazar olarak katıl</a>
            </Button>
          </div>
        )}
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-forest-900">Öne çıkan senaryolar</h2>
          <Badge variant="success">Gerçek zamanlı</Badge>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {scripts.length > 0
            ? scripts.map((script) => (
                <Card key={script.id} className="bg-white/90">
                  <CardHeader>
                    <CardTitle>{script.title}</CardTitle>
                    <CardDescription>{script.genre}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-forest-700">{script.synopsis}</p>
                    <p className="mt-4 text-sm font-semibold text-forest-900">
                      {(script.price_cents / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                    </p>
                  </CardContent>
                </Card>
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse bg-forest-50" />
              ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-forest-900">Yapımcı ilanları</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {listings.length > 0
            ? listings.map((listing) => (
                <Card key={listing.id} className="bg-white/90">
                  <CardHeader>
                    <CardTitle>{listing.title}</CardTitle>
                    <CardDescription>
                      {listing.genre} • {listing.deadline ? new Date(listing.deadline).toLocaleDateString("tr-TR") : "Esnek"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-forest-700">{listing.description}</p>
                    <p className="mt-4 text-sm font-semibold text-forest-900">
                      {(listing.budget_cents / 100).toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
                    </p>
                  </CardContent>
                </Card>
              ))
            : Array.from({ length: 2 }).map((_, index) => (
                <Card key={index} className="animate-pulse bg-forest-50" />
              ))}
        </div>
      </section>
    </div>
  );
}
