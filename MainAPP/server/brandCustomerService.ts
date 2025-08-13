import { db } from "./db";
import { 
  brandCustomers, 
  brandCustomerSubscriptions, 
  brandCustomerFeatures,
  brandCustomerAssessments,
  brandCustomerChats,
  brandCustomerAnalytics,
  features,
  brandFeatures,
  type BrandCustomer,
  type InsertBrandCustomer,
  type BrandCustomerSubscription,
  type InsertBrandCustomerSubscription,
  type BrandCustomerFeature,
  type InsertBrandCustomerFeature
} from "@shared/brand-schema";
import { eq, and, desc, sql, count, sum, avg } from "drizzle-orm";
import bcrypt from "bcrypt";

export class BrandCustomerService {
  // Customer Management
  static async createCustomer(brandId: string, customerData: Omit<InsertBrandCustomer, 'brandId' | 'passwordHash'> & { password: string }): Promise<BrandCustomer> {
    const { password, ...data } = customerData;
    const passwordHash = await bcrypt.hash(password, 12);
    
    const [customer] = await db
      .insert(brandCustomers)
      .values({
        ...data,
        brandId,
        passwordHash,
      })
      .returning();
    
    // Initialize default feature access based on brand features
    await this.initializeCustomerFeatures(brandId, customer.id);
    
    return customer;
  }

  static async getCustomer(brandId: string, customerId: string): Promise<BrandCustomer | null> {
    const [customer] = await db
      .select()
      .from(brandCustomers)
      .where(and(
        eq(brandCustomers.brandId, brandId),
        eq(brandCustomers.id, customerId)
      ))
      .limit(1);
    
    return customer || null;
  }

  static async getCustomerByEmail(brandId: string, email: string): Promise<BrandCustomer | null> {
    const [customer] = await db
      .select()
      .from(brandCustomers)
      .where(and(
        eq(brandCustomers.brandId, brandId),
        eq(brandCustomers.email, email)
      ))
      .limit(1);
    
    return customer || null;
  }

  static async updateCustomer(brandId: string, customerId: string, updates: Partial<BrandCustomer>): Promise<BrandCustomer | null> {
    const [customer] = await db
      .update(brandCustomers)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(
        eq(brandCustomers.brandId, brandId),
        eq(brandCustomers.id, customerId)
      ))
      .returning();
    
    return customer || null;
  }

  static async authenticateCustomer(brandId: string, email: string, password: string): Promise<BrandCustomer | null> {
    const customer = await this.getCustomerByEmail(brandId, email);
    if (!customer || !customer.passwordHash) return null;
    
    const isValid = await bcrypt.compare(password, customer.passwordHash);
    if (!isValid) return null;
    
    // Update last active
    await this.updateCustomer(brandId, customer.id, { lastActive: new Date() });
    
    return customer;
  }

  // Subscription Management
  static async createSubscription(brandId: string, customerId: string, subscriptionData: Omit<InsertBrandCustomerSubscription, 'brandId' | 'customerId'>): Promise<BrandCustomerSubscription> {
    const [subscription] = await db
      .insert(brandCustomerSubscriptions)
      .values({
        ...subscriptionData,
        brandId,
        customerId,
      })
      .returning();
    
    // Update customer feature access based on subscription tier
    await this.updateCustomerFeaturesByTier(brandId, customerId, subscriptionData.tier);
    
    return subscription;
  }

  static async getActiveSubscription(brandId: string, customerId: string): Promise<BrandCustomerSubscription | null> {
    const [subscription] = await db
      .select()
      .from(brandCustomerSubscriptions)
      .where(and(
        eq(brandCustomerSubscriptions.brandId, brandId),
        eq(brandCustomerSubscriptions.customerId, customerId),
        eq(brandCustomerSubscriptions.status, 'active')
      ))
      .orderBy(desc(brandCustomerSubscriptions.createdAt))
      .limit(1);
    
    return subscription || null;
  }

  // Feature Management
  static async initializeCustomerFeatures(brandId: string, customerId: string): Promise<void> {
    // Get all features enabled for this brand
    const enabledFeatures = await db
      .select({
        featureId: brandFeatures.featureId,
        configuration: brandFeatures.configuration,
      })
      .from(brandFeatures)
      .innerJoin(features, eq(brandFeatures.featureId, features.id))
      .where(and(
        eq(brandFeatures.brandId, brandId),
        eq(brandFeatures.isEnabled, true),
        eq(features.isActive, true)
      ));

    // Create customer feature records with basic access
    for (const feature of enabledFeatures) {
      await db
        .insert(brandCustomerFeatures)
        .values({
          brandId,
          customerId,
          featureId: feature.featureId,
          accessLevel: 'basic',
        })
        .onConflictDoNothing();
    }
  }

  static async updateCustomerFeaturesByTier(brandId: string, customerId: string, tier: string): Promise<void> {
    // Define feature access levels by tier
    const tierAccess = {
      basic: { accessLevel: 'basic', usageLimit: 5 },
      pro: { accessLevel: 'premium', usageLimit: 50 },
      premium: { accessLevel: 'unlimited', usageLimit: null },
    };

    const access = tierAccess[tier as keyof typeof tierAccess] || tierAccess.basic;

    await db
      .update(brandCustomerFeatures)
      .set({
        accessLevel: access.accessLevel,
        usageLimit: access.usageLimit,
      })
      .where(and(
        eq(brandCustomerFeatures.brandId, brandId),
        eq(brandCustomerFeatures.customerId, customerId)
      ));
  }

  static async checkFeatureAccess(brandId: string, customerId: string, featureId: string): Promise<{ hasAccess: boolean; usageRemaining?: number }> {
    const [customerFeature] = await db
      .select()
      .from(brandCustomerFeatures)
      .where(and(
        eq(brandCustomerFeatures.brandId, brandId),
        eq(brandCustomerFeatures.customerId, customerId),
        eq(brandCustomerFeatures.featureId, featureId)
      ))
      .limit(1);

    if (!customerFeature) {
      return { hasAccess: false };
    }

    // Check if feature has expired
    if (customerFeature.expiresAt && customerFeature.expiresAt < new Date()) {
      return { hasAccess: false };
    }

    // Check usage limits
    if (customerFeature.usageLimit !== null) {
      const usageRemaining = customerFeature.usageLimit - customerFeature.usageCount;
      if (usageRemaining <= 0) {
        return { hasAccess: false };
      }
      return { hasAccess: true, usageRemaining };
    }

    return { hasAccess: true };
  }

  static async incrementFeatureUsage(brandId: string, customerId: string, featureId: string): Promise<void> {
    await db
      .update(brandCustomerFeatures)
      .set({
        usageCount: sql`${brandCustomerFeatures.usageCount} + 1`,
        lastUsed: new Date(),
      })
      .where(and(
        eq(brandCustomerFeatures.brandId, brandId),
        eq(brandCustomerFeatures.customerId, customerId),
        eq(brandCustomerFeatures.featureId, featureId)
      ));
  }

  // Assessment Management
  static async saveAssessment(brandId: string, customerId: string, assessmentData: Omit<InsertBrandCustomerAssessment, 'brandId' | 'customerId'>): Promise<void> {
    await db
      .insert(brandCustomerAssessments)
      .values({
        ...assessmentData,
        brandId,
        customerId,
      });
  }

  static async getCustomerAssessments(brandId: string, customerId: string): Promise<any[]> {
    return await db
      .select()
      .from(brandCustomerAssessments)
      .where(and(
        eq(brandCustomerAssessments.brandId, brandId),
        eq(brandCustomerAssessments.customerId, customerId)
      ))
      .orderBy(desc(brandCustomerAssessments.completedAt));
  }

  // Analytics
  static async trackEvent(brandId: string, customerId: string, eventType: string, eventData?: any, sessionId?: string): Promise<void> {
    await db
      .insert(brandCustomerAnalytics)
      .values({
        brandId,
        customerId,
        eventType,
        eventData,
        sessionId,
      });
  }

  // Brand Analytics
  static async getBrandStats(brandId: string): Promise<any> {
    // Get customer count
    const [customerCount] = await db
      .select({ count: count() })
      .from(brandCustomers)
      .where(eq(brandCustomers.brandId, brandId));

    // Get active subscribers count
    const [activeSubscribers] = await db
      .select({ count: count() })
      .from(brandCustomerSubscriptions)
      .where(and(
        eq(brandCustomerSubscriptions.brandId, brandId),
        eq(brandCustomerSubscriptions.status, 'active')
      ));

    // Get assessments completed count
    const [assessmentsCompleted] = await db
      .select({ count: count() })
      .from(brandCustomerAssessments)
      .where(eq(brandCustomerAssessments.brandId, brandId));

    return {
      totalCustomers: customerCount.count,
      activeSubscribers: activeSubscribers.count,
      assessmentsCompleted: assessmentsCompleted.count,
    };
  }
}