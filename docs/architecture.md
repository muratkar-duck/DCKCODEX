# Mimari Özeti

## Teknoloji Yığını
- **Next.js 15 App Router**: SSR/ISR ve route grupları
- **TypeScript**: Paylaşılan Supabase tipleriyle uçtan uca tip güvenliği
- **Supabase**: Postgres, Auth, Realtime ve RPC fonksiyonları
- **React Query**: Supabase sorgularının önbelleklenmesi ve yeniden deneme stratejileri
- **Tailwind CSS 4**: Temalı bileşen seti (button, card, badge, table)

## Veri Modeli

Aşağıdaki tablo şemaları `supabase/schema.sql` dosyasında tanımlıdır:

- `users`: auth.users ile senkron, writer / producer rolleri
- `scripts`: writer senaryoları, fiyat bilgisi ve açıklama alanları
- `producer_listings`: yapımcı ilanları, bütçe ve deadline
- `requests`: miras alınan talep modeli, producer veya user referansları
- `applications`: writer → producer başvuruları, durum ve RLS politikaları
- `orders`: Senaryo satın alma kayıtları
- `interests`: Yapımcıların senaryolara bıraktığı ilgiler (composite PK)
- `notification_queue`: Asenkron bildirim kuyruğu, durum alanı
- `conversations`, `conversation_participants`, `messages`: Başvuru temelli mesajlaşma
- `support_messages`: İletişim formu kayıtları

### Görünümler & RPC
- `v_listings_unified`: İlanlar ve taleplerin birleşik görünümü
- `get_producer_applications(producer_id uuid)`: Başvuruların detaylı listesi
- `enqueue_notification(...)`: Bildirim kuyruğuna kayıt ekler
- `rpc_mark_interest(script_id uuid)`: İdempotent ilgi bırakma fonksiyonu
- `ensure_conversation_with_participants(...)`: Başvuruya ait sohbeti açar ve katılımcıları ekler

## Ana Akışlar

1. **Browse → Buy**
   - Yapımcı `/browse` sayfasında senaryoları görüntüler.
   - `rpc_mark_interest` ile yazar bilgilendirilir, ardından `orders` kaydı oluşturulur.

2. **Dashboard Producer**
   - `DashboardShell` bileşeni ile özet kartlar, satın alma tabloları ve başvuru yönetimi.
   - `get_producer_applications` RPC çağrısı ile başvuru listeleri.

3. **Dashboard Writer**
   - Supabase Realtime ile script listesi canlı güncellenir.
   - Satış istatistikleri `orders` tablosundan türetilir.

4. **Apply → Messages**
   - Writer, `applications` kaydı oluşturur.
   - Yapımcı kabul ettiğinde `ensure_conversation_with_participants` sohbeti açar.
   - `messages` tablosu üzerinden gerçek zamanlı iletişim sürdürülür.

## Katmanlar

- **UI**: `src/components/ui` altında atomik bileşenler
- **Layout**: `AppHeader`, `DashboardShell`, `UserMenu`
- **Veri**: `src/lib/supabase` istemci yardımcıları, `src/lib/env` doğrulama
- **Durum**: React Query + AuthContext
- **Testler**: Jest ile ünite, Playwright ile uçtan uca senaryolar
