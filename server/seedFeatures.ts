import { db } from "./db";
import { features } from "@shared/brand-schema";
import { FeatureService, DEFAULT_FEATURES } from "./featureService";
import { eq } from "drizzle-orm";

export async function seedFeatures() {
  console.log('🌱 Seeding platform features...');
  
  try {
    // Create default features if they don't exist
    for (const featureData of DEFAULT_FEATURES) {
      const [existingFeature] = await db
        .select()
        .from(features)
        .where(eq(features.name, featureData.name))
        .limit(1);

      if (!existingFeature) {
        console.log(`Creating feature: ${featureData.name}`);
        await FeatureService.createFeature(featureData);
      } else {
        console.log(`Feature already exists: ${featureData.name}`);
      }
    }

    console.log('✅ Platform features seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding features:', error);
    throw error;
  }
}

// Function to initialize default features for a new brand
export async function initializeBrandFeatures(brandId: string) {
  console.log(`🎯 Initializing features for brand: ${brandId}`);
  
  try {
    await FeatureService.initializeDefaultFeaturesForBrand(brandId);
    console.log(`✅ Features initialized for brand: ${brandId}`);
  } catch (error) {
    console.error(`❌ Error initializing features for brand ${brandId}:`, error);
    throw error;
  }
}