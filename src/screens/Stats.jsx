// src/screens/Stats.jsx
import { useMemo } from 'react';
import { useData } from '../contexts/DataContext.jsx';
import { sortedPeriods, daysBetween, fromISODate } from '../utils/cycle.js';

export default function Stats() {
  const { periods, insights, logs } = useData();

  const cycleLengths = useMemo(() => {
    const sorted = sortedPeriods(periods);
    const lens = [];
    for (let i = 1; i < sorted.length; i++) {
      lens.push({
        from: sorted[i - 1].start,
        days: daysBetween(fromISODate(sorted[i - 1].start), fromISODate(sorted[i].start)),
      });
    }
    return lens.reverse();
  }, [periods]);

  const symptomFrequency = useMemo(() => {
    const counts = {};
    Object.values(logs).forEach((l) => {
      (l.symptoms || []).forEach((s) => {
        counts[s] = (counts[s] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [logs]);

  const maxLen = Math.max(1, ...cycleLengths.map((c) => c.days), insights.cycleLength);

  return (
    <div className="px-5 pt-8 animate-riseIn">
      <header className="mb-6">
        <p className="text-sm text-muted font-medium">İstatistik</p>
        <h1 className="font-display text-2xl font-semibold mt-0.5">Döngü Geçmişin</h1>
      </header>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Ort. Döngü" value={`${insights.cycleLength} gün`} />
        <StatCard label="Ort. Regl" value={`${insights.periodLength} gün`} />
        <StatCard label="Kayıtlı Döngü" value={periods.length} />
      </div>

      {cycleLengths.length > 0 ? (
        <div className="bg-surface rounded-2xl p-4 mb-6 shadow-card">
          <h2 className="text-sm font-semibold mb-4">Son Döngü Uzunlukları</h2>
          <div className="space-y-2.5">
            {cycleLengths.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-muted w-16 shrink-0">
                  {fromISODate(c.from).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                </span>
                <div className="flex-1 bg-surface2 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(c.days / maxLen) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold w-12 text-right">{c.days} gün</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-4 leading-relaxed">
            21–35 gün arası döngüler tıbbi olarak normal kabul edilir. Sürekli bu aralığın dışında
            kalan döngüler için bir sağlık uzmanına danışmak iyi bir adımdır.
          </p>
        </div>
      ) : (
        <EmptyState text="Henüz yeterli döngü verisi yok. En az 2 regl kaydından sonra burada geçmişini görebilirsin." />
      )}

      {symptomFrequency.length > 0 ? (
        <div className="bg-surface rounded-2xl p-4 shadow-card">
          <h2 className="text-sm font-semibold mb-4">En Sık Semptomlar</h2>
          <div className="space-y-2.5">
            {symptomFrequency.map(([s, count]) => (
              <div key={s} className="flex items-center gap-3">
                <span className="text-xs text-ink w-28 shrink-0 truncate">{s}</span>
                <div className="flex-1 bg-surface2 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{ width: `${(count / symptomFrequency[0][1]) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState text="Günlük ekranından semptom kaydettikçe burada sıklık analizi göreceksin." />
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-surface rounded-2xl p-3.5 shadow-card text-center">
      <p className="font-display text-xl font-semibold">{value}</p>
      <p className="text-[11px] text-muted font-medium mt-0.5">{label}</p>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="bg-surface2 rounded-2xl p-5 text-center mb-6">
      <p className="text-sm text-muted leading-relaxed">{text}</p>
    </div>
  );
}
