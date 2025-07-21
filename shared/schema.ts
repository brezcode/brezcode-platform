import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Import brand schema for multi-tenancy
export * from "./brand-schema";

// Import health schedule schema for health planning
export * from "./health-schedule-schema";

// Import business schema for business automation
export * from "./business-schema";

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

// User Profile and Business Information
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  businessName: text("business_name"),
  industry: text("industry"),
  businessModel: text("business_model"),
  targetAudience: text("target_audience"),
  monthlyRevenue: text("monthly_revenue"),
  teamSize: text("team_size"),
  marketingChannels: jsonb("marketing_channels"), // Array of channels
  businessChallenges: jsonb("business_challenges"), // Array of challenges
  businessGoals: jsonb("business_goals"), // Array of goals
  growthTimeline: text("growth_timeline"),
  marketingBudget: text("marketing_budget"),
  businessTools: jsonb("business_tools"), // Array of tools
  uniqueValue: text("unique_value"),
  customerAcquisition: text("customer_acquisition"),
  customerServiceNeeds: text("customer_service_needs"),
  preferences: jsonb("preferences"), // User preferences and settings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dashboard and Tools Usage Tracking
export const userDashboardStats = pgTable("user_dashboard_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  totalStrategies: integer("total_strategies").default(0),
  activeTools: integer("active_tools").default(0),
  completedActions: integer("completed_actions").default(0),
  customerInteractions: integer("customer_interactions").default(0),
  leadsGenerated: integer("leads_generated").default(0),
  salesClosed: integer("sales_closed").default(0),
  lastLoginAt: timestamp("last_login_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tool and Assistant Usage
export const userToolUsage = pgTable("user_tool_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  toolName: text("tool_name").notNull(), // 'ai_avatar', 'landing_page', 'lead_gen', 'crm', 'email', 'sms', etc.
  usageCount: integer("usage_count").default(0),
  lastUsed: timestamp("last_used"),
  isActive: boolean("is_active").default(true),
  configuration: jsonb("configuration"), // Tool-specific settings
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

// Apple Watch and Health Data Integration
export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  date: timestamp("date").notNull(),
  // Heart Rate Data
  heartRateResting: integer("heart_rate_resting"), // bpm
  heartRateMax: integer("heart_rate_max"), // bpm
  heartRateVariability: real("heart_rate_variability"), // milliseconds
  // Activity Data
  steps: integer("steps"),
  distanceWalking: real("distance_walking"), // kilometers
  caloriesBurned: integer("calories_burned"),
  activeMinutes: integer("active_minutes"),
  exerciseMinutes: integer("exercise_minutes"),
  standHours: integer("stand_hours"),
  // Sleep Data
  sleepDuration: real("sleep_duration"), // hours
  sleepQuality: varchar("sleep_quality"), // 'poor', 'fair', 'good', 'excellent'
  // Health Metrics
  weight: real("weight"), // kg
  bodyFat: real("body_fat"), // percentage
  bloodPressureSystolic: integer("blood_pressure_systolic"),
  bloodPressureDiastolic: integer("blood_pressure_diastolic"),
  // Stress and Recovery
  stressLevel: varchar("stress_level"), // 'low', 'moderate', 'high'
  recoveryScore: integer("recovery_score"), // 0-100
  // Raw data from Apple Health
  rawHealthData: jsonb("raw_health_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Health Data Sync Settings
export const healthDataSync = pgTable("health_data_sync", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  isAppleHealthEnabled: boolean("is_apple_health_enabled").default(false),
  isAppleWatchConnected: boolean("is_apple_watch_connected").default(false),
  lastSyncAt: timestamp("last_sync_at"),
  syncFrequency: varchar("sync_frequency").default("daily"), // 'hourly', 'daily', 'weekly'
  enabledMetrics: jsonb("enabled_metrics").default([]), // Array of metric types to sync
  syncErrors: jsonb("sync_errors"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// Brand Knowledge Base Tables for Multi-Brand AI Training
export const brandKnowledgeBase = pgTable('brand_knowledge_base', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brandId: text('brand_id').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(), // e.g., 'health_guidance', 'procedures', 'faq', 'medical_info'
  fileType: text('file_type'), // pdf, txt, docx, etc.
  fileName: text('file_name'),
  tags: text('tags').array(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const brandChatSessions = pgTable('brand_chat_sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brandId: text('brand_id').notNull(),
  sessionId: text('session_id').notNull(),
  userId: text('user_id'), // Optional: link to authenticated user
  language: text('language').default('en'),
  createdAt: timestamp('created_at').defaultNow(),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
});

export const brandChatMessages = pgTable('brand_chat_messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  sessionId: text('session_id').notNull(),
  brandId: text('brand_id').notNull(),
  role: text('role').notNull(), // 'user' or 'assistant'
  content: text('content').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
  knowledgeUsed: text('knowledge_used').array(), // IDs of knowledge base entries used
});

export const brandAiConfig = pgTable('brand_ai_config', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  brandId: text('brand_id').notNull().unique(),
  assistantName: text('assistant_name').default('AI Health Assistant'),
  systemPrompt: text('system_prompt'),
  temperature: real('temperature').default(0.7),
  maxTokens: integer('max_tokens').default(500),
  model: text('model').default('gpt-4o'),
  expertise: text('expertise').notNull(), // e.g., 'breast_health', 'general_health', 'fitness', 'nutrition'
  personality: text('personality'), // assistant personality traits
  disclaimers: text('disclaimers').array(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
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

// Brand Knowledge Base Types
export type BrandKnowledgeBase = typeof brandKnowledgeBase.$inferSelect;
export type InsertBrandKnowledgeBase = typeof brandKnowledgeBase.$inferInsert;
export type BrandChatSession = typeof brandChatSessions.$inferSelect;
export type InsertBrandChatSession = typeof brandChatSessions.$inferInsert;
export type BrandChatMessage = typeof brandChatMessages.$inferSelect;
export type InsertBrandChatMessage = typeof brandChatMessages.$inferInsert;
export type BrandAiConfig = typeof brandAiConfig.$inferSelect;
export type InsertBrandAiConfig = typeof brandAiConfig.$inferInsert;

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
