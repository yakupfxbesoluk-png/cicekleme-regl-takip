// src/components/AdBanner.jsx
import { useEffect, useRef, useState } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { AD_UNIT_IDS } from '../config/ads.js';

// Native (Android) ortamda gerçek AdMob banner'ı gösterir; tarayıcı önizlemesinde
// (Codespaces / npm run dev) yer tutucu bir kart gösterir çünkü AdMob native koda ihtiyaç duyar.
export default function AdBanner() {
  const initialized = useRef(false);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const native = Capacitor.isNativePlatform();
    setIsNative(native);
    if (!native || initialized.current) return;
    initialized.current = true;

    (async () => {
      try {
        await AdMob.initialize({
          testingDevices: [],
          initializeForTesting: AD_UNIT_IDS.useTestIds,
        });
        await AdMob.showBanner({
          adId: AD_UNIT_IDS.banner,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 56, // alt navigasyon çubuğunun üzerinde kalsın diye boşluk
        });
      } catch (e) {
        console.warn('AdMob banner gösterilemedi:', e);
      }
    })();

    return () => {
      if (Capacitor.isNativePlatform()) {
        AdMob.removeBanner().catch(() => {});
      }
    };
  }, []);

  // Native banner AdMob tarafından ekranın üstüne native view olarak basılır,
  // bu yüzden web tarafında gerçek cihazda ekstra bir şey render etmemize gerek yok.
  if (isNative) return null;

  // Tarayıcı önizlemesi (npm run dev) için yer tutucu — sadece geliştirici görür.
  return (
    <div className="fixed bottom-[64px] left-0 right-0 z-30 max-w-md mx-auto px-3">
      <div className="bg-surface2 border border-dashed border-line rounded-lg py-2 text-center">
        <span className="text-[10px] text-muted">Reklam alanı (gerçek cihazda AdMob banner'ı görünür)</span>
      </div>
    </div>
  );
}
