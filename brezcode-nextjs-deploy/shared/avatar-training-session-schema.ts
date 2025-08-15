import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Avatar Training Sessions Table - Complete session management with memory
export const avatarTrainingSessions = pgTable("avatar_training_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(), // Unique session identifier
  userId: integer("user_id").notNull(), // References users.id
  
  // Session Configuration
  avatarId: text("avatar_id").notNull(), // Which avatar is being trained
  avatarType: text("avatar_type").notNull(), // Avatar personality type
  scenarioId: text("scenario_id").notNull(), // Training scenario
  scenarioName: text("scenario_name").notNull(), // Human-readable scenario name
  businessContext: text("business_context").notNull(), // Business vertical
  
  // Session State
  status: text("status").default('active'), // active, completed, paused, archived
  totalMessages: integer("total_messages").default(0),
  sessionDuration: integer("session_duration"), // Total duration in minutes
  
  // Session Memory & Context
  scenarioDetails: jsonb("scenario_details"), // Complete scenario configuration
  conversationHistory: jsonb("conversation_history"), // All messages in order
  currentContext: jsonb("current_context"), // Current conversation state
  customerPersona: jsonb("customer_persona"), // Customer profile being simulated
  
  // Learning & Performance
  learningPoints: jsonb("learning_points"), // Key insights from this session
  performanceMetrics: jsonb("performance_metrics"), // Quality scores, improvements
  knowledgeApplied: jsonb("knowledge_applied"), // Knowledge used in this session
  skillsImproved: jsonb("skills_improved"), // Skills that were practiced
  
  // Session Summary
  sessionSummary: text("session_summary"), // AI-generated summary
  keyAchievements: jsonb("key_achievements"), // What was accomplished
  areasForImprovement: jsonb("areas_for_improvement"), // What needs work
  nextRecommendations: jsonb("next_recommendations"), // Suggested follow-up
  
  // Metadata
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Session Messages Table - Individual messages within training sessions
export const avatarTrainingMessages = pgTable("avatar_training_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => avatarTrainingSessions.sessionId),
  messageId: text("message_id").notNull().unique(), // Unique message identifier
  
  // Message Content
  role: text("role").notNull(), // 'customer', 'avatar', 'system', 'patient'
  content: text("content").notNull(), // Full message content
  emotion: text("emotion"), // Message emotion (anxious, confident, neutral, etc.)
  sequenceNumber: integer("sequence_number").notNull(), // Order in conversation
  
  // AI Response Data (for avatar messages)
  qualityScore: integer("quality_score"), // AI response quality (0-100)
  responseTime: integer("response_time"), // Time to generate response (ms)
  aiModel: text("ai_model"), // Which AI model was used (claude, openai)
  
  // Learning & Feedback
  userFeedback: text("user_feedback"), // User comment on the response
  improvedResponse: text("improved_response"), // Improved response if feedback given
  improvementScore: integer("improvement_score"), // Quality of improvement
  
  // Context & Memory
  conversationContext: jsonb("conversation_context"), // Context at time of message
  knowledgeUsed: jsonb("knowledge_used"), // Knowledge applied in this message
  topicsDiscussed: jsonb("topics_discussed"), // Topics covered
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Session Knowledge Base - Knowledge accumulated per session
export const avatarSessionKnowledge = pgTable("avatar_session_knowledge", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => avatarTrainingSessions.sessionId),
  userId: integer("user_id").notNull(),
  
  // Knowledge Entry
  title: text("title").notNull(), // Knowledge topic
  category: text("category").notNull(), // Category (medical, communication, etc.)
  content: text("content").notNull(), // Full knowledge content
  summary: text("summary"), // Brief summary
  
  // Knowledge Source
  sourceMessageId: text("source_message_id").references(() => avatarTrainingMessages.messageId),
  extractedFrom: text("extracted_from"), // How knowledge was discovered
  confidence: integer("confidence").default(5), // Confidence level (1-10)
  
  // Application & Usage
  timesApplied: integer("times_applied").default(0), // How often used
  successRate: decimal("success_rate").default('0'), // Success when applied
  lastUsed: timestamp("last_used"),
  
  // Learning Progress
  masteryLevel: text("mastery_level").default('learning'), // learning, practiced, mastered
  practiceCount: integer("practice_count").default(0),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const avatarTrainingSessionsRelations = relations(avatarTrainingSessions, ({ many }) => ({
  messages: many(avatarTrainingMessages),
  knowledge: many(avatarSessionKnowledge),
}));

export const avatarTrainingMessagesRelations = relations(avatarTrainingMessages, ({ one, many }) => ({
  session: one(avatarTrainingSessions, {
    fields: [avatarTrainingMessages.sessionId],
    references: [avatarTrainingSessions.sessionId],
  }),
  knowledge: many(avatarSessionKnowledge),
}));

export const avatarSessionKnowledgeRelations = relations(avatarSessionKnowledge, ({ one }) => ({
  session: one(avatarTrainingSessions, {
    fields: [avatarSessionKnowledge.sessionId],
    references: [avatarTrainingSessions.sessionId],
  }),
  sourceMessage: one(avatarTrainingMessages, {
    fields: [avatarSessionKnowledge.sourceMessageId],
    references: [avatarTrainingMessages.messageId],
  }),
}));

// Zod schemas for type safety
export const insertAvatarTrainingSessionSchema = createInsertSchema(avatarTrainingSessions);
export const insertAvatarTrainingMessageSchema = createInsertSchema(avatarTrainingMessages);
export const insertAvatarSessionKnowledgeSchema = createInsertSchema(avatarSessionKnowledge);

export type AvatarTrainingSession = typeof avatarTrainingSessions.$inferSelect;
export type InsertAvatarTrainingSession = z.infer<typeof insertAvatarTrainingSessionSchema>;

export type AvatarTrainingMessage = typeof avatarTrainingMessages.$inferSelect;
export type InsertAvatarTrainingMessage = z.infer<typeof insertAvatarTrainingMessageSchema>;

export type AvatarSessionKnowledge = typeof avatarSessionKnowledge.$inferSelect;
export type InsertAvatarSessionKnowledge = z.infer<typeof insertAvatarSessionKnowledgeSchema>;