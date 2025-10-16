# Test Stratejisi

## Unit / Component
- `AppHeader`: Navigasyon linklerinin oturum ve role göre değiştiğini doğrular.
- `AuthGuard`: Oturumsuz kullanıcıları `/auth/sign-in` sayfasına yönlendirir, rol kontrolü yapar.
- `calculateTaxBreakdown`: Vergi hesaplamasının doğru yapıldığını ve negatif değerlerde hata verdiğini test eder.

### Araçlar
- Jest + ts-jest
- React Testing Library
- Jest DOM matcher'ları

## E2E (Playwright)
- `auth-flow.spec.ts`: Kayıt → çıkış → giriş döngüsü.
- `pipeline.spec.ts`: `/test/pipeline` rotasını kullanarak baştan sona başvuru-satın alma akışını simüle eder. Supabase çağrıları mock'lanır.

### Çalıştırma
```
npm run test:e2e
```

Playwright testleri `playwright.config.ts` içerisinde tanımlı web sunucusu komutunu (`npm run dev`) otomatik olarak başlatır.
