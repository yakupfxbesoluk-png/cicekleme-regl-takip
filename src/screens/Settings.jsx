// src/screens/Settings.jsx
import { useTheme } from '../contexts/ThemeContext.jsx';
import { useData } from '../contexts/DataContext.jsx';

export default function Settings() {
  const { mode, setMode } = useTheme();
  const { settings, updateSettings, periods } = useData();

  return (
    <div className="px-5 pt-8 animate-riseIn">
      <header className="mb-6">
        <p className="text-sm text-muted font-medium">Ayarlar</p>
        <h1 className="font-display text-2xl font-semibold mt-0.5">Tercihlerin</h1>
      </header>

      <Section title="Görünüm">
        <div className="flex gap-2">
          {[
            { v: 'light', l: 'Açık' },
            { v: 'dark', l: 'Koyu' },
            { v: 'system', l: 'Sistem' },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setMode(o.v)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border ${
                mode === o.v ? 'bg-primary text-white border-primary' : 'bg-surface text-ink border-line'
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Döngü Varsayılanları">
        <p className="text-xs text-muted mb-3 leading-relaxed">
          Yeterli geçmiş verin oluştuğunda (en az 2 döngü) uygulama tahminlerini otomatik olarak
          senin gerçek ortalamana göre günceller. Bu değerler sadece veri yokken kullanılır.
        </p>
        <NumberRow
          label="Ortalama döngü uzunluğu"
          value={settings.defaultCycleLength}
          unit="gün"
          min={21}
          max={45}
          onChange={(v) => updateSettings({ defaultCycleLength: v })}
        />
        <NumberRow
          label="Ortalama regl süresi"
          value={settings.defaultPeriodLength}
          unit="gün"
          min={2}
          max={10}
          onChange={(v) => updateSettings({ defaultPeriodLength: v })}
        />
        <NumberRow
          label="Luteal faz uzunluğu"
          value={settings.lutealPhaseLength}
          unit="gün"
          min={10}
          max={16}
          onChange={(v) => updateSettings({ lutealPhaseLength: v })}
        />
      </Section>

      <Section title="Bildirimler">
        <ToggleRow
          label="Yaklaşan regl hatırlatması"
          checked={settings.periodReminder}
          onChange={(v) => updateSettings({ periodReminder: v })}
        />
        <ToggleRow
          label="Yumurtlama hatırlatması"
          checked={settings.ovulationReminder}
          onChange={(v) => updateSettings({ ovulationReminder: v })}
        />
        <ToggleRow
          label="Günlük doldurma hatırlatması (21:00)"
          checked={settings.dailyLog}
          onChange={(v) => updateSettings({ dailyLog: v })}
        />
      </Section>

      <Section title="Veri">
        <p className="text-xs text-muted leading-relaxed mb-2">
          Regl, semptom ve günlük verilerin yalnızca bu cihazda, yerel olarak saklanır; bu veriler
          hiçbir sunucuya gönderilmez. Uygulama Google AdMob ile reklam gösterir; AdMob, reklam
          sunmak için cihaz/reklam tanımlayıcı gibi sınırlı verileri Google ile paylaşabilir
          (Google'ın gizlilik politikasına tabidir). {periods.length} regl kaydı bulunuyor.
        </p>
      </Section>

      <p className="text-[11px] text-muted text-center mt-8 leading-relaxed px-4">
        Bu uygulama genel döngü tahminleri sunar ve tıbbi tavsiye yerine geçmez. Düzensiz
        döngüler, şiddetli ağrı veya başka belirtiler için bir sağlık uzmanına danış.
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-7">
      <h2 className="text-sm font-semibold text-muted mb-2.5">{title}</h2>
      {children}
    </section>
  );
}

function NumberRow({ label, value, unit, min, max, onChange }) {
  return (
    <div className="flex items-center justify-between bg-surface rounded-2xl px-4 py-3 mb-2.5 shadow-card">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-7 h-7 rounded-full bg-surface2 text-ink font-semibold"
        >
          −
        </button>
        <span className="text-sm font-semibold w-14 text-center">
          {value} {unit}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-7 h-7 rounded-full bg-surface2 text-ink font-semibold"
        >
          +
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between bg-surface rounded-2xl px-4 py-3 mb-2.5 shadow-card">
      <span className="text-sm pr-3">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full shrink-0 relative transition-colors ${
          checked ? 'bg-primary' : 'bg-surface2'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
