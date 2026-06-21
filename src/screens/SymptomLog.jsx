// src/screens/SymptomLog.jsx
import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext.jsx';

const MOODS = ['😊 İyi', '😐 Normal', '😣 Kötü', '😢 Hassas', '😡 Sinirli'];
const FLOWS = ['Yok', 'Hafif', 'Orta', 'Yoğun'];
const SYMPTOMS = [
  'Kramp', 'Baş ağrısı', 'Şişkinlik', 'Yorgunluk', 'Sırt ağrısı',
  'Göğüs hassasiyeti', 'Akne', 'Bulantı', 'İştah artışı', 'Uyku sorunu',
];

export default function SymptomLog() {
  const { logToday, logs, today } = useData();
  const existing = logs[today] || {};
  const [mood, setMood] = useState(existing.mood || null);
  const [flow, setFlow] = useState(existing.flow || null);
  const [symptoms, setSymptoms] = useState(existing.symptoms || []);
  const [note, setNote] = useState(existing.note || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(false);
  }, [mood, flow, symptoms, note]);

  const toggleSymptom = (s) => {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const save = () => {
    logToday(today, { mood, flow, symptoms, note });
    setSaved(true);
  };

  return (
    <div className="px-5 pt-8 animate-riseIn">
      <header className="mb-6">
        <p className="text-sm text-muted font-medium">Günlük</p>
        <h1 className="font-display text-2xl font-semibold mt-0.5">Bugün nasıl hissediyorsun?</h1>
      </header>

      <Section title="Ruh Hali">
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <Chip key={m} active={mood === m} onClick={() => setMood(m)}>
              {m}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Akış Yoğunluğu">
        <div className="flex flex-wrap gap-2">
          {FLOWS.map((f) => (
            <Chip key={f} active={flow === f} onClick={() => setFlow(f)}>
              {f}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Semptomlar">
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map((s) => (
            <Chip key={s} active={symptoms.includes(s)} onClick={() => toggleSymptom(s)}>
              {s}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Not">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Eklemek istediğin bir şey var mı?"
          rows={3}
          className="w-full bg-surface rounded-2xl p-4 text-sm placeholder:text-muted border border-line focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
        />
      </Section>

      <button
        onClick={save}
        className="w-full bg-primary text-white font-semibold rounded-2xl py-3.5 shadow-card active:scale-[0.98] transition-transform"
      >
        {saved ? 'Kaydedildi ✓' : 'Kaydet'}
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-semibold text-muted mb-2.5">{title}</h2>
      {children}
    </section>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-colors ${
        active ? 'bg-primary text-white border-primary' : 'bg-surface text-ink border-line'
      }`}
    >
      {children}
    </button>
  );
}
