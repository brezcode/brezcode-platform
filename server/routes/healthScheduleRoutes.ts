import { Router } from "express";
import { HealthScheduleService } from "../healthScheduleService";
// Temporary simple auth middleware - will integrate with proper brand customer auth later
const requireCustomerAuth = (req: any, res: any, next: any) => {
  // For now, assume customer is authenticated
  // TODO: Integrate with proper brand customer authentication
  req.customerId = "550e8400-e29b-41d4-a716-446655440000"; // Valid UUID format for testing
  next();
};
import { z } from "zod";
import {
  healthPreferencesFormSchema,
  activityCompletionSchema,
  createScheduleSchema,
} from "@shared/health-schedule-schema";

const router = Router();

// ===== ACTIVITY TEMPLATES =====

// Get all activity templates
router.get("/templates", async (req, res) => {
  try {
    const { category } = req.query;
    const templates = await HealthScheduleService.getActivityTemplates(
      category as string
    );
    
    res.json({
      success: true,
      templates,
    });
  } catch (error: any) {
    console.error("Error fetching activity templates:", error);
    res.status(500).json({ 
      error: "Failed to fetch activity templates",
      message: error.message 
    });
  }
});

// ===== HEALTH PREFERENCES =====

// Save customer health preferences
router.post("/preferences", requireCustomerAuth, async (req: any, res) => {
  try {
    const preferences = healthPreferencesFormSchema.parse(req.body);
    const brandId = req.brand!.id;
    const customerId = req.customerId;

    const savedPreferences = await HealthScheduleService.saveHealthPreferences(
      brandId,
      customerId,
      preferences
    );
    
    res.json({
      success: true,
      preferences: savedPreferences,
    });
  } catch (error: any) {
    console.error("Error saving health preferences:", error);
    res.status(500).json({ 
      error: "Failed to save health preferences",
      message: error.message 
    });
  }
});

// Get customer health preferences
router.get("/preferences", requireCustomerAuth, async (req: any, res) => {
  try {
    const brandId = req.brand!.id;
    const customerId = req.customerId;

    const preferences = await HealthScheduleService.getHealthPreferences(
      brandId,
      customerId
    );
    
    res.json({
      success: true,
      preferences,
    });
  } catch (error: any) {
    console.error("Error fetching health preferences:", error);
    res.status(500).json({ 
      error: "Failed to fetch health preferences",
      message: error.message 
    });
  }
});

// ===== HEALTH SCHEDULES =====

// Create personalized health schedule
router.post("/schedule", requireCustomerAuth, async (req: any, res) => {
  try {
    const scheduleData = createScheduleSchema.parse(req.body);
    const brandId = req.brand!.id;
    const customerId = req.customerId;

    const result = await HealthScheduleService.createPersonalizedSchedule(
      brandId,
      customerId,
      scheduleData
    );
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error creating health schedule:", error);
    res.status(500).json({ 
      error: "Failed to create health schedule",
      message: error.message 
    });
  }
});

// ===== SCHEDULED ACTIVITIES =====

// Get scheduled activities for date range
router.get("/activities", requireCustomerAuth, async (req: any, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: "Start date and end date are required" 
      });
    }

    const brandId = req.brand!.id;
    const customerId = req.customerId;

    const activities = await HealthScheduleService.getScheduledActivities(
      brandId,
      customerId,
      startDate as string,
      endDate as string
    );
    
    res.json({
      success: true,
      activities,
    });
  } catch (error: any) {
    console.error("Error fetching scheduled activities:", error);
    res.status(500).json({ 
      error: "Failed to fetch scheduled activities",
      message: error.message 
    });
  }
});

// Complete an activity
router.post("/complete-activity", requireCustomerAuth, async (req: any, res) => {
  try {
    const completionData = activityCompletionSchema.parse(req.body);
    const brandId = req.brand!.id;
    const customerId = req.customerId;

    const result = await HealthScheduleService.completeActivity(
      brandId,
      customerId,
      completionData
    );
    
    res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error completing activity:", error);
    res.status(500).json({ 
      error: "Failed to complete activity",
      message: error.message 
    });
  }
});

// ===== HEALTH STATS & ANALYTICS =====

// Get customer health stats
router.get("/stats", requireCustomerAuth, async (req: any, res) => {
  try {
    const brandId = req.brand!.id;
    const customerId = req.customerId;

    const stats = await HealthScheduleService.getHealthStats(
      brandId,
      customerId
    );
    
    res.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error("Error fetching health stats:", error);
    res.status(500).json({ 
      error: "Failed to fetch health stats",
      message: error.message 
    });
  }
});

// Get daily health plan
router.get("/daily-plan", requireCustomerAuth, async (req: any, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ 
        error: "Date is required" 
      });
    }

    const brandId = req.brand!.id;
    const customerId = req.customerId;

    const dailyPlan = await HealthScheduleService.getDailyPlan(
      brandId,
      customerId,
      date as string
    );
    
    res.json({
      success: true,
      ...dailyPlan,
    });
  } catch (error: any) {
    console.error("Error fetching daily plan:", error);
    res.status(500).json({ 
      error: "Failed to fetch daily plan",
      message: error.message 
    });
  }
});

export default router;