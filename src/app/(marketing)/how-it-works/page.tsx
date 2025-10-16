export const metadata = {
  title: "Nasıl Çalışır | ducktylo",
};

const steps = [
  {
    title: "1. Hesabını oluştur",
    description: "Supabase destekli auth ile dakikalar içinde writer veya producer hesabı aç.",
  },
  {
    title: "2. İçeriğini yükle veya ilan aç",
    description: "Yazarlar senaryolarını fiyatlandırır, yapımcılar tür ve bütçe bilgisiyle ilan yayınlar.",
  },
  {
    title: "3. Başvuruları yönet",
    description: "Uygun scripti seç, ilgi bildir, başvuruları kabul et; tüm süreç dashboard üzerinden ilerler.",
  },
  {
    title: "4. Mesajlaş ve satın al",
    description: "Conversation servisimiz başvuruyla ilişkilendirilmiş mesajlaşmayı ve siparişi yönetir.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-12 px-6 py-16">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold text-forest-950">ducktylo akışı dört adımda tamamlanır</h1>
        <p className="text-lg text-forest-700">
          Güvenlik katmanları, bildirim kuyruğu ve uçtan uca testlerle güçlendirilmiş bir deneyim sunuyoruz.
        </p>
      </header>

      <ol className="grid gap-6 md:grid-cols-2">
        {steps.map((step) => (
          <li key={step.title} className="rounded-3xl border border-forest-100 bg-white/90 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-forest-900">{step.title}</h2>
            <p className="mt-2 text-sm text-forest-700">{step.description}</p>
          </li>
        ))}
      </ol>

      <section className="rounded-3xl bg-sun-500/20 px-6 py-8 text-center text-forest-900">
        <h2 className="text-2xl font-semibold">Demo akışını test et</h2>
        <p className="mt-2 text-sm">
          /test/pipeline sayfasındaki deterministik senaryo ile yazar ve yapımcı rollerini otomatik olarak canlandırıyoruz.
        </p>
      </section>
    </div>
  );
}
