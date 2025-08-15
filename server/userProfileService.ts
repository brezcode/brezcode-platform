import { db } from "./db";
import { userProfiles, userDashboardStats, userToolUsage, type User } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface UserProfileData {
  // Personal Information (Primary)
  fullName: string;
  location: string;
  timezone: string;
  phoneNumber?: string;
  personalGoals: string[];
  workStyle: string;
  communicationPreference: string;
  availabilityHours: string;
  personalChallenges: string[];
  
  // Business Information (Optional/Secondary)
  businessName?: string;
  industry?: string;
  businessModel?: string;
  targetAudience?: string;
  monthlyRevenue?: string;
  teamSize?: string;
  marketingChannels?: string[];
  businessChallenges?: string[];
  businessGoals?: string[];
  growthTimeline?: string;
  marketingBudget?: string;
  businessTools?: string[];
  uniqueValue?: string;
  customerAcquisition?: string;
  customerServiceNeeds?: string;
  preferences?: any;
}

export interface DashboardStats {
  totalStrategies: number;
  activeTools: number;
  completedActions: number;
  customerInteractions: number;
  leadsGenerated: number;
  salesClosed: number;
  lastLoginAt?: Date;
}

export class UserProfileService {
  /**
   * Get user profile by user ID
   */
  async getUserProfile(userId: number) {
    try {
      const [profile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));

      return profile || null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error("Failed to fetch user profile");
    }
  }

  /**
   * Create or update user profile
   */
  async saveUserProfile(userId: number, profileData: UserProfileData) {
    try {
      // Check if profile exists
      const existingProfile = await this.getUserProfile(userId);

      if (existingProfile) {
        // Update existing profile
        const [updatedProfile] = await db
          .update(userProfiles)
          .set({
            ...profileData,
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, userId))
          .returning();

        return updatedProfile;
      } else {
        // Create new profile
        const [newProfile] = await db
          .insert(userProfiles)
          .values({
            userId,
            ...profileData,
          })
          .returning();

        // Initialize dashboard stats for new user
        await this.initializeDashboardStats(userId);
        
        return newProfile;
      }
    } catch (error) {
      console.error("Error saving user profile:", error);
      throw new Error("Failed to save user profile");
    }
  }

  /**
   * Get user dashboard statistics
   */
  async getDashboardStats(userId: number): Promise<DashboardStats> {
    try {
      const [stats] = await db
        .select()
        .from(userDashboardStats)
        .where(eq(userDashboardStats.userId, userId));

      if (!stats) {
        // Initialize stats if they don't exist
        const newStats = await this.initializeDashboardStats(userId);
        return {
          totalStrategies: newStats.totalStrategies || 0,
          activeTools: newStats.activeTools || 0,
          completedActions: newStats.completedActions || 0,
          customerInteractions: newStats.customerInteractions || 0,
          leadsGenerated: newStats.leadsGenerated || 0,
          salesClosed: newStats.salesClosed || 0,
          lastLoginAt: newStats.lastLoginAt,
        };
      }

      return {
        totalStrategies: stats.totalStrategies || 0,
        activeTools: stats.activeTools || 0,
        completedActions: stats.completedActions || 0,
        customerInteractions: stats.customerInteractions || 0,
        leadsGenerated: stats.leadsGenerated || 0,
        salesClosed: stats.salesClosed || 0,
        lastLoginAt: stats.lastLoginAt,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error("Failed to fetch dashboard statistics");
    }
  }

  /**
   * Update dashboard statistics
   */
  async updateDashboardStats(userId: number, updates: Partial<DashboardStats>) {
    try {
      const [updatedStats] = await db
        .update(userDashboardStats)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(userDashboardStats.userId, userId))
        .returning();

      return updatedStats;
    } catch (error) {
      console.error("Error updating dashboard stats:", error);
      throw new Error("Failed to update dashboard statistics");
    }
  }

  /**
   * Increment a specific dashboard metric
   */
  async incrementDashboardMetric(userId: number, metric: keyof DashboardStats, amount: number = 1) {
    try {
      const currentStats = await this.getDashboardStats(userId);
      const currentValue = currentStats[metric] as number || 0;
      
      await this.updateDashboardStats(userId, {
        [metric]: currentValue + amount,
      });
    } catch (error) {
      console.error("Error incrementing dashboard metric:", error);
      throw new Error("Failed to increment dashboard metric");
    }
  }

  /**
   * Get user tool usage
   */
  async getToolUsage(userId: number) {
    try {
      const tools = await db
        .select()
        .from(userToolUsage)
        .where(eq(userToolUsage.userId, userId));

      return tools;
    } catch (error) {
      console.error("Error fetching tool usage:", error);
      throw new Error("Failed to fetch tool usage");
    }
  }

  /**
   * Record tool usage
   */
  async recordToolUsage(userId: number, toolName: string, configuration?: any) {
    try {
      // Check if tool usage record exists
      const [existingUsage] = await db
        .select()
        .from(userToolUsage)
        .where(eq(userToolUsage.userId, userId))
        .where(eq(userToolUsage.toolName, toolName));

      if (existingUsage) {
        // Update existing usage
        const [updatedUsage] = await db
          .update(userToolUsage)
          .set({
            usageCount: (existingUsage.usageCount || 0) + 1,
            lastUsed: new Date(),
            configuration: configuration || existingUsage.configuration,
          })
          .where(eq(userToolUsage.id, existingUsage.id))
          .returning();

        return updatedUsage;
      } else {
        // Create new usage record
        const [newUsage] = await db
          .insert(userToolUsage)
          .values({
            userId,
            toolName,
            usageCount: 1,
            lastUsed: new Date(),
            configuration,
          })
          .returning();

        // Update active tools count
        await this.updateActiveToolsCount(userId);
        
        return newUsage;
      }
    } catch (error) {
      console.error("Error recording tool usage:", error);
      throw new Error("Failed to record tool usage");
    }
  }

  /**
   * Update user login timestamp
   */
  async updateLastLogin(userId: number) {
    try {
      await this.updateDashboardStats(userId, {
        lastLoginAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating last login:", error);
      // Don't throw error for login tracking
    }
  }

  /**
   * Initialize dashboard stats for new user
   */
  private async initializeDashboardStats(userId: number) {
    try {
      const [newStats] = await db
        .insert(userDashboardStats)
        .values({
          userId,
          totalStrategies: 0,
          activeTools: 0,
          completedActions: 0,
          customerInteractions: 0,
          leadsGenerated: 0,
          salesClosed: 0,
          lastLoginAt: new Date(),
        })
        .returning();

      return newStats;
    } catch (error) {
      console.error("Error initializing dashboard stats:", error);
      throw new Error("Failed to initialize dashboard statistics");
    }
  }

  /**
   * Update active tools count based on actual tool usage
   */
  private async updateActiveToolsCount(userId: number) {
    try {
      const activeTools = await db
        .select()
        .from(userToolUsage)
        .where(eq(userToolUsage.userId, userId))
        .where(eq(userToolUsage.isActive, true));

      await this.updateDashboardStats(userId, {
        activeTools: activeTools.length,
      });
    } catch (error) {
      console.error("Error updating active tools count:", error);
      // Don't throw error, this is a background update
    }
  }

  /**
   * Get business profile completion percentage
   */
  async getProfileCompletionPercentage(userId: number): Promise<number> {
    try {
      const profile = await this.getUserProfile(userId);
      
      if (!profile) return 0;

      const requiredFields = [
        'businessName', 'industry', 'businessModel', 'targetAudience',
        'monthlyRevenue', 'teamSize', 'uniqueValue', 'customerAcquisition',
        'customerServiceNeeds'
      ];

      const completedFields = requiredFields.filter(field => {
        const value = profile[field as keyof typeof profile];
        return value && value.toString().trim().length > 0;
      });

      return Math.round((completedFields.length / requiredFields.length) * 100);
    } catch (error) {
      console.error("Error calculating profile completion:", error);
      return 0;
    }
  }
}

export const userProfileService = new UserProfileService();