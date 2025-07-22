import { pgTable, serial, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User onboarding progress tracking
export const userOnboarding = pgTable("user_onboarding", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tourCompleted: boolean("tour_completed").default(false),
  currentStep: integer("current_step").default(0),
  stepsCompleted: jsonb("steps_completed").$type<string[]>().default([]),
  deviceType: text("device_type"), // 'mobile', 'tablet', 'desktop'
  tourStartedAt: timestamp("tour_started_at"),
  tourCompletedAt: timestamp("tour_completed_at"),
  skipCount: integer("skip_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Onboarding tour steps configuration
export const tourSteps = pgTable("tour_steps", {
  id: serial("id").primaryKey(),
  stepId: text("step_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetElement: text("target_element"), // CSS selector
  position: text("position").default("bottom"), // 'top', 'bottom', 'left', 'right'
  deviceTypes: jsonb("device_types").$type<string[]>().default(['mobile', 'tablet', 'desktop']),
  order: integer("order").notNull(),
  isRequired: boolean("is_required").default(false),
  actionType: text("action_type"), // 'click', 'scroll', 'highlight', 'modal'
  actionData: jsonb("action_data").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow()
});

// User preferences for onboarding
export const onboardingPreferences = pgTable("onboarding_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  showTipsOnMobile: boolean("show_tips_on_mobile").default(true),
  preferredTourSpeed: text("preferred_tour_speed").default("normal"), // 'slow', 'normal', 'fast'
  skipAdvancedFeatures: boolean("skip_advanced_features").default(false),
  language: text("language").default("en"),
  completedTours: jsonb("completed_tours").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Schema types
export const insertUserOnboardingSchema = createInsertSchema(userOnboarding);
export const insertTourStepSchema = createInsertSchema(tourSteps);
export const insertOnboardingPreferencesSchema = createInsertSchema(onboardingPreferences);

export type UserOnboarding = typeof userOnboarding.$inferSelect;
export type InsertUserOnboarding = z.infer<typeof insertUserOnboardingSchema>;
export type TourStep = typeof tourSteps.$inferSelect;
export type InsertTourStep = z.infer<typeof insertTourStepSchema>;
export type OnboardingPreferences = typeof onboardingPreferences.$inferSelect;
export type InsertOnboardingPreferences = z.infer<typeof insertOnboardingPreferencesSchema>;