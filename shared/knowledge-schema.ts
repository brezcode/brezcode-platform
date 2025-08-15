import { pgTable, serial, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Knowledge base entries for AI training
export const knowledgeEntries = pgTable("knowledge_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  brandId: text("brand_id"), // Optional - for brand-specific knowledge
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // 'personal', 'brand', 'procedures', 'faq', 'products'
  tags: text("tags").array().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// AI assistant configurations
export const aiAssistants = pgTable("ai_assistants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  brandId: text("brand_id"), // Optional - for brand-specific assistants
  name: text("name").notNull(),
  description: text("description"),
  systemPrompt: text("system_prompt").notNull(),
  personality: text("personality").default("professional"), // 'professional', 'friendly', 'formal', 'casual'
  expertise: text("expertise").array().default([]), // Areas of expertise
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Training documents uploaded by users
export const trainingDocuments = pgTable("training_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  brandId: text("brand_id"), // Optional
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(), // 'pdf', 'txt', 'docx', 'csv'
  fileSize: integer("file_size").notNull(),
  extractedText: text("extracted_text"),
  processingStatus: text("processing_status").default("pending"), // 'pending', 'processing', 'completed', 'failed'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at")
});

// Conversation history for training and improvement
export const conversationHistory = pgTable("conversation_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  assistantId: integer("assistant_id").notNull(),
  sessionId: text("session_id").notNull(),
  userMessage: text("user_message").notNull(),
  assistantResponse: text("assistant_response").notNull(),
  feedback: text("feedback"), // 'helpful', 'not_helpful', 'needs_improvement'
  rating: integer("rating"), // 1-5 stars
  createdAt: timestamp("created_at").defaultNow()
});

// Training sessions and analytics
export const trainingAnalytics = pgTable("training_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  assistantId: integer("assistant_id").notNull(),
  totalConversations: integer("total_conversations").default(0),
  averageRating: integer("average_rating").default(0), // 0-5 scale
  totalKnowledgeEntries: integer("total_knowledge_entries").default(0),
  totalDocuments: integer("total_documents").default(0),
  lastTrainingDate: timestamp("last_training_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Zod schemas for validation
export const insertKnowledgeEntrySchema = createInsertSchema(knowledgeEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertAiAssistantSchema = createInsertSchema(aiAssistants).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertTrainingDocumentSchema = createInsertSchema(trainingDocuments).omit({
  id: true,
  createdAt: true,
  processedAt: true
});

export const insertConversationHistorySchema = createInsertSchema(conversationHistory).omit({
  id: true,
  createdAt: true
});

// Types
export type KnowledgeEntry = typeof knowledgeEntries.$inferSelect;
export type NewKnowledgeEntry = z.infer<typeof insertKnowledgeEntrySchema>;

export type AiAssistant = typeof aiAssistants.$inferSelect;
export type NewAiAssistant = z.infer<typeof insertAiAssistantSchema>;

export type TrainingDocument = typeof trainingDocuments.$inferSelect;
export type NewTrainingDocument = z.infer<typeof insertTrainingDocumentSchema>;

export type ConversationHistory = typeof conversationHistory.$inferSelect;
export type NewConversationHistory = z.infer<typeof insertConversationHistorySchema>;

export type TrainingAnalytics = typeof trainingAnalytics.$inferSelect;