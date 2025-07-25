import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User Conversations Table - Records all avatar training conversations
export const userConversations = pgTable("user_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // References users.id
  sessionId: text("session_id").notNull(), // Avatar training session identifier
  messageId: text("message_id").notNull(), // Individual message identifier
  
  // Message Content
  role: text("role").notNull(), // 'customer', 'avatar', 'patient'
  content: text("content").notNull(), // Full message content
  emotion: text("emotion"), // Message emotion (anxious, confident, neutral, etc.)
  
  // AI Response Quality
  qualityScore: integer("quality_score"), // AI response quality (0-100)
  improvedResponse: text("improved_response"), // Improved response if user provided feedback
  userFeedback: text("user_feedback"), // User comment on the response
  
  // Avatar & Scenario Context
  avatarId: text("avatar_id").notNull(), // Which avatar was used
  scenarioId: text("scenario_id"), // Training scenario
  businessContext: text("business_context"), // Business vertical (brezcode, leadgen, etc.)
  
  // Learning Data
  conversationContext: jsonb("conversation_context"), // Context at time of message
  learningPoints: jsonb("learning_points"), // Key learning extracted from conversation
  topicsDiscussed: jsonb("topics_discussed"), // Topics covered in this message
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Knowledge Base - Accumulated learning from all conversations
export const userKnowledgeBase = pgTable("user_knowledge_base", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // References users.id
  
  // Knowledge Entry
  title: text("title").notNull(), // Topic title
  category: text("category").notNull(), // Category (health, business, technical, etc.)
  content: text("content").notNull(), // Full knowledge content
  summary: text("summary"), // Brief summary of the knowledge
  
  // Source Information
  sourceType: text("source_type").notNull(), // 'conversation', 'manual', 'training'
  sourceConversationId: integer("source_conversation_id").references(() => userConversations.id),
  sourceSessionId: text("source_session_id"), // Session where this knowledge was learned
  
  // Knowledge Metadata
  tags: jsonb("tags"), // Searchable tags
  keywords: jsonb("keywords"), // Key terms for search
  relatedTopics: jsonb("related_topics"), // Connected knowledge areas
  importance: integer("importance").default(5), // Importance level (1-10)
  
  // Usage & Learning
  timesAccessed: integer("times_accessed").default(0), // How often this knowledge is referenced
  lastAccessed: timestamp("last_accessed"),
  confidenceLevel: integer("confidence_level").default(5), // How confident user is (1-10)
  
  // Learning Progress
  masteryLevel: text("mastery_level").default('beginner'), // beginner, intermediate, advanced, expert
  practiceCount: integer("practice_count").default(0), // Times this knowledge was practiced
  successRate: decimal("success_rate").default('0'), // Success rate when applying this knowledge
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Conversation Learning Analytics - Track learning patterns
export const conversationLearningAnalytics = pgTable("conversation_learning_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  
  // Learning Session Data
  sessionId: text("session_id").notNull(),
  avatarId: text("avatar_id").notNull(),
  scenarioId: text("scenario_id"),
  businessContext: text("business_context"),
  
  // Performance Metrics
  totalMessages: integer("total_messages").default(0),
  averageQualityScore: decimal("average_quality_score"),
  improvementCount: integer("improvement_count").default(0), // Times user provided feedback
  knowledgePointsGenerated: integer("knowledge_points_generated").default(0),
  
  // Learning Insights
  topicsLearned: jsonb("topics_learned"), // Topics covered in this session
  skillsImproved: jsonb("skills_improved"), // Skills that improved
  weaknessesIdentified: jsonb("weaknesses_identified"), // Areas needing work
  strengthsReinforced: jsonb("strengths_reinforced"), // Strengths demonstrated
  
  // Session Summary
  sessionSummary: text("session_summary"), // AI-generated session summary
  learningOutcomes: jsonb("learning_outcomes"), // What user learned
  nextRecommendations: jsonb("next_recommendations"), // Recommended next steps
  
  // Metadata
  sessionDuration: integer("session_duration"), // Session length in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const userConversationsRelations = relations(userConversations, ({ one, many }) => ({
  knowledgeEntries: many(userKnowledgeBase),
}));

export const userKnowledgeBaseRelations = relations(userKnowledgeBase, ({ one }) => ({
  sourceConversation: one(userConversations, {
    fields: [userKnowledgeBase.sourceConversationId],
    references: [userConversations.id],
  }),
}));

// Zod schemas for type safety
export const insertUserConversationSchema = createInsertSchema(userConversations);
export const insertUserKnowledgeBaseSchema = createInsertSchema(userKnowledgeBase);
export const insertConversationLearningAnalyticsSchema = createInsertSchema(conversationLearningAnalytics);

export type UserConversation = typeof userConversations.$inferSelect;
export type InsertUserConversation = z.infer<typeof insertUserConversationSchema>;

export type UserKnowledgeBase = typeof userKnowledgeBase.$inferSelect;
export type InsertUserKnowledgeBase = z.infer<typeof insertUserKnowledgeBaseSchema>;

export type ConversationLearningAnalytics = typeof conversationLearningAnalytics.$inferSelect;
export type InsertConversationLearningAnalytics = z.infer<typeof insertConversationLearningAnalyticsSchema>;