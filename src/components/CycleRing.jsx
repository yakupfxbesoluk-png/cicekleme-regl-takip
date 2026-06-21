// src/components/CycleRing.jsx
import { useMemo } from 'react';

// Döngüyü bir halka olarak çizer: regl günleri (taç yaprak/petal dolgusu),
// doğurgan pencere (sage yay), ovülasyon (amber yıldız), bugünün konumu (nabız noktası).
export default function CycleRing({ insights, size = 280 }) {
  const r = size / 2 - 22;
  const cx = size / 2;
  const cy = size / 2;
  const cycleLength = insights.cycleLength || 28;

  const angleForDay = (day) => (day - 1) / cycleLength * 360 - 90;

  const pointAt = (day, radius = r) => {
    const a = (angleForDay(day) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  };

  const arcPath = (startDay, endDay, radius = r) => {
    const start = pointAt(startDay, radius);
    const end = pointAt(endDay, radius);
    const largeArc = ((endDay - startDay + cycleLength) % cycleLength) > cycleLength / 2 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  const ticks = useMemo(() => {
    return Array.from({ length: cycleLength }, (_, i) => i + 1);
  }, [cycleLength]);

  const todayPos = insights.hasData ? pointAt(insights.cycleDay) : pointAt(1);
  const ovDay = insights.hasData
    ? Math.max(insights.periodLength, cycleLength - insights.luteal) + 1
    : null;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
      {/* base ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgb(var(--c-line))" strokeWidth="14" />

      {/* period petals */}
      {insights.hasData && (
        <path
          d={arcPath(1, insights.periodLength + 1)}
          fill="none"
          stroke="rgb(var(--c-primary))"
          strokeWidth="14"
          strokeLinecap="round"
        />
      )}

      {/* fertile window arc */}
      {insights.hasData && (
        <path
          d={arcPath(
            Math.max(1, (ovDay ?? 1) - 5),
            (ovDay ?? 1) + 1
          )}
          fill="none"
          stroke="rgb(var(--c-secondary))"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.85"
        />
      )}

      {/* day ticks */}
      {ticks.map((d) => {
        if (d % 7 !== 0 && d !== 1) return null;
        const p = pointAt(d, r + 20);
        return (
          <text
            key={d}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted font-body"
            fontSize="10"
          >
            {d}
          </text>
        );
      })}

      {/* ovulation marker (star point) */}
      {insights.hasData && ovDay && (
        <circle cx={pointAt(ovDay).x} cy={pointAt(ovDay).y} r="6" fill="rgb(var(--c-accent))" />
      )}

      {/* today marker */}
      {insights.hasData && (
        <g>
          <circle cx={todayPos.x} cy={todayPos.y} r="9" fill="rgb(var(--c-ink))" className="animate-pulseSoft" />
          <circle cx={todayPos.x} cy={todayPos.y} r="4" fill="rgb(var(--c-bg))" />
        </g>
      )}

      {/* center label */}
      <text x={cx} y={cy - 6} textAnchor="middle" className="fill-ink font-display" fontSize="38" fontWeight="600">
        {insights.hasData ? Math.abs(insights.daysUntilNextPeriod) : '–'}
      </text>
      <text x={cx} y={cy + 20} textAnchor="middle" className="fill-muted font-body" fontSize="12">
        {insights.hasData
          ? insights.daysUntilNextPeriod >= 0
            ? 'gün sonra regl'
            : 'gün gecikme'
          : 'veri bekleniyor'}
      </text>
    </svg>
  );
}
