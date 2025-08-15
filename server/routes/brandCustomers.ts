import { Router } from "express";
import { BrandCustomerService } from "../brandCustomerService";
import { brandMiddleware, requireBrand } from "../brandMiddleware";
import { z } from "zod";

const router = Router();

// Apply brand middleware to all routes
router.use(brandMiddleware);
router.use(requireBrand);

// Customer registration
router.post("/register", async (req, res) => {
  try {
    const registerSchema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
    });

    const data = registerSchema.parse(req.body);
    const brandId = req.brand!.id;

    // Check if customer already exists
    const existingCustomer = await BrandCustomerService.getCustomerByEmail(brandId, data.email);
    if (existingCustomer) {
      return res.status(400).json({ error: "Customer already exists" });
    }

    const customer = await BrandCustomerService.createCustomer(brandId, data);
    
    // Remove password hash from response
    const { passwordHash, ...customerData } = customer;
    
    res.json({ customer: customerData });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Customer login
router.post("/login", async (req, res) => {
  try {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = loginSchema.parse(req.body);
    const brandId = req.brand!.id;

    const customer = await BrandCustomerService.authenticateCustomer(brandId, email, password);
    if (!customer) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Store customer in session
    (req.session as any).customerId = customer.id;
    (req.session as any).brandId = brandId;

    // Remove password hash from response
    const { passwordHash, ...customerData } = customer;
    
    res.json({ customer: customerData });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get current customer
router.get("/me", async (req, res) => {
  try {
    const customerId = (req.session as any)?.customerId;
    if (!customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const brandId = req.brand!.id;
    const customer = await BrandCustomerService.getCustomer(brandId, customerId);
    
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Remove password hash from response
    const { passwordHash, ...customerData } = customer;
    
    res.json({ customer: customerData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer profile
router.patch("/profile", async (req, res) => {
  try {
    const customerId = (req.session as any)?.customerId;
    if (!customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const updateSchema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      profileData: z.record(z.any()).optional(),
      preferences: z.record(z.any()).optional(),
    });

    const updates = updateSchema.parse(req.body);
    const brandId = req.brand!.id;

    const customer = await BrandCustomerService.updateCustomer(brandId, customerId, updates);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Remove password hash from response
    const { passwordHash, ...customerData } = customer;
    
    res.json({ customer: customerData });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get customer subscription
router.get("/subscription", async (req, res) => {
  try {
    const customerId = (req.session as any)?.customerId;
    if (!customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const brandId = req.brand!.id;
    const subscription = await BrandCustomerService.getActiveSubscription(brandId, customerId);
    
    res.json({ subscription });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create subscription
router.post("/subscription", async (req, res) => {
  try {
    const customerId = (req.session as any)?.customerId;
    if (!customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const subscriptionSchema = z.object({
      tier: z.enum(["basic", "pro", "premium"]),
      stripeSubscriptionId: z.string().optional(),
    });

    const data = subscriptionSchema.parse(req.body);
    const brandId = req.brand!.id;

    const subscription = await BrandCustomerService.createSubscription(brandId, customerId, {
      ...data,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
    
    res.json({ subscription });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Save assessment
router.post("/assessments", async (req, res) => {
  try {
    const customerId = (req.session as any)?.customerId;
    if (!customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const assessmentSchema = z.object({
      assessmentType: z.string(),
      responses: z.record(z.any()),
      results: z.record(z.any()).optional(),
    });

    const data = assessmentSchema.parse(req.body);
    const brandId = req.brand!.id;

    await BrandCustomerService.saveAssessment(brandId, customerId, data);
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get customer assessments
router.get("/assessments", async (req, res) => {
  try {
    const customerId = (req.session as any)?.customerId;
    if (!customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const brandId = req.brand!.id;
    const assessments = await BrandCustomerService.getCustomerAssessments(brandId, customerId);
    
    res.json({ assessments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out" });
    }
    res.json({ success: true });
  });
});

export default router;