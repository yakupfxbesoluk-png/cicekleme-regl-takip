# Çiçeklenme — Regl Takip Uygulaması

Kadınlar için modern, tamamen cihaz içinde (offline) çalışan regl döngüsü takip uygulaması.
React + Vite + Tailwind CSS ile yazıldı, Capacitor ile Android uygulamasına paketlendi.

## Özellikler

- **Regl & yumurtlama tahmini** — geçmiş döngülerden ortalama hesaplayarak bir sonraki regl ve
  yumurtlama gününü tahmin eder (luteal faz yöntemi: ovülasyon günü = döngü uzunluğu − luteal faz).
- **Doğurgan pencere takibi** — yumurtlamadan 5 gün önce başlayıp 1 gün sonra biten aralık
  (sperm canlılığı + yumurta canlılığına dayalı standart tıbbi aralık).
- **Geri sayım halkası** — döngünün tamamını çiçek/halka şeklinde gösteren ana ekran widget'ı.
- **Semptom & ruh hali günlüğü** — günlük kramp, baş ağrısı, ruh hali, akış yoğunluğu kaydı.
- **İstatistikler** — döngü uzunluğu geçmişi ve en sık görülen semptomlar.
- **Yerel bildirimler** — yaklaşan regl, yumurtlama ve günlük doldurma hatırlatmaları
  (@capacitor/local-notifications, tamamen cihaz üzerinde planlanır).
- **Açık/Koyu/Sistem tema** — `@capacitor/preferences` ile cihazda saklanan tercih.
- **Tıbbi terimler sözlüğü** — uygulamada geçen terimlerin (ovülasyon, luteal faz, doğurgan
  pencere, PMS, BVS vb.) aranabilir, kategorilere ayrılmış açıklamaları.
- **Reklam entegrasyonu (Google AdMob)** — alt navigasyonun üzerinde banner reklam ve günlük
  kaydı gibi doğal duraklama noktalarında, sık olmayacak şekilde (her 4 kayıtta bir) geçiş
  reklamı. Şu an Google'ın resmi TEST ID'leriyle çalışıyor — yayına çıkmadan önce
  `src/config/ads.js` ve `AndroidManifest.xml` içindeki ID'leri kendi AdMob hesabınla
  değiştirmen gerekir (dosyanın içinde adım adım açıklama var).
- **Regl/semptom verisi tamamen yerel** — bu veriler hiçbir sunucuya gönderilmez. Reklam
  altyapısı (AdMob) kendi işleyişi için Google ile sınırlı cihaz verisi paylaşabilir; bu Google'ın
  kendi gizlilik politikasına tabidir.

> ⚕️ Not: Uygulama genel istatistiksel tahminler sunar, tıbbi tavsiye yerine geçmez.

## GitHub Codespaces ile geliştirme

1. Bu klasörü bir GitHub reposuna push'la (aşağıdaki "Repoya yükleme" bölümüne bak).
2. Repo sayfasında **Code → Codespaces → Create codespace on main**.
3. Codespace açıldığında terminalde:
   ```bash
   npm install
   npm run dev -- --host
   ```
4. Açılan portu (5173) "Ports" sekmesinden public yapıp tarayıcıda önizleyebilirsin.

## Android APK üretimi

Codespaces'te Java + Android SDK kurulu değilse önce kurman gerekir. En pratik yöntem:

### Yöntem A — Codespaces içinde Android SDK kurarak

```bash
# Java
sudo apt-get update && sudo apt-get install -y openjdk-17-jdk

# Android command line tools
mkdir -p ~/android-sdk/cmdline-tools
cd ~/android-sdk/cmdline-tools
curl -o tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip tools.zip && mv cmdline-tools latest
echo 'export ANDROID_HOME=$HOME/android-sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc

yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# Projeyi derle ve Android'e senkronize et
cd /workspaces/<repo-adın>
npm install
npm run build
npx cap sync android

# APK üret (debug)
cd android
./gradlew assembleDebug
# Çıktı: android/app/build/outputs/apk/debug/app-debug.apk
```

### Yöntem B — Android Studio (kendi bilgisayarında)

```bash
npm install
npm run build
npx cap sync android
npx cap open android
```
Android Studio açılır, normal şekilde **Run** veya **Build > Build Bundle(s)/APK(s)**.

## Repoya yükleme

```bash
git init
git add .
git commit -m "İlk sürüm: Çiçeklenme regl takip uygulaması"
git branch -M main
git remote add origin https://github.com/<kullanici-adin>/cicekleme.git
git push -u origin main
```

## AdMob reklamlarını gerçek hesabınla bağlama

Şu an uygulama Google'ın **test** reklam ID'leriyle çalışıyor (gerçek reklam göstermez, sadece
örnek/test reklamları gösterir). Yayına çıkmadan önce:

1. https://apps.admob.com adresinde bir AdMob hesabı aç, uygulamanı (Android) ekle.
2. Bir **Banner** ve istersen bir **Geçiş (Interstitial)** reklam birimi oluştur.
3. `src/config/ads.js` dosyasındaki `PRODUCTION_IDS` değerlerini kendi `appId`, `banner`,
   `interstitial` ID'lerinle doldur ve `useTestIds`'i `false` yap.
4. `android/app/src/main/AndroidManifest.xml` içindeki
   `com.google.android.gms.ads.APPLICATION_ID` meta-data değerini de aynı `appId` ile değiştir.
5. `npm run build && npx cap sync android` çalıştırıp APK'yı yeniden üret.

> Test ID'leriyle yayına çıkmak AdMob hesap politikalarına aykırıdır — gerçek ID'leri girmeden
> Play Store'a yüklemiyoruz.

## Proje yapısı

```
src/
  contexts/      ThemeContext, DataContext (tüm state + yerel depolama burada)
  utils/cycle.js Tıbbi hesaplama mantığı (yorumlu, kaynak referanslı)
  utils/notifications.js  Yerel bildirim planlama
  components/    CycleRing (imza görsel), BottomNav
  screens/       Home, Calendar, SymptomLog, Stats, Settings
android/         Capacitor tarafından oluşturulan native Android projesi
```

## Tasarım

- **Tipografi:** Başlıklarda Fraunces (sıcak, organik serif), gövde metinde Inter.
- **Renk paleti:** "Şafak/Gece Bahçesi" — açık temada solgun lavanta-beyaz zemin + derin mor
  yazı rengi; koyu temada derin patlıcan moru zemin. Regl = gül pembesi, doğurgan pencere =
  adaçayı yeşili, yumurtlama = kehribar — döngünün biyolojik fazlarını renkle kodlar.
- **İmza öğe:** Ana ekrandaki dairesel "döngü halkası" — döngünün kendisi zaten döngüsel
  olduğu için ilerleme çubuğu yerine gerçek bir daire/saat kadranı olarak tasarlandı.
