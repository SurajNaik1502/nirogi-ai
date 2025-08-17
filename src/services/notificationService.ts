import { Medication } from './medicationService';

export interface NotificationSettings {
  id: string;
  medication_id: string;
  times: string[]; // Array of times in HH:mm format
  days: number[]; // Array of day numbers (0-6, 0 = Sunday)
  is_custom: boolean;
  custom_frequency?: string;
  next_notification: string;
}

export interface CustomNotificationData {
  date: string;
  times: string[];
  frequency: 'once' | 'daily' | 'weekly' | 'custom';
  days?: number[]; // for weekly custom
}

class NotificationService {
  private notifications: Map<string, NotificationSettings> = new Map();
  private timeouts: Map<string, NodeJS.Timeout[]> = new Map();

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  setupMedicationNotifications(medication: Medication, customData?: CustomNotificationData) {
    const settings = this.createNotificationSettings(medication, customData);
    this.notifications.set(medication.id, settings);
    this.scheduleNotifications(medication, settings);
    
    // Store in localStorage for persistence
    this.saveNotificationsToStorage();
  }

  private createNotificationSettings(medication: Medication, customData?: CustomNotificationData): NotificationSettings {
    let times: string[] = [];
    let days: number[] = [];
    let isCustom = false;

    switch (medication.frequency) {
      case 'twice-daily':
        times = ['13:00', '21:00']; // 1pm and 9pm
        days = [0, 1, 2, 3, 4, 5, 6]; // Every day
        break;
      case 'daily':
        times = ['20:00']; // 8pm
        days = [0, 1, 2, 3, 4, 5, 6]; // Every day
        break;
      case 'weekly':
        times = ['20:00']; // 8pm
        days = [1]; // Monday
        break;
      case 'as-needed':
        if (customData) {
          times = customData.times;
          isCustom = true;
          
          switch (customData.frequency) {
            case 'once':
              // No recurring days
              days = [];
              break;
            case 'daily':
              days = [0, 1, 2, 3, 4, 5, 6];
              break;
            case 'weekly':
              days = customData.days || [1]; // Default to Monday
              break;
            case 'custom':
              days = customData.days || [];
              break;
          }
        }
        break;
      default:
        times = ['20:00'];
        days = [0, 1, 2, 3, 4, 5, 6];
    }

    return {
      id: `${medication.id}_${Date.now()}`,
      medication_id: medication.id,
      times,
      days,
      is_custom: isCustom,
      custom_frequency: customData?.frequency,
      next_notification: this.calculateNextNotification(times, days)
    };
  }

  private calculateNextNotification(times: string[], days: number[]): string {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let nextNotification: Date | null = null;

    // Check today's remaining times
    for (const time of times) {
      const [hours, minutes] = time.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      if (days.includes(currentDay) && timeInMinutes > currentTime) {
        const today = new Date();
        today.setHours(hours, minutes, 0, 0);
        if (!nextNotification || today < nextNotification) {
          nextNotification = today;
        }
      }
    }

    // If no time today, check upcoming days
    if (!nextNotification) {
      for (let i = 1; i <= 7; i++) {
        const nextDay = (currentDay + i) % 7;
        if (days.includes(nextDay)) {
          const [hours, minutes] = times[0].split(':').map(Number);
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + i);
          futureDate.setHours(hours, minutes, 0, 0);
          nextNotification = futureDate;
          break;
        }
      }
    }

    return nextNotification ? nextNotification.toISOString() : '';
  }

  private scheduleNotifications(medication: Medication, settings: NotificationSettings) {
    // Clear existing timeouts
    this.clearNotifications(medication.id);

    const timeouts: NodeJS.Timeout[] = [];

    settings.times.forEach(time => {
      settings.days.forEach(day => {
        const timeout = this.scheduleNotificationForTime(medication, time, day);
        if (timeout) {
          timeouts.push(timeout);
        }
      });
    });

    this.timeouts.set(medication.id, timeouts);
  }

  private scheduleNotificationForTime(medication: Medication, time: string, day: number): NodeJS.Timeout | null {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    
    // Calculate next occurrence of this day and time
    const currentDay = now.getDay();
    let daysUntil = day - currentDay;
    if (daysUntil < 0 || (daysUntil === 0 && (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() >= minutes)))) {
      daysUntil += 7;
    }
    
    scheduledTime.setDate(now.getDate() + daysUntil);
    scheduledTime.setHours(hours, minutes, 0, 0);

    const delay = scheduledTime.getTime() - now.getTime();
    
    if (delay > 0) {
      return setTimeout(() => {
        this.showNotification(medication);
        // Reschedule for next week
        this.scheduleNotificationForTime(medication, time, day);
      }, delay);
    }

    return null;
  }

  private showNotification(medication: Medication) {
    if (Notification.permission === 'granted') {
      new Notification(`💊 Time for your medication`, {
        body: `Don't forget to take ${medication.name} (${medication.dosage})`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `medication_${medication.id}`,
        requireInteraction: true,
        silent: false
      });
    }
  }

  clearNotifications(medicationId: string) {
    const timeouts = this.timeouts.get(medicationId);
    if (timeouts) {
      timeouts.forEach(timeout => clearTimeout(timeout));
      this.timeouts.delete(medicationId);
    }
    this.notifications.delete(medicationId);
    this.saveNotificationsToStorage();
  }

  private saveNotificationsToStorage() {
    const notificationsArray = Array.from(this.notifications.entries());
    localStorage.setItem('medication_notifications', JSON.stringify(notificationsArray));
  }

  loadNotificationsFromStorage() {
    const stored = localStorage.getItem('medication_notifications');
    if (stored) {
      try {
        const notificationsArray = JSON.parse(stored);
        this.notifications = new Map(notificationsArray);
      } catch (error) {
        console.error('Error loading notifications from storage:', error);
      }
    }
  }

  getNotificationSettings(medicationId: string): NotificationSettings | undefined {
    return this.notifications.get(medicationId);
  }

  updateNotificationSettings(medicationId: string, customData: CustomNotificationData) {
    const notification = this.notifications.get(medicationId);
    if (notification) {
      // Update with new custom data
      const medication = { id: medicationId, frequency: 'as-needed' } as Medication;
      this.setupMedicationNotifications(medication, customData);
    }
  }
}

export const notificationService = new NotificationService();