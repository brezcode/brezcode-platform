import { pgTable, text, integer, timestamp, boolean, json, serial, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// BrezCode Health Platform Tables
export const brezcodeUsers = pgTable("brezcode_users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  age: integer("age"),
  phone: text("phone"),
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationCode: text("email_verification_code"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const brezcodeHealthProfiles = pgTable("brezcode_health_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => brezcodeUsers.id).notNull(),
  age: integer("age"),
  country: text("country"),
  ethnicity: text("ethnicity"),
  familyHistory: text("family_history"),
  height: decimal("height", { precision: 5, scale: 2 }),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  bmi: decimal("bmi", { precision: 5, scale: 2 }),
  exerciseHabits: text("exercise_habits"),
  dietaryPreferences: text("dietary_preferences"),
  medicalHistory: json("medical_history"),
  riskFactors: json("risk_factors").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const brezcodeAssessments = pgTable("brezcode_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => brezcodeUsers.id).notNull(),
  assessmentType: text("assessment_type").notNull(), // breast_health, wellness, screening
  responses: json("responses").notNull(),
  riskScore: integer("risk_score"),
  riskCategory: text("risk_category"), // low, moderate, high
  recommendations: json("recommendations").$type<string[]>(),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const brezcodeHealthReports = pgTable("brezcode_health_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => brezcodeUsers.id).notNull(),
  assessmentId: integer("assessment_id").references(() => brezcodeAssessments.id),
  reportType: text("report_type").notNull(), // risk_assessment, wellness_plan, screening_guide
  content: json("content").notNull(),
  personalizedPlan: json("personalized_plan"),
  followUpDate: timestamp("follow_up_date"),
  isShared: boolean("is_shared").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const brezcodeWellnessPlans = pgTable("brezcode_wellness_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => brezcodeUsers.id).notNull(),
  planName: text("plan_name").notNull(),
  planType: text("plan_type").notNull(), // daily, weekly, monthly
  activities: json("activities").notNull(),
  goals: json("goals").$type<string[]>(),
  duration: integer("duration"), // in days
  progress: json("progress"),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const brezcodeHealthMetrics = pgTable("brezcode_health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => brezcodeUsers.id).notNull(),
  metricType: text("metric_type").notNull(), // weight, exercise, sleep, mood, symptoms
  value: text("value").notNull(),
  unit: text("unit"),
  notes: text("notes"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const brezcodeEducationalContent = pgTable("brezcode_educational_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  contentType: text("content_type").notNull(), // article, video, infographic, quiz
  category: text("category").notNull(), // prevention, screening, lifestyle, nutrition
  content: text("content").notNull(),
  tags: json("tags").$type<string[]>(),
  difficulty: text("difficulty"), // beginner, intermediate, advanced
  estimatedReadTime: integer("estimated_read_time"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert and Select Schemas
export const insertBrezcodeUserSchema = createInsertSchema(brezcodeUsers);
export const selectBrezcodeUserSchema = createSelectSchema(brezcodeUsers);
export type InsertBrezcodeUser = z.infer<typeof insertBrezcodeUserSchema>;
export type BrezcodeUser = z.infer<typeof selectBrezcodeUserSchema>;

export const insertBrezcodeHealthProfileSchema = createInsertSchema(brezcodeHealthProfiles);
export const selectBrezcodeHealthProfileSchema = createSelectSchema(brezcodeHealthProfiles);
export type InsertBrezcodeHealthProfile = z.infer<typeof insertBrezcodeHealthProfileSchema>;
export type BrezcodeHealthProfile = z.infer<typeof selectBrezcodeHealthProfileSchema>;

export const insertBrezcodeAssessmentSchema = createInsertSchema(brezcodeAssessments);
export const selectBrezcodeAssessmentSchema = createSelectSchema(brezcodeAssessments);
export type InsertBrezcodeAssessment = z.infer<typeof insertBrezcodeAssessmentSchema>;
export type BrezcodeAssessment = z.infer<typeof selectBrezcodeAssessmentSchema>;

export const insertBrezcodeHealthReportSchema = createInsertSchema(brezcodeHealthReports);
export const selectBrezcodeHealthReportSchema = createSelectSchema(brezcodeHealthReports);
export type InsertBrezcodeHealthReport = z.infer<typeof insertBrezcodeHealthReportSchema>;
export type BrezcodeHealthReport = z.infer<typeof selectBrezcodeHealthReportSchema>;

export const insertBrezcodeWellnessPlanSchema = createInsertSchema(brezcodeWellnessPlans);
export const selectBrezcodeWellnessPlanSchema = createSelectSchema(brezcodeWellnessPlans);
export type InsertBrezcodeWellnessPlan = z.infer<typeof insertBrezcodeWellnessPlanSchema>;
export type BrezcodeWellnessPlan = z.infer<typeof selectBrezcodeWellnessPlanSchema>;

export const insertBrezcodeHealthMetricSchema = createInsertSchema(brezcodeHealthMetrics);
export const selectBrezcodeHealthMetricSchema = createSelectSchema(brezcodeHealthMetrics);
export type InsertBrezcodeHealthMetric = z.infer<typeof insertBrezcodeHealthMetricSchema>;
export type BrezcodeHealthMetric = z.infer<typeof selectBrezcodeHealthMetricSchema>;