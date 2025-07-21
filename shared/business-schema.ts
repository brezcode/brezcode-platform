import { pgTable, text, uuid, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Business onboarding and analysis
export const businessProfiles = pgTable("business_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  businessName: text("business_name").notNull(),
  industry: text("industry").notNull(),
  businessType: text("business_type").notNull(), // B2B, B2C, B2B2C
  targetAudience: text("target_audience").notNull(),
  currentRevenue: text("current_revenue"), // ranges like 0-10k, 10k-50k, etc.
  teamSize: integer("team_size"),
  marketingChannels: jsonb("marketing_channels").$type<string[]>().default([]),
  currentChallenges: jsonb("current_challenges").$type<string[]>().default([]),
  goals: jsonb("goals").$type<string[]>().default([]),
  timeline: text("timeline"), // 3 months, 6 months, 1 year
  budget: text("budget"), // marketing budget ranges
  currentTools: jsonb("current_tools").$type<string[]>().default([]),
  competitorAnalysis: jsonb("competitor_analysis").$type<Record<string, any>>().default({}),
  uniqueValueProp: text("unique_value_prop"),
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

// Zod schemas for validation
export const insertBusinessProfileSchema = createInsertSchema(businessProfiles);
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