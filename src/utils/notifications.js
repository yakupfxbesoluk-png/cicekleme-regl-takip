// src/utils/notifications.js
import { LocalNotifications } from '@capacitor/local-notifications';
import { fromISODate } from './cycle';

export async function ensureNotificationPermission() {
  const status = await LocalNotifications.checkPermissions();
  if (status.display !== 'granted') {
    const req = await LocalNotifications.requestPermissions();
    return req.display === 'granted';
  }
  return true;
}

// reminderDays: yaklaşan regl için kaç gün önceden hatırlatılacağı (ör. [3, 1])
export async function scheduleAllReminders(insights, reminderSettings) {
  const granted = await ensureNotificationPermission();
  if (!granted || !insights?.hasData) return;

  await LocalNotifications.cancel({ notifications: (await LocalNotifications.getPending()).notifications });

  const notifications = [];
  let id = 1;

  if (reminderSettings.periodReminder) {
    for (const daysBefore of reminderSettings.periodReminderDays || [2]) {
      const date = fromISODate(insights.nextPeriodDate);
      date.setDate(date.getDate() - daysBefore);
      date.setHours(9, 0, 0, 0);
      if (date > new Date()) {
        notifications.push({
          id: id++,
          title: 'Reglin yaklaşıyor 🌸',
          body: daysBefore === 0
            ? 'Bugün reglin başlaması bekleniyor.'
            : `Tahmini regl başlangıcına ${daysBefore} gün kaldı.`,
          schedule: { at: date },
          smallIcon: 'ic_stat_icon',
        });
      }
    }
  }

  if (reminderSettings.ovulationReminder) {
    const ovDate = fromISODate(insights.ovulationDate);
    ovDate.setDate(ovDate.getDate() - 1);
    ovDate.setHours(9, 0, 0, 0);
    if (ovDate > new Date()) {
      notifications.push({
        id: id++,
        title: 'Doğurgan pencere yaklaşıyor 🌿',
        body: 'Yumurtlamana 1 gün kaldı, doğurgan pencerendesin.',
        schedule: { at: ovDate },
        smallIcon: 'ic_stat_icon',
      });
    }
  }

  if (reminderSettings.dailyLog) {
    notifications.push({
      id: id++,
      title: 'Günlüğünü doldurmayı unutma 📝',
      body: 'Bugünkü semptom ve ruh halini kaydet.',
      schedule: {
        on: { hour: reminderSettings.dailyLogHour ?? 21, minute: 0 },
        repeats: true,
      },
      smallIcon: 'ic_stat_icon',
    });
  }

  if (notifications.length) {
    await LocalNotifications.schedule({ notifications });
  }
}

export async function cancelAllReminders() {
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length) {
    await LocalNotifications.cancel({ notifications: pending.notifications });
  }
}
