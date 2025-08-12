import { Request } from "express";
import { db } from "./db";
import { brands, brandConfigs, type Brand, type BrandConfig } from "@shared/brand-schema";
import { eq, and } from "drizzle-orm";

export class BrandService {
  // Extract brand context from request (path-based or subdomain)
  static getBrandContext(req: Request): string | null {
    const host = req.get('host') || '';
    const path = req.path;
    
    // Handle specific domain routing
    if (host === 'www.brezcode.com' || host === 'brezcode.com') {
      return 'brezcode'; // Always return brezcode brand for brezcode.com domain
    }
    
    // Handle leadgen.to domain with path-based routing
    if (host === 'leadgen.to' || host === 'www.leadgen.to' || host.includes('localhost')) {
      // Check if path starts with brand name: /brezcode, /health, etc.
      const pathSegments = path.split('/').filter(Boolean);
      if (pathSegments.length > 0 && pathSegments[0] !== 'api' && pathSegments[0] !== 'admin') {
        return pathSegments[0]; // Return brand name from path
      }
      return null; // No brand for root leadgen.to landing page
    }
    
    // Check for subdomain pattern: brand.leadgen.to
    const subdomainMatch = host.match(/^([a-zA-Z0-9-]+)\.leadgen\.to$/);
    if (subdomainMatch && subdomainMatch[1] !== 'www') {
      return subdomainMatch[1];
    }
    
    // Legacy subdomain pattern: brand.brezcode.com
    const legacySubdomainMatch = host.match(/^([a-zA-Z0-9-]+)\.brezcode\./);
    if (legacySubdomainMatch) {
      return legacySubdomainMatch[1];
    }
    
    // Default to main brand
    return 'brezcode';
  }

  // Get brand by subdomain or domain
  static async getBrandByDomain(domain: string): Promise<Brand | null> {
    const [brand] = await db
      .select()
      .from(brands)
      .where(
        and(
          eq(brands.isActive, true),
          eq(brands.subdomain, domain)
        )
      )
      .limit(1);
    
    return brand || null;
  }

  // Get brand configuration
  static async getBrandConfig(brandId: string): Promise<BrandConfig | null> {
    const [config] = await db
      .select()
      .from(brandConfigs)
      .where(eq(brandConfigs.brandId, brandId))
      .limit(1);
    
    return config || null;
  }

  // Create default brand configuration template
  static getDefaultBrandConfig(): Partial<BrandConfig> {
    return {
      // Hero Section
      heroHeadline: "Transform Your Health Journey with AI-Powered Insights",
      heroSubheadline: "Get personalized health assessments and coaching tailored to your unique needs and lifestyle.",
      heroCtaText: "Start Your Assessment",
      trustBadges: ["FDA Compliant", "HIPAA Secure", "Clinically Validated"],
      
      // Branding
      primaryColor: "#0ea5e9",
      secondaryColor: "#f59e0b",
      fontFamily: "Inter",
      
      // How It Works
      howItWorksSteps: [
        {
          title: "Complete Assessment",
          description: "Answer our comprehensive health questionnaire in just 5 minutes",
          icon: "clipboard-list",
          order: 1
        },
        {
          title: "Get Personalized Report",
          description: "Receive detailed insights about your health risks and protective factors",
          icon: "chart-bar",
          order: 2
        },
        {
          title: "Follow AI Coaching",
          description: "Get daily personalized recommendations and track your progress",
          icon: "academic-cap",
          order: 3
        }
      ],
      
      // Features
      features: [
        {
          title: "Personalized Risk Assessment",
          description: "Advanced AI analyzes your responses to provide accurate risk insights",
          icon: "shield-check",
          benefits: ["Evidence-based scoring", "Personalized recommendations", "Regular updates"]
        },
        {
          title: "Daily AI Coaching",
          description: "Get personalized daily tips and guidance tailored to your health goals",
          icon: "user-group",
          benefits: ["24/7 availability", "Adaptive learning", "Progress tracking"]
        },
        {
          title: "Progress Tracking",
          description: "Monitor your health improvements with detailed analytics and insights",
          icon: "trending-up",
          benefits: ["Visual dashboards", "Goal setting", "Achievement milestones"]
        }
      ],
      
      // Testimonials
      testimonials: [
        {
          name: "Sarah Johnson",
          role: "Healthcare Professional",
          content: "This platform has revolutionized how I approach preventive health. The insights are incredibly accurate and actionable.",
          rating: 5
        },
        {
          name: "Michael Chen",
          role: "Wellness Enthusiast",
          content: "The personalized coaching has helped me make lasting changes to my lifestyle. Highly recommended!",
          rating: 5
        }
      ],
      reviewCount: "10,000+",
      averageRating: "4.8",
      
      // Technical Specifications
      technicalSpecs: [
        { spec: "Data Security", value: "256-bit SSL encryption" },
        { spec: "Compliance", value: "HIPAA, GDPR compliant" },
        { spec: "AI Model", value: "GPT-4 powered insights" },
        { spec: "Response Time", value: "< 3 seconds average" },
        { spec: "Uptime", value: "99.9% guaranteed" }
      ],
      
      // Pricing
      pricingTiers: [
        {
          name: "Basic",
          price: "$9.99",
          description: "Perfect for getting started with health insights",
          features: [
            "Health risk assessment",
            "Basic recommendations",
            "Monthly progress reports"
          ],
          ctaText: "Start Basic Plan",
          popular: false
        },
        {
          name: "Pro",
          price: "$19.99",
          description: "Comprehensive health coaching and tracking",
          features: [
            "Everything in Basic",
            "Daily AI coaching",
            "Advanced analytics",
            "Priority support"
          ],
          ctaText: "Choose Pro Plan",
          popular: true
        },
        {
          name: "Premium",
          price: "$39.99",
          description: "Full-featured health optimization platform",
          features: [
            "Everything in Pro",
            "Expert consultations",
            "Custom meal plans",
            "Family sharing",
            "API access"
          ],
          ctaText: "Go Premium",
          popular: false
        }
      ],
      
      // FAQ
      faqs: [
        {
          question: "How accurate are the health assessments?",
          answer: "Our assessments are based on peer-reviewed medical research and validated against clinical studies. While not a replacement for professional medical advice, they provide reliable insights for preventive health planning.",
          category: "accuracy"
        },
        {
          question: "Is my health data secure?",
          answer: "Yes, we use enterprise-grade security with 256-bit SSL encryption and are fully HIPAA compliant. Your data is never shared without your explicit consent.",
          category: "security"
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Absolutely! You can cancel your subscription at any time from your account settings. No cancellation fees or hidden charges.",
          category: "billing"
        }
      ],
      
      // Final CTA
      finalCtaHeadline: "Ready to Take Control of Your Health?",
      finalCtaText: "Start Your Journey Today",
      
      // Footer
      companyDescription: "Empowering individuals with AI-driven health insights and personalized coaching for proactive wellness management.",
      contactInfo: {
        email: "support@company.com",
        phone: "+1 (555) 123-4567",
        address: "123 Health St, Wellness City, WC 12345",
        socialLinks: {
          twitter: "https://twitter.com/company",
          linkedin: "https://linkedin.com/company/company"
        }
      }
    };
  }

  // Create a new brand with default configuration
  static async createBrand(brandData: {
    name: string;
    subdomain: string;
    customDomain?: string;
  }): Promise<{ brand: Brand; config: BrandConfig }> {
    // Create brand
    const [brand] = await db
      .insert(brands)
      .values(brandData)
      .returning();

    // Create default configuration
    const defaultConfig = this.getDefaultBrandConfig();
    const [config] = await db
      .insert(brandConfigs)
      .values({
        brandId: brand.id,
        ...defaultConfig
      })
      .returning();

    return { brand, config };
  }

  // Update brand configuration
  static async updateBrandConfig(
    brandId: string, 
    updates: Partial<BrandConfig>
  ): Promise<BrandConfig | null> {
    const [updated] = await db
      .update(brandConfigs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(brandConfigs.brandId, brandId))
      .returning();

    return updated || null;
  }
}