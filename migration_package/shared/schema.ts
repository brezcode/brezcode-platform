import { sql } from "drizzle-orm";
import { pgTable, text, integer, timestamp, jsonb, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication and basic profile
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: varchar("phone", { length: 50 }),
  streetAddress: text("street_address"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country"),
  profilePhoto: text("profile_photo"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Health assessments table for quiz responses
export const healthAssessments = pgTable("health_assessments", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").references(() => users.id),
  assessmentData: jsonb("assessment_data").notNull(), // Store all quiz answers
  riskScore: integer("risk_score"),
  riskCategory: text("risk_category"), // low, moderate, high
  userProfile: text("user_profile"), // teenager, premenopausal, postmenopausal, etc.
  createdAt: timestamp("created_at").defaultNow()
});

// Health reports table for generated reports
export const healthReports = pgTable("health_reports", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: integer("user_id").references(() => users.id),
  assessmentId: integer("assessment_id").references(() => healthAssessments.id),
  reportData: jsonb("report_data").notNull(), // Complete report with analysis
  riskFactors: text("risk_factors").array(),
  recommendations: text("recommendations").array(),
  dailyPlan: jsonb("daily_plan"),
  createdAt: timestamp("created_at").defaultNow()
});

// Email verification codes
export const emailVerificationCodes = pgTable("email_verification_codes", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  email: varchar("email", { length: 255 }).notNull(),
  code: varchar("code", { length: 10 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// User sessions for authentication
export const userSessions = pgTable("user_sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertHealthAssessmentSchema = createInsertSchema(healthAssessments);
export const insertHealthReportSchema = createInsertSchema(healthReports);
export const insertEmailVerificationCodeSchema = createInsertSchema(emailVerificationCodes);
export const insertUserSessionSchema = createInsertSchema(userSessions);

// Select schemas  
export const selectUserSchema = createSelectSchema(users);
export const selectHealthAssessmentSchema = createSelectSchema(healthAssessments);
export const selectHealthReportSchema = createSelectSchema(healthReports);
export const selectEmailVerificationCodeSchema = createSelectSchema(emailVerificationCodes);
export const selectUserSessionSchema = createSelectSchema(userSessions);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type HealthAssessment = typeof healthAssessments.$inferSelect;
export type InsertHealthAssessment = typeof healthAssessments.$inferInsert;
export type HealthReport = typeof healthReports.$inferSelect;
export type InsertHealthReport = typeof healthReports.$inferInsert;
export type EmailVerificationCode = typeof emailVerificationCodes.$inferSelect;
export type InsertEmailVerificationCode = typeof emailVerificationCodes.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = typeof userSessions.$inferInsert;