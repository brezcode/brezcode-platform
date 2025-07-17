import { db } from './db';
import { 
  userCoachingSchedules, 
  dailyInteractions, 
  coachingContent, 
  userAnalytics,
  healthProgress,
  type InsertDailyInteraction
} from '@shared/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { enhancedAI } from './enhancedAI';
import { i18nManager } from './internationalization';

export class CoachingEngine {
  
  async initializeUserCoaching(userId: number, frequency: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const nextInteraction = new Date();
    nextInteraction.setDate(nextInteraction.getDate() + 1); // Tomorrow

    try {
      await db
        .insert(userCoachingSchedules)
        .values({
          userId,
          frequency,
          nextInteraction,
          isActive: true,
          streakCount: 0
        })
        .onConflictDoUpdate({
          target: userCoachingSchedules.userId,
          set: { 
            frequency,
            nextInteraction,
            isActive: true,
            updatedAt: new Date()
          }
        });

      console.log(`✅ Coaching initialized for user ${userId} with ${frequency} frequency`);
    } catch (error) {
      console.error('Failed to initialize coaching:', error);
    }
  }

  async generateDailyTip(userId: number, userProfile: string, languageCode: string = 'en') {
    try {
      // Get user's recent progress
      const recentProgress = await db
        .select()
        .from(healthProgress)
        .where(eq(healthProgress.userId, userId))
        .orderBy(desc(healthProgress.createdAt))
        .limit(1);

      const improvementAreas = recentProgress[0]?.improvementAreas || [];
      
      // Generate personalized tip using enhanced AI
      const tip = await enhancedAI.generatePersonalizedRecommendations(
        userProfile,
        improvementAreas.map(area => ({ factor: area, impact: 'medium' }))
      );

      // Store the coaching content
      await db.insert(coachingContent).values({
        userId,
        contentType: 'daily_tip',
        languageCode,
        title: await i18nManager.getTranslation('coaching.daily_tip', languageCode),
        content: tip,
        scheduledDate: new Date(),
        targetProfile: userProfile
      });

      return tip;
    } catch (error) {
      console.error('Failed to generate daily tip:', error);
      return "Stay hydrated and maintain a healthy lifestyle. Small daily choices make a big difference!";
    }
  }

  async recordDailyInteraction(userId: number, interactionData: Omit<InsertDailyInteraction, 'userId'>) {
    try {
      await db.insert(dailyInteractions).values({
        userId,
        ...interactionData,
        date: new Date()
      });

      // Update streak count if user engaged
      if (interactionData.completed) {
        await this.updateStreakCount(userId);
      }

      // Record analytics
      await db.insert(userAnalytics).values({
        userId,
        eventType: `daily_${interactionData.interactionType}`,
        metadata: { engagement_score: interactionData.engagementScore }
      });

    } catch (error) {
      console.error('Failed to record daily interaction:', error);
    }
  }

  async updateStreakCount(userId: number) {
    try {
      // Get current streak
      const [schedule] = await db
        .select()
        .from(userCoachingSchedules)
        .where(eq(userCoachingSchedules.userId, userId));

      if (schedule) {
        const newStreak = schedule.streakCount + 1;
        
        await db
          .update(userCoachingSchedules)
          .set({ 
            streakCount: newStreak,
            lastInteraction: new Date(),
            updatedAt: new Date()
          })
          .where(eq(userCoachingSchedules.userId, userId));

        // Celebrate milestones
        if (newStreak % 7 === 0) { // Weekly milestones
          await this.createMilestoneContent(userId, newStreak);
        }
      }
    } catch (error) {
      console.error('Failed to update streak:', error);
    }
  }

  async createMilestoneContent(userId: number, streak: number) {
    const userLanguage = await i18nManager.getUserLanguage(userId);
    
    try {
      await db.insert(coachingContent).values({
        userId,
        contentType: 'milestone',
        languageCode: userLanguage,
        title: `🎉 ${streak} Day Streak!`,
        content: `Congratulations! You've maintained your health journey for ${streak} days. Your consistency is building healthier habits!`,
        scheduledDate: new Date(),
        targetProfile: 'all'
      });
    } catch (error) {
      console.error('Failed to create milestone content:', error);
    }
  }

  async getDailyEngagementReport(userId: number, startDate: Date, endDate: Date) {
    try {
      const interactions = await db
        .select()
        .from(dailyInteractions)
        .where(
          and(
            eq(dailyInteractions.userId, userId),
            gte(dailyInteractions.date, startDate),
            lte(dailyInteractions.date, endDate)
          )
        )
        .orderBy(desc(dailyInteractions.date));

      const totalInteractions = interactions.length;
      const completedInteractions = interactions.filter(i => i.completed).length;
      const averageEngagement = interactions.reduce((sum, i) => sum + i.engagementScore, 0) / totalInteractions;

      return {
        totalInteractions,
        completedInteractions,
        completionRate: (completedInteractions / totalInteractions) * 100,
        averageEngagement,
        weeklyStreak: await this.getUserStreak(userId)
      };
    } catch (error) {
      console.error('Failed to generate engagement report:', error);
      return {
        totalInteractions: 0,
        completedInteractions: 0,
        completionRate: 0,
        averageEngagement: 0,
        weeklyStreak: 0
      };
    }
  }

  async getUserStreak(userId: number): Promise<number> {
    try {
      const [schedule] = await db
        .select()
        .from(userCoachingSchedules)
        .where(eq(userCoachingSchedules.userId, userId));

      return schedule?.streakCount || 0;
    } catch (error) {
      console.error('Failed to get user streak:', error);
      return 0;
    }
  }

  async scheduleWeeklyCheckIn(userId: number) {
    const userLanguage = await i18nManager.getUserLanguage(userId);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    try {
      await db.insert(coachingContent).values({
        userId,
        contentType: 'weekly_challenge',
        languageCode: userLanguage,
        title: 'Weekly Health Check-In',
        content: 'How are you feeling this week? Any changes in your health routine?',
        scheduledDate: nextWeek,
        targetProfile: 'all'
      });
    } catch (error) {
      console.error('Failed to schedule weekly check-in:', error);
    }
  }

  async getPersonalizedCoaching(userId: number, userProfile: string, languageCode: string = 'en') {
    try {
      // Get recent interactions to understand user engagement
      const recentInteractions = await db
        .select()
        .from(dailyInteractions)
        .where(eq(dailyInteractions.userId, userId))
        .orderBy(desc(dailyInteractions.date))
        .limit(7);

      // Generate coaching based on engagement patterns
      const engagementPattern = this.analyzeEngagementPattern(recentInteractions);
      const coaching = await enhancedAI.generatePersonalizedRecommendations(
        userProfile,
        [{ factor: 'engagement_pattern', impact: engagementPattern }]
      );

      return {
        coaching,
        engagement: engagementPattern,
        streak: await this.getUserStreak(userId)
      };
    } catch (error) {
      console.error('Failed to get personalized coaching:', error);
      return {
        coaching: "Keep focusing on your health goals one day at a time!",
        engagement: "moderate",
        streak: 0
      };
    }
  }

  private analyzeEngagementPattern(interactions: any[]): string {
    if (interactions.length === 0) return "new";
    
    const completedCount = interactions.filter(i => i.completed).length;
    const completionRate = completedCount / interactions.length;
    
    if (completionRate > 0.8) return "high";
    if (completionRate > 0.5) return "moderate";
    return "low";
  }
}

export const coachingEngine = new CoachingEngine();