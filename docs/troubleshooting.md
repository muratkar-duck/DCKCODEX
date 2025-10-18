# Sorun Giderme

## "Supabase Auth şeması okunamadı" hatası

Bu hata, Supabase projesinde **auth** veya **public** şemasındaki tablolar eksik ya da güncel olmadığında oluşur. Aşağıdaki adımları takip ederek sorunu çözebilirsiniz:

1. Supabase kontrol panelinde **SQL Editor** sekmesini açın ve depodaki `supabase/schema.sql` dosyasını çalıştırın. Bu işlem auth/public tablolarını ve gerekli politika ile trigger tanımlarını oluşturur.
2. Aynı editörde `supabase/seed_test_accounts.sql` scriptini çalıştırın. Script demo kullanıcılarını (ör. `writer@ducktylo.test` ve `producer@ducktylo.test`) Supabase Auth ile senkronize eder.
3. Önceden kullanıcı oluşturduysanız ancak Auth ile eşitlenmediyse `supabase/sync_auth_users.sql` dosyasını çalıştırarak kayıtları yeniden oluşturabilirsiniz.
4. `schema.sql` içerisinde kullanılan `pgcrypto` uzantısının etkin olduğundan emin olun. Script, uzantı eksikse otomatik olarak oluşturur ancak kendi projenizde erişim yetkisi gerektirebilir.

Scriptleri çalıştırdıktan sonra giriş yapmayı tekrar deneyin. Hata almaya devam ediyorsanız Supabase proje ayarlarından **Project URL** ve **anon key** değerlerinin `.env.local` dosyasında doğru tanımlandığını kontrol edin.
