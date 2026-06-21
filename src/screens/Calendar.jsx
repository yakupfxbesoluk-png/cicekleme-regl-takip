// src/screens/Calendar.jsx
import { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext.jsx';
import { toISODate, fromISODate, daysBetween } from '../utils/cycle.js';

const WEEKDAYS = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'];

export default function CalendarScreen() {
  const { periods, insights, today, addOrUpdatePeriodStart, removePeriod, logs } = useData();
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selected, setSelected] = useState(null);

  const days = useMemo(() => buildMonthGrid(cursor), [cursor]);

  const dayStatus = (date) => {
    const iso = toISODate(date);
    const isPeriod = periods.some((p) => {
      const start = p.start;
      const end = p.end || start;
      return iso >= start && iso <= end;
    });
    const isFertile = insights.hasData && iso >= insights.fertileStart && iso <= insights.fertileEnd;
    const isOvulation = insights.hasData && iso === insights.ovulationDate;
    const isPredictedPeriod =
      insights.hasData &&
      !isPeriod &&
      iso >= insights.nextPeriodDate &&
      daysBetween(fromISODate(insights.nextPeriodDate), date) < insights.periodLength;
    const hasLog = !!logs[iso];
    return { isPeriod, isFertile, isOvulation, isPredictedPeriod, hasLog };
  };

  return (
    <div className="px-5 pt-8 animate-riseIn">
      <header className="flex items-center justify-between mb-6">
        <button onClick={() => shiftMonth(cursor, -1, setCursor)} className="p-2 text-muted" aria-label="Önceki ay">
          ←
        </button>
        <h1 className="font-display text-xl font-semibold">
          {cursor.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
        </h1>
        <button onClick={() => shiftMonth(cursor, 1, setCursor)} className="p-2 text-muted" aria-label="Sonraki ay">
          →
        </button>
      </header>

      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-xs font-semibold text-muted py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-6">
        {days.map((date, i) => {
          if (!date) return <div key={i} />;
          const iso = toISODate(date);
          const { isPeriod, isFertile, isOvulation, isPredictedPeriod, hasLog } = dayStatus(date);
          const isToday = iso === today;
          return (
            <button
              key={iso}
              onClick={() => setSelected(iso)}
              className={`relative aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-colors
                ${isPeriod ? 'bg-primary text-white' : isPredictedPeriod ? 'bg-primary/20 text-primary' : isOvulation ? 'bg-accent text-white' : isFertile ? 'bg-secondary/25 text-secondary' : 'bg-surface text-ink'}
                ${isToday ? 'ring-2 ring-ink' : ''}
              `}
            >
              {date.getDate()}
              {hasLog && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-current opacity-70" />}
            </button>
          );
        })}
      </div>

      <Legend />

      {selected && (
        <DayDetail
          iso={selected}
          onClose={() => setSelected(null)}
          periods={periods}
          addOrUpdatePeriodStart={addOrUpdatePeriodStart}
          removePeriod={removePeriod}
          log={logs[selected]}
        />
      )}
    </div>
  );
}

function Legend() {
  const items = [
    { color: 'bg-primary', label: 'Regl' },
    { color: 'bg-primary/20', label: 'Tahmini Regl' },
    { color: 'bg-secondary/25', label: 'Doğurgan' },
    { color: 'bg-accent', label: 'Yumurtlama' },
  ];
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-full ${it.color}`} />
          <span className="text-xs text-muted">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function DayDetail({ iso, onClose, periods, addOrUpdatePeriodStart, removePeriod, log }) {
  const isPeriodStart = periods.some((p) => p.start === iso);
  const date = fromISODate(iso);

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-end z-50" onClick={onClose}>
      <div
        className="bg-surface w-full max-w-md mx-auto rounded-t-3xl p-6 pb-[max(env(safe-area-inset-bottom),24px)] animate-riseIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-line rounded-full mx-auto mb-4" />
        <h2 className="font-display text-lg font-semibold mb-1">
          {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
        </h2>
        {log && (
          <div className="text-sm text-muted mb-3 space-y-0.5">
            {log.mood && <p>Ruh hali: {log.mood}</p>}
            {log.flow && <p>Akış: {log.flow}</p>}
            {log.symptoms?.length > 0 && <p>Semptomlar: {log.symptoms.join(', ')}</p>}
            {log.note && <p>Not: {log.note}</p>}
          </div>
        )}
        <button
          onClick={() => {
            isPeriodStart ? removePeriod(iso) : addOrUpdatePeriodStart(iso);
            onClose();
          }}
          className={`w-full rounded-2xl py-3.5 font-semibold ${
            isPeriodStart ? 'bg-surface2 text-ink' : 'bg-primary text-white'
          }`}
        >
          {isPeriodStart ? 'Regl başlangıcını kaldır' : 'Regl başlangıcı olarak işaretle'}
        </button>
      </div>
    </div>
  );
}

function buildMonthGrid(cursor) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Pazartesi=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grid = Array(startWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(new Date(year, month, d));
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

function shiftMonth(cursor, delta, setCursor) {
  const d = new Date(cursor);
  d.setMonth(d.getMonth() + delta);
  setCursor(d);
}
