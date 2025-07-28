import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Avatar Knowledge Base Tables
export const avatarKnowledgeDocuments = pgTable("avatar_knowledge_documents", {
  id: serial("id").primaryKey(),
  avatarId: text("avatar_id").notNull(), // e.g., "brezcode_health_coach"
  userId: integer("user_id").notNull(),
  filename: text("filename").notNull(),
  originalContent: text("original_content").notNull(), // Raw file content
  processedContent: text("processed_content").notNull(), // Cleaned/processed content
  documentType: text("document_type").notNull(), // "pdf", "txt", "docx", etc.
  contentCategory: text("content_category"), // "pricing", "technical", "policy", etc.
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  isProcessed: boolean("is_processed").default(false),
  processingStatus: text("processing_status").default("pending"), // "pending", "processing", "completed", "failed"
  metadata: jsonb("metadata"), // Additional file metadata
});

export const avatarKnowledgeChunks = pgTable("avatar_knowledge_chunks", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => avatarKnowledgeDocuments.id).notNull(),
  avatarId: text("avatar_id").notNull(),
  chunkContent: text("chunk_content").notNull(), // Smaller searchable chunks
  chunkIndex: integer("chunk_index").notNull(), // Order within document
  keywords: jsonb("keywords"), // Extracted keywords for search
  topics: jsonb("topics"), // AI-identified topics
  relevanceScore: integer("relevance_score").default(100), // 0-100 relevance to avatar
  createdAt: timestamp("created_at").defaultNow(),
});

export const avatarKnowledgeQueries = pgTable("avatar_knowledge_queries", {
  id: serial("id").primaryKey(),
  avatarId: text("avatar_id").notNull(),
  sessionId: text("session_id"),
  userQuery: text("user_query").notNull(),
  matchedDocuments: jsonb("matched_documents"), // Array of document IDs that matched
  knowledgeUsed: text("knowledge_used"), // Specific content used in response
  responseGenerated: text("response_generated"), // Avatar's response
  accuracyRating: integer("accuracy_rating"), // User feedback on knowledge accuracy
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for validation
export const insertAvatarKnowledgeDocument = createInsertSchema(avatarKnowledgeDocuments).omit({
  id: true,
  uploadedAt: true,
});

export const insertAvatarKnowledgeChunk = createInsertSchema(avatarKnowledgeChunks).omit({
  id: true,
  createdAt: true,
});

export const insertAvatarKnowledgeQuery = createInsertSchema(avatarKnowledgeQueries).omit({
  id: true,
  createdAt: true,
});

// TypeScript types
export type AvatarKnowledgeDocument = typeof avatarKnowledgeDocuments.$inferSelect;
export type InsertAvatarKnowledgeDocument = z.infer<typeof insertAvatarKnowledgeDocument>;

export type AvatarKnowledgeChunk = typeof avatarKnowledgeChunks.$inferSelect;
export type InsertAvatarKnowledgeChunk = z.infer<typeof insertAvatarKnowledgeChunk>;

export type AvatarKnowledgeQuery = typeof avatarKnowledgeQueries.$inferSelect;
export type InsertAvatarKnowledgeQuery = z.infer<typeof insertAvatarKnowledgeQuery>;