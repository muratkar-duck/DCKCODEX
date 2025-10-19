# Sorun Giderme

## "Supabase Auth şeması okunamadı" hatası

Bu hata, Supabase projesinde **auth** veya **public** şemasındaki tablolar eksik ya da güncel olmadığında oluşur. Aşağıdaki adımları takip ederek sorunu çözebilirsiniz:

1. Supabase kontrol panelinde **SQL Editor** sekmesini açın ve depodaki `supabase/schema.sql` dosyasını çalıştırın. Bu işlem auth/public tablolarını ve gerekli politika ile trigger tanımlarını oluşturur.
2. Aynı editörde `supabase/seed_test_accounts.sql` scriptini çalıştırın. Script demo kullanıcılarını (ör. `writer@ducktylo.test` ve `producer@ducktylo.test`) Supabase Auth ile senkronize eder.
3. Önceden kullanıcı oluşturduysanız ancak Auth ile eşitlenmediyse `supabase/sync_auth_users.sql` dosyasını çalıştırarak kayıtları yeniden oluşturabilirsiniz.
4. `schema.sql` içerisinde kullanılan `pgcrypto` uzantısının etkin olduğundan emin olun. Script, uzantı eksikse otomatik olarak oluşturur ancak kendi projenizde erişim yetkisi gerektirebilir.
5. Scriptleri çalıştırdıktan sonra `select * from auth.users limit 1;` ve `select * from public.users limit 1;` sorgularını çalıştırarak tabloların gerçekten oluştuğunu ve kayıt içerdiğini doğrulayın. Supabase SQL Editor, başarısız olan sorguları sonuç panelinde gösterir; hata görürseniz scripti parça parça yeniden çalıştırın.
6. Supabase proje ayarlarından **Project URL** ve **anon key** değerlerinin `.env.local` dosyasında doğru tanımlandığını kontrol edin. Her anahtar tek satırda olmalıdır; metin editörünün otomatik satır kırması JSON web token anahtarlarını bölerse Supabase istemcisi gizli anahtarı okuyamaz. Birden fazla Supabase projesi (ör. staging/production) kullanıyorsanız scriptleri çalıştırdığınız proje ile uygulamanın bağlandığı projenin eşleştiğinden emin olun.
   * `.env.example` yalnızca referans şablonu olduğu için projede bulunması sorun yaratmaz; Next.js çalışma zamanında `.env.local` dosyası okunur. Yine de şablondaki değerleri güncel tutarsanız ekip arkadaşlarının doğru anahtarları kopyalaması kolaylaşır.
7. Auth → **Providers** sekmesinde e-posta/şifre sağlayıcısının etkin olduğundan emin olun. Bu seçenek devre dışı ise Supabase giriş akışı "Database error querying schema" mesajı ile başarısız olur.
8. Demo ortamında RLS ile ilgili bir yanlış yapılandırmadan şüpheleniyorsanız SQL Editor'de `alter table public.users disable row level security;` (ve gerekirse diğer tablolar için) komutlarını çalıştırarak politikaları geçici olarak devre dışı bırakabilirsiniz. Sorun çözüldüyse `schema.sql` dosyasını yeniden çalıştırarak varsayılan politikalara geri dönebilirsiniz.

Tüm kontroller başarılı olduğu hâlde hata devam ederse Auth → Users sekmesinde demo kullanıcılarının listelendiğini, ayrıca Project Settings → API sayfasında **Service Role** anahtarının değiştirilmediğini doğrulayın. Servis anahtarı yenilenmişse seed scriptlerini yeniden çalıştırmadan önce `.env.local` dosyasındaki değerleri güncellemeniz gerekir.
