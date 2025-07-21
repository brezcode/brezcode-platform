import { Router } from "express";
import { businessConsultantService } from "./businessConsultantService";
import { db } from "./db";
import { 
  onboardingQuestions, 
  onboardingResponses, 
  businessProfiles, 
  businessStrategies,
  insertBusinessProfileSchema,
  insertOnboardingResponseSchema 
} from "@shared/schema";
import { eq, asc } from "drizzle-orm";

const router = Router();

// Get onboarding questions
router.get("/onboarding-questions", async (req, res) => {
  try {
    const questions = await db
      .select()
      .from(onboardingQuestions)
      .where(eq(onboardingQuestions.active, true))
      .orderBy(asc(onboardingQuestions.order));

    res.json(questions);
  } catch (error) {
    console.error("Error fetching onboarding questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// Submit onboarding responses and get business analysis
router.post("/complete-onboarding", async (req, res) => {
  try {
    const { responses } = req.body;
    
    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({ error: "Invalid responses format" });
    }

    // For now, we'll use a mock user ID since authentication might not be fully set up
    const userId = req.user?.id || "demo-user-" + Date.now();

    // Save responses to database
    for (const response of responses) {
      const validatedResponse = insertOnboardingResponseSchema.parse({
        userId,
        questionId: response.questionId,
        response: response.response,
      });

      await db.insert(onboardingResponses).values(validatedResponse);
    }

    // Create business profile from responses
    const businessProfile = await businessConsultantService.createBusinessProfile(userId, responses);
    
    // Save business profile
    const validatedProfile = insertBusinessProfileSchema.parse(businessProfile);
    const [savedProfile] = await db.insert(businessProfiles).values(validatedProfile).returning();

    // Generate AI strategies
    const strategies = await businessConsultantService.generateBusinessStrategies(savedProfile);
    
    // Save strategies to database
    const savedStrategies = [];
    for (const strategy of strategies) {
      const [savedStrategy] = await db.insert(businessStrategies).values(strategy).returning();
      savedStrategies.push(savedStrategy);
    }

    res.json({
      profile: savedProfile,
      strategies: savedStrategies,
      message: "Business analysis completed successfully"
    });

  } catch (error) {
    console.error("Error completing onboarding:", error);
    res.status(500).json({ 
      error: "Failed to complete business analysis",
      details: error.message 
    });
  }
});

// Get business profile for user
router.get("/profile", async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId as string;
    
    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }

    const profile = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.userId, userId))
      .limit(1);

    if (profile.length === 0) {
      return res.status(404).json({ error: "Business profile not found" });
    }

    res.json(profile[0]);
  } catch (error) {
    console.error("Error fetching business profile:", error);
    res.status(500).json({ error: "Failed to fetch business profile" });
  }
});

// Get strategies for business profile
router.get("/strategies/:profileId", async (req, res) => {
  try {
    const { profileId } = req.params;

    const strategies = await db
      .select()
      .from(businessStrategies)
      .where(eq(businessStrategies.businessProfileId, profileId));

    res.json(strategies);
  } catch (error) {
    console.error("Error fetching strategies:", error);
    res.status(500).json({ error: "Failed to fetch strategies" });
  }
});

// Execute strategy action
router.post("/execute-strategy/:strategyId", async (req, res) => {
  try {
    const { strategyId } = req.params;
    const { actionStep } = req.body;

    // Get strategy and business profile
    const strategy = await db
      .select()
      .from(businessStrategies)
      .where(eq(businessStrategies.id, strategyId))
      .limit(1);

    if (strategy.length === 0) {
      return res.status(404).json({ error: "Strategy not found" });
    }

    const profile = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.id, strategy[0].businessProfileId))
      .limit(1);

    if (profile.length === 0) {
      return res.status(404).json({ error: "Business profile not found" });
    }

    // Execute the automated step
    const result = await businessConsultantService.executeAutomatedStep(actionStep, profile[0]);

    res.json({
      success: result.success,
      message: result.message,
      results: result.results
    });

  } catch (error) {
    console.error("Error executing strategy:", error);
    res.status(500).json({ error: "Failed to execute strategy step" });
  }
});

// Generate new strategies based on updated business info
router.post("/regenerate-strategies/:profileId", async (req, res) => {
  try {
    const { profileId } = req.params;
    const updates = req.body;

    // Update business profile
    if (Object.keys(updates).length > 0) {
      await db
        .update(businessProfiles)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(businessProfiles.id, profileId));
    }

    // Get updated profile
    const [profile] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.id, profileId))
      .limit(1);

    if (!profile) {
      return res.status(404).json({ error: "Business profile not found" });
    }

    // Generate new strategies
    const newStrategies = await businessConsultantService.generateBusinessStrategies(profile);
    
    // Save new strategies
    const savedStrategies = [];
    for (const strategy of newStrategies) {
      const [savedStrategy] = await db.insert(businessStrategies).values(strategy).returning();
      savedStrategies.push(savedStrategy);
    }

    res.json({
      profile,
      strategies: savedStrategies,
      message: "New strategies generated successfully"
    });

  } catch (error) {
    console.error("Error regenerating strategies:", error);
    res.status(500).json({ error: "Failed to regenerate strategies" });
  }
});

export { router as businessRoutes };