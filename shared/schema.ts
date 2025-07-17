import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
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

// Knowledge Base for AI Memory and Learning
export const knowledgeBase = pgTable("knowledge_base", {
  id: serial("id").primaryKey(),
  category: varchar("category").notNull(), // 'medical_facts', 'user_prompts', 'corrections', 'references'
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  sourceFile: varchar("source_file"), // reference to uploaded files
  pageNumber: integer("page_number"), // for PDF references
  evidenceLevel: varchar("evidence_level").notNull(), // 'high', 'medium', 'low'
  tags: text("tags").array(), // for easy searching
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User feedback and corrections for continuous learning
export const userFeedback = pgTable("user_feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  reportId: integer("report_id").references(() => healthReports.id),
  feedbackType: varchar("feedback_type").notNull(), // 'correction', 'improvement', 'error_report'
  originalContent: text("original_content").notNull(),
  correctedContent: text("corrected_content"),
  userComment: text("user_comment").notNull(),
  isProcessed: boolean("is_processed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  firstName: true,
  lastName: true,
  email: true,
  password: true,
  quizAnswers: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
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

export const knowledgeBaseSchema = z.object({
  category: z.enum(['medical_facts', 'user_prompts', 'corrections', 'references']),
  title: z.string(),
  content: z.string(),
  sourceFile: z.string().optional(),
  pageNumber: z.number().optional(),
  evidenceLevel: z.enum(['high', 'medium', 'low']),
  tags: z.array(z.string()).optional(),
});

export const userFeedbackSchema = z.object({
  reportId: z.number(),
  feedbackType: z.enum(['correction', 'improvement', 'error_report']),
  originalContent: z.string(),
  correctedContent: z.string().optional(),
  userComment: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type EmailVerification = typeof emailVerifications.$inferSelect;
export type SubscriptionTier = "basic" | "pro" | "premium";
export type HealthReport = typeof healthReports.$inferSelect;
export type InsertHealthReport = typeof healthReports.$inferInsert;
export type KnowledgeBase = typeof knowledgeBase.$inferSelect;
export type InsertKnowledgeBase = typeof knowledgeBase.$inferInsert;
export type UserFeedback = typeof userFeedback.$inferSelect;
export type InsertUserFeedback = typeof userFeedback.$inferInsert;

// Internationalization Support
export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 5 }).notNull().unique(), // e.g., 'en', 'zh-CN', 'es'
  name: varchar("name", { length: 100 }).notNull(), // e.g., 'English', '中文', 'Español'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  languageCode: varchar("language_code", { length: 5 }).notNull().references(() => languages.code),
  key: varchar("key", { length: 200 }).notNull(), // e.g., 'quiz.question.age.title'
  value: text("value").notNull(), // Translated text
  context: varchar("context", { length: 100 }), // e.g., 'quiz', 'report', 'coaching'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  languageCode: varchar("language_code", { length: 5 }).notNull().default('en'),
  timezone: varchar("timezone", { length: 50 }).default('UTC'),
  dateFormat: varchar("date_format", { length: 20 }).default('MM/DD/YYYY'),
  notificationFrequency: varchar("notification_frequency").default('daily'), // daily, weekly, monthly
  preferredContactMethod: varchar("preferred_contact_method").default('email'), // email, sms, push
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily Coaching and Follow-up System
export const userCoachingSchedules = pgTable("user_coaching_schedules", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  frequency: varchar("frequency").notNull().default('daily'), // daily, weekly, monthly
  nextInteraction: timestamp("next_interaction").notNull(),
  lastInteraction: timestamp("last_interaction"),
  streakCount: integer("streak_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dailyInteractions = pgTable("daily_interactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: timestamp("date").notNull(),
  interactionType: varchar("interaction_type").notNull(), // 'tip', 'check_in', 'assessment', 'reminder'
  completed: boolean("completed").default(false),
  responseData: jsonb("response_data"), // User's response to daily check-in
  contentSent: text("content_sent"), // What was sent to user
  engagementScore: integer("engagement_score").default(0), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
});

export const coachingContent = pgTable("coaching_content", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  contentType: varchar("content_type").notNull(), // 'daily_tip', 'weekly_challenge', 'milestone'
  languageCode: varchar("language_code", { length: 5 }).notNull().default('en'),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  sentAt: timestamp("sent_at"),
  status: varchar("status").default('pending'), // 'pending', 'sent', 'read', 'engaged'
  targetProfile: varchar("target_profile"), // 'teenager', 'premenopausal', etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// User Analytics and Progress Tracking
export const userAnalytics = pgTable("user_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  eventType: varchar("event_type").notNull(), // 'quiz_completed', 'report_viewed', 'tip_engaged'
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  metadata: jsonb("metadata"), // Additional event data
  sessionId: varchar("session_id"),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address"),
});

export const healthProgress = pgTable("health_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  assessmentDate: timestamp("assessment_date").notNull(),
  healthScore: decimal("health_score", { precision: 5, scale: 2 }).notNull(),
  uncontrollableScore: decimal("uncontrollable_score", { precision: 5, scale: 2 }).notNull(),
  improvementAreas: text("improvement_areas").array(), // Areas where user can improve
  goalsAchieved: text("goals_achieved").array(), // Goals user has achieved
  nextMilestone: text("next_milestone"), // Next goal to work towards
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for new tables
export const userPreferencesSchema = z.object({
  languageCode: z.string().max(5).default('en'),
  timezone: z.string().max(50).default('UTC'),
  dateFormat: z.string().max(20).default('MM/DD/YYYY'),
  notificationFrequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  preferredContactMethod: z.enum(['email', 'sms', 'push']).default('email'),
});

export const dailyInteractionSchema = z.object({
  interactionType: z.enum(['tip', 'check_in', 'assessment', 'reminder']),
  completed: z.boolean().default(false),
  responseData: z.record(z.any()).optional(),
  contentSent: z.string().optional(),
  engagementScore: z.number().min(0).max(100).default(0),
});

export type Language = typeof languages.$inferSelect;
export type Translation = typeof translations.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = typeof userPreferences.$inferInsert;
export type UserCoachingSchedule = typeof userCoachingSchedules.$inferSelect;
export type DailyInteraction = typeof dailyInteractions.$inferSelect;
export type InsertDailyInteraction = typeof dailyInteractions.$inferInsert;
export type CoachingContent = typeof coachingContent.$inferSelect;
export type UserAnalytics = typeof userAnalytics.$inferSelect;
export type HealthProgress = typeof healthProgress.$inferSelect;
export type CoachingTip = typeof coachingTips.$inferSelect;
export type UserNotification = typeof userNotifications.$inferSelect;
