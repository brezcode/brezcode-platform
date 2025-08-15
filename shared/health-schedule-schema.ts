import { pgTable, text, varchar, jsonb, timestamp, boolean, uuid, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Health activity types and templates
export const healthActivityTemplates = pgTable("health_activity_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // exercise, self_exam, massage, wellness
  description: text("description").notNull(),
  instructions: jsonb("instructions").notNull(), // Step-by-step instructions
  duration: integer("duration").notNull(), // Duration in minutes
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // beginner, intermediate, advanced
  benefits: jsonb("benefits").notNull(), // Health benefits array
  precautions: jsonb("precautions"), // Safety considerations
  videoUrl: varchar("video_url", { length: 500 }),
  imageUrl: varchar("image_url", { length: 500 }),
  tags: jsonb("tags").default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer health schedules
export const healthSchedules = pgTable("health_schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").notNull(),
  customerId: uuid("customer_id").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scheduled activities for customers
export const scheduledActivities = pgTable("scheduled_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  scheduleId: uuid("schedule_id").notNull(),
  templateId: uuid("template_id").notNull(),
  scheduledDate: date("scheduled_date").notNull(),
  scheduledTime: varchar("scheduled_time", { length: 8 }), // HH:MM format
  status: varchar("status", { length: 20 }).default("pending"), // pending, completed, skipped, rescheduled
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  rating: integer("rating"), // 1-5 stars
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activity completion tracking
export const activityCompletions = pgTable("activity_completions", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").notNull(),
  customerId: uuid("customer_id").notNull(),
  templateId: uuid("template_id").notNull(),
  scheduledActivityId: uuid("scheduled_activity_id"),
  completedDate: date("completed_date").notNull(),
  duration: integer("duration"), // Actual duration in minutes
  intensity: varchar("intensity", { length: 20 }), // low, medium, high
  mood: varchar("mood", { length: 20 }), // how they felt after
  notes: text("notes"),
  achievements: jsonb("achievements"), // Milestones reached
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer health preferences and goals
export const healthPreferences = pgTable("health_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").notNull(),
  customerId: uuid("customer_id").notNull(),
  preferredTime: varchar("preferred_time", { length: 20 }), // morning, afternoon, evening
  reminderSettings: jsonb("reminder_settings").notNull(), // SMS, email, push preferences
  fitnessLevel: varchar("fitness_level", { length: 20 }).notNull(), // beginner, intermediate, advanced
  healthGoals: jsonb("health_goals").notNull(), // Array of goals
  medicalConditions: jsonb("medical_conditions"), // Conditions to consider
  availableDays: jsonb("available_days").notNull(), // Days of week available
  sessionDuration: integer("session_duration").default(30), // Preferred session length
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reminder notifications
export const healthReminders = pgTable("health_reminders", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").notNull(),
  customerId: uuid("customer_id").notNull(),
  scheduledActivityId: uuid("scheduled_activity_id").notNull(),
  reminderType: varchar("reminder_type", { length: 20 }).notNull(), // sms, email, push
  reminderTime: timestamp("reminder_time").notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).default("pending"), // pending, sent, failed
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Health streaks and achievements
export const healthStreaks = pgTable("health_streaks", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").notNull(),
  customerId: uuid("customer_id").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivityDate: date("last_activity_date"),
  totalActivities: integer("total_activities").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports
export type HealthActivityTemplate = typeof healthActivityTemplates.$inferSelect;
export type InsertHealthActivityTemplate = typeof healthActivityTemplates.$inferInsert;

export type HealthSchedule = typeof healthSchedules.$inferSelect;
export type InsertHealthSchedule = typeof healthSchedules.$inferInsert;

export type ScheduledActivity = typeof scheduledActivities.$inferSelect;
export type InsertScheduledActivity = typeof scheduledActivities.$inferInsert;

export type ActivityCompletion = typeof activityCompletions.$inferSelect;
export type InsertActivityCompletion = typeof activityCompletions.$inferInsert;

export type HealthPreferences = typeof healthPreferences.$inferSelect;
export type InsertHealthPreferences = typeof healthPreferences.$inferInsert;

export type HealthReminder = typeof healthReminders.$inferSelect;
export type InsertHealthReminder = typeof healthReminders.$inferInsert;

export type HealthStreak = typeof healthStreaks.$inferSelect;
export type InsertHealthStreak = typeof healthStreaks.$inferSelect;

// Zod schemas
export const insertHealthActivityTemplateSchema = createInsertSchema(healthActivityTemplates);
export const insertHealthScheduleSchema = createInsertSchema(healthSchedules);
export const insertScheduledActivitySchema = createInsertSchema(scheduledActivities);
export const insertActivityCompletionSchema = createInsertSchema(activityCompletions);
export const insertHealthPreferencesSchema = createInsertSchema(healthPreferences);

// Health preferences form schema
export const healthPreferencesFormSchema = z.object({
  preferredTime: z.enum(['morning', 'afternoon', 'evening']),
  reminderSettings: z.object({
    sms: z.boolean().default(true),
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    reminderMinutes: z.number().min(5).max(120).default(30),
  }),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  healthGoals: z.array(z.string()).min(1),
  medicalConditions: z.array(z.string()).optional(),
  availableDays: z.array(z.number().min(0).max(6)), // 0=Sunday, 6=Saturday
  sessionDuration: z.number().min(10).max(120).default(30),
});

// Activity completion form schema
export const activityCompletionSchema = z.object({
  scheduledActivityId: z.string().uuid(),
  duration: z.number().min(1),
  intensity: z.enum(['low', 'medium', 'high']),
  mood: z.enum(['energized', 'relaxed', 'tired', 'motivated', 'neutral']),
  notes: z.string().optional(),
  rating: z.number().min(1).max(5),
});

// Create schedule schema
export const createScheduleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  activities: z.array(z.object({
    templateId: z.string().uuid(),
    frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly']),
    preferredDays: z.array(z.number().min(0).max(6)).optional(),
    preferredTime: z.string().optional(),
  })),
});