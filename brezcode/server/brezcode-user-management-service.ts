// BREZCODE USER MANAGEMENT SERVICE
// Comprehensive user management for BrezCode health platform
// Adapted from LeadGen user management for health users

import { db } from './brezcode-db'
import { 
  brezcodeUsers, 
  brezcodeHealthAssessments, 
  brezcodeSubscriptions,
  brezcodeAiCoachingSessions 
} from '../../shared/brezcode-schema'
import { eq, desc, count, and, gte, like } from 'drizzle-orm'
import bcrypt from 'bcrypt'

export interface UserCreateData {
  firstName: string
  lastName: string
  email: string
  password: string
  isEmailVerified?: boolean
}

export interface UserUpdateData {
  firstName?: string
  lastName?: string
  email?: string
  isEmailVerified?: boolean
}

export interface UserSearchFilters {
  search?: string
  riskLevel?: 'low' | 'moderate' | 'high'
  subscriptionTier?: 'free' | 'premium' | 'family'
  isActive?: boolean
  joinedAfter?: Date
  joinedBefore?: Date
}

export interface UserStats {
  totalUsers: number
  newUsersThisMonth: number
  activeUsersThisMonth: number
  usersByRiskLevel: {
    low: number
    moderate: number
    high: number
    unknown: number
  }
  usersBySubscription: {
    free: number
    premium: number
    family: number
  }
}

class BrezcodeUserManagementService {
  async createUser(userData: UserCreateData) {
    try {
      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      // Create user
      const [newUser] = await db.insert(brezcodeUsers).values({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        isEmailVerified: userData.isEmailVerified || false,
        createdAt: new Date()
      }).returning()

      // Create default subscription
      await db.insert(brezcodeSubscriptions).values({
        userId: newUser.id,
        planType: 'free',
        isActive: true,
        premiumFeaturesEnabled: ['basic_assessments']
      })

      // Return user without password
      const { password, ...userWithoutPassword } = newUser
      return userWithoutPassword
    } catch (error) {
      console.error('User creation error:', error)
      throw error
    }
  }

  async getUserById(userId: number) {
    try {
      const users = await db
        .select()
        .from(brezcodeUsers)
        .where(eq(brezcodeUsers.id, userId))
        .limit(1)

      if (users.length === 0) {
        return null
      }

      const { password, ...userWithoutPassword } = users[0]
      return userWithoutPassword
    } catch (error) {
      console.error('Get user by ID error:', error)
      throw error
    }
  }

  async getUserByEmail(email: string) {
    try {
      const users = await db
        .select()
        .from(brezcodeUsers)
        .where(eq(brezcodeUsers.email, email.toLowerCase()))
        .limit(1)

      return users[0] || null
    } catch (error) {
      console.error('Get user by email error:', error)
      throw error
    }
  }

  async updateUser(userId: number, updateData: UserUpdateData) {
    try {
      const [updatedUser] = await db
        .update(brezcodeUsers)
        .set({
          ...updateData,
          email: updateData.email?.toLowerCase(),
          updatedAt: new Date()
        })
        .where(eq(brezcodeUsers.id, userId))
        .returning()

      if (!updatedUser) {
        throw new Error('User not found')
      }

      const { password, ...userWithoutPassword } = updatedUser
      return userWithoutPassword
    } catch (error) {
      console.error('User update error:', error)
      throw error
    }
  }

  async deleteUser(userId: number) {
    try {
      // Delete related records first
      await db.delete(brezcodeSubscriptions).where(eq(brezcodeSubscriptions.userId, userId))
      await db.delete(brezcodeAiCoachingSessions).where(eq(brezcodeAiCoachingSessions.userId, userId))
      await db.delete(brezcodeHealthAssessments).where(eq(brezcodeHealthAssessments.userId, userId))
      
      // Delete user
      await db.delete(brezcodeUsers).where(eq(brezcodeUsers.id, userId))
      
      return { success: true, message: 'User deleted successfully' }
    } catch (error) {
      console.error('User deletion error:', error)
      throw error
    }
  }

  async searchUsers(filters: UserSearchFilters, page: number = 1, limit: number = 50) {
    try {
      const offset = (page - 1) * limit
      let query = db.select().from(brezcodeUsers)

      // Apply filters
      const conditions = []

      if (filters.search) {
        conditions.push(
          like(brezcodeUsers.firstName, `%${filters.search}%`),
          like(brezcodeUsers.lastName, `%${filters.search}%`),
          like(brezcodeUsers.email, `%${filters.search}%`)
        )
      }

      if (filters.isActive !== undefined) {
        conditions.push(eq(brezcodeUsers.isEmailVerified, filters.isActive))
      }

      if (filters.joinedAfter) {
        conditions.push(gte(brezcodeUsers.createdAt, filters.joinedAfter))
      }

      if (filters.joinedBefore) {
        conditions.push(gte(filters.joinedBefore, brezcodeUsers.createdAt))
      }

      // Execute query with pagination
      const users = await query
        .limit(limit)
        .offset(offset)
        .orderBy(desc(brezcodeUsers.createdAt))

      // Get total count
      const totalResult = await db
        .select({ count: count() })
        .from(brezcodeUsers)

      // Enrich users with additional data
      const enrichedUsers = await Promise.all(
        users.map(async (user) => {
          const { password, ...userWithoutPassword } = user

          // Get latest assessment for risk level
          const latestAssessment = await db
            .select()
            .from(brezcodeHealthAssessments)
            .where(eq(brezcodeHealthAssessments.userId, user.id))
            .orderBy(desc(brezcodeHealthAssessments.completedAt))
            .limit(1)

          // Get subscription
          const subscription = await db
            .select()
            .from(brezcodeSubscriptions)
            .where(eq(brezcodeSubscriptions.userId, user.id))
            .limit(1)

          // Count assessments and sessions
          const [assessmentCount] = await db
            .select({ count: count() })
            .from(brezcodeHealthAssessments)
            .where(eq(brezcodeHealthAssessments.userId, user.id))

          const [sessionCount] = await db
            .select({ count: count() })
            .from(brezcodeAiCoachingSessions)
            .where(eq(brezcodeAiCoachingSessions.userId, user.id))

          // Get last activity
          const lastActivity = await db
            .select()
            .from(brezcodeAiCoachingSessions)
            .where(eq(brezcodeAiCoachingSessions.userId, user.id))
            .orderBy(desc(brezcodeAiCoachingSessions.startedAt))
            .limit(1)

          return {
            ...userWithoutPassword,
            riskLevel: latestAssessment[0]?.riskCategory || 'unknown',
            subscriptionTier: subscription[0]?.planType || 'free',
            assessmentsCompleted: assessmentCount?.count || 0,
            aiSessionsCount: sessionCount?.count || 0,
            lastActivity: lastActivity[0]?.startedAt || user.createdAt
          }
        })
      )

      return {
        users: enrichedUsers,
        total: totalResult[0]?.count || 0,
        page,
        limit,
        hasMore: (offset + limit) < (totalResult[0]?.count || 0)
      }
    } catch (error) {
      console.error('User search error:', error)
      throw error
    }
  }

  async getUserStats(): Promise<UserStats> {
    try {
      // Total users
      const [totalUsersResult] = await db
        .select({ count: count() })
        .from(brezcodeUsers)

      // Users this month
      const thisMonth = new Date()
      thisMonth.setDate(1)
      thisMonth.setHours(0, 0, 0, 0)

      const [newUsersThisMonth] = await db
        .select({ count: count() })
        .from(brezcodeUsers)
        .where(gte(brezcodeUsers.createdAt, thisMonth))

      // Active users this month (users with sessions)
      const [activeUsersThisMonth] = await db
        .select({ count: count() })
        .from(brezcodeAiCoachingSessions)
        .where(gte(brezcodeAiCoachingSessions.startedAt, thisMonth))

      // Risk level distribution
      const riskDistribution = await db
        .select({
          riskCategory: brezcodeHealthAssessments.riskCategory,
          count: count()
        })
        .from(brezcodeHealthAssessments)
        .groupBy(brezcodeHealthAssessments.riskCategory)

      const usersByRiskLevel = {
        low: 0,
        moderate: 0,
        high: 0,
        unknown: 0
      }

      riskDistribution.forEach(item => {
        if (item.riskCategory === 'low') usersByRiskLevel.low = item.count
        else if (item.riskCategory === 'moderate') usersByRiskLevel.moderate = item.count
        else if (item.riskCategory === 'high') usersByRiskLevel.high = item.count
        else usersByRiskLevel.unknown += item.count
      })

      // Subscription distribution
      const subscriptionDistribution = await db
        .select({
          planType: brezcodeSubscriptions.planType,
          count: count()
        })
        .from(brezcodeSubscriptions)
        .where(eq(brezcodeSubscriptions.isActive, true))
        .groupBy(brezcodeSubscriptions.planType)

      const usersBySubscription = {
        free: 0,
        premium: 0,
        family: 0
      }

      subscriptionDistribution.forEach(item => {
        if (item.planType === 'free') usersBySubscription.free = item.count
        else if (item.planType === 'premium') usersBySubscription.premium = item.count
        else if (item.planType === 'family') usersBySubscription.family = item.count
      })

      return {
        totalUsers: totalUsersResult?.count || 0,
        newUsersThisMonth: newUsersThisMonth?.count || 0,
        activeUsersThisMonth: activeUsersThisMonth?.count || 0,
        usersByRiskLevel,
        usersBySubscription
      }
    } catch (error) {
      console.error('User stats error:', error)
      throw error
    }
  }

  async updateUserSubscription(userId: number, planType: string, isActive: boolean = true) {
    try {
      const premiumFeatures = {
        free: ['basic_assessments'],
        premium: ['ai_coaching', 'detailed_reports', 'priority_support', 'advanced_analytics'],
        family: ['ai_coaching', 'detailed_reports', 'family_sharing', 'multiple_profiles']
      }

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
            premiumFeaturesEnabled: premiumFeatures[planType as keyof typeof premiumFeatures] || ['basic_assessments'],
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
            premiumFeaturesEnabled: premiumFeatures[planType as keyof typeof premiumFeatures] || ['basic_assessments']
          })
      }

      return { success: true, message: 'Subscription updated successfully' }
    } catch (error) {
      console.error('Subscription update error:', error)
      throw error
    }
  }

  async getUserActivity(userId: number, days: number = 30) {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

      // Get user's assessments
      const assessments = await db
        .select()
        .from(brezcodeHealthAssessments)
        .where(and(
          eq(brezcodeHealthAssessments.userId, userId),
          gte(brezcodeHealthAssessments.completedAt, startDate)
        ))
        .orderBy(desc(brezcodeHealthAssessments.completedAt))

      // Get user's AI sessions
      const aiSessions = await db
        .select()
        .from(brezcodeAiCoachingSessions)
        .where(and(
          eq(brezcodeAiCoachingSessions.userId, userId),
          gte(brezcodeAiCoachingSessions.startedAt, startDate)
        ))
        .orderBy(desc(brezcodeAiCoachingSessions.startedAt))

      return {
        assessments,
        aiSessions,
        summary: {
          totalAssessments: assessments.length,
          totalAiSessions: aiSessions.length,
          lastActivity: aiSessions[0]?.startedAt || assessments[0]?.completedAt || null
        }
      }
    } catch (error) {
      console.error('User activity error:', error)
      throw error
    }
  }

  async verifyUserEmail(userId: number) {
    try {
      await db
        .update(brezcodeUsers)
        .set({ 
          isEmailVerified: true,
          updatedAt: new Date()
        })
        .where(eq(brezcodeUsers.id, userId))

      return { success: true, message: 'Email verified successfully' }
    } catch (error) {
      console.error('Email verification error:', error)
      throw error
    }
  }

  async resetUserPassword(userId: number, newPassword: string) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      
      await db
        .update(brezcodeUsers)
        .set({ 
          password: hashedPassword,
          updatedAt: new Date()
        })
        .where(eq(brezcodeUsers.id, userId))

      return { success: true, message: 'Password reset successfully' }
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  async bulkUpdateUsers(userIds: number[], updateData: Partial<UserUpdateData>) {
    try {
      const results = await Promise.all(
        userIds.map(userId => this.updateUser(userId, updateData))
      )

      return {
        success: true,
        message: `${results.length} users updated successfully`,
        updatedUsers: results
      }
    } catch (error) {
      console.error('Bulk update error:', error)
      throw error
    }
  }
}

export const brezcodeUserManagementService = new BrezcodeUserManagementService()