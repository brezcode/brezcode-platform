import { pgTable, text, uuid, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Comprehensive business profiles for expert business consulting analysis
export const businessProfiles = pgTable("business_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  
  // Company Fundamentals
  businessName: text("business_name").notNull(),
  industry: text("industry").notNull(),
  businessType: text("business_type").notNull(),
  companySize: text("company_size").notNull(),
  businessStage: text("business_stage").notNull(),
  
  // Market & Competition
  targetAudience: text("target_audience").notNull(),
  uniqueValueProp: text("unique_value_prop").notNull(),
  mainCompetitors: jsonb("main_competitors").$type<string[]>().default([]),
  marketPosition: text("market_position").notNull(),
  
  // Financial Context
  currentRevenue: text("current_revenue").notNull(),
  revenueStreams: jsonb("revenue_streams").$type<string[]>().default([]),
  profitMargins: text("profit_margins").notNull(),
  cashFlowHealth: text("cash_flow_health").notNull(),
  marketingBudget: text("marketing_budget").notNull(),
  
  // Operations & Team
  teamSize: text("team_size").notNull(),
  keyRoles: jsonb("key_roles").$type<string[]>().default([]),
  operationalChallenges: jsonb("operational_challenges").$type<string[]>().default([]),
  currentTools: jsonb("current_tools").$type<string[]>().default([]),
  systemsNeeded: jsonb("systems_needed").$type<string[]>().default([]),
  
  // Marketing & Sales
  marketingChannels: jsonb("marketing_channels").$type<string[]>().default([]),
  salesProcess: text("sales_process").notNull(),
  customerAcquisitionCost: text("customer_acquisition_cost").notNull(),
  customerLifetimeValue: text("customer_lifetime_value").notNull(),
  conversionRates: text("conversion_rates").notNull(),
  
  // Goals & Vision
  primaryGoals: jsonb("primary_goals").$type<string[]>().default([]),
  timeline: text("timeline").notNull(),
  successMetrics: jsonb("success_metrics").$type<string[]>().default([]),
  growthTargets: text("growth_targets").notNull(),
  
  // Current Challenges & Pain Points
  businessChallenges: jsonb("business_challenges").$type<string[]>().default([]),
  urgentIssues: jsonb("urgent_issues").$type<string[]>().default([]),
  resourceLimitations: jsonb("resource_limitations").$type<string[]>().default([]),
  
  // Strategic Context
  riskTolerance: text("risk_tolerance").notNull(),
  changeReadiness: text("change_readiness").notNull(),
  innovationFocus: jsonb("innovation_focus").$type<string[]>().default([]),
  futureVision: text("future_vision").notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI-generated business strategies
export const businessStrategies = pgTable("business_strategies", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessProfileId: uuid("business_profile_id").notNull(),
  strategyTitle: text("strategy_title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // marketing, sales, operations, growth
  priority: text("priority").notNull(), // high, medium, low
  estimatedImpact: text("estimated_impact"), // revenue impact estimate
  timeToImplement: text("time_to_implement"), // days/weeks/months
  requiredResources: jsonb("required_resources").$type<string[]>().default([]),
  actionPlan: jsonb("action_plan").$type<{
    step: string;
    description: string;
    timeline: string;
    automatable: boolean;
  }[]>().default([]),
  kpiMetrics: jsonb("kpi_metrics").$type<string[]>().default([]),
  status: text("status").default("pending"), // pending, in_progress, completed, paused
  aiGenerated: boolean("ai_generated").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Strategy execution tracking
export const strategyExecutions = pgTable("strategy_executions", {
  id: uuid("id").primaryKey().defaultRandom(),
  strategyId: uuid("strategy_id").notNull(),
  actionStep: text("action_step").notNull(),
  status: text("status").notNull(), // pending, in_progress, completed, failed
  automationUsed: boolean("automation_used").default(false),
  results: jsonb("results").$type<Record<string, any>>().default({}),
  metrics: jsonb("metrics").$type<Record<string, number>>().default({}),
  notes: text("notes"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Onboarding quiz questions
export const onboardingQuestions = pgTable("onboarding_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull(), // single_choice, multiple_choice, text, number
  options: jsonb("options").$type<string[]>().default([]),
  category: text("category").notNull(), // business_basics, marketing, sales, operations
  order: integer("order").notNull(),
  required: boolean("required").default(true),
  active: boolean("active").default(true),
});

// User responses to onboarding
export const onboardingResponses = pgTable("onboarding_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  questionId: uuid("question_id").notNull(),
  response: jsonb("response").$type<string | string[] | number>(),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Comprehensive Zod schemas with detailed validation
export const insertBusinessProfileSchema = createInsertSchema(businessProfiles, {
  // Company Fundamentals
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  businessType: z.string().min(1, "Business type is required"),
  companySize: z.string().min(1, "Company size is required"),
  businessStage: z.string().min(1, "Business stage is required"),
  
  // Market & Competition
  targetAudience: z.string().min(10, "Please provide detailed target audience description"),
  uniqueValueProp: z.string().min(10, "Please describe your unique value proposition"),
  marketPosition: z.string().min(1, "Market position is required"),
  
  // Financial Context
  currentRevenue: z.string().min(1, "Revenue range is required"),
  profitMargins: z.string().min(1, "Profit margin range is required"),
  cashFlowHealth: z.string().min(1, "Cash flow assessment is required"),
  marketingBudget: z.string().min(1, "Marketing budget is required"),
  
  // Operations & Team
  teamSize: z.string().min(1, "Team size is required"),
  salesProcess: z.string().min(10, "Please describe your sales process"),
  customerAcquisitionCost: z.string().min(1, "Customer acquisition cost is required"),
  customerLifetimeValue: z.string().min(1, "Customer lifetime value is required"),
  conversionRates: z.string().min(1, "Conversion rate information is required"),
  
  // Goals & Vision
  timeline: z.string().min(1, "Timeline is required"),
  growthTargets: z.string().min(10, "Please describe growth targets"),
  riskTolerance: z.string().min(1, "Risk tolerance is required"),
  changeReadiness: z.string().min(1, "Change readiness assessment is required"),
  futureVision: z.string().min(20, "Please describe your 3-year vision"),
});

export const insertBusinessStrategySchema = createInsertSchema(businessStrategies);
export const insertStrategyExecutionSchema = createInsertSchema(strategyExecutions);
export const insertOnboardingQuestionSchema = createInsertSchema(onboardingQuestions);  
export const insertOnboardingResponseSchema = createInsertSchema(onboardingResponses);

// Types
export type BusinessProfile = typeof businessProfiles.$inferSelect;
export type InsertBusinessProfile = z.infer<typeof insertBusinessProfileSchema>;
export type BusinessStrategy = typeof businessStrategies.$inferSelect;
export type InsertBusinessStrategy = z.infer<typeof insertBusinessStrategySchema>;
export type StrategyExecution = typeof strategyExecutions.$inferSelect;
export type InsertStrategyExecution = z.infer<typeof insertStrategyExecutionSchema>;
export type OnboardingQuestion = typeof onboardingQuestions.$inferSelect;
export type InsertOnboardingQuestion = z.infer<typeof insertOnboardingQuestionSchema>;
export type OnboardingResponse = typeof onboardingResponses.$inferSelect;
export type InsertOnboardingResponse = z.infer<typeof insertOnboardingResponseSchema>;