import { db } from "./db";
import {
  healthActivityTemplates,
  healthSchedules,
  scheduledActivities,
  activityCompletions,
  healthPreferences,
  healthReminders,
  healthStreaks,
  type InsertHealthSchedule,
  type InsertScheduledActivity,
  type InsertActivityCompletion,
  type InsertHealthPreferences,
} from "@shared/health-schedule-schema";
import { eq, and, between, desc, asc, gte, lte } from "drizzle-orm";
import { TwilioService } from "./twilioService";
import { EmailService } from "./emailService";

export class HealthScheduleService {
  // Get all activity templates
  static async getActivityTemplates(category?: string) {
    const templates = await db
      .select()
      .from(healthActivityTemplates)
      .where(
        category
          ? and(
              eq(healthActivityTemplates.category, category),
              eq(healthActivityTemplates.isActive, true)
            )
          : eq(healthActivityTemplates.isActive, true)
      )
      .orderBy(healthActivityTemplates.category, healthActivityTemplates.name);

    return templates;
  }

  // Create customer health preferences
  static async saveHealthPreferences(
    brandId: string,
    customerId: string,
    preferences: any
  ) {
    const [existing] = await db
      .select()
      .from(healthPreferences)
      .where(
        and(
          eq(healthPreferences.brandId, brandId),
          eq(healthPreferences.customerId, customerId)
        )
      )
      .limit(1);

    if (existing) {
      // Update existing preferences
      const [updated] = await db
        .update(healthPreferences)
        .set({
          ...preferences,
          updatedAt: new Date(),
        })
        .where(eq(healthPreferences.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new preferences
      const [created] = await db
        .insert(healthPreferences)
        .values({
          brandId,
          customerId,
          ...preferences,
        })
        .returning();
      return created;
    }
  }

  // Get customer health preferences
  static async getHealthPreferences(brandId: string, customerId: string) {
    const [preferences] = await db
      .select()
      .from(healthPreferences)
      .where(
        and(
          eq(healthPreferences.brandId, brandId),
          eq(healthPreferences.customerId, customerId)
        )
      )
      .limit(1);

    return preferences;
  }

  // Create personalized health schedule
  static async createPersonalizedSchedule(
    brandId: string,
    customerId: string,
    scheduleData: any
  ) {
    // Get customer preferences
    const preferences = await this.getHealthPreferences(brandId, customerId);
    if (!preferences) {
      throw new Error("Customer health preferences not found");
    }

    // Create the schedule
    const [schedule] = await db
      .insert(healthSchedules)
      .values({
        brandId,
        customerId,
        name: scheduleData.name,
        description: scheduleData.description,
      })
      .returning();

    // Generate scheduled activities based on preferences
    const activities = await this.generateScheduledActivities(
      schedule.id,
      scheduleData.activities,
      preferences
    );

    return { schedule, activities };
  }

  // Generate personalized schedule based on quiz results
  static async generatePersonalizedScheduleFromQuiz(
    brandId: string,
    customerId: string,
    startDate: Date,
    endDate: Date,
    preferences: any,
    quizResults?: any
  ): Promise<any[]> {
    // Get all available activity templates
    const allTemplates = await this.getActivityTemplates();
    
    // Personalize activities based on quiz results
    const personalizedActivities = this.personalizeActivitiesFromQuiz(
      allTemplates,
      preferences,
      quizResults
    );

    // Create schedule first
    const [schedule] = await db
      .insert(healthSchedules)
      .values({
        brandId,
        customerId,
        name: "Personalized Health Plan",
        description: "AI-generated schedule based on your health assessment",
      })
      .returning();

    // Generate and save scheduled activities
    const activities = await this.generateScheduledActivitiesFromTemplates(
      schedule.id,
      personalizedActivities,
      startDate,
      endDate,
      preferences
    );

    return activities;
  }

  // Personalize activity selection based on quiz results
  private static personalizeActivitiesFromQuiz(
    templates: any[],
    preferences: any,
    quizResults?: any
  ) {
    const selected: any[] = [];
    
    // Always include essential activities
    const essentialActivities = ['self-breast-exam', 'breathing-exercise'];
    
    // Add activities based on quiz results
    if (quizResults) {
      const age = parseInt(quizResults['1']) || 25;
      const activityLevel = quizResults['21'] || 'Rarely/Never';
      const stressLevel = quizResults['16'] || 'Low';
      const familyHistory = quizResults['11'] === 'Yes';
      
      // Age-based recommendations
      if (age >= 40) {
        essentialActivities.push('cardio-workout', 'yoga-session');
        if (familyHistory) {
          essentialActivities.push('self-massage'); // Additional prevention focus
        }
      } else if (age >= 30) {
        essentialActivities.push('yoga-session', 'strength-training');
      } else {
        essentialActivities.push('cardio-workout'); // Build foundation
      }
      
      // Activity level adjustments
      if (activityLevel === 'Daily' || activityLevel === '5+ times per week') {
        essentialActivities.push('strength-training');
      } else if (activityLevel === 'Rarely/Never' || activityLevel === '1-2 times per week') {
        // Focus on gentle activities for beginners
        essentialActivities.push('stretching-routine');
      }
      
      // Stress level considerations
      if (stressLevel === 'Very high' || stressLevel === 'High') {
        essentialActivities.push('meditation', 'breathing-exercise');
      }
    }
    
    // Map to template activities with appropriate frequency
    templates.forEach(template => {
      if (essentialActivities.includes(template.id)) {
        let frequency = 'weekly';
        
        // Adjust frequency based on activity type and user profile
        if (template.id === 'self-breast-exam') {
          frequency = 'monthly'; // Once per month as recommended
        } else if (template.id === 'breathing-exercise') {
          frequency = 'daily'; // Daily stress relief
        } else if (preferences?.fitnessLevel === 'advanced') {
          frequency = template.id.includes('cardio') || template.id.includes('strength') ? 'biweekly' : 'weekly';
        } else if (preferences?.fitnessLevel === 'beginner') {
          frequency = 'weekly'; // Gentle start
        }
        
        selected.push({
          templateId: template.id,
          frequency,
          preferredDays: preferences?.availableDays || [1, 3, 5],
          preferredTime: preferences?.preferredTime || 'morning'
        });
      }
    });
    
    return selected;
  }

  // Generate scheduled activities from templates
  private static async generateScheduledActivitiesFromTemplates(
    scheduleId: string,
    activityConfigs: any[],
    startDate: Date,
    endDate: Date,
    preferences: any
  ) {
    const activities: InsertScheduledActivity[] = [];

    for (const config of activityConfigs) {
      const dates = this.generateActivityDates(
        startDate,
        endDate,
        config.frequency,
        config.preferredDays || preferences.availableDays,
        preferences.preferredTime
      );

      for (const date of dates) {
        activities.push({
          scheduleId,
          templateId: config.templateId,
          scheduledDate: date.toISOString().split('T')[0],
          scheduledTime: config.preferredTime || this.getTimeFromPreference(preferences.preferredTime),
          status: "pending",
        });
      }
    }

    if (activities.length > 0) {
      await db.insert(scheduledActivities).values(activities);
    }

    // Return activities with template details
    const detailedActivities = [];
    for (const activity of activities) {
      const template = await db
        .select()
        .from(activityTemplates)
        .where(eq(activityTemplates.id, activity.templateId))
        .limit(1);
      
      if (template[0]) {
        detailedActivities.push({
          ...activity,
          template: template[0]
        });
      }
    }

    return detailedActivities;
  }

  // Generate scheduled activities for the next 30 days
  private static async generateScheduledActivities(
    scheduleId: string,
    activityConfigs: any[],
    preferences: any
  ) {
    const activities: InsertScheduledActivity[] = [];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30); // Next 30 days

    for (const config of activityConfigs) {
      const dates = this.generateActivityDates(
        startDate,
        endDate,
        config.frequency,
        config.preferredDays || preferences.availableDays,
        preferences.preferredTime
      );

      for (const date of dates) {
        activities.push({
          scheduleId,
          templateId: config.templateId,
          scheduledDate: date.toISOString().split('T')[0],
          scheduledTime: config.preferredTime || this.getTimeFromPreference(preferences.preferredTime),
          status: "pending",
        });
      }
    }

    if (activities.length > 0) {
      await db.insert(scheduledActivities).values(activities);
    }

    return activities;
  }

  // Generate dates based on frequency
  private static generateActivityDates(
    startDate: Date,
    endDate: Date,
    frequency: string,
    availableDays: number[],
    preferredTime: string
  ): Date[] {
    const dates: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      if (availableDays.includes(current.getDay())) {
        switch (frequency) {
          case 'daily':
            dates.push(new Date(current));
            break;
          case 'weekly':
            if (dates.length === 0 || this.daysBetween(dates[dates.length - 1], current) >= 7) {
              dates.push(new Date(current));
            }
            break;
          case 'biweekly':
            if (dates.length === 0 || this.daysBetween(dates[dates.length - 1], current) >= 14) {
              dates.push(new Date(current));
            }
            break;
          case 'monthly':
            if (dates.length === 0 || this.daysBetween(dates[dates.length - 1], current) >= 30) {
              dates.push(new Date(current));
            }
            break;
        }
      }
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  private static daysBetween(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private static getTimeFromPreference(preference: string): string {
    switch (preference) {
      case 'morning':
        return '08:00';
      case 'afternoon':
        return '14:00';
      case 'evening':
        return '18:00';
      default:
        return '09:00';
    }
  }

  // Get customer's scheduled activities for a date range
  static async getScheduledActivities(
    brandId: string,
    customerId: string,
    startDate: string,
    endDate: string
  ) {
    // Get schedules for customer
    const schedules = await db
      .select()
      .from(healthSchedules)
      .where(
        and(
          eq(healthSchedules.brandId, brandId),
          eq(healthSchedules.customerId, customerId),
          eq(healthSchedules.isActive, true)
        )
      );

    if (schedules.length === 0) return [];

    const scheduleIds = schedules.map(s => s.id);

    // Get activities with template details
    const activities = await db
      .select({
        activity: scheduledActivities,
        template: healthActivityTemplates,
      })
      .from(scheduledActivities)
      .leftJoin(
        healthActivityTemplates,
        eq(scheduledActivities.templateId, healthActivityTemplates.id)
      )
      .where(
        and(
          eq(scheduledActivities.scheduleId, scheduleIds[0]), // Simplified for now
          between(scheduledActivities.scheduledDate, startDate, endDate)
        )
      )
      .orderBy(scheduledActivities.scheduledDate, scheduledActivities.scheduledTime);

    return activities;
  }

  // Complete an activity
  static async completeActivity(
    brandId: string,
    customerId: string,
    completionData: any
  ) {
    // Mark scheduled activity as completed
    const [scheduledActivity] = await db
      .update(scheduledActivities)
      .set({
        status: "completed",
        completedAt: new Date(),
        notes: completionData.notes,
        rating: completionData.rating,
        feedback: completionData.feedback,
      })
      .where(eq(scheduledActivities.id, completionData.scheduledActivityId))
      .returning();

    if (!scheduledActivity) {
      throw new Error("Scheduled activity not found");
    }

    // Record completion details
    const [completion] = await db
      .insert(activityCompletions)
      .values({
        brandId,
        customerId,
        templateId: scheduledActivity.templateId,
        scheduledActivityId: scheduledActivity.id,
        completedDate: new Date().toISOString().split('T')[0],
        duration: completionData.duration,
        intensity: completionData.intensity,
        mood: completionData.mood,
        notes: completionData.notes,
      })
      .returning();

    // Update streaks
    await this.updateHealthStreaks(brandId, customerId, scheduledActivity.templateId);

    return { scheduledActivity, completion };
  }

  // Update health streaks
  private static async updateHealthStreaks(
    brandId: string,
    customerId: string,
    templateId: string
  ) {
    // Get template to determine category
    const [template] = await db
      .select()
      .from(healthActivityTemplates)
      .where(eq(healthActivityTemplates.id, templateId))
      .limit(1);

    if (!template) return;

    // Get or create streak record
    const [existingStreak] = await db
      .select()
      .from(healthStreaks)
      .where(
        and(
          eq(healthStreaks.brandId, brandId),
          eq(healthStreaks.customerId, customerId),
          eq(healthStreaks.category, template.category)
        )
      )
      .limit(1);

    const today = new Date().toISOString().split('T')[0];

    if (existingStreak) {
      // Check if this continues the streak
      const lastDate = new Date(existingStreak.lastActivityDate || '');
      const daysDiff = this.daysBetween(lastDate, new Date());

      let newStreak = existingStreak.currentStreak;
      if (daysDiff === 1) {
        // Continues streak
        newStreak += 1;
      } else if (daysDiff > 1) {
        // Breaks streak
        newStreak = 1;
      }

      await db
        .update(healthStreaks)
        .set({
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, existingStreak.longestStreak),
          lastActivityDate: today,
          totalActivities: existingStreak.totalActivities + 1,
          updatedAt: new Date(),
        })
        .where(eq(healthStreaks.id, existingStreak.id));
    } else {
      // Create new streak
      await db
        .insert(healthStreaks)
        .values({
          brandId,
          customerId,
          category: template.category,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: today,
          totalActivities: 1,
        });
    }
  }

  // Get customer health stats
  static async getHealthStats(brandId: string, customerId: string) {
    // Get streaks
    const streaks = await db
      .select()
      .from(healthStreaks)
      .where(
        and(
          eq(healthStreaks.brandId, brandId),
          eq(healthStreaks.customerId, customerId)
        )
      );

    // Get recent completions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCompletions = await db
      .select()
      .from(activityCompletions)
      .where(
        and(
          eq(activityCompletions.brandId, brandId),
          eq(activityCompletions.customerId, customerId),
          gte(activityCompletions.completedDate, thirtyDaysAgo.toISOString().split('T')[0])
        )
      );

    // Get upcoming activities (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingActivities = await this.getScheduledActivities(
      brandId,
      customerId,
      new Date().toISOString().split('T')[0],
      nextWeek.toISOString().split('T')[0]
    );

    return {
      streaks,
      recentCompletions: recentCompletions.length,
      upcomingActivities: upcomingActivities.length,
      totalActivities: streaks.reduce((sum, streak) => sum + streak.totalActivities, 0),
    };
  }

  // Send activity reminders
  static async sendReminders() {
    // Get all pending reminders for today
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const pendingReminders = await db
      .select()
      .from(healthReminders)
      .where(
        and(
          eq(healthReminders.status, "pending"),
          between(healthReminders.reminderTime, startOfDay, endOfDay)
        )
      );

    for (const reminder of pendingReminders) {
      try {
        // Send reminder based on type
        switch (reminder.reminderType) {
          case 'sms':
            // Implement SMS reminder
            // await TwilioService.sendSMS(customerPhone, reminder.message);
            break;
          case 'email':
            // Implement email reminder
            // await EmailService.sendEmail(customerEmail, "Health Activity Reminder", reminder.message);
            break;
          case 'push':
            // Implement push notification
            // await PushService.sendNotification(customerId, reminder.message);
            break;
        }

        // Mark as sent
        await db
          .update(healthReminders)
          .set({
            status: "sent",
            sentAt: new Date(),
          })
          .where(eq(healthReminders.id, reminder.id));
      } catch (error) {
        console.error(`Failed to send reminder ${reminder.id}:`, error);
        await db
          .update(healthReminders)
          .set({ status: "failed" })
          .where(eq(healthReminders.id, reminder.id));
      }
    }
  }

  // Get daily health plan for customer
  static async getDailyPlan(
    brandId: string,
    customerId: string,
    date: string
  ) {
    const activities = await this.getScheduledActivities(
      brandId,
      customerId,
      date,
      date
    );

    // Get completion status for each activity
    const completions = await db
      .select()
      .from(activityCompletions)
      .where(
        and(
          eq(activityCompletions.brandId, brandId),
          eq(activityCompletions.customerId, customerId),
          eq(activityCompletions.completedDate, date)
        )
      );

    const completedTemplateIds = completions.map(c => c.templateId);

    return {
      date,
      activities: activities.map(a => ({
        ...a,
        isCompleted: completedTemplateIds.includes(a.activity.templateId),
        completion: completions.find(c => c.templateId === a.activity.templateId),
      })),
      stats: {
        total: activities.length,
        completed: completedTemplateIds.length,
        pending: activities.length - completedTemplateIds.length,
      },
    };
  }
}