// BREZCODE HEALTH PLATFORM SCHEMA
// Separate database schema for breast health personal frontend app
// Database: brezcode_health_db

import { pgTable, text, integer, timestamp, boolean, decimal, jsonb, date, time, inet, serial } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

// BREZCODE USERS (Personal Health Users)
export const brezcodeUsers = pgTable('brezcode_users', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  isEmailVerified: boolean('is_email_verified').default(false),
  phone: text('phone'),
  dateOfBirth: date('date_of_birth'),
  profilePhoto: text('profile_photo'),
  emergencyContact: jsonb('emergency_contact'), // {name, phone, relationship}
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// HEALTH ASSESSMENTS & RISK ANALYSIS
export const brezcodeHealthAssessments = pgTable('brezcode_health_assessments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => brezcodeUsers.id).notNull(),
  assessmentType: text('assessment_type').default('breast_health'),
  quizAnswers: jsonb('quiz_answers').notNull(),
  riskScore: decimal('risk_score', { precision: 5, scale: 2 }),
  riskCategory: text('risk_category'), // 'low', 'moderate', 'high', 'very_high'
  userProfile: text('user_profile'), // 'teenager', 'premenopausal', 'postmenopausal', 'pregnant'
  bmi: decimal('bmi', { precision: 5, scale: 2 }),
  familyHistory: jsonb('family_history'),
  lifestyleFactors: jsonb('lifestyle_factors'),
  assessmentVersion: text('assessment_version').default('1.0'),
  completedAt: timestamp('completed_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow()
})

// PERSONALIZED HEALTH REPORTS
export const brezcodeHealthReports = pgTable('brezcode_health_reports', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => brezcodeUsers.id).notNull(),
  assessmentId: integer('assessment_id').references(() => brezcodeHealthAssessments.id).notNull(),
  reportTitle: text('report_title').notNull(),
  riskSummary: text('risk_summary').notNull(),
  keyRecommendations: text('key_recommendations').array().notNull(),
  riskFactors: text('risk_factors').array(),
  protectiveFactors: text('protective_factors').array(),
  screeningSchedule: jsonb('screening_schedule'), // {next_mammogram, next_clinical_exam, self_exam_frequency}
  lifestyleRecommendations: jsonb('lifestyle_recommendations'),
  dietarySuggestions: text('dietary_suggestions').array(),
  exercisePlan: jsonb('exercise_plan'),
  followUpTimeline: jsonb('follow_up_timeline'),
  doctorDiscussionPoints: text('doctor_discussion_points').array(),
  generatedAt: timestamp('generated_at').defaultNow(),
  expiresAt: timestamp('expires_at'), // When report should be refreshed
  createdAt: timestamp('created_at').defaultNow()
})

// DAILY HEALTH ACTIVITIES & COMPLIANCE
export const brezcodeDailyActivities = pgTable('brezcode_daily_activities', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => brezcodeUsers.id).notNull(),
  activityType: text('activity_type').notNull(), // 'self_exam', 'exercise', 'medication', 'nutrition'
  activityName: text('activity_name').notNull(),
  description: text('description'),
  recommendedFrequency: text('recommended_frequency'), // 'daily', 'weekly', 'monthly'
  isCompleted: boolean('is_completed').default(false),
  completionDate: date('completion_date'),
  completionNotes: text('completion_notes'),
  reminderTime: time('reminder_time'),
  scheduledDate: date('scheduled_date').defaultNow(),
  streakCount: integer('streak_count').default(0),
  createdAt: timestamp('created_at').defaultNow()
})

// HEALTH METRICS TRACKING
export const brezcodeHealthMetrics = pgTable('brezcode_health_metrics', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => brezcodeUsers.id).notNull(),
  metricType: text('metric_type').notNull(), // 'weight', 'mood', 'energy', 'symptoms', 'pain_level'
  value: decimal('value', { precision: 10, scale: 2 }),
  textValue: text('text_value'), // For qualitative metrics
  unit: text('unit'),
  severityLevel: integer('severity_level'), // 1-10 scale for symptoms/pain
  bodyLocation: text('body_location'), // For symptom tracking
  notes: text('notes'),
  recordedDate: date('recorded_date').defaultNow(),
  recordedTime: time('recorded_time').defaultNow(),
  createdAt: timestamp('created_at').defaultNow()
})

// AI HEALTH COACHING SESSIONS (Dr. Sakura)
export const brezcodeAiCoachingSessions = pgTable('brezcode_ai_coaching_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => brezcodeUsers.id).notNull(),
  sessionId: text('session_id').notNull().unique(),
  aiCoachName: text('ai_coach_name').default('Dr. Sakura'),
  conversationHistory: jsonb('conversation_history').default([]),
  sessionFocus: text('session_focus'), // 'risk_discussion', 'lifestyle_coaching', 'emotional_support'
  moodBefore: integer('mood_before'), // 1-10 scale
  moodAfter: integer('mood_after'), // 1-10 scale
  keyInsights: text('key_insights').array(),
  actionItems: text('action_items').array(),
  followUpNeeded: boolean('follow_up_needed').default(false),
  followUpDate: date('follow_up_date'),
  sessionDuration: integer('session_duration'), // minutes
  satisfactionRating: integer('satisfaction_rating'), // 1-5 stars
  startedAt: timestamp('started_at').defaultNow(),
  endedAt: timestamp('ended_at'),
  createdAt: timestamp('created_at').defaultNow()
})

// HEALTH REMINDERS & NOTIFICATIONS
export const brezcodeHealthReminders = pgTable('brezcode_health_reminders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => brezcodeUsers.id).notNull(),
  reminderType: text('reminder_type').notNull(), // 'self_exam', 'appointment', 'medication', 'checkup'
  title: text('title').notNull(),
  message: text('message').notNull(),
  reminderDate: date('reminder_date').notNull(),
  reminderTime: time('reminder_time'),
  isRecurring: boolean('is_recurring').default(false),
  recurrencePattern: text('recurrence_pattern'), // 'daily', 'weekly', 'monthly', 'yearly'
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  isDismissed: boolean('is_dismissed').default(false),
  dismissedAt: timestamp('dismissed_at'),
  priorityLevel: text('priority_level').default('medium'), // 'low', 'medium', 'high', 'urgent'
  createdAt: timestamp('created_at').defaultNow()
})

// SUBSCRIPTION & PREMIUM FEATURES
export const brezcodeSubscriptions = pgTable('brezcode_subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => brezcodeUsers.id).notNull(),
  planType: text('plan_type').notNull(), // 'free', 'premium', 'family'
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  isActive: boolean('is_active').default(false),
  currentPeriodStart: date('current_period_start'),
  currentPeriodEnd: date('current_period_end'),
  cancelledAt: timestamp('cancelled_at'),
  premiumFeaturesEnabled: text('premium_features_enabled').array(), // ['ai_coaching', 'detailed_reports', 'family_sharing']
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// AUTHENTICATION & SECURITY
export const brezcodeUserSessions = pgTable('brezcode_user_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => brezcodeUsers.id).notNull(),
  sessionToken: text('session_token').notNull().unique(),
  deviceInfo: jsonb('device_info'), // {device_type, browser, os}
  ipAddress: inet('ip_address'),
  location: jsonb('location'), // {city, country} for security monitoring
  isActive: boolean('is_active').default(true),
  lastActivity: timestamp('last_activity').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

// ZOD SCHEMAS FOR VALIDATION
export const insertBrezcodeUserSchema = createInsertSchema(brezcodeUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const insertBrezcodeHealthAssessmentSchema = createInsertSchema(brezcodeHealthAssessments).omit({
  id: true,
  completedAt: true,
  createdAt: true
})

export const insertBrezcodeHealthReportSchema = createInsertSchema(brezcodeHealthReports).omit({
  id: true,
  generatedAt: true,
  createdAt: true
})

export const insertBrezcodeDailyActivitySchema = createInsertSchema(brezcodeDailyActivities).omit({
  id: true,
  createdAt: true
})

export const insertBrezcodeHealthMetricSchema = createInsertSchema(brezcodeHealthMetrics).omit({
  id: true,
  recordedDate: true,
  recordedTime: true,
  createdAt: true
})

export const insertBrezcodeAiCoachingSessionSchema = createInsertSchema(brezcodeAiCoachingSessions).omit({
  id: true,
  startedAt: true,
  createdAt: true
})

// TYPE EXPORTS
export type BrezcodeUser = typeof brezcodeUsers.$inferSelect
export type InsertBrezcodeUser = z.infer<typeof insertBrezcodeUserSchema>

export type BrezcodeHealthAssessment = typeof brezcodeHealthAssessments.$inferSelect
export type InsertBrezcodeHealthAssessment = z.infer<typeof insertBrezcodeHealthAssessmentSchema>

export type BrezcodeHealthReport = typeof brezcodeHealthReports.$inferSelect
export type InsertBrezcodeHealthReport = z.infer<typeof insertBrezcodeHealthReportSchema>

export type BrezcodeDailyActivity = typeof brezcodeDailyActivities.$inferSelect
export type InsertBrezcodeDailyActivity = z.infer<typeof insertBrezcodeDailyActivitySchema>

export type BrezcodeHealthMetric = typeof brezcodeHealthMetrics.$inferSelect
export type InsertBrezcodeHealthMetric = z.infer<typeof insertBrezcodeHealthMetricSchema>

export type BrezcodeAiCoachingSession = typeof brezcodeAiCoachingSessions.$inferSelect
export type InsertBrezcodeAiCoachingSession = z.infer<typeof insertBrezcodeAiCoachingSessionSchema>