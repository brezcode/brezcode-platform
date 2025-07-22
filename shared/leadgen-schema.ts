import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ========================================
// LEADGEN.TO PLATFORM SCHEMA
// Separate database structure for leadgen users
// ========================================

// LeadGen Platform Users (separate from BrezCode users)
export const leadgenUsers = pgTable("leadgen_users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isEmailVerified: boolean("is_email_verified").default(false),
  subscriptionTier: text("subscription_tier").$type<"basic" | "pro" | "premium" | null>().default(null),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  isSubscriptionActive: boolean("is_subscription_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// LeadGen User Profiles (Business-focused, not health)
export const leadgenProfiles = pgTable("leadgen_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => leadgenUsers.id).notNull(),
  
  // Personal Information (Primary for business users)
  fullName: text("full_name"),
  location: text("location"),
  timezone: text("timezone"),
  phoneNumber: text("phone_number"),
  workStyle: text("work_style"),
  communicationPreference: text("communication_preference"),
  availabilityHours: text("availability_hours"),
  personalGoals: jsonb("personal_goals"), // Business/personal goals
  personalChallenges: jsonb("personal_challenges"),
  
  // Business Information (Core for LeadGen users)
  businessName: text("business_name"),
  industry: text("industry"),
  businessModel: text("business_model"),
  targetAudience: text("target_audience"),
  monthlyRevenue: text("monthly_revenue"),
  teamSize: text("team_size"),
  marketingChannels: jsonb("marketing_channels"),
  businessChallenges: jsonb("business_challenges"),
  businessGoals: jsonb("business_goals"),
  growthTimeline: text("growth_timeline"),
  marketingBudget: text("marketing_budget"),
  businessTools: jsonb("business_tools"),
  uniqueValue: text("unique_value"),
  customerAcquisition: text("customer_acquisition"),
  customerServiceNeeds: text("customer_service_needs"),
  preferences: jsonb("preferences"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// LeadGen Business Tools Usage & Analytics
export const leadgenDashboardStats = pgTable("leadgen_dashboard_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => leadgenUsers.id).notNull(),
  
  // Business automation metrics
  totalStrategies: integer("total_strategies").default(0),
  activeTools: integer("active_tools").default(0),
  completedActions: integer("completed_actions").default(0),
  customerInteractions: integer("customer_interactions").default(0),
  leadsGenerated: integer("leads_generated").default(0),
  salesClosed: integer("sales_closed").default(0),
  
  // AI assistant metrics
  aiConversations: integer("ai_conversations").default(0),
  avatarTrainingMinutes: integer("avatar_training_minutes").default(0),
  landingPagesCreated: integer("landing_pages_created").default(0),
  emailCampaignsSent: integer("email_campaigns_sent").default(0),
  smsCampaignsSent: integer("sms_campaigns_sent").default(0),
  
  lastLoginAt: timestamp("last_login_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// LeadGen Tool Usage Tracking
export const leadgenToolUsage = pgTable("leadgen_tool_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => leadgenUsers.id).notNull(),
  toolName: text("tool_name").notNull(), // 'ai_avatar', 'landing_page', 'lead_gen', 'crm', 'email', 'sms', etc.
  usageCount: integer("usage_count").default(0),
  lastUsed: timestamp("last_used"),
  isActive: boolean("is_active").default(true),
  configuration: jsonb("configuration"), // Tool-specific settings
  performanceMetrics: jsonb("performance_metrics"), // ROI, conversion rates, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// LeadGen AI Assistant Conversations
export const leadgenAiChats = pgTable("leadgen_ai_chats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => leadgenUsers.id).notNull(),
  conversationId: text("conversation_id").notNull(),
  messages: jsonb("messages").notNull(), // Array of chat messages
  aiPersonality: text("ai_personality"), // 'business_consultant', 'sales_assistant', etc.
  purpose: text("purpose"), // 'lead_generation', 'customer_service', 'training', etc.
  metrics: jsonb("metrics"), // Engagement, satisfaction, conversion data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// LeadGen Business Strategies & Recommendations
export const leadgenStrategies = pgTable("leadgen_strategies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => leadgenUsers.id).notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'marketing', 'sales', 'operations', 'growth'
  description: text("description").notNull(),
  actionSteps: jsonb("action_steps").notNull(),
  priority: text("priority").notNull(), // 'high', 'medium', 'low'
  estimatedImpact: text("estimated_impact"),
  timeline: text("timeline"),
  isCompleted: boolean("is_completed").default(false),
  automationAvailable: boolean("automation_available").default(false),
  results: jsonb("results"), // Track actual results vs predicted
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas for form validation
export const insertLeadgenUser = createInsertSchema(leadgenUsers);
export const insertLeadgenProfile = createInsertSchema(leadgenProfiles);
export const insertLeadgenStrategy = createInsertSchema(leadgenStrategies);

// Type exports
export type LeadgenUser = typeof leadgenUsers.$inferSelect;
export type InsertLeadgenUser = z.infer<typeof insertLeadgenUser>;
export type LeadgenProfile = typeof leadgenProfiles.$inferSelect;
export type LeadgenDashboardStats = typeof leadgenDashboardStats.$inferSelect;
export type LeadgenToolUsage = typeof leadgenToolUsage.$inferSelect;
export type LeadgenStrategy = typeof leadgenStrategies.$inferSelect;