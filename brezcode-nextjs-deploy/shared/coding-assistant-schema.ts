import { pgTable, text, integer, timestamp, jsonb, boolean, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Coding sessions table
export const codingSessions = pgTable("coding_sessions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  technologies: jsonb("technologies").$type<string[]>().default([]),
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, completed, paused
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Code patterns learned
export const codePatterns = pgTable("code_patterns", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull(),
  sessionId: integer("session_id"),
  patternName: text("pattern_name").notNull(),
  description: text("description").notNull(),
  codeExample: text("code_example").notNull(),
  technology: text("technology").notNull(), // React, Node.js, etc.
  category: text("category").notNull(), // component, function, pattern, fix
  useCount: integer("use_count").default(0),
  successRate: integer("success_rate").default(100), // 0-100
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Debugging solutions
export const debuggingSolutions = pgTable("debugging_solutions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull(),
  sessionId: integer("session_id"),
  problemDescription: text("problem_description").notNull(),
  errorMessage: text("error_message"),
  solution: text("solution").notNull(),
  codeBeforefix: text("code_before_fix"),
  codeAfterFix: text("code_after_fix"),
  technology: text("technology").notNull(),
  timeToSolve: integer("time_to_solve"), // minutes
  difficulty: varchar("difficulty", { length: 10 }).default("medium"), // easy, medium, hard
  isVerified: boolean("is_verified").default(false),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI prompting strategies
export const promptingStrategies = pgTable("prompting_strategies", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull(),
  strategyName: text("strategy_name").notNull(),
  promptTemplate: text("prompt_template").notNull(),
  description: text("description").notNull(),
  useCase: text("use_case").notNull(), // debugging, feature development, refactoring
  successExamples: jsonb("success_examples").$type<string[]>().default([]),
  effectiveness: integer("effectiveness").default(50), // 0-100
  timesUsed: integer("times_used").default(0),
  avgTimeToSolution: integer("avg_time_to_solution"), // minutes
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Context and memory for AI assistant
export const codingContext = pgTable("coding_context", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  contextType: varchar("context_type", { length: 30 }).notNull(), // project_state, user_preference, solution_history
  contextKey: text("context_key").notNull(),
  contextValue: jsonb("context_value").notNull(),
  priority: integer("priority").default(1), // 1-10, higher = more important
  expiresAt: timestamp("expires_at"), // null = never expires
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Performance metrics
export const codingMetrics = pgTable("coding_metrics", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull(),
  sessionId: integer("session_id"),
  metricType: varchar("metric_type", { length: 30 }).notNull(), // time_to_solve, success_rate, pattern_reuse
  metricValue: integer("metric_value").notNull(),
  technology: text("technology"),
  date: timestamp("date").defaultNow().notNull(),
});

// Relations - simplified to avoid conflicts
export const codingSessionsRelations = relations(codingSessions, ({ many }) => ({
  patterns: many(codePatterns),
  solutions: many(debuggingSolutions),
  metrics: many(codingMetrics),
}));

// Zod schemas for validation
export const insertCodingSessionSchema = createInsertSchema(codingSessions);
export const insertCodePatternSchema = createInsertSchema(codePatterns);
export const insertDebuggingSolutionSchema = createInsertSchema(debuggingSolutions);
export const insertPromptingStrategySchema = createInsertSchema(promptingStrategies);
export const insertCodingContextSchema = createInsertSchema(codingContext);
export const insertCodingMetricSchema = createInsertSchema(codingMetrics);

// TypeScript types
export type CodingSession = typeof codingSessions.$inferSelect;
export type InsertCodingSession = z.infer<typeof insertCodingSessionSchema>;
export type CodePattern = typeof codePatterns.$inferSelect;
export type InsertCodePattern = z.infer<typeof insertCodePatternSchema>;
export type DebuggingSolution = typeof debuggingSolutions.$inferSelect;
export type InsertDebuggingSolution = z.infer<typeof insertDebuggingSolutionSchema>;
export type PromptingStrategy = typeof promptingStrategies.$inferSelect;
export type InsertPromptingStrategy = z.infer<typeof insertPromptingStrategySchema>;
export type CodingContext = typeof codingContext.$inferSelect;
export type InsertCodingContext = z.infer<typeof insertCodingContextSchema>;
export type CodingMetric = typeof codingMetrics.$inferSelect;
export type InsertCodingMetric = z.infer<typeof insertCodingMetricSchema>;