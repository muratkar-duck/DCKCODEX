# ducktylo Senaryo Pazaryeri

Next.js 15, Supabase ve React Query ile inşa edilen modern senaryo pazaryeri MVP'si. Tailwind CSS ile özelleştirilmiş UI, paylaşılan veritabanı tipleri ve test otomasyonu (Jest + Playwright) içerir.

## Kurulum

```bash
npm install
```

> Not: PR araçlarının ikili dosya kısıtlarından dolayı `package-lock.json` depo dışında tutuluyor. Kurulumda `npm install` en güncel
> uyumlu bağımlılık sürümlerini yükler; CI boru hattı da aynı komutu kullanır.

## Gerekli ortam değişkenleri

1. Örnek dosyayı kopyalayın:

   ```bash
   cp .env.example .env.local
   ```

2. Supabase kontrol panelinden aşağıdaki değerleri doldurun:

   - **NEXT_PUBLIC_SUPABASE_URL** – Project Settings → API → Project URL
   - **NEXT_PUBLIC_SUPABASE_ANON_KEY** – Project Settings → API → `anon` public API key
   - **SUPABASE_SERVICE_ROLE_KEY** *(opsiyonel)* – Seed scriptleri ve yönetici işlemleri için Project Settings → API → `service_role` secret
   - **DEMO_USER_PASSWORD** *(opsiyonel)* – Seed scriptlerinin kullanacağı demo parola (varsayılan `123456`)
   - **SUPABASE_URL** – Çoğu durumda Project URL ile aynı değeri kullanın

> Not: Seed scriptini çalıştırarak demo verileri yüklemek istiyorsanız servis rol anahtarının tanımlı olması gerekir.

## Geliştirme

```bash
npm run dev
```

### Vercel

Depo kökünde yer alan `vercel.json`, projeyi her zaman Next.js yapımcısı (`@vercel/next`) ile derlemeye zorlar. Vercel kontrol panelinde daha önce statik dağıtım için `public` klasörünü hedef gösterdiyseniz bu ayarlar kendi kendine uygulanır ve 404 hatası engellenir. Herhangi bir özel çıkış dizini tanımladıysanız kaldırmayı unutmayın.

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

Seed script'i aşağıdaki demo kullanıcıları oluşturur (parola varsayılan olarak `123456` veya `DEMO_USER_PASSWORD` değeridir):

- `writer@ducktylo.test`
- `producer@ducktylo.test`
- `senarist1@ducktylo.test` – `senarist5@ducktylo.test`
- `yapimci1@ducktylo.test`
- `yapimci2@ducktylo.test`

Elinizde halihazırda `public.users` tablosunda kayıtlı kullanıcılar varsa ve Supabase Auth ile senkronize etmek istiyorsanız `supabase/sync_auth_users.sql` dosyasını Supabase SQL editöründe çalıştırabilirsiniz. Script tüm kullanıcıların parolasını aynı demo parola ile günceller ve gerekli kimlik kayıtlarını oluşturur.

Script ayrıca örnek senaryolar, ilanlar, bir satın alma kaydı ve demo mesajlaşma oturumu ekler.

### Sorun giderme

Giriş yaparken "Supabase Auth şeması okunamadı" mesajını görüyorsanız Supabase projenizin şemasını ve demo hesaplarını yeniden
oluşturmanız gerekir. Adım adım yönergeler için [`docs/troubleshooting.md`](docs/troubleshooting.md) dosyasına göz atın.

## Dizim

- `src/app`: Next.js App Router sayfaları
- `src/components`: UI ve layout bileşenleri
- `src/lib`: Supabase istemci yardımcıları ve ortam doğrulayıcıları
- `src/types`: Paylaşılan Supabase tipleri
- `scripts`: Yardımcı CLI/seed scriptleri
- `supabase/schema.sql`: Postgres şema ve politika tanımları

## Lisans

MIT
