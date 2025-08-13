import { pgTable, serial, text, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Real conversation history storage - the foundation of learning
export const conversationHistory = pgTable("conversation_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionId: text("session_id").notNull(),
  
  // Actual conversation data
  userMessage: text("user_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  
  // Context and classification
  messageType: text("message_type").notNull(), // 'coding', 'debugging', 'explanation', 'general'
  technology: text("technology"), // 'React', 'JavaScript', 'TypeScript', etc.
  problemType: text("problem_type"), // 'debugging', 'learning', 'optimization', 'best-practices'
  difficulty: text("difficulty"), // 'beginner', 'intermediate', 'advanced'
  
  // Learning indicators
  wasHelpful: boolean("was_helpful"), // User feedback on response quality
  followupNeeded: boolean("followup_needed"), // Did user ask follow-up questions?
  errorResolved: boolean("error_resolved"), // Did the solution actually work?
  
  // Response quality metrics
  responseTime: integer("response_time"), // How long AI took to respond
  responseLength: integer("response_length"), // Length of AI response
  codeExamplesCount: integer("code_examples_count"), // Number of code blocks provided
  
  // Metadata
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User preferences and learning patterns
export const userLearningProfile = pgTable("user_learning_profile", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  
  // Technical skill level
  primaryLanguages: jsonb("primary_languages").$type<string[]>(),
  experienceLevel: text("experience_level"), // 'beginner', 'intermediate', 'senior'
  preferredFrameworks: jsonb("preferred_frameworks").$type<string[]>(),
  
  // Learning preferences
  communicationStyle: text("communication_style"), // 'simple', 'technical', 'detailed'
  preferencesDetailed: boolean("prefers_detailed_explanations").default(true),
  prefersCodeExamples: boolean("prefers_code_examples").default(true),
  prefersStepByStep: boolean("prefers_step_by_step").default(false),
  
  // Common patterns and anti-patterns
  frequentMistakes: jsonb("frequent_mistakes").$type<string[]>(),
  successfulPatterns: jsonb("successful_patterns").$type<string[]>(),
  avoidedApproaches: jsonb("avoided_approaches").$type<string[]>(), // What NOT to suggest again
  
  // Interaction history summary
  totalConversations: integer("total_conversations").default(0),
  averageHelpfulness: real("average_helpfulness").default(0),
  mostCommonProblems: jsonb("most_common_problems").$type<string[]>(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Extracted knowledge that actually works
export const extractedKnowledge = pgTable("extracted_knowledge", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  
  // Knowledge classification
  knowledgeType: text("knowledge_type").notNull(), // 'pattern', 'solution', 'anti-pattern', 'preference'
  title: text("title").notNull(),
  description: text("description").notNull(),
  
  // The actual knowledge
  content: jsonb("content"), // Structured knowledge data
  codeExample: text("code_example"),
  technology: text("technology").notNull(),
  tags: jsonb("tags").$type<string[]>(),
  
  // Effectiveness tracking
  timesUsed: integer("times_used").default(0),
  timesSuccessful: integer("times_successful").default(0),
  averageHelpfulness: real("average_helpfulness").default(0),
  
  // Source conversation
  sourceConversationId: integer("source_conversation_id").references(() => conversationHistory.id),
  extractedAt: timestamp("extracted_at").defaultNow(),
  
  // Status
  isActive: boolean("is_active").default(true),
  confidence: real("confidence").default(0.8), // AI confidence in this knowledge
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Track what approaches failed - crucial for learning
export const failedApproaches = pgTable("failed_approaches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  conversationId: integer("conversation_id").references(() => conversationHistory.id),
  
  // What failed
  approachDescription: text("approach_description").notNull(),
  errorMessage: text("error_message"),
  technology: text("technology").notNull(),
  context: jsonb("context"), // Surrounding conditions that led to failure
  
  // Why it failed
  failureReason: text("failure_reason"), // User reported or AI inferred
  userFeedback: text("user_feedback"), // What user said about why it didn't work
  
  // Prevention
  shouldAvoid: boolean("should_avoid").default(true),
  alternativeSuggestion: text("alternative_suggestion"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Conversation feedback - the key to improving
export const conversationFeedback = pgTable("conversation_feedback", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversationHistory.id).notNull(),
  userId: integer("user_id").notNull(),
  
  // Explicit feedback
  helpfulnessRating: integer("helpfulness_rating"), // 1-5 stars
  accuracyRating: integer("accuracy_rating"), // 1-5 stars
  clarityRating: integer("clarity_rating"), // 1-5 stars
  
  // Implicit feedback (behavioral indicators)
  userAskedFollowup: boolean("user_asked_followup").default(false),
  userImplementedSolution: boolean("user_implemented_solution"),
  solutionWorked: boolean("solution_worked"),
  userCameBackWithSameProblem: boolean("user_came_back_with_same_problem").default(false),
  
  // Detailed feedback
  whatWorked: text("what_worked"),
  whatDidntWork: text("what_didnt_work"),
  suggestions: text("suggestions"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema types for TypeScript
export type ConversationHistory = typeof conversationHistory.$inferSelect;
export type InsertConversationHistory = typeof conversationHistory.$inferInsert;

export type UserLearningProfile = typeof userLearningProfile.$inferSelect;
export type InsertUserLearningProfile = typeof userLearningProfile.$inferInsert;

export type ExtractedKnowledge = typeof extractedKnowledge.$inferSelect;
export type InsertExtractedKnowledge = typeof extractedKnowledge.$inferInsert;

export type FailedApproach = typeof failedApproaches.$inferSelect;
export type InsertFailedApproach = typeof failedApproaches.$inferInsert;

export type ConversationFeedback = typeof conversationFeedback.$inferSelect;
export type InsertConversationFeedback = typeof conversationFeedback.$inferInsert;

// Validation schemas
export const insertConversationHistorySchema = createInsertSchema(conversationHistory);
export const insertUserLearningProfileSchema = createInsertSchema(userLearningProfile);
export const insertExtractedKnowledgeSchema = createInsertSchema(extractedKnowledge);
export const insertFailedApproachSchema = createInsertSchema(failedApproaches);
export const insertConversationFeedbackSchema = createInsertSchema(conversationFeedback);