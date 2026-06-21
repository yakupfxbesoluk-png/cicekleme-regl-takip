// src/utils/interstitial.js
import { AdMob } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { AD_UNIT_IDS } from '../config/ads.js';

const COUNT_KEY = 'cicekleme.interstitialCounter';
const SHOW_EVERY_N = 4; // her 4 "tetikleyici eylemde" (ör. günlük kaydı) bir kez göster — rahatsız etmeyecek sıklık

let preloaded = false;

async function preload() {
  if (!Capacitor.isNativePlatform() || preloaded) return;
  try {
    await AdMob.prepareInterstitial({ adId: AD_UNIT_IDS.interstitial });
    preloaded = true;
  } catch (e) {
    console.warn('Interstitial hazırlanamadı:', e);
  }
}

// Uygulama açılışında bir kez çağırarak ilk reklamı önceden yükle.
export function preloadInterstitial() {
  preload();
}

// Sık olmayan, doğal duraklama noktalarında (ör. günlük kaydı sonrası) çağır.
// Her seferinde değil, SHOW_EVERY_N eylemde bir gösterir.
export async function maybeShowInterstitial() {
  if (!Capacitor.isNativePlatform()) return;

  const { value } = await Preferences.get({ key: COUNT_KEY });
  const count = (parseInt(value || '0', 10) + 1) % SHOW_EVERY_N;
  await Preferences.set({ key: COUNT_KEY, value: String(count) });

  if (count !== 0) return;

  try {
    if (!preloaded) await preload();
    await AdMob.showInterstitial();
    preloaded = false;
    preload(); // bir sonraki gösterim için yeniden hazırla
  } catch (e) {
    console.warn('Interstitial gösterilemedi:', e);
  }
}
