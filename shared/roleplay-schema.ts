import { pgTable, serial, text, integer, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Role Playing Scenarios
export const roleplayScenarios = pgTable("roleplay_scenarios", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  assistantId: integer("assistant_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  customerType: text("customer_type").notNull(), // angry, confused, price-sensitive, tech-savvy, etc.
  scenario: text("scenario").notNull(), // detailed scenario description
  objectives: json("objectives").$type<string[]>().notNull(), // what the AI should achieve
  timeframeMins: integer("timeframe_mins").default(10),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Role Playing Sessions
export const roleplaySessions = pgTable("roleplay_sessions", {
  id: serial("id").primaryKey(),
  scenarioId: integer("scenario_id").notNull(),
  userId: integer("user_id").notNull(),
  assistantId: integer("assistant_id").notNull(),
  status: text("status").notNull(), // running, completed, interrupted
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  customerPersona: text("customer_persona").notNull(),
  sessionNotes: text("session_notes"),
  score: integer("score"), // 1-10 performance score
  createdAt: timestamp("created_at").defaultNow(),
});

// Role Playing Messages
export const roleplayMessages = pgTable("roleplay_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  sender: text("sender").notNull(), // customer_ai, assistant_ai
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: json("metadata").$type<{
    confidence?: number;
    intent?: string;
    emotion?: string;
  }>(),
});

// User Feedback on Messages
export const roleplayFeedback = pgTable("roleplay_feedback", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull(),
  userId: integer("user_id").notNull(),
  sessionId: integer("session_id").notNull(),
  feedbackType: text("feedback_type").notNull(), // improvement, issue, good
  comment: text("comment").notNull(),
  suggestion: text("suggestion"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas
export const insertRoleplayScenarioSchema = createInsertSchema(roleplayScenarios).omit({
  id: true,
  createdAt: true,
});

export const insertRoleplaySessionSchema = createInsertSchema(roleplaySessions).omit({
  id: true,
  createdAt: true,
});

export const insertRoleplayMessageSchema = createInsertSchema(roleplayMessages).omit({
  id: true,
  timestamp: true,
});

export const insertRoleplayFeedbackSchema = createInsertSchema(roleplayFeedback).omit({
  id: true,
  createdAt: true,
});

// TypeScript types
export type RoleplayScenario = typeof roleplayScenarios.$inferSelect;
export type InsertRoleplayScenario = z.infer<typeof insertRoleplayScenarioSchema>;

export type RoleplaySession = typeof roleplaySessions.$inferSelect;
export type InsertRoleplaySession = z.infer<typeof insertRoleplaySessionSchema>;

export type RoleplayMessage = typeof roleplayMessages.$inferSelect;
export type InsertRoleplayMessage = z.infer<typeof insertRoleplayMessageSchema>;

export type RoleplayFeedback = typeof roleplayFeedback.$inferSelect;
export type InsertRoleplayFeedback = z.infer<typeof insertRoleplayFeedbackSchema>;