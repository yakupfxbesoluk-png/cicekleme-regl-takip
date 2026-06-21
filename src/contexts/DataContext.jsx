// src/contexts/DataContext.jsx
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';
import { getCycleInsights, toISODate } from '../utils/cycle';
import { scheduleAllReminders } from '../utils/notifications';

const DataContext = createContext(null);

const KEYS = {
  periods: 'cicekleme.periods',
  logs: 'cicekleme.logs',
  settings: 'cicekleme.settings',
};

const DEFAULT_SETTINGS = {
  defaultCycleLength: 28,
  defaultPeriodLength: 5,
  lutealPhaseLength: 14,
  periodReminder: true,
  periodReminderDays: [2, 0],
  ovulationReminder: true,
  dailyLog: false,
  dailyLogHour: 21,
  onboarded: false,
};

export function DataProvider({ children }) {
  const [periods, setPeriods] = useState([]); // [{start, end}]
  const [logs, setLogs] = useState({}); // { 'YYYY-MM-DD': { mood, symptoms: [], flow, note } }
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [p, l, s] = await Promise.all([
        Preferences.get({ key: KEYS.periods }),
        Preferences.get({ key: KEYS.logs }),
        Preferences.get({ key: KEYS.settings }),
      ]);
      if (p.value) setPeriods(JSON.parse(p.value));
      if (l.value) setLogs(JSON.parse(l.value));
      if (s.value) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s.value) });
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) Preferences.set({ key: KEYS.periods, value: JSON.stringify(periods) });
  }, [periods, loaded]);

  useEffect(() => {
    if (loaded) Preferences.set({ key: KEYS.logs, value: JSON.stringify(logs) });
  }, [logs, loaded]);

  useEffect(() => {
    if (loaded) Preferences.set({ key: KEYS.settings, value: JSON.stringify(settings) });
  }, [settings, loaded]);

  const insights = useMemo(() => getCycleInsights(periods, settings), [periods, settings]);

  // Hatırlatmaları döngü tahmini veya ayarlar değiştiğinde yeniden planla
  useEffect(() => {
    if (!loaded) return;
    scheduleAllReminders(insights, settings).catch(() => {});
  }, [insights.nextPeriodDate, insights.ovulationDate, settings.periodReminder, settings.ovulationReminder, settings.dailyLog, settings.dailyLogHour, loaded]);

  const addOrUpdatePeriodStart = useCallback((dateISO) => {
    setPeriods((prev) => {
      const exists = prev.find((p) => p.start === dateISO);
      if (exists) return prev;
      return [...prev, { start: dateISO, end: null }];
    });
  }, []);

  const setPeriodEnd = useCallback((startISO, endISO) => {
    setPeriods((prev) => prev.map((p) => (p.start === startISO ? { ...p, end: endISO } : p)));
  }, []);

  const removePeriod = useCallback((startISO) => {
    setPeriods((prev) => prev.filter((p) => p.start !== startISO));
  }, []);

  const logToday = useCallback((dateISO, entry) => {
    setLogs((prev) => ({ ...prev, [dateISO]: { ...(prev[dateISO] || {}), ...entry } }));
  }, []);

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = {
    periods,
    logs,
    settings,
    insights,
    loaded,
    addOrUpdatePeriodStart,
    setPeriodEnd,
    removePeriod,
    logToday,
    updateSettings,
    today: toISODate(new Date()),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
