export const metadata = {
  title: "Hakkımızda | ducktylo",
};

const values = [
  {
    title: "Şeffaflık",
    description: "Fiyat, başvuru ve mesajlaşma süreçlerini herkes için izlenebilir kıldık.",
  },
  {
    title: "Topluluk",
    description: "Yazarlar ve yapımcılar arasında güvenli iş birlikleri oluşturuyoruz.",
  },
  {
    title: "Teknoloji",
    description: "Supabase, React Query ve otomasyon testleri ile kesintisiz deneyim.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 px-6 py-16">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold text-forest-950">ducktylo nasıl doğdu?</h1>
        <p className="text-lg text-forest-700">
          Film ve TV projelerinde doğru hikayeyi bulmak çoğu zaman aylar sürüyor. Biz bu süreci hızlandırmak ve
          güvence altına almak için senaryo pazaryerini yeniden tasarladık.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {values.map((value) => (
          <article key={value.title} className="rounded-2xl border border-forest-100 bg-white/80 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-forest-900">{value.title}</h2>
            <p className="mt-2 text-sm text-forest-700">{value.description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl bg-forest-900 px-8 py-10 text-krem">
        <h2 className="text-2xl font-semibold">Ekibimiz</h2>
        <p className="mt-3 max-w-3xl text-forest-200">
          Türkiye ve Avrupa’daki film marketlerinden gelen geri bildirimlerle geliştirdiğimiz ducktylo, deneyimli yazılım
          geliştiricileri ve yapım danışmanlarından oluşan hibrit bir ekibin ürünü. Paydaşlarımız için sürdürülebilir gelir ve
          yüksek kaliteli içerik üretimi hedefliyoruz.
        </p>
      </section>
    </div>
  );
}
