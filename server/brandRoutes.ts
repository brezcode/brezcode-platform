import { Router } from "express";
import { BrandService } from "./brandService";
import { brandMiddleware, requireBrand } from "./brandMiddleware";
import { 
  insertBrandSchema, 
  insertBrandConfigSchema,
  type HeroSectionTemplate,
  type FeatureTemplate,
  type PricingTierTemplate,
  type FAQTemplate
} from "@shared/brand-schema";

const router = Router();

// Apply brand middleware to all routes
router.use(brandMiddleware);

// Get brand configuration for current domain
router.get('/api/brand/config', async (req, res) => {
  try {
    if (!req.brand || !req.brandConfig) {
      // Return default configuration
      const defaultConfig = BrandService.getDefaultBrandConfig();
      return res.json({
        brand: {
          name: "BrezCode",
          subdomain: "brezcode"
        },
        config: defaultConfig
      });
    }

    res.json({
      brand: {
        id: req.brand.id,
        name: req.brand.name,
        subdomain: req.brand.subdomain,
        customDomain: req.brand.customDomain
      },
      config: req.brandConfig
    });
  } catch (error) {
    console.error('Error fetching brand config:', error);
    res.status(500).json({ error: 'Failed to fetch brand configuration' });
  }
});

// Admin routes for brand management (would be protected in production)
router.post('/api/admin/brands', async (req, res) => {
  try {
    const brandData = insertBrandSchema.parse(req.body);
    const result = await BrandService.createBrand(brandData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(400).json({ error: 'Failed to create brand' });
  }
});

// Update brand configuration
router.put('/api/admin/brands/:brandId/config', async (req, res) => {
  try {
    const { brandId } = req.params;
    const configData = insertBrandConfigSchema.partial().parse(req.body);
    
    const updated = await BrandService.updateBrandConfig(brandId, configData);
    if (!updated) {
      return res.status(404).json({ error: 'Brand configuration not found' });
    }
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating brand config:', error);
    res.status(400).json({ error: 'Failed to update brand configuration' });
  }
});

// Template endpoints for brand configuration
router.get('/api/admin/templates/hero', (req, res) => {
  const templates: HeroSectionTemplate[] = [
    {
      headline: "Transform Your Health Journey with AI",
      subheadline: "Get personalized health insights and coaching tailored to your unique needs",
      ctaText: "Start Your Assessment",
      trustBadges: ["FDA Compliant", "HIPAA Secure", "Clinically Validated"]
    },
    {
      headline: "Take Control of Your Wellness",
      subheadline: "Evidence-based health assessments powered by advanced AI technology",
      ctaText: "Begin Your Journey",
      trustBadges: ["Medical Grade", "Privacy Protected", "Scientifically Backed"]
    }
  ];
  res.json(templates);
});

router.get('/api/admin/templates/features', (req, res) => {
  const templates: FeatureTemplate[] = [
    {
      title: "Personalized Risk Assessment",
      description: "Advanced AI analyzes your responses to provide accurate risk insights",
      icon: "shield-check",
      benefits: ["Evidence-based scoring", "Personalized recommendations", "Regular updates"]
    },
    {
      title: "24/7 AI Health Coach",
      description: "Get instant answers and guidance from your personal AI health assistant",
      icon: "chat-bubble-left-right",
      benefits: ["Instant responses", "Personalized advice", "Learning algorithm"]
    },
    {
      title: "Progress Tracking",
      description: "Monitor your health improvements with detailed analytics",
      icon: "chart-bar",
      benefits: ["Visual dashboards", "Goal tracking", "Achievement system"]
    }
  ];
  res.json(templates);
});

router.get('/api/admin/templates/pricing', (req, res) => {
  const templates: PricingTierTemplate[] = [
    {
      name: "Starter",
      price: "$9.99",
      description: "Perfect for individuals starting their health journey",
      features: [
        "Health risk assessment",
        "Basic recommendations", 
        "Monthly reports"
      ],
      ctaText: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$19.99", 
      description: "Comprehensive health optimization for serious users",
      features: [
        "Everything in Starter",
        "Daily AI coaching",
        "Advanced analytics",
        "Priority support"
      ],
      ctaText: "Go Pro",
      popular: true
    }
  ];
  res.json(templates);
});

router.get('/api/admin/templates/faq', (req, res) => {
  const templates: FAQTemplate[] = [
    {
      question: "How accurate are the health assessments?",
      answer: "Our assessments are based on peer-reviewed medical research and validated against clinical studies.",
      category: "accuracy"
    },
    {
      question: "Is my health data secure?",
      answer: "Yes, we use enterprise-grade security with 256-bit SSL encryption and are fully HIPAA compliant.",
      category: "security"
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely! You can cancel your subscription at any time with no cancellation fees.",
      category: "billing"
    }
  ];
  res.json(templates);
});

// Get brand-specific translations (extends existing translation system)
router.get('/api/brand/translations/:language', async (req, res) => {
  try {
    const { language } = req.params;
    
    // Get base translations
    const baseTranslationsResponse = await fetch(`${req.protocol}://${req.get('host')}/api/translations/${language}`);
    const baseTranslations = await baseTranslationsResponse.json();
    
    // Override with brand-specific content if available
    if (req.brandConfig) {
      const brandTranslations = {
        ...baseTranslations,
        'hero.headline': req.brandConfig.heroHeadline,
        'hero.subheadline': req.brandConfig.heroSubheadline,
        'hero.cta': req.brandConfig.heroCtaText,
        'footer.description': req.brandConfig.companyDescription,
        'cta.final.headline': req.brandConfig.finalCtaHeadline,
        'cta.final.text': req.brandConfig.finalCtaText,
      };
      
      return res.json(brandTranslations);
    }
    
    res.json(baseTranslations);
  } catch (error) {
    console.error('Error fetching brand translations:', error);
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

export default router;