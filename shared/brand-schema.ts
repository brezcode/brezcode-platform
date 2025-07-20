import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  boolean,
  decimal,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Brand/Organization table for multi-tenancy
export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  subdomain: varchar("subdomain", { length: 100 }).unique().notNull(), // e.g., "acme" for acme.brezcode.com
  customDomain: varchar("custom_domain", { length: 255 }), // e.g., "health.acme.com"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Brand configuration for customizable content
export const brandConfigs = pgTable("brand_configs", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").references(() => brands.id).notNull(),
  
  // Hero Section
  heroHeadline: text("hero_headline").notNull(),
  heroSubheadline: text("hero_subheadline").notNull(),
  heroCtaText: varchar("hero_cta_text", { length: 100 }).notNull(),
  heroImageUrl: varchar("hero_image_url", { length: 500 }),
  trustBadges: jsonb("trust_badges"), // Array of trust badges/certifications
  
  // Branding
  logoUrl: varchar("logo_url", { length: 500 }),
  primaryColor: varchar("primary_color", { length: 7 }).default("#0ea5e9"), // hex color
  secondaryColor: varchar("secondary_color", { length: 7 }).default("#f59e0b"),
  fontFamily: varchar("font_family", { length: 100 }).default("Inter"),
  
  // How It Works Section
  howItWorksSteps: jsonb("how_it_works_steps"), // Array of steps with icons/descriptions
  
  // Features Section
  features: jsonb("features"), // Array of feature objects
  
  // Testimonials/Reviews
  testimonials: jsonb("testimonials"), // Array of customer testimonials
  reviewCount: text("review_count"),
  averageRating: decimal("average_rating", { precision: 2, scale: 1 }),
  
  // Technical Specifications
  technicalSpecs: jsonb("technical_specs"), // Array of technical details
  
  // Pricing
  pricingTiers: jsonb("pricing_tiers"), // Array of pricing tier objects
  
  // FAQ
  faqs: jsonb("faqs"), // Array of FAQ objects
  
  // Final CTA
  finalCtaHeadline: text("final_cta_headline").notNull(),
  finalCtaText: varchar("final_cta_text", { length: 100 }).notNull(),
  
  // Footer
  companyDescription: text("company_description").notNull(),
  contactInfo: jsonb("contact_info"), // Contact details, social links
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Brand-specific quiz configurations
export const brandQuizConfigs = pgTable("brand_quiz_configs", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").references(() => brands.id).notNull(),
  
  quizTitle: varchar("quiz_title", { length: 255 }).notNull(),
  quizDescription: text("quiz_description").notNull(),
  healthFocus: varchar("health_focus", { length: 100 }).notNull(), // "breast", "heart", "mental", etc.
  
  // Customizable questions (can override default ones)
  customQuestions: jsonb("custom_questions"), // Array of question objects
  
  // Risk factors and scoring
  riskFactors: jsonb("risk_factors"), // Configurable risk calculation rules
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User sessions linked to brands
export const brandUsers = pgTable("brand_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull(), // References users.id
  brandId: uuid("brand_id").references(() => brands.id).notNull(),
  isSubscribed: boolean("is_subscribed").default(false),
  subscriptionTier: varchar("subscription_tier", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const insertBrandSchema = createInsertSchema(brands);
export const insertBrandConfigSchema = createInsertSchema(brandConfigs);
export const insertBrandQuizConfigSchema = createInsertSchema(brandQuizConfigs);
export const insertBrandUserSchema = createInsertSchema(brandUsers);

// Types
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type BrandConfig = typeof brandConfigs.$inferSelect;
export type InsertBrandConfig = z.infer<typeof insertBrandConfigSchema>;
export type BrandQuizConfig = typeof brandQuizConfigs.$inferSelect;
export type InsertBrandQuizConfig = z.infer<typeof insertBrandQuizConfigSchema>;
export type BrandUser = typeof brandUsers.$inferSelect;
export type InsertBrandUser = z.infer<typeof insertBrandUserSchema>;

// Template interfaces for brand configuration
export interface HeroSectionTemplate {
  headline: string;
  subheadline: string;
  ctaText: string;
  imageUrl?: string;
  trustBadges?: string[];
}

export interface HowItWorksStep {
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface FeatureTemplate {
  title: string;
  description: string;
  icon: string;
  benefits?: string[];
}

export interface TestimonialTemplate {
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
  imageUrl?: string;
}

export interface PricingTierTemplate {
  name: string;
  price: string;
  description: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
}

export interface FAQTemplate {
  question: string;
  answer: string;
  category?: string;
}