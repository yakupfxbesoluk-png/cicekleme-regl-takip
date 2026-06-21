// src/components/BottomNav.jsx
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Bugün', icon: HomeIcon },
  { to: '/takvim', label: 'Takvim', icon: CalendarIcon },
  { to: '/gunluk', label: 'Günlük', icon: LogIcon },
  { to: '/istatistik', label: 'İstatistik', icon: StatsIcon },
  { to: '/terimler', label: 'Terimler', icon: BookIcon },
  { to: '/ayarlar', label: 'Ayarlar', icon: SettingsIcon },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur border-t border-line px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 z-40">
      <div className="flex justify-between max-w-md mx-auto">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-colors ${
                isActive ? 'text-primary' : 'text-muted'
              }`
            }
          >
            <Icon className="w-[18px] h-[18px]" />
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 3 3 10v10h6v-6h6v6h6V10z" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}
function LogIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 19.5V6a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 22a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h12v4Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function StatsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 20V10M12 20V4M20 20v-7" strokeLinecap="round" />
    </svg>
  );
}
function BookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SettingsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}
