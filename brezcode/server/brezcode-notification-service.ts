// BREZCODE NOTIFICATION SERVICE
// Health-focused notification system for BrezCode platform
// Adapted from LeadGen notification system for health reminders and alerts

import { db } from './brezcode-db'
import { 
  brezcodeUsers, 
  brezcodeHealthAssessments, 
  brezcodeAiCoachingSessions,
  brezcodeSubscriptions 
} from '../../shared/brezcode-schema'
import { eq, desc, and, gte, lte } from 'drizzle-orm'

export interface HealthNotification {
  id: string
  userId: number
  type: 'health_reminder' | 'assessment_due' | 'appointment_reminder' | 'risk_alert' | 'milestone_celebration'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  scheduledAt: Date
  sentAt?: Date
  readAt?: Date
  actionUrl?: string
  metadata?: {
    assessmentType?: string
    riskLevel?: string
    milestoneType?: string
  }
}

export interface NotificationPreferences {
  userId: number
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  reminderFrequency: 'daily' | 'weekly' | 'monthly'
  notificationTypes: {
    healthReminders: boolean
    assessmentDue: boolean
    appointmentReminders: boolean
    riskAlerts: boolean
    milestones: boolean
  }
}

class BrezcodeNotificationService {
  private notifications: Map<string, HealthNotification> = new Map()
  private userPreferences: Map<number, NotificationPreferences> = new Map()

  async createNotification(notification: Omit<HealthNotification, 'id'>): Promise<HealthNotification> {
    const id = `brezcode-notif-${Date.now()}-${notification.userId}`
    const newNotification: HealthNotification = {
      ...notification,
      id
    }

    this.notifications.set(id, newNotification)
    
    // In production, store in database
    // await db.insert(brezcodeNotifications).values(newNotification)

    return newNotification
  }

  async scheduleHealthReminders(userId: number): Promise<HealthNotification[]> {
    try {
      // Get user's latest assessment to determine reminder schedule
      const latestAssessment = await db
        .select()
        .from(brezcodeHealthAssessments)
        .where(eq(brezcodeHealthAssessments.userId, userId))
        .orderBy(desc(brezcodeHealthAssessments.completedAt))
        .limit(1)

      const user = await db
        .select()
        .from(brezcodeUsers)
        .where(eq(brezcodeUsers.id, userId))
        .limit(1)

      if (user.length === 0) {
        throw new Error('User not found')
      }

      const notifications: HealthNotification[] = []
      const now = new Date()

      // Schedule different types of health reminders based on user profile
      const riskLevel = latestAssessment[0]?.riskCategory || 'unknown'

      // 1. Self-examination reminder
      notifications.push(await this.createNotification({
        userId,
        type: 'health_reminder',
        title: 'Monthly Breast Self-Examination',
        message: 'It\'s time for your monthly self-examination. Regular self-exams help you become familiar with your body.',
        priority: 'medium',
        scheduledAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
        actionUrl: '/health-calendar',
        metadata: { assessmentType: 'self_exam' }
      }))

      // 2. Assessment update reminder (based on risk level)
      const assessmentInterval = riskLevel === 'high' ? 90 : riskLevel === 'moderate' ? 180 : 365 // days
      notifications.push(await this.createNotification({
        userId,
        type: 'assessment_due',
        title: 'Health Assessment Update',
        message: 'Update your health assessment to get the latest personalized recommendations.',
        priority: riskLevel === 'high' ? 'high' : 'medium',
        scheduledAt: new Date(now.getTime() + assessmentInterval * 24 * 60 * 60 * 1000),
        actionUrl: '/quiz',
        metadata: { assessmentType: 'health_update', riskLevel }
      }))

      // 3. Screening reminder (age and risk-based)
      if (this.shouldScheduleScreeningReminder(riskLevel)) {
        notifications.push(await this.createNotification({
          userId,
          type: 'appointment_reminder',
          title: 'Screening Appointment Reminder',
          message: 'Based on your risk profile, consider scheduling your next mammogram or clinical breast exam.',
          priority: riskLevel === 'high' ? 'urgent' : 'high',
          scheduledAt: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year
          actionUrl: '/health-calendar',
          metadata: { assessmentType: 'screening', riskLevel }
        }))
      }

      // 4. Lifestyle reminder
      notifications.push(await this.createNotification({
        userId,
        type: 'health_reminder',
        title: 'Healthy Lifestyle Check-in',
        message: 'How are you doing with your health goals? Dr. Sakura is here to help you stay on track.',
        priority: 'low',
        scheduledAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
        actionUrl: '/chat',
        metadata: { assessmentType: 'lifestyle' }
      }))

      return notifications
    } catch (error) {
      console.error('Schedule health reminders error:', error)
      throw error
    }
  }

  async checkRiskAlerts(userId: number): Promise<HealthNotification[]> {
    try {
      const alerts: HealthNotification[] = []

      // Get user's recent assessments
      const recentAssessments = await db
        .select()
        .from(brezcodeHealthAssessments)
        .where(eq(brezcodeHealthAssessments.userId, userId))
        .orderBy(desc(brezcodeHealthAssessments.completedAt))
        .limit(2)

      if (recentAssessments.length >= 2) {
        const [latest, previous] = recentAssessments
        
        // Check for risk level increase
        if (this.hasRiskIncreased(previous.riskCategory, latest.riskCategory)) {
          alerts.push(await this.createNotification({
            userId,
            type: 'risk_alert',
            title: 'Risk Level Update',
            message: 'Your risk assessment shows changes. Let\'s discuss this with Dr. Sakura to understand your options.',
            priority: 'high',
            scheduledAt: new Date(), // Immediate
            actionUrl: '/chat',
            metadata: { 
              riskLevel: latest.riskCategory,
              assessmentType: 'risk_change'
            }
          }))
        }

        // Check for concerning risk factors
        if (latest.riskCategory === 'high' && !previous || previous.riskCategory !== 'high') {
          alerts.push(await this.createNotification({
            userId,
            type: 'risk_alert',
            title: 'High Risk Category',
            message: 'Your assessment indicates elevated risk factors. Dr. Sakura recommends discussing prevention strategies.',
            priority: 'urgent',
            scheduledAt: new Date(),
            actionUrl: '/chat',
            metadata: { 
              riskLevel: 'high',
              assessmentType: 'high_risk_alert'
            }
          }))
        }
      }

      return alerts
    } catch (error) {
      console.error('Risk alerts check error:', error)
      throw error
    }
  }

  async celebrateMilestones(userId: number): Promise<HealthNotification[]> {
    try {
      const celebrations: HealthNotification[] = []

      // Count user's assessments and sessions
      const assessments = await db
        .select()
        .from(brezcodeHealthAssessments)
        .where(eq(brezcodeHealthAssessments.userId, userId))

      const aiSessions = await db
        .select()
        .from(brezcodeAiCoachingSessions)
        .where(eq(brezcodeAiCoachingSessions.userId, userId))

      // Milestone celebrations
      const milestones = [
        { count: 1, type: 'first_assessment', title: 'Welcome to Your Health Journey!', message: 'Congratulations on completing your first health assessment. You\'ve taken an important step toward better health awareness.' },
        { count: 3, type: 'regular_user', title: 'Health Tracking Champion!', message: 'You\'ve completed 3 assessments! Your commitment to health tracking is inspiring.' },
        { count: 5, type: 'health_advocate', title: 'Health Advocacy Milestone!', message: 'With 5 completed assessments, you\'re becoming a true health advocate. Keep up the excellent work!' },
        { count: 10, type: 'wellness_expert', title: 'Wellness Expert Status!', message: 'Amazing! 10 assessments completed. You\'re setting an excellent example for health consciousness.' }
      ]

      for (const milestone of milestones) {
        if (assessments.length === milestone.count) {
          celebrations.push(await this.createNotification({
            userId,
            type: 'milestone_celebration',
            title: milestone.title,
            message: milestone.message,
            priority: 'medium',
            scheduledAt: new Date(),
            actionUrl: '/personalized-report',
            metadata: { 
              milestoneType: milestone.type,
              assessmentType: 'milestone'
            }
          }))
        }
      }

      // AI coaching milestones
      const coachingMilestones = [
        { count: 1, title: 'First Chat with Dr. Sakura!', message: 'Welcome to AI-powered health coaching! Dr. Sakura is here to support your health journey.' },
        { count: 5, title: 'Coaching Consistency!', message: 'You\'ve had 5 coaching sessions with Dr. Sakura. Your dedication to learning is commendable!' },
        { count: 10, title: 'Health Coaching Pro!', message: 'Ten sessions with Dr. Sakura! You\'re building strong health literacy and self-care habits.' }
      ]

      for (const milestone of coachingMilestones) {
        if (aiSessions.length === milestone.count) {
          celebrations.push(await this.createNotification({
            userId,
            type: 'milestone_celebration',
            title: milestone.title,
            message: milestone.message,
            priority: 'low',
            scheduledAt: new Date(),
            actionUrl: '/chat',
            metadata: { 
              milestoneType: 'coaching',
              assessmentType: 'ai_coaching'
            }
          }))
        }
      }

      return celebrations
    } catch (error) {
      console.error('Milestone celebrations error:', error)
      throw error
    }
  }

  async getUserNotifications(userId: number, limit: number = 20): Promise<HealthNotification[]> {
    // In production, this would query the database
    const userNotifications = Array.from(this.notifications.values())
      .filter(notif => notif.userId === userId)
      .sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime())
      .slice(0, limit)

    return userNotifications
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    const notification = this.notifications.get(notificationId)
    if (notification) {
      notification.readAt = new Date()
      this.notifications.set(notificationId, notification)
    }
  }

  async markNotificationSent(notificationId: string): Promise<void> {
    const notification = this.notifications.get(notificationId)
    if (notification) {
      notification.sentAt = new Date()
      this.notifications.set(notificationId, notification)
    }
  }

  async updateNotificationPreferences(userId: number, preferences: Partial<NotificationPreferences>): Promise<void> {
    const existing = this.userPreferences.get(userId) || this.getDefaultPreferences(userId)
    const updated = { ...existing, ...preferences }
    this.userPreferences.set(userId, updated)

    // In production, store in database
    // await db.update(brezcodeUserPreferences).set(updated).where(eq(brezcodeUserPreferences.userId, userId))
  }

  async getNotificationPreferences(userId: number): Promise<NotificationPreferences> {
    return this.userPreferences.get(userId) || this.getDefaultPreferences(userId)
  }

  private getDefaultPreferences(userId: number): NotificationPreferences {
    return {
      userId,
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      reminderFrequency: 'weekly',
      notificationTypes: {
        healthReminders: true,
        assessmentDue: true,
        appointmentReminders: true,
        riskAlerts: true,
        milestones: true
      }
    }
  }

  private shouldScheduleScreeningReminder(riskLevel: string): boolean {
    // In real implementation, this would also consider age and other factors
    return riskLevel === 'moderate' || riskLevel === 'high'
  }

  private hasRiskIncreased(previousRisk: string, currentRisk: string): boolean {
    const riskLevels = { 'low': 1, 'moderate': 2, 'high': 3 }
    const prevLevel = riskLevels[previousRisk as keyof typeof riskLevels] || 0
    const currLevel = riskLevels[currentRisk as keyof typeof riskLevels] || 0
    return currLevel > prevLevel
  }

  // Batch notification processing for system automation
  async processPendingNotifications(): Promise<{ sent: number; failed: number }> {
    const now = new Date()
    let sent = 0
    let failed = 0

    for (const notification of this.notifications.values()) {
      if (!notification.sentAt && notification.scheduledAt <= now) {
        try {
          await this.sendNotification(notification)
          await this.markNotificationSent(notification.id)
          sent++
        } catch (error) {
          console.error(`Failed to send notification ${notification.id}:`, error)
          failed++
        }
      }
    }

    return { sent, failed }
  }

  private async sendNotification(notification: HealthNotification): Promise<void> {
    // Get user preferences
    const preferences = await this.getNotificationPreferences(notification.userId)
    
    if (!preferences.notificationTypes[this.mapNotificationType(notification.type)]) {
      return // User has disabled this type of notification
    }

    // In production, integrate with email service, push notifications, SMS, etc.
    console.log(`[BREZCODE NOTIFICATION] Sending ${notification.type} to user ${notification.userId}: ${notification.title}`)

    // Simulate different delivery methods based on preferences
    if (preferences.emailNotifications) {
      await this.sendEmailNotification(notification)
    }

    if (preferences.pushNotifications) {
      await this.sendPushNotification(notification)
    }

    if (preferences.smsNotifications && notification.priority === 'urgent') {
      await this.sendSMSNotification(notification)
    }
  }

  private async sendEmailNotification(notification: HealthNotification): Promise<void> {
    // In production, integrate with SendGrid or similar
    console.log(`[EMAIL] ${notification.title}: ${notification.message}`)
  }

  private async sendPushNotification(notification: HealthNotification): Promise<void> {
    // In production, integrate with FCM or similar
    console.log(`[PUSH] ${notification.title}: ${notification.message}`)
  }

  private async sendSMSNotification(notification: HealthNotification): Promise<void> {
    // In production, integrate with Twilio or similar
    console.log(`[SMS] ${notification.title}: ${notification.message}`)
  }

  private mapNotificationType(type: HealthNotification['type']): keyof NotificationPreferences['notificationTypes'] {
    const mapping = {
      'health_reminder': 'healthReminders',
      'assessment_due': 'assessmentDue',
      'appointment_reminder': 'appointmentReminders',
      'risk_alert': 'riskAlerts',
      'milestone_celebration': 'milestones'
    }
    return mapping[type] as keyof NotificationPreferences['notificationTypes']
  }

  // Automated health check-ins
  async scheduleAutomatedCheckIns(): Promise<void> {
    try {
      // Get all active users
      const activeUsers = await db
        .select()
        .from(brezcodeUsers)
        .where(eq(brezcodeUsers.isEmailVerified, true))

      for (const user of activeUsers) {
        // Schedule health reminders for each user
        await this.scheduleHealthReminders(user.id)
        
        // Check for risk alerts
        await this.checkRiskAlerts(user.id)
        
        // Check for milestones
        await this.celebrateMilestones(user.id)
      }

      console.log(`Scheduled automated check-ins for ${activeUsers.length} users`)
    } catch (error) {
      console.error('Automated check-ins scheduling error:', error)
    }
  }
}

export const brezcodeNotificationService = new BrezcodeNotificationService()