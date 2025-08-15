import { Router } from "express";
import { FeatureService } from "../featureService";
import { BrandCustomerService } from "../brandCustomerService";
import { brandMiddleware, requireBrand } from "../brandMiddleware";
import { z } from "zod";

const router = Router();

// Apply brand middleware to all routes
router.use(brandMiddleware);
router.use(requireBrand);

// Get all available platform features
router.get("/available", async (req, res) => {
  try {
    const features = await FeatureService.getAllFeatures();
    res.json({ features });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get features enrolled for current brand
router.get("/enrolled", async (req, res) => {
  try {
    const brandId = req.brand!.id;
    const brandFeatures = await FeatureService.getBrandFeatures(brandId);
    res.json({ features: brandFeatures });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll brand in a feature (admin only)
router.post("/enroll", async (req, res) => {
  try {
    const enrollSchema = z.object({
      featureId: z.string().uuid(),
      configuration: z.record(z.any()).optional(),
    });

    const { featureId, configuration } = enrollSchema.parse(req.body);
    const brandId = req.brand!.id;

    const brandFeature = await FeatureService.enrollBrandInFeature(brandId, featureId, configuration);
    res.json({ brandFeature });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle feature for brand (admin only)
router.patch("/:featureId/toggle", async (req, res) => {
  try {
    const { featureId } = req.params;
    const toggleSchema = z.object({
      isEnabled: z.boolean(),
    });

    const { isEnabled } = toggleSchema.parse(req.body);
    const brandId = req.brand!.id;

    const brandFeature = await FeatureService.toggleBrandFeature(brandId, featureId, isEnabled);
    if (!brandFeature) {
      return res.status(404).json({ error: "Brand feature not found" });
    }

    res.json({ brandFeature });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Check customer's access to a specific feature
router.get("/:featureId/access", async (req, res) => {
  try {
    const { featureId } = req.params;
    const customerId = (req.session as any)?.customerId;
    
    if (!customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const brandId = req.brand!.id;
    const access = await BrandCustomerService.checkFeatureAccess(brandId, customerId, featureId);
    
    res.json({ access });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Use a feature (increment usage count)
router.post("/:featureId/use", async (req, res) => {
  try {
    const { featureId } = req.params;
    const customerId = (req.session as any)?.customerId;
    
    if (!customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const brandId = req.brand!.id;
    
    // Check access first
    const access = await BrandCustomerService.checkFeatureAccess(brandId, customerId, featureId);
    if (!access.hasAccess) {
      return res.status(403).json({ error: "Feature access denied" });
    }

    // Increment usage
    await BrandCustomerService.incrementFeatureUsage(brandId, customerId, featureId);
    
    // Track usage event
    await BrandCustomerService.trackEvent(brandId, customerId, "feature_used", { featureId });
    
    res.json({ success: true, usageRemaining: access.usageRemaining ? access.usageRemaining - 1 : null });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get feature usage statistics (admin only)
router.get("/:featureId/stats", async (req, res) => {
  try {
    const { featureId } = req.params;
    const brandId = req.brand!.id;

    const stats = await FeatureService.getFeatureUsageStats(brandId, featureId);
    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;