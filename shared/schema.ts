import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isEmailVerified: boolean("is_email_verified").default(false),
  quizAnswers: jsonb("quiz_answers"),
  subscriptionTier: text("subscription_tier").$type<"basic" | "pro" | "premium" | null>().default(null),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  isSubscriptionActive: boolean("is_subscription_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emailVerifications = pgTable("email_verifications", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Health Reports and Risk Assessment
export const healthReports = pgTable("health_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
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

// Coaching Tips and Notifications
export const coachingTips = pgTable("coaching_tips", {
  id: serial("id").primaryKey(),
  category: varchar("category").notNull(), // 'nutrition', 'exercise', 'stress', 'prevention'
  targetProfile: varchar("target_profile").notNull(),
  riskLevel: varchar("risk_level").notNull(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  frequency: varchar("frequency").default("daily"), // 'daily', 'weekly', 'monthly'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userNotifications = pgTable("user_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: varchar("type").notNull(), // 'reminder', 'tip', 'assessment', 'report'
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  readAt: timestamp("read_at"),
  status: varchar("status").default("pending"), // 'pending', 'sent', 'read', 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  quizAnswers: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  quizAnswers: z.record(z.any()),
});

export const emailVerificationSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Code must be 6 digits"),
});

// Phone verification schema removed

// Zod schemas for health reports
export const healthReportSchema = z.object({
  quizAnswers: z.record(z.any()),
  riskScore: z.number(),
  riskCategory: z.enum(['low', 'moderate', 'high']),
  userProfile: z.enum(['teenager', 'premenopausal', 'postmenopausal', 'current_patient', 'survivor']),
  riskFactors: z.array(z.string()),
  recommendations: z.array(z.string()),
  dailyPlan: z.record(z.any()),
});

export const coachingTipSchema = z.object({
  category: z.string(),
  targetProfile: z.string(),
  riskLevel: z.string(),
  title: z.string(),
  content: z.string(),
  frequency: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type EmailVerification = typeof emailVerifications.$inferSelect;
export type SubscriptionTier = "basic" | "pro" | "premium";
export type HealthReport = typeof healthReports.$inferSelect;
export type InsertHealthReport = typeof healthReports.$inferInsert;
export type CoachingTip = typeof coachingTips.$inferSelect;
export type UserNotification = typeof userNotifications.$inferSelect;
