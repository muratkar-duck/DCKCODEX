export const metadata = {
  title: "Test Pipeline | ducktylo",
};

const steps = [
  {
    title: "Senaryo oluştur",
    description: "Writer hesabı ile giriş yapıp yeni script kaydı ekleyin.",
  },
  {
    title: "İlan aç",
    description: "Producer hesabı ile bütçe ve tür bilgisi girerek ilan oluşturun.",
  },
  {
    title: "Başvuru gönder",
    description: "Yazar panelinden ilgili ilana script'inizi bağlayarak başvuru yapın.",
  },
  {
    title: "Başvuruyu kabul et",
    description: "Yapımcı panelinde başvuruyu kabul edin ve konuşmayı başlatın.",
  },
  {
    title: "Mesajlaş",
    description: "ensure_conversation_with_participants RPC'si ile otomatik açılan sohbette mesaj gönderin.",
  },
];

export default function PipelineTestPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-16">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-forest-950">Test Pipeline Senaryosu</h1>
        <p className="text-sm text-forest-700">
          Playwright testleri bu sayfayı ziyaret ederek Supabase çağrılarını mocklayan deterministik akışı çalıştırır.
        </p>
      </header>
      <ol className="space-y-4" data-test-id="pipeline-steps">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="rounded-3xl border border-forest-100 bg-white/80 p-5 shadow-sm"
            data-test-id={`pipeline-step-${index + 1}`}
          >
            <h2 className="text-lg font-semibold text-forest-900">{step.title}</h2>
            <p className="text-sm text-forest-700">{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
