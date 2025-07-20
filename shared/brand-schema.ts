import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  boolean,
  decimal,
  uuid,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

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

// Features available on the platform
export const features = pgTable("features", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }).notNull(), // "assessment", "coaching", "analytics", etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Brand feature enrollment - what features each brand has access to
export const brandFeatures = pgTable("brand_features", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").references(() => brands.id).notNull(),
  featureId: uuid("feature_id").references(() => features.id).notNull(),
  isEnabled: boolean("is_enabled").default(true),
  configuration: jsonb("configuration"), // Feature-specific settings
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Brand customers - each brand's isolated customer database
export const brandCustomers = pgTable("brand_customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").references(() => brands.id).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  username: varchar("username", { length: 100 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  profileData: jsonb("profile_data"), // Brand-specific profile fields
  preferences: jsonb("preferences"), // Language, notifications, etc.
  lastActive: timestamp("last_active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer subscriptions within each brand
export const brandCustomerSubscriptions = pgTable("brand_customer_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").references(() => brands.id).notNull(),
  customerId: uuid("customer_id").references(() => brandCustomers.id).notNull(),
  tier: varchar("tier", { length: 50 }).notNull(), // "basic", "pro", "premium"
  status: varchar("status", { length: 20 }).default("active"), // "active", "cancelled", "expired"
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 100 }),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer feature access - what features each customer has
export const brandCustomerFeatures = pgTable("brand_customer_features", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").references(() => brands.id).notNull(),
  customerId: uuid("customer_id").references(() => brandCustomers.id).notNull(),
  featureId: uuid("feature_id").references(() => features.id).notNull(),
  accessLevel: varchar("access_level", { length: 50 }).default("basic"), // "basic", "premium", "unlimited"
  usageCount: integer("usage_count").default(0),
  usageLimit: integer("usage_limit"), // null for unlimited
  lastUsed: timestamp("last_used"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer assessments (brand-specific)
export const brandCustomerAssessments = pgTable("brand_customer_assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").references(() => brands.id).notNull(),
  customerId: uuid("customer_id").references(() => brandCustomers.id).notNull(),
  assessmentType: varchar("assessment_type", { length: 100 }).notNull(),
  responses: jsonb("responses").notNull(), // Quiz answers
  results: jsonb("results"), // Calculated results/scores
  completedAt: timestamp("completed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer chat sessions (brand-specific)
export const brandCustomerChats = pgTable("brand_customer_chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").references(() => brands.id).notNull(),
  customerId: uuid("customer_id").references(() => brandCustomers.id).notNull(),
  sessionId: uuid("session_id").defaultRandom(),
  messages: jsonb("messages").notNull(), // Array of chat messages
  isActive: boolean("is_active").default(true),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer analytics (brand-specific)
export const brandCustomerAnalytics = pgTable("brand_customer_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").references(() => brands.id).notNull(),
  customerId: uuid("customer_id").references(() => brandCustomers.id).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  eventData: jsonb("event_data"),
  sessionId: varchar("session_id", { length: 100 }),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Define relations for proper joins
export const brandsRelations = relations(brands, ({ one, many }) => ({
  config: one(brandConfigs, {
    fields: [brands.id],
    references: [brandConfigs.brandId],
  }),
  quizConfig: one(brandQuizConfigs, {
    fields: [brands.id],
    references: [brandQuizConfigs.brandId],
  }),
  features: many(brandFeatures),
  customers: many(brandCustomers),
}));

export const brandCustomersRelations = relations(brandCustomers, ({ one, many }) => ({
  brand: one(brands, {
    fields: [brandCustomers.brandId],
    references: [brands.id],
  }),
  subscriptions: many(brandCustomerSubscriptions),
  features: many(brandCustomerFeatures),
  assessments: many(brandCustomerAssessments),
  chats: many(brandCustomerChats),
  analytics: many(brandCustomerAnalytics),
}));

export const featuresRelations = relations(features, ({ many }) => ({
  brandFeatures: many(brandFeatures),
  customerFeatures: many(brandCustomerFeatures),
}));

// Zod schemas for validation
export const insertBrandSchema = createInsertSchema(brands);
export const insertBrandConfigSchema = createInsertSchema(brandConfigs);
export const insertBrandQuizConfigSchema = createInsertSchema(brandQuizConfigs);
export const insertFeatureSchema = createInsertSchema(features);
export const insertBrandFeatureSchema = createInsertSchema(brandFeatures);
export const insertBrandCustomerSchema = createInsertSchema(brandCustomers);
export const insertBrandCustomerSubscriptionSchema = createInsertSchema(brandCustomerSubscriptions);
export const insertBrandCustomerFeatureSchema = createInsertSchema(brandCustomerFeatures);
export const insertBrandCustomerAssessmentSchema = createInsertSchema(brandCustomerAssessments);

// Types
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type BrandConfig = typeof brandConfigs.$inferSelect;
export type InsertBrandConfig = z.infer<typeof insertBrandConfigSchema>;
export type BrandQuizConfig = typeof brandQuizConfigs.$inferSelect;
export type InsertBrandQuizConfig = z.infer<typeof insertBrandQuizConfigSchema>;
export type Feature = typeof features.$inferSelect;
export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type BrandFeature = typeof brandFeatures.$inferSelect;
export type InsertBrandFeature = z.infer<typeof insertBrandFeatureSchema>;
export type BrandCustomer = typeof brandCustomers.$inferSelect;
export type InsertBrandCustomer = z.infer<typeof insertBrandCustomerSchema>;
export type BrandCustomerSubscription = typeof brandCustomerSubscriptions.$inferSelect;
export type InsertBrandCustomerSubscription = z.infer<typeof insertBrandCustomerSubscriptionSchema>;
export type BrandCustomerFeature = typeof brandCustomerFeatures.$inferSelect;
export type InsertBrandCustomerFeature = z.infer<typeof insertBrandCustomerFeatureSchema>;
export type BrandCustomerAssessment = typeof brandCustomerAssessments.$inferSelect;
export type InsertBrandCustomerAssessment = z.infer<typeof insertBrandCustomerAssessmentSchema>;

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