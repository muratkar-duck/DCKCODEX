# ducktylo Senaryo Pazaryeri

Next.js 15, Supabase ve React Query ile inşa edilen modern senaryo pazaryeri MVP'si. Tailwind CSS ile özelleştirilmiş UI, paylaşılan veritabanı tipleri ve test otomasyonu (Jest + Playwright) içerir.

## Kurulum

```bash
npm install
```

> Not: PR araçlarının ikili dosya kısıtlarından dolayı `package-lock.json` depo dışında tutuluyor. Kurulumda `npm install` en güncel
> uyumlu bağımlılık sürümlerini yükler; CI boru hattı da aynı komutu kullanır.

## Gerekli ortam değişkenleri

Aşağıdaki değişkenleri `.env.local` dosyasına ekleyin:

```
NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
SUPABASE_URL="https://<project>.supabase.co"
```

## Geliştirme

```bash
npm run dev
```

## Kalite kontrolleri

```bash
npm run lint
npm run test
npm run test:e2e
```

Playwright testleri çalıştırmadan önce tarayıcı bağımlılıklarını yüklemek için:

```bash
npx playwright install
```

## Seed Script

Supabase servis rolü ile demo verileri yüklemek için:

```bash
npm run seed:mvp
```

Seed script'i aşağıdaki demo kullanıcıları oluşturur:

- `writer@ducktylo.test` / `password`
- `producer@ducktylo.test` / `password`

Script ayrıca örnek senaryolar, ilanlar, bir satın alma kaydı ve demo mesajlaşma oturumu ekler.

## Dizim

- `src/app`: Next.js App Router sayfaları
- `src/components`: UI ve layout bileşenleri
- `src/lib`: Supabase istemci yardımcıları ve ortam doğrulayıcıları
- `src/types`: Paylaşılan Supabase tipleri
- `scripts`: Yardımcı CLI/seed scriptleri
- `supabase/schema.sql`: Postgres şema ve politika tanımları

## Lisans

MIT
