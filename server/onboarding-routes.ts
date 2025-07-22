import { Router } from "express";
import { onboardingService } from "./onboardingService";
import { z } from "zod";

const router = Router();

// Get user onboarding status
router.get("/status", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const deviceType = req.headers['x-device-type'] as string || 'desktop';
    
    const status = await onboardingService.getUserOnboardingStatus(userId);
    const shouldShow = await onboardingService.shouldShowOnboarding(userId, deviceType);
    const preferences = await onboardingService.getUserPreferences(userId);

    res.json({
      status,
      shouldShow,
      preferences,
      deviceType
    });
  } catch (error) {
    console.error("Error getting onboarding status:", error);
    res.status(500).json({ error: "Failed to get onboarding status" });
  }
});

// Initialize onboarding tour
router.post("/start", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { deviceType = 'desktop' } = req.body;
    
    const onboarding = await onboardingService.initializeUserOnboarding(userId, deviceType);
    const tourSteps = await onboardingService.getTourStepsForDevice(deviceType);

    res.json({
      onboarding,
      tourSteps
    });
  } catch (error) {
    console.error("Error starting onboarding:", error);
    res.status(500).json({ error: "Failed to start onboarding" });
  }
});

// Get tour steps
router.get("/steps", async (req, res) => {
  try {
    const deviceType = req.query.deviceType as string || 'desktop';
    const steps = await onboardingService.getTourStepsForDevice(deviceType);
    
    res.json(steps);
  } catch (error) {
    console.error("Error getting tour steps:", error);
    res.status(500).json({ error: "Failed to get tour steps" });
  }
});

// Update progress
router.post("/progress", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { stepId, completed = true } = req.body;
    
    const updated = await onboardingService.updateOnboardingProgress(userId, stepId, completed);
    
    res.json(updated);
  } catch (error) {
    console.error("Error updating onboarding progress:", error);
    res.status(500).json({ error: "Failed to update progress" });
  }
});

// Complete tour
router.post("/complete", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const completed = await onboardingService.completeTour(userId);
    
    res.json(completed);
  } catch (error) {
    console.error("Error completing tour:", error);
    res.status(500).json({ error: "Failed to complete tour" });
  }
});

// Skip tour
router.post("/skip", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const skipped = await onboardingService.skipTour(userId);
    
    res.json(skipped);
  } catch (error) {
    console.error("Error skipping tour:", error);
    res.status(500).json({ error: "Failed to skip tour" });
  }
});

// Update preferences
router.put("/preferences", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const updates = req.body;
    const preferences = await onboardingService.updateUserPreferences(userId, updates);
    
    res.json(preferences);
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ error: "Failed to update preferences" });
  }
});

// Reset onboarding (for testing)
router.post("/reset", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    await onboardingService.resetOnboarding(userId);
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error resetting onboarding:", error);
    res.status(500).json({ error: "Failed to reset onboarding" });
  }
});

export default router;