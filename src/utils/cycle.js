// src/utils/cycle.js
//
// Tıbbi referans notları:
// - Ortalama regl döngüsü 21–35 gün arasında normal kabul edilir (ACOG / Mayo Clinic).
// - Luteal faz (yumurtlama -> regl başlangıcı) kişiden kişiye az değişir: ortalama 12–14 gün.
//   Bu yüzden yumurtlama günü, döngü uzunluğundan luteal faz çıkarılarak geriye doğru hesaplanır:
//   ovülasyonGünü = döngüUzunluğu - lutealFazUzunluğu
// - Doğurgan pencere: sperm rahimde ~5 güne kadar canlı kalabilir, yumurta ise atıldıktan
//   sonra ~12-24 saat döllenebilir. Bu nedenle doğurgan pencere ovülasyondan 5 gün önce başlar,
//   ovülasyon gününün ertesi günü biter (NHS / ACOG kabul edilen aralık).
// - Döngü uzunluğu kullanıcı geçmişinden (son 6 döngünün ortalaması) hesaplanır; geçmiş yoksa
//   kullanıcı varsayılanı (default 28 gün) kullanılır.

const DAY_MS = 24 * 60 * 60 * 1000;

export function daysBetween(a, b) {
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((db - da) / DAY_MS);
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function toISODate(d) {
  const dt = new Date(d);
  const tz = dt.getTimezoneOffset() * 60000;
  return new Date(dt - tz).toISOString().slice(0, 10);
}

export function fromISODate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// periods: [{ start: 'YYYY-MM-DD', end: 'YYYY-MM-DD'|null }] — tarihe göre artan sıralı değil olabilir
export function sortedPeriods(periods) {
  return [...periods].sort((a, b) => fromISODate(a.start) - fromISODate(b.start));
}

// Son 6 döngüden ortalama döngü uzunluğunu hesaplar; yetersiz veri varsa null döner.
export function computeAverageCycleLength(periods) {
  const sorted = sortedPeriods(periods);
  if (sorted.length < 2) return null;
  const recent = sorted.slice(-7); // son 6 fark için 7 başlangıç noktası
  const diffs = [];
  for (let i = 1; i < recent.length; i++) {
    const len = daysBetween(fromISODate(recent[i - 1].start), fromISODate(recent[i].start));
    if (len >= 15 && len <= 60) diffs.push(len); // mantıksız aykırı değerleri ele
  }
  if (!diffs.length) return null;
  const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  return Math.round(avg);
}

export function computeAveragePeriodLength(periods) {
  const withEnd = periods.filter((p) => p.end);
  if (!withEnd.length) return null;
  const lens = withEnd.map((p) => daysBetween(fromISODate(p.start), fromISODate(p.end)) + 1);
  const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
  return Math.round(avg);
}

// Ana tahmin fonksiyonu
export function getCycleInsights(periods, settings, today = new Date()) {
  const { defaultCycleLength = 28, defaultPeriodLength = 5, lutealPhaseLength = 14 } = settings;
  const sorted = sortedPeriods(periods);
  const lastPeriod = sorted.length ? sorted[sorted.length - 1] : null;

  const avgCycle = computeAverageCycleLength(periods);
  const avgPeriod = computeAveragePeriodLength(periods);

  const cycleLength = clamp(avgCycle ?? defaultCycleLength, 21, 45);
  const periodLength = clamp(avgPeriod ?? defaultPeriodLength, 2, 10);
  const luteal = clamp(lutealPhaseLength, 10, 16);

  if (!lastPeriod) {
    return {
      hasData: false,
      cycleLength,
      periodLength,
      luteal,
    };
  }

  const lastStart = fromISODate(lastPeriod.start);
  const ovulationDayOffset = Math.max(cycleLength - luteal, periodLength); // ovülasyon period bitiminden önce olmaz
  const ovulationDate = addDays(lastStart, ovulationDayOffset);
  const fertileStart = addDays(ovulationDate, -5);
  const fertileEnd = addDays(ovulationDate, 1);
  const nextPeriodDate = addDays(lastStart, cycleLength);
  const periodEndDate = addDays(lastStart, periodLength - 1);

  const cycleDay = daysBetween(lastStart, today) + 1; // 1-index
  const daysUntilNextPeriod = daysBetween(today, nextPeriodDate);
  const daysUntilOvulation = daysBetween(today, ovulationDate);

  let phase = 'foliküler';
  if (cycleDay >= 1 && cycleDay <= periodLength) phase = 'menstrüel';
  else if (today >= fertileStart && today <= fertileEnd) phase = 'doğurgan/ovülasyon';
  else if (daysUntilNextPeriod <= 0 || cycleDay > ovulationDayOffset) phase = 'luteal';

  const isLate = daysUntilNextPeriod < 0 && cycleDay > cycleLength;

  return {
    hasData: true,
    cycleLength,
    periodLength,
    luteal,
    lastPeriodStart: lastPeriod.start,
    periodEndDate: toISODate(periodEndDate),
    ovulationDate: toISODate(ovulationDate),
    fertileStart: toISODate(fertileStart),
    fertileEnd: toISODate(fertileEnd),
    nextPeriodDate: toISODate(nextPeriodDate),
    cycleDay: Math.max(1, cycleDay),
    daysUntilNextPeriod,
    daysUntilOvulation,
    phase,
    isLate,
    isInPeriodNow: cycleDay >= 1 && cycleDay <= periodLength,
    isInFertileNow: today >= fertileStart && today <= fertileEnd,
  };
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export const PHASE_LABELS = {
  'menstrüel': 'Regl Dönemi',
  'foliküler': 'Foliküler Faz',
  'doğurgan/ovülasyon': 'Doğurgan Pencere',
  'luteal': 'Luteal Faz',
};

export const PHASE_INFO = {
  'menstrüel': 'Rahim iç zarının döküldüğü dönem. Genellikle 3-7 gün sürer.',
  'foliküler': 'Yumurtalıklarda folikül gelişimi devam ediyor, östrojen yükseliyor.',
  'doğurgan/ovülasyon': 'Gebelik ihtimalinin en yüksek olduğu dönem. Yumurtlama bu pencerede gerçekleşir.',
  'luteal': 'Yumurtlama sonrası progesteron yükselir; gebelik yoksa regl yaklaşır.',
};
