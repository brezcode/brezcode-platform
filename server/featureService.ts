import { db } from "./db";
import { 
  features, 
  brandFeatures,
  brandCustomerFeatures,
  type Feature,
  type InsertFeature,
  type BrandFeature,
  type InsertBrandFeature
} from "@shared/brand-schema";
import { eq, and, count, sum, avg } from "drizzle-orm";

export class FeatureService {
  // Platform Feature Management
  static async createFeature(featureData: InsertFeature): Promise<Feature> {
    const [feature] = await db
      .insert(features)
      .values(featureData)
      .returning();
    
    return feature;
  }

  static async getAllFeatures(): Promise<Feature[]> {
    return await db
      .select()
      .from(features)
      .where(eq(features.isActive, true));
  }

  static async getFeaturesByCategory(category: string): Promise<Feature[]> {
    return await db
      .select()
      .from(features)
      .where(and(
        eq(features.category, category),
        eq(features.isActive, true)
      ));
  }

  // Brand Feature Enrollment
  static async enrollBrandInFeature(brandId: string, featureId: string, configuration?: any): Promise<BrandFeature> {
    const [brandFeature] = await db
      .insert(brandFeatures)
      .values({
        brandId,
        featureId,
        configuration,
        isEnabled: true,
      })
      .onConflictDoUpdate({
        target: [brandFeatures.brandId, brandFeatures.featureId],
        set: {
          isEnabled: true,
          configuration,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    return brandFeature;
  }

  static async getBrandFeatures(brandId: string): Promise<(BrandFeature & { feature: Feature })[]> {
    return await db
      .select({
        id: brandFeatures.id,
        brandId: brandFeatures.brandId,
        featureId: brandFeatures.featureId,
        isEnabled: brandFeatures.isEnabled,
        configuration: brandFeatures.configuration,
        enrolledAt: brandFeatures.enrolledAt,
        updatedAt: brandFeatures.updatedAt,
        feature: features,
      })
      .from(brandFeatures)
      .innerJoin(features, eq(brandFeatures.featureId, features.id))
      .where(and(
        eq(brandFeatures.brandId, brandId),
        eq(features.isActive, true)
      ));
  }

  static async updateBrandFeature(brandId: string, featureId: string, updates: Partial<BrandFeature>): Promise<BrandFeature | null> {
    const [brandFeature] = await db
      .update(brandFeatures)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(
        eq(brandFeatures.brandId, brandId),
        eq(brandFeatures.featureId, featureId)
      ))
      .returning();
    
    return brandFeature || null;
  }

  static async toggleBrandFeature(brandId: string, featureId: string, isEnabled: boolean): Promise<BrandFeature | null> {
    return await this.updateBrandFeature(brandId, featureId, { isEnabled });
  }

  // Feature initialization for new brands
  static async initializeDefaultFeaturesForBrand(brandId: string): Promise<void> {
    // Get default features that should be enabled for all new brands
    const defaultFeatures = await db
      .select()
      .from(features)
      .where(and(
        eq(features.isActive, true),
        // You can add specific categories or conditions for default features
      ));

    // Enroll brand in default features
    for (const feature of defaultFeatures) {
      await this.enrollBrandInFeature(brandId, feature.id);
    }
  }

  // Feature usage analytics
  static async getFeatureUsageStats(brandId: string, featureId: string): Promise<any> {
    const [result] = await db
      .select({
        uniqueUsers: count(brandCustomerFeatures.customerId),
        totalUsage: sum(brandCustomerFeatures.usageCount),
        avgUsagePerUser: avg(brandCustomerFeatures.usageCount),
      })
      .from(brandCustomerFeatures)
      .where(and(
        eq(brandCustomerFeatures.brandId, brandId),
        eq(brandCustomerFeatures.featureId, featureId)
      ));

    return result || { uniqueUsers: 0, totalUsage: 0, avgUsagePerUser: 0 };
  }
}

// Default platform features
export const DEFAULT_FEATURES = [
  {
    name: "Health Assessment",
    description: "Comprehensive health risk assessment questionnaire",
    category: "assessment",
  },
  {
    name: "AI Health Coach",
    description: "24/7 AI-powered health coaching and guidance",
    category: "coaching",
  },
  {
    name: "Personalized Reports",
    description: "Custom health reports with recommendations",
    category: "reporting",
  },
  {
    name: "Progress Tracking",
    description: "Track health metrics and improvements over time",
    category: "analytics",
  },
  {
    name: "Community Access",
    description: "Access to brand-specific health community",
    category: "community",
  },
  {
    name: "SMS Notifications",
    description: "Health reminders and tips via SMS",
    category: "notifications",
  },
  {
    name: "Email Campaigns",
    description: "Automated health education email campaigns",
    category: "marketing",
  },
  {
    name: "Multi-language Support",
    description: "Support for multiple languages and localization",
    category: "localization",
  },
  {
    name: "White-label Branding",
    description: "Complete brand customization and white-labeling",
    category: "branding",
  },
  {
    name: "Analytics Dashboard",
    description: "Comprehensive analytics and reporting dashboard",
    category: "analytics",
  },
] as const;