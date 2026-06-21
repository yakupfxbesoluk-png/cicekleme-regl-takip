// src/screens/Home.jsx
import { useData } from '../contexts/DataContext.jsx';
import CycleRing from '../components/CycleRing.jsx';
import { PHASE_LABELS, PHASE_INFO, fromISODate } from '../utils/cycle.js';

export default function Home() {
  const { insights, today, addOrUpdatePeriodStart, setPeriodEnd, periods, removePeriod } = useData();

  const isTodayLogged = periods.some((p) => p.start === today);
  const openPeriod = periods.find((p) => p.start === insights.lastPeriodStart && !p.end);

  const handleStart = () => addOrUpdatePeriodStart(today);
  const handleEndOpenPeriod = () => openPeriod && setPeriodEnd(openPeriod.start, today);
  const handleUndoToday = () => removePeriod(today);

  return (
    <div className="px-5 pt-8 animate-riseIn">
      <header className="mb-6">
        <p className="text-sm text-muted font-medium">Bugün</p>
        <h1 className="font-display text-2xl font-semibold mt-0.5">
          {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
        </h1>
      </header>

      <div className="flex flex-col items-center bg-surface rounded-3xl shadow-soft py-8 mb-5">
        <CycleRing insights={insights} />
        {insights.hasData && (
          <div className="mt-4 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-surface2 text-primary text-xs font-semibold">
              {insights.cycleDay}. döngü günü · {PHASE_LABELS[insights.phase]}
            </span>
          </div>
        )}
      </div>

      {!insights.hasData && (
        <button
          onClick={handleStart}
          className="w-full bg-primary text-white font-semibold rounded-2xl py-4 shadow-card active:scale-[0.98] transition-transform"
        >
          İlk regl başlangıcını kaydet
        </button>
      )}

      {insights.hasData && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <InfoCard
              label="Yumurtlama"
              value={formatRelative(insights.daysUntilOvulation)}
              date={fromISODate(insights.ovulationDate)}
              color="secondary"
            />
            <InfoCard
              label="Doğurgan Pencere"
              value={`${shortDate(insights.fertileStart)} – ${shortDate(insights.fertileEnd)}`}
              color="secondary"
            />
          </div>

          <div className="bg-surface2 rounded-2xl p-4 mb-5">
            <p className="text-sm font-semibold mb-1">{PHASE_LABELS[insights.phase]}</p>
            <p className="text-sm text-muted leading-relaxed">{PHASE_INFO[insights.phase]}</p>
          </div>

          {isTodayLogged ? (
            <button
              onClick={handleUndoToday}
              className="w-full bg-surface2 text-ink font-semibold rounded-2xl py-3.5 mb-3 active:scale-[0.98] transition-transform"
            >
              Bugünkü regl kaydını geri al
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="w-full bg-primary text-white font-semibold rounded-2xl py-3.5 mb-3 shadow-card active:scale-[0.98] transition-transform"
            >
              {insights.isInPeriodNow ? 'Yeni regl başlangıcı (erken)' : 'Reglim bugün başladı'}
            </button>
          )}

          {openPeriod && (
            <button
              onClick={handleEndOpenPeriod}
              className="w-full bg-surface border border-line text-ink font-semibold rounded-2xl py-3.5 active:scale-[0.98] transition-transform"
            >
              Reglim bugün bitti
            </button>
          )}

          {insights.isLate && (
            <p className="text-center text-xs text-muted mt-4 leading-relaxed">
              Tahmini tarihten {Math.abs(insights.daysUntilNextPeriod)} gün geçti. Düzensiz döngüler
              stres, kilo değişimi veya hormonal nedenlerden kaynaklanabilir; gecikme uzarsa bir
              sağlık uzmanına danışman faydalı olur.
            </p>
          )}
        </>
      )}
    </div>
  );
}

const COLOR_CLASSES = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
};

function InfoCard({ label, value, date, color = 'primary' }) {
  return (
    <div className="bg-surface rounded-2xl p-4 shadow-card">
      <p className="text-xs text-muted font-medium mb-1">{label}</p>
      <p className={`font-display text-lg font-semibold ${COLOR_CLASSES[color]}`}>{value}</p>
      {date && <p className="text-xs text-muted mt-0.5">{shortDate(date)}</p>}
    </div>
  );
}

function formatRelative(days) {
  if (days === 0) return 'Bugün';
  if (days > 0) return `${days} gün sonra`;
  return `${Math.abs(days)} gün önce`;
}

function shortDate(d) {
  const date = typeof d === 'string' ? fromISODate(d) : d;
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}
