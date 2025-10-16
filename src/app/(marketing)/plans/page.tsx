export const metadata = {
  title: "Planlar | ducktylo",
};

const plans = [
  {
    name: "Başlangıç",
    price: "Ücretsiz",
    features: [
      "3 senaryo yayınlama",
      "Aylık 5 başvuru",
      "Temel raporlama",
    ],
  },
  {
    name: "Profesyonel",
    price: "₺499 / ay",
    features: [
      "Sınırsız senaryo",
      "Gerçek zamanlı mesajlaşma",
      "İleri düzey istatistikler",
      "Öncelikli destek",
    ],
    highlighted: true,
  },
  {
    name: "Kurumsal",
    price: "Teklif",
    features: [
      "Çoklu ekip yönetimi",
      "Özel entegrasyonlar",
      "Dedicated success manager",
    ],
  },
];

export default function PlansPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-12 px-6 py-16">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold text-forest-950">İş modelinize göre ölçeklenen planlar</h1>
        <p className="text-lg text-forest-700">
          Tüm planlar Supabase güvenlik katmanları ve rol tabanlı erişim kontrolleri ile gelir. İhtiyacınıza uygun paketi seçin.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-3xl border ${
              plan.highlighted ? "border-sun-500 bg-white shadow-xl" : "border-forest-100 bg-white/90 shadow-sm"
            } p-6`}
          >
            <h2 className="text-xl font-semibold text-forest-900">{plan.name}</h2>
            <p className="mt-2 text-2xl font-bold text-forest-800">{plan.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-forest-700">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-forest-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="rounded-3xl bg-forest-900 px-8 py-10 text-center text-krem">
        <h2 className="text-2xl font-semibold">Özel entegrasyon mu arıyorsunuz?</h2>
        <p className="mt-2 text-sm text-forest-200">
          Yapımcı CRM sistemleri ve ödeme servisleri ile entegrasyon için enterprise@ducktylo.test adresine ulaşın.
        </p>
      </section>
    </div>
  );
}
