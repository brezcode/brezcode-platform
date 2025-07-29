import { pgTable, serial, text, timestamp, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isVerified: boolean("is_verified").default(false),
  verificationCode: text("verification_code"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz responses table
export const quizResponses = pgTable("quiz_responses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").notNull(),
  answers: json("answers").notNull(),
  riskScore: integer("risk_score"),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Health reports table
export const healthReports = pgTable("health_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  quizResponseId: integer("quiz_response_id").references(() => quizResponses.id),
  reportData: json("report_data").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
});

// Schema types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type QuizResponse = typeof quizResponses.$inferSelect;
export type InsertQuizResponse = typeof quizResponses.$inferInsert;
export type HealthReport = typeof healthReports.$inferSelect;
export type InsertHealthReport = typeof healthReports.$inferInsert;

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertQuizResponseSchema = createInsertSchema(quizResponses).omit({
  id: true,
  completedAt: true,
});

export const insertHealthReportSchema = createInsertSchema(healthReports).omit({
  id: true,
  generatedAt: true,
});