// src/config/ads.js
//
// ÖNEMLİ: Burada Google'ın resmi TEST reklam birimi ID'leri kullanılıyor.
// Uygulamayı yayınlamadan önce bunları kendi AdMob hesabından aldığın gerçek
// ID'lerle değiştirmen gerekir, aksi halde gerçek reklam gösterilmez ve/veya
// test reklamlarıyla yayına çıkmış olursun (AdMob politikalarına aykırıdır).
//
// Gerçek ID'leri nereden alırsın:
// 1) https://apps.admob.com adresinde bir hesap aç.
// 2) Uygulamanı ekle (Android), bir "Banner" ve istersen bir "Geçiş (Interstitial)"
//    reklam birimi oluştur.
// 3) Aşağıdaki üç değeri (appId, banner, interstitial) kendi ID'lerinle değiştir.
// 4) android/app/src/main/AndroidManifest.xml içindeki
//    com.google.android.gms.ads.APPLICATION_ID meta-data değerini de appId ile aynı yap.
// 5) useTestIds değerini false yap.

const TEST_IDS = {
  appId: 'ca-app-pub-3940256099942544~3347511713',
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
};

const PRODUCTION_IDS = {
  appId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
  banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
};

const useTestIds = true; // ← yayına çıkmadan önce false yap ve gerçek ID'leri gir

export const AD_UNIT_IDS = {
  useTestIds,
  appId: useTestIds ? TEST_IDS.appId : PRODUCTION_IDS.appId,
  banner: useTestIds ? TEST_IDS.banner : PRODUCTION_IDS.banner,
  interstitial: useTestIds ? TEST_IDS.interstitial : PRODUCTION_IDS.interstitial,
};
