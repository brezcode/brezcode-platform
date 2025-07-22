import { db } from "./db";
import { userOnboarding, tourSteps, onboardingPreferences, type UserOnboarding, type TourStep, type OnboardingPreferences } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export class OnboardingService {
  // Initialize user onboarding on first login
  async initializeUserOnboarding(userId: number, deviceType: string): Promise<UserOnboarding> {
    const existing = await this.getUserOnboardingStatus(userId);
    if (existing) {
      return existing;
    }

    const [onboarding] = await db
      .insert(userOnboarding)
      .values({
        userId,
        deviceType,
        tourStartedAt: new Date(),
        currentStep: 0,
        stepsCompleted: []
      })
      .returning();

    // Create default preferences
    await db
      .insert(onboardingPreferences)
      .values({
        userId,
        showTipsOnMobile: deviceType === 'mobile',
        preferredTourSpeed: 'normal',
        skipAdvancedFeatures: deviceType === 'mobile'
      })
      .onConflictDoNothing();

    return onboarding;
  }

  // Get user onboarding status
  async getUserOnboardingStatus(userId: number): Promise<UserOnboarding | null> {
    const [result] = await db
      .select()
      .from(userOnboarding)
      .where(eq(userOnboarding.userId, userId));
    
    return result || null;
  }

  // Get tour steps for device type
  async getTourStepsForDevice(deviceType: string): Promise<TourStep[]> {
    const steps = await db
      .select()
      .from(tourSteps)
      .orderBy(tourSteps.order);

    return steps.filter(step => 
      step.deviceTypes?.includes(deviceType) || 
      step.deviceTypes?.includes('all')
    );
  }

  // Update onboarding progress
  async updateOnboardingProgress(
    userId: number, 
    stepId: string, 
    completed: boolean = true
  ): Promise<UserOnboarding> {
    const current = await this.getUserOnboardingStatus(userId);
    if (!current) {
      throw new Error('Onboarding not initialized');
    }

    const completedSteps = current.stepsCompleted || [];
    const newStepsCompleted = completed && !completedSteps.includes(stepId)
      ? [...completedSteps, stepId]
      : completedSteps;

    const [updated] = await db
      .update(userOnboarding)
      .set({
        stepsCompleted: newStepsCompleted,
        currentStep: newStepsCompleted.length,
        updatedAt: new Date()
      })
      .where(eq(userOnboarding.userId, userId))
      .returning();

    return updated;
  }

  // Complete tour
  async completeTour(userId: number): Promise<UserOnboarding> {
    const [updated] = await db
      .update(userOnboarding)
      .set({
        tourCompleted: true,
        tourCompletedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(userOnboarding.userId, userId))
      .returning();

    // Update preferences to track completed tour
    const preferences = await this.getUserPreferences(userId);
    if (preferences) {
      const completedTours = preferences.completedTours || [];
      await db
        .update(onboardingPreferences)
        .set({
          completedTours: [...completedTours, 'ai-training-tour'],
          updatedAt: new Date()
        })
        .where(eq(onboardingPreferences.userId, userId));
    }

    return updated;
  }

  // Skip tour
  async skipTour(userId: number): Promise<UserOnboarding> {
    const current = await this.getUserOnboardingStatus(userId);
    if (!current) {
      throw new Error('Onboarding not initialized');
    }

    const [updated] = await db
      .update(userOnboarding)
      .set({
        tourCompleted: true,
        skipCount: (current.skipCount || 0) + 1,
        updatedAt: new Date()
      })
      .where(eq(userOnboarding.userId, userId))
      .returning();

    return updated;
  }

  // Get user preferences
  async getUserPreferences(userId: number): Promise<OnboardingPreferences | null> {
    const [result] = await db
      .select()
      .from(onboardingPreferences)
      .where(eq(onboardingPreferences.userId, userId));
    
    return result || null;
  }

  // Update user preferences
  async updateUserPreferences(
    userId: number,
    updates: Partial<OnboardingPreferences>
  ): Promise<OnboardingPreferences> {
    const [updated] = await db
      .update(onboardingPreferences)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(onboardingPreferences.userId, userId))
      .returning();

    return updated;
  }

  // Check if user should see onboarding
  async shouldShowOnboarding(userId: number, deviceType: string): Promise<boolean> {
    const status = await this.getUserOnboardingStatus(userId);
    const preferences = await this.getUserPreferences(userId);

    // Never completed any tour
    if (!status || !status.tourCompleted) {
      return true;
    }

    // Mobile user preferences
    if (deviceType === 'mobile' && preferences?.showTipsOnMobile) {
      const completedTours = preferences.completedTours || [];
      return !completedTours.includes('ai-training-tour');
    }

    return false;
  }

  // Reset onboarding (for testing or user request)
  async resetOnboarding(userId: number): Promise<void> {
    await db
      .update(userOnboarding)
      .set({
        tourCompleted: false,
        currentStep: 0,
        stepsCompleted: [],
        tourStartedAt: new Date(),
        tourCompletedAt: null,
        updatedAt: new Date()
      })
      .where(eq(userOnboarding.userId, userId));
  }
}

export const onboardingService = new OnboardingService();