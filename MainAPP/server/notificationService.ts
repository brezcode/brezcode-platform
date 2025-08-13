import { db } from './db';
import { brandCustomers, brandKnowledgeBase } from '@shared/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

interface NotificationSchedule {
  id: string;
  customerId: string;
  brandId: string;
  type: 'health_tip' | 'reminder' | 'check_in' | 'education';
  message: string;
  scheduledFor: Date;
  isRecurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  metadata?: any;
}

interface WebPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class NotificationService {
  private notifications: Map<string, NotificationSchedule> = new Map();
  private subscriptions: Map<string, WebPushSubscription> = new Map();

  // Initialize notification service
  async initialize() {
    console.log('🔔 Initializing notification service...');
    
    // Start scheduled notification checker
    this.startNotificationScheduler();
    
    // Set up default notification templates
    await this.setupDefaultNotifications();
    
    console.log('✅ Notification service initialized');
  }

  // Register web push subscription for a customer
  async registerPushSubscription(
    customerId: string, 
    subscription: WebPushSubscription
  ): Promise<void> {
    this.subscriptions.set(customerId, subscription);
    console.log(`📱 Registered push subscription for customer ${customerId}`);
  }

  // Schedule a notification
  async scheduleNotification(
    customerId: string,
    brandId: string,
    type: NotificationSchedule['type'],
    message: string,
    scheduledFor: Date,
    isRecurring: boolean = false,
    frequency?: NotificationSchedule['frequency']
  ): Promise<string> {
    const id = `notif_${Date.now()}_${customerId}`;
    
    const notification: NotificationSchedule = {
      id,
      customerId,
      brandId,
      type,
      message,
      scheduledFor,
      isRecurring,
      frequency,
      isActive: true,
      metadata: { createdAt: new Date() }
    };

    this.notifications.set(id, notification);
    console.log(`⏰ Scheduled ${type} notification for customer ${customerId} at ${scheduledFor}`);
    
    return id;
  }

  // Send immediate web push notification
  async sendWebPushNotification(
    customerId: string,
    title: string,
    body: string,
    icon?: string,
    badge?: string,
    data?: any
  ): Promise<boolean> {
    const subscription = this.subscriptions.get(customerId);
    
    if (!subscription) {
      console.log(`❌ No push subscription found for customer ${customerId}`);
      return false;
    }

    try {
      // In production, you would use web-push library here
      // For now, we'll simulate the notification
      const notificationPayload = {
        title,
        body,
        icon: icon || '/icon-192x192.png',
        badge: badge || '/badge-72x72.png',
        data: data || {},
        timestamp: Date.now(),
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'View Details',
            icon: '/action-view.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss',
            icon: '/action-dismiss.png'
          }
        ]
      };

      console.log(`🔔 Sending web push notification to customer ${customerId}:`, notificationPayload);
      
      // Here you would use the web-push library:
      // await webpush.sendNotification(subscription, JSON.stringify(notificationPayload));
      
      return true;
    } catch (error: any) {
      console.error(`❌ Failed to send push notification to customer ${customerId}:`, error.message);
      return false;
    }
  }

  // Generate personalized health notifications using AI knowledge base
  async generatePersonalizedNotification(
    customerId: string,
    brandId: string,
    type: NotificationSchedule['type']
  ): Promise<string> {
    try {
      // Get relevant knowledge from brand's knowledge base
      const knowledgeEntries = await db
        .select()
        .from(brandKnowledgeBase)
        .where(and(
          eq(brandKnowledgeBase.brandId, brandId),
          eq(brandKnowledgeBase.isActive, true)
        ))
        .limit(5);

      // Generate personalized message based on type and knowledge
      let message = '';
      
      switch (type) {
        case 'health_tip':
          if (knowledgeEntries.length > 0) {
            const randomEntry = knowledgeEntries[Math.floor(Math.random() * knowledgeEntries.length)];
            const contentPreview = randomEntry.content.substring(0, 120);
            message = `💡 Daily Health Tip: ${contentPreview}... Tap to read more.`;
          } else {
            message = '💡 Daily Health Tip: Remember to practice self-care and maintain your wellness routine today!';
          }
          break;
          
        case 'reminder':
          message = '🗓️ Health Check Reminder: Time for your scheduled health activity. Your wellness journey matters!';
          break;
          
        case 'check_in':
          message = '❤️ How are you feeling today? Check in with your health goals and track your progress.';
          break;
          
        case 'education':
          if (knowledgeEntries.length > 0) {
            const educationalEntry = knowledgeEntries.find(e => 
              e.category === 'education' || e.category === 'guidelines'
            ) || knowledgeEntries[0];
            message = `📚 Learn Something New: ${educationalEntry.title}. Expand your health knowledge today!`;
          } else {
            message = '📚 Educational Content: Discover new ways to improve your health and wellness.';
          }
          break;
          
        default:
          message = '🌟 Your health journey continues! Check your app for personalized guidance.';
      }

      return message;
    } catch (error: any) {
      console.error('Error generating personalized notification:', error.message);
      return 'Your health matters! Check your app for personalized wellness guidance.';
    }
  }

  // Schedule daily health tips for a customer
  async scheduleDailyHealthTips(customerId: string, brandId: string, preferredTime: string = '09:00'): Promise<void> {
    const [hours, minutes] = preferredTime.split(':').map(Number);
    
    // Schedule for next 7 days
    for (let i = 1; i <= 7; i++) {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + i);
      scheduledDate.setHours(hours, minutes, 0, 0);
      
      const message = await this.generatePersonalizedNotification(customerId, brandId, 'health_tip');
      
      await this.scheduleNotification(
        customerId,
        brandId,
        'health_tip',
        message,
        scheduledDate,
        true,
        'daily'
      );
    }
    
    console.log(`📅 Scheduled 7 days of health tips for customer ${customerId}`);
  }

  // Check and send due notifications
  private async checkAndSendNotifications(): Promise<void> {
    const now = new Date();
    
    for (const [id, notification] of this.notifications.entries()) {
      if (!notification.isActive) continue;
      
      if (notification.scheduledFor <= now) {
        console.log(`🔔 Sending scheduled notification: ${notification.type} to customer ${notification.customerId}`);
        
        // Send web push notification
        await this.sendWebPushNotification(
          notification.customerId,
          this.getNotificationTitle(notification.type),
          notification.message,
          '/health-icon.png',
          '/health-badge.png',
          {
            type: notification.type,
            brandId: notification.brandId,
            notificationId: id
          }
        );

        // Handle recurring notifications
        if (notification.isRecurring && notification.frequency) {
          const nextSchedule = this.calculateNextSchedule(notification.scheduledFor, notification.frequency);
          notification.scheduledFor = nextSchedule;
          console.log(`♻️ Rescheduled recurring notification for ${nextSchedule}`);
        } else {
          // Mark as inactive for one-time notifications
          notification.isActive = false;
        }
      }
    }
  }

  // Calculate next schedule for recurring notifications
  private calculateNextSchedule(currentDate: Date, frequency: string): Date {
    const nextDate = new Date(currentDate);
    
    switch (frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
    }
    
    return nextDate;
  }

  // Get notification title based on type
  private getNotificationTitle(type: NotificationSchedule['type']): string {
    const titles = {
      'health_tip': '💡 Daily Health Tip',
      'reminder': '🗓️ Health Reminder',
      'check_in': '❤️ Wellness Check-in',
      'education': '📚 Learn & Grow'
    };
    
    return titles[type] || '🌟 Health Update';
  }

  // Start the notification scheduler (runs every minute)
  private startNotificationScheduler(): void {
    setInterval(async () => {
      await this.checkAndSendNotifications();
    }, 60000); // Check every minute
    
    console.log('⏰ Notification scheduler started (checking every minute)');
  }

  // Setup default notification templates
  private async setupDefaultNotifications(): Promise<void> {
    console.log('📋 Setting up default notification templates...');
    
    // Default templates are now generated dynamically using the knowledge base
    // This ensures notifications are always personalized and relevant
  }

  // Get all active notifications for a customer
  async getCustomerNotifications(customerId: string): Promise<NotificationSchedule[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.customerId === customerId && n.isActive)
      .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
  }

  // Cancel a notification
  async cancelNotification(notificationId: string): Promise<boolean> {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.isActive = false;
      console.log(`❌ Cancelled notification ${notificationId}`);
      return true;
    }
    return false;
  }

  // Update notification preferences
  async updateNotificationPreferences(
    customerId: string,
    preferences: {
      enableDailyTips?: boolean;
      enableReminders?: boolean;
      preferredTime?: string;
      frequency?: string;
    }
  ): Promise<void> {
    console.log(`⚙️ Updated notification preferences for customer ${customerId}:`, preferences);
    
    // Here you would typically save preferences to database
    // For now, we'll just log the changes
  }
}

export const notificationService = new NotificationService();