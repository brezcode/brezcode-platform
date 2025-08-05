// BREZCODE BUSINESS DASHBOARD SERVICE
// Backend management and analytics for BrezCode health platform
// Adapted from LeadGen business tools for health platform administration

import { db } from './brezcode-db'
import { 
  brezcodeUsers, 
  brezcodeHealthAssessments, 
  brezcodeHealthReports,
  brezcodeAiCoachingSessions,
  brezcodeSubscriptions 
} from '../../shared/brezcode-schema'
import { eq, desc, count, and, gte, sql } from 'drizzle-orm'

export interface BrezcodeAnalytics {
  totalUsers: number
  activeUsers: number
  assessmentsCompleted: number
  aiSessionsTotal: number
  subscriptionMetrics: {
    free: number
    premium: number
    family: number
  }
  userGrowth: {
    period: string
    newUsers: number
    retainedUsers: number
  }[]
  healthMetrics: {
    lowRisk: number
    moderateRisk: number
    highRisk: number
  }
  engagementMetrics: {
    averageSessionDuration: number
    averageMessagesPerSession: number
    userSatisfactionScore: number
  }
}

export interface UserManagementData {
  id: number
  name: string
  email: string
  joinedDate: Date
  lastActive: Date
  riskLevel: string
  subscriptionTier: string
  assessmentsCompleted: number
  aiSessionsCount: number
  isActive: boolean
}

export interface HealthTrendData {
  date: string
  assessmentsCompleted: number
  averageRiskScore: number
  userEngagement: number
}

class BrezcodeBusinessDashboardService {
  async getDashboardAnalytics(dateRange?: { start: Date; end: Date }): Promise<BrezcodeAnalytics> {
    const startDate = dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    const endDate = dateRange?.end || new Date()

    // Get total users
    const totalUsersResult = await db
      .select({ count: count() })
      .from(brezcodeUsers)

    // Get active users (users with sessions in the last 30 days)
    const activeUsersResult = await db
      .select({ count: count() })
      .from(brezcodeAiCoachingSessions)
      .where(gte(brezcodeAiCoachingSessions.startedAt, startDate))

    // Get total assessments
    const assessmentsResult = await db
      .select({ count: count() })
      .from(brezcodeHealthAssessments)
      .where(gte(brezcodeHealthAssessments.completedAt, startDate))

    // Get AI sessions
    const aiSessionsResult = await db
      .select({ count: count() })
      .from(brezcodeAiCoachingSessions)
      .where(gte(brezcodeAiCoachingSessions.startedAt, startDate))

    // Get subscription metrics
    const subscriptionMetrics = await this.getSubscriptionMetrics()

    // Get user growth data
    const userGrowth = await this.getUserGrowthData(startDate, endDate)

    // Get health risk distribution
    const healthMetrics = await this.getHealthRiskDistribution()

    // Get engagement metrics
    const engagementMetrics = await this.getEngagementMetrics()

    return {
      totalUsers: totalUsersResult[0]?.count || 0,
      activeUsers: activeUsersResult[0]?.count || 0,
      assessmentsCompleted: assessmentsResult[0]?.count || 0,
      aiSessionsTotal: aiSessionsResult[0]?.count || 0,
      subscriptionMetrics,
      userGrowth,
      healthMetrics,
      engagementMetrics
    }
  }

  private async getSubscriptionMetrics() {
    const subscriptions = await db
      .select({
        planType: brezcodeSubscriptions.planType,
        count: count()
      })
      .from(brezcodeSubscriptions)
      .where(eq(brezcodeSubscriptions.isActive, true))
      .groupBy(brezcodeSubscriptions.planType)

    const metrics = { free: 0, premium: 0, family: 0 }
    
    subscriptions.forEach(sub => {
      if (sub.planType === 'free') metrics.free = sub.count
      else if (sub.planType === 'premium') metrics.premium = sub.count
      else if (sub.planType === 'family') metrics.family = sub.count
    })

    return metrics
  }

  private async getUserGrowthData(startDate: Date, endDate: Date) {
    // Generate weekly growth data
    const weeks = []
    const oneWeek = 7 * 24 * 60 * 60 * 1000
    
    for (let date = new Date(startDate); date <= endDate; date = new Date(date.getTime() + oneWeek)) {
      const weekEnd = new Date(Math.min(date.getTime() + oneWeek, endDate.getTime()))
      
      const newUsers = await db
        .select({ count: count() })
        .from(brezcodeUsers)
        .where(and(
          gte(brezcodeUsers.createdAt, date),
          gte(weekEnd, brezcodeUsers.createdAt)
        ))

      weeks.push({
        period: date.toISOString().split('T')[0],
        newUsers: newUsers[0]?.count || 0,
        retainedUsers: 0 // Calculate retention in a more complex query
      })
    }

    return weeks
  }

  private async getHealthRiskDistribution() {
    const riskDistribution = await db
      .select({
        riskCategory: brezcodeHealthAssessments.riskCategory,
        count: count()
      })
      .from(brezcodeHealthAssessments)
      .groupBy(brezcodeHealthAssessments.riskCategory)

    const metrics = { lowRisk: 0, moderateRisk: 0, highRisk: 0 }
    
    riskDistribution.forEach(risk => {
      if (risk.riskCategory === 'low') metrics.lowRisk = risk.count
      else if (risk.riskCategory === 'moderate') metrics.moderateRisk = risk.count
      else if (risk.riskCategory === 'high') metrics.highRisk = risk.count
    })

    return metrics
  }

  private async getEngagementMetrics() {
    // Calculate average session duration and user satisfaction
    const sessionsData = await db
      .select({
        sessionDuration: brezcodeAiCoachingSessions.sessionDuration,
        satisfactionRating: brezcodeAiCoachingSessions.satisfactionRating,
        conversationHistory: brezcodeAiCoachingSessions.conversationHistory
      })
      .from(brezcodeAiCoachingSessions)
      .where(eq(brezcodeAiCoachingSessions.endedAt, sql`IS NOT NULL`))

    let totalDuration = 0
    let totalSatisfaction = 0
    let totalMessages = 0
    let validSessions = 0

    sessionsData.forEach(session => {
      if (session.sessionDuration) {
        totalDuration += session.sessionDuration
        validSessions++
      }
      if (session.satisfactionRating) {
        totalSatisfaction += session.satisfactionRating
      }
      if (session.conversationHistory) {
        const history = session.conversationHistory as any[]
        totalMessages += history.length
      }
    })

    return {
      averageSessionDuration: validSessions > 0 ? Math.round(totalDuration / validSessions) : 0,
      averageMessagesPerSession: validSessions > 0 ? Math.round(totalMessages / validSessions) : 0,
      userSatisfactionScore: validSessions > 0 ? +(totalSatisfaction / validSessions).toFixed(1) : 0
    }
  }

  async getUserManagementData(page: number = 1, limit: number = 50): Promise<{
    users: UserManagementData[]
    total: number
    hasMore: boolean
  }> {
    const offset = (page - 1) * limit

    // Get users with their related data
    const users = await db
      .select({
        id: brezcodeUsers.id,
        firstName: brezcodeUsers.firstName,
        lastName: brezcodeUsers.lastName,
        email: brezcodeUsers.email,
        createdAt: brezcodeUsers.createdAt,
        isEmailVerified: brezcodeUsers.isEmailVerified
      })
      .from(brezcodeUsers)
      .orderBy(desc(brezcodeUsers.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(brezcodeUsers)

    // Enrich user data with assessments and sessions
    const enrichedUsers: UserManagementData[] = []

    for (const user of users) {
      // Get latest assessment
      const latestAssessment = await db
        .select()
        .from(brezcodeHealthAssessments)
        .where(eq(brezcodeHealthAssessments.userId, user.id))
        .orderBy(desc(brezcodeHealthAssessments.completedAt))
        .limit(1)

      // Count assessments
      const assessmentCount = await db
        .select({ count: count() })
        .from(brezcodeHealthAssessments)
        .where(eq(brezcodeHealthAssessments.userId, user.id))

      // Count AI sessions
      const sessionCount = await db
        .select({ count: count() })
        .from(brezcodeAiCoachingSessions)
        .where(eq(brezcodeAiCoachingSessions.userId, user.id))

      // Get latest session for last active
      const latestSession = await db
        .select()
        .from(brezcodeAiCoachingSessions)
        .where(eq(brezcodeAiCoachingSessions.userId, user.id))
        .orderBy(desc(brezcodeAiCoachingSessions.startedAt))
        .limit(1)

      // Get subscription
      const subscription = await db
        .select()
        .from(brezcodeSubscriptions)
        .where(eq(brezcodeSubscriptions.userId, user.id))
        .limit(1)

      enrichedUsers.push({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        joinedDate: user.createdAt,
        lastActive: latestSession[0]?.startedAt || user.createdAt,
        riskLevel: latestAssessment[0]?.riskCategory || 'unknown',
        subscriptionTier: subscription[0]?.planType || 'free',
        assessmentsCompleted: assessmentCount[0]?.count || 0,
        aiSessionsCount: sessionCount[0]?.count || 0,
        isActive: user.isEmailVerified
      })
    }

    return {
      users: enrichedUsers,
      total: totalResult[0]?.count || 0,
      hasMore: (offset + limit) < (totalResult[0]?.count || 0)
    }
  }

  async getHealthTrendData(days: number = 30): Promise<HealthTrendData[]> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const trends: HealthTrendData[] = []

    // Generate daily trend data
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)

      // Count assessments for this day
      const assessments = await db
        .select({ count: count() })
        .from(brezcodeHealthAssessments)
        .where(and(
          gte(brezcodeHealthAssessments.completedAt, date),
          gte(nextDate, brezcodeHealthAssessments.completedAt)
        ))

      // Get average risk score for the day
      const riskScores = await db
        .select({ riskScore: brezcodeHealthAssessments.riskScore })
        .from(brezcodeHealthAssessments)
        .where(and(
          gte(brezcodeHealthAssessments.completedAt, date),
          gte(nextDate, brezcodeHealthAssessments.completedAt)
        ))

      const avgRiskScore = riskScores.length > 0 
        ? riskScores.reduce((sum, item) => sum + (parseFloat(item.riskScore || '0')), 0) / riskScores.length
        : 0

      // Count user engagement (AI sessions)
      const engagements = await db
        .select({ count: count() })
        .from(brezcodeAiCoachingSessions)
        .where(and(
          gte(brezcodeAiCoachingSessions.startedAt, date),
          gte(nextDate, brezcodeAiCoachingSessions.startedAt)
        ))

      trends.push({
        date: date.toISOString().split('T')[0],
        assessmentsCompleted: assessments[0]?.count || 0,
        averageRiskScore: +avgRiskScore.toFixed(1),
        userEngagement: engagements[0]?.count || 0
      })
    }

    return trends
  }

  async getDetailedUserProfile(userId: number) {
    // Get user basic info
    const user = await db
      .select()
      .from(brezcodeUsers)
      .where(eq(brezcodeUsers.id, userId))
      .limit(1)

    if (user.length === 0) {
      throw new Error('User not found')
    }

    // Get all assessments
    const assessments = await db
      .select()
      .from(brezcodeHealthAssessments)
      .where(eq(brezcodeHealthAssessments.userId, userId))
      .orderBy(desc(brezcodeHealthAssessments.completedAt))

    // Get all reports
    const reports = await db
      .select()
      .from(brezcodeHealthReports)
      .where(eq(brezcodeHealthReports.userId, userId))
      .orderBy(desc(brezcodeHealthReports.generatedAt))

    // Get AI sessions
    const aiSessions = await db
      .select()
      .from(brezcodeAiCoachingSessions)
      .where(eq(brezcodeAiCoachingSessions.userId, userId))
      .orderBy(desc(brezcodeAiCoachingSessions.startedAt))

    // Get subscription
    const subscription = await db
      .select()
      .from(brezcodeSubscriptions)
      .where(eq(brezcodeSubscriptions.userId, userId))
      .limit(1)

    return {
      user: user[0],
      assessments,
      reports,
      aiSessions,
      subscription: subscription[0] || null,
      summary: {
        totalAssessments: assessments.length,
        totalReports: reports.length,
        totalAiSessions: aiSessions.length,
        currentRiskLevel: assessments[0]?.riskCategory || 'unknown',
        joinedDate: user[0].createdAt,
        lastActive: aiSessions[0]?.startedAt || user[0].createdAt
      }
    }
  }

  async updateUserSubscription(userId: number, planType: string, isActive: boolean) {
    const existing = await db
      .select()
      .from(brezcodeSubscriptions)
      .where(eq(brezcodeSubscriptions.userId, userId))
      .limit(1)

    if (existing.length > 0) {
      await db
        .update(brezcodeSubscriptions)
        .set({ 
          planType: planType as any, 
          isActive,
          updatedAt: new Date()
        })
        .where(eq(brezcodeSubscriptions.userId, userId))
    } else {
      await db
        .insert(brezcodeSubscriptions)
        .values({
          userId,
          planType: planType as any,
          isActive,
          premiumFeaturesEnabled: planType === 'premium' 
            ? ['ai_coaching', 'detailed_reports', 'priority_support']
            : ['basic_assessments']
        })
    }

    return { success: true }
  }

  async exportUserData(format: 'csv' | 'json' = 'csv'): Promise<string> {
    const userData = await this.getUserManagementData(1, 1000) // Get all users

    if (format === 'json') {
      return JSON.stringify(userData.users, null, 2)
    }

    // CSV format
    const headers = ['ID', 'Name', 'Email', 'Joined Date', 'Last Active', 'Risk Level', 'Subscription', 'Assessments', 'AI Sessions', 'Active']
    const rows = userData.users.map(user => [
      user.id,
      user.name,
      user.email,
      user.joinedDate.toISOString().split('T')[0],
      user.lastActive.toISOString().split('T')[0],
      user.riskLevel,
      user.subscriptionTier,
      user.assessmentsCompleted,
      user.aiSessionsCount,
      user.isActive ? 'Yes' : 'No'
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }
}

export const brezcodeBusinessDashboardService = new BrezcodeBusinessDashboardService()