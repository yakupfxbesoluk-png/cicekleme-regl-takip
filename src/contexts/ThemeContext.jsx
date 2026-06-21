// src/contexts/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';

const ThemeContext = createContext(null);
const KEY = 'cicekleme.theme';

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('system'); // 'light' | 'dark' | 'system'
  const [resolved, setResolved] = useState('light');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { value } = await Preferences.get({ key: KEY });
      if (value) setMode(value);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const effective = mode === 'system' ? (mq.matches ? 'dark' : 'light') : mode;
      setResolved(effective);
      document.documentElement.classList.toggle('dark', effective === 'dark');
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [mode]);

  useEffect(() => {
    if (loaded) Preferences.set({ key: KEY, value: mode });
  }, [mode, loaded]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
