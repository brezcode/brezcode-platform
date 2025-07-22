import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ========================================
// BREZCODE PLATFORM SCHEMA
// Separate database structure for BrezCode health users
// ========================================

// BrezCode Users (health-focused, separate from LeadGen users)
export const brezcodeUsers = pgTable("brezcode_users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isEmailVerified: boolean("is_email_verified").default(false),
  
  // Health-specific fields
  quizAnswers: jsonb("quiz_answers"),
  healthProfile: text("health_profile"), // 'teenager', 'premenopausal', 'postmenopausal', 'current_patient', 'survivor'
  riskLevel: text("risk_level"), // 'low', 'moderate', 'high'
  
  subscriptionTier: text("subscription_tier").$type<"basic" | "pro" | "premium" | null>().default(null),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  isSubscriptionActive: boolean("is_subscription_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// BrezCode Health Reports and Risk Assessment
export const brezcodeHealthReports = pgTable("brezcode_health_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => brezcodeUsers.id),
  quizAnswers: jsonb("quiz_answers").notNull(),
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }).notNull(),
  riskCategory: varchar("risk_category").notNull(), // 'low', 'moderate', 'high'
  userProfile: varchar("user_profile").notNull(), // 'teenager', 'premenopausal', 'postmenopausal', 'current_patient', 'survivor'
  riskFactors: jsonb("risk_factors").notNull(), // Array of identified risk factors
  recommendations: jsonb("recommendations").notNull(),
  dailyPlan: jsonb("daily_plan").notNull(),
  reportData: jsonb("report_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// BrezCode Health Dashboard Stats
export const brezcodeDashboardStats = pgTable("brezcode_dashboard_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => brezcodeUsers.id).notNull(),
  
  // Health-specific metrics
  weeklyGoalProgress: integer("weekly_goal_progress").default(0),
  currentStreak: integer("current_streak").default(0),
  totalActivities: integer("total_activities").default(0),
  weeklyMinutes: integer("weekly_minutes").default(0),
  healthScore: integer("health_score").default(0),
  
  // Assessment metrics
  completedAssessments: integer("completed_assessments").default(0),
  lastAssessmentDate: timestamp("last_assessment_date"),
  riskImprovementScore: decimal("risk_improvement_score", { precision: 5, scale: 2 }),
  
  lastLoginAt: timestamp("last_login_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// BrezCode Health Activities
export const brezcodeHealthActivities = pgTable("brezcode_health_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => brezcodeUsers.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'exercise', 'self_exam', 'nutrition', 'stress_management'
  duration: integer("duration").notNull(), // minutes
  instructions: text("instructions"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// BrezCode Apple Health Integration
export const brezcodeHealthMetrics = pgTable("brezcode_health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => brezcodeUsers.id).notNull(),
  metricType: text("metric_type").notNull(), // 'heart_rate', 'steps', 'calories', 'sleep'
  value: real("value").notNull(),
  unit: text("unit").notNull(),
  recordedAt: timestamp("recorded_at").notNull(),
  source: text("source").default('apple_health'),
  createdAt: timestamp("created_at").defaultNow(),
});

// BrezCode AI Health Conversations
export const brezcodeAiChats = pgTable("brezcode_ai_chats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => brezcodeUsers.id).notNull(),
  conversationId: text("conversation_id").notNull(),
  messages: jsonb("messages").notNull(), // Array of health chat messages
  healthFocus: text("health_focus"), // 'breast_health', 'general_wellness', 'risk_assessment'
  riskContext: jsonb("risk_context"), // User's current risk factors for context
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// BrezCode Coaching Tips
export const brezcodeCoachingTips = pgTable("brezcode_coaching_tips", {
  id: serial("id").primaryKey(),
  category: varchar("category").notNull(), // 'nutrition', 'exercise', 'stress', 'prevention'
  targetProfile: varchar("target_profile").notNull(),
  riskLevel: varchar("risk_level").notNull(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  actionable: boolean("actionable").default(true),
  evidenceBased: boolean("evidence_based").default(true),
  frequency: varchar("frequency").notNull(), // 'daily', 'weekly', 'monthly'
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas
export const insertBrezcodeUser = createInsertSchema(brezcodeUsers);
export const insertBrezcodeHealthReport = createInsertSchema(brezcodeHealthReports);
export const insertBrezcodeHealthActivity = createInsertSchema(brezcodeHealthActivities);

// Type exports
export type BrezcodeUser = typeof brezcodeUsers.$inferSelect;
export type InsertBrezcodeUser = z.infer<typeof insertBrezcodeUser>;
export type BrezcodeHealthReport = typeof brezcodeHealthReports.$inferSelect;
export type BrezcodeDashboardStats = typeof brezcodeDashboardStats.$inferSelect;
export type BrezcodeHealthActivity = typeof brezcodeHealthActivities.$inferSelect;
export type BrezcodeHealthMetrics = typeof brezcodeHealthMetrics.$inferSelect;