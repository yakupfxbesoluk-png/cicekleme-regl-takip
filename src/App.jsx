// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav.jsx';
import AdBanner from './components/AdBanner.jsx';
import Home from './screens/Home.jsx';
import CalendarScreen from './screens/Calendar.jsx';
import SymptomLog from './screens/SymptomLog.jsx';
import Stats from './screens/Stats.jsx';
import Terms from './screens/Terms.jsx';
import Settings from './screens/Settings.jsx';

export default function App() {
  return (
    <div className="min-h-full max-w-md mx-auto pb-36">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/takvim" element={<CalendarScreen />} />
        <Route path="/gunluk" element={<SymptomLog />} />
        <Route path="/istatistik" element={<Stats />} />
        <Route path="/terimler" element={<Terms />} />
        <Route path="/ayarlar" element={<Settings />} />
      </Routes>
      <AdBanner />
      <BottomNav />
    </div>
  );
}
