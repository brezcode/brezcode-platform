import { Router } from "express";
import { z } from "zod";
import { userProfileService } from "../userProfileService";

const router = Router();

// Profile schema for validation
const profileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  businessModel: z.string().min(1, "Business model is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  monthlyRevenue: z.string().min(1, "Monthly revenue range is required"),
  teamSize: z.string().min(1, "Team size is required"),
  marketingChannels: z.array(z.string()).min(1, "Select at least one marketing channel"),
  businessChallenges: z.array(z.string()).min(1, "Select at least one challenge"),
  businessGoals: z.array(z.string()).min(1, "Select at least one goal"),
  growthTimeline: z.string().min(1, "Growth timeline is required"),
  marketingBudget: z.string().min(1, "Marketing budget is required"),
  businessTools: z.array(z.string()),
  uniqueValue: z.string().min(1, "Unique value proposition is required"),
  customerAcquisition: z.string().min(1, "Customer acquisition method is required"),
  customerServiceNeeds: z.string().min(1, "Customer service needs are required"),
  preferences: z.any().optional(),
});

// Authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session?.isAuthenticated || !req.session?.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// Get user profile
router.get("/profile", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId;
    const profile = await userProfileService.getUserProfile(userId);
    
    if (!profile) {
      return res.json(null);
    }

    res.json(profile);
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: error.message || "Failed to fetch profile" });
  }
});

// Save user profile
router.post("/profile", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId;
    const profileData = profileSchema.parse(req.body);
    
    const savedProfile = await userProfileService.saveUserProfile(userId, profileData);
    
    res.json(savedProfile);
  } catch (error: any) {
    console.error("Error saving user profile:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: error.message || "Failed to save profile" });
  }
});

// Get dashboard statistics
router.get("/dashboard-stats", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId;
    const stats = await userProfileService.getDashboardStats(userId);
    
    // Update last login
    await userProfileService.updateLastLogin(userId);
    
    res.json(stats);
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: error.message || "Failed to fetch dashboard statistics" });
  }
});

// Get tool usage
router.get("/tool-usage", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId;
    const toolUsage = await userProfileService.getToolUsage(userId);
    
    res.json(toolUsage);
  } catch (error: any) {
    console.error("Error fetching tool usage:", error);
    res.status(500).json({ message: error.message || "Failed to fetch tool usage" });
  }
});

// Record tool usage
router.post("/tool-usage", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId;
    const { toolName, configuration } = req.body;
    
    if (!toolName) {
      return res.status(400).json({ message: "Tool name is required" });
    }
    
    const usage = await userProfileService.recordToolUsage(userId, toolName, configuration);
    
    res.json(usage);
  } catch (error: any) {
    console.error("Error recording tool usage:", error);
    res.status(500).json({ message: error.message || "Failed to record tool usage" });
  }
});

// Get profile completion percentage
router.get("/profile-completion", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId;
    const completionPercentage = await userProfileService.getProfileCompletionPercentage(userId);
    
    res.json({ completionPercentage });
  } catch (error: any) {
    console.error("Error getting profile completion:", error);
    res.status(500).json({ message: error.message || "Failed to get profile completion" });
  }
});

// Increment dashboard metric
router.post("/dashboard-stats/increment", requireAuth, async (req: any, res) => {
  try {
    const userId = req.session.userId;
    const { metric, amount = 1 } = req.body;
    
    if (!metric) {
      return res.status(400).json({ message: "Metric name is required" });
    }
    
    await userProfileService.incrementDashboardMetric(userId, metric, amount);
    
    res.json({ success: true });
  } catch (error: any) {
    console.error("Error incrementing metric:", error);
    res.status(500).json({ message: error.message || "Failed to increment metric" });
  }
});

export default router;