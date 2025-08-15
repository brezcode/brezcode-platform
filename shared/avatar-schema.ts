import { pgTable, text, varchar, jsonb, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Avatar configuration for each brand
export const avatarConfigs = pgTable("avatar_configs", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").notNull(),
  avatarName: varchar("avatar_name", { length: 100 }).notNull(),
  heygenAvatarId: varchar("heygen_avatar_id", { length: 100 }),
  voiceId: varchar("voice_id", { length: 100 }).default("en-US-AriaNeural"),
  personality: jsonb("personality").notNull(), // From requirements quiz
  knowledgeBase: jsonb("knowledge_base").notNull(), // Custom knowledge
  systemPrompt: text("system_prompt").notNull(),
  languages: jsonb("languages").default(['en']),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer avatar requirements from quiz
export const avatarRequirements = pgTable("avatar_requirements", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").notNull(),
  customerId: uuid("customer_id").notNull(),
  businessType: varchar("business_type", { length: 100 }).notNull(),
  primaryUseCase: varchar("primary_use_case", { length: 100 }).notNull(),
  targetAudience: varchar("target_audience", { length: 100 }).notNull(),
  communicationStyle: varchar("communication_style", { length: 100 }).notNull(),
  expertise: jsonb("expertise").notNull(), // Areas of knowledge
  languages: jsonb("languages").notNull(),
  personalityTraits: jsonb("personality_traits").notNull(),
  restrictions: jsonb("restrictions"), // What avatar should not do
  customInstructions: text("custom_instructions"),
  generatedPrompt: text("generated_prompt"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Avatar knowledge base entries
export const avatarKnowledge = pgTable("avatar_knowledge", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").notNull(),
  configId: uuid("config_id").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  tags: jsonb("tags").default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Avatar conversation memory
export const avatarMemory = pgTable("avatar_memory", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").notNull(),
  customerId: uuid("customer_id").notNull(),
  configId: uuid("config_id").notNull(),
  sessionId: varchar("session_id", { length: 100 }),
  memories: jsonb("memories").notNull(), // Key conversation points to remember
  preferences: jsonb("preferences").notNull(), // Customer preferences learned
  context: jsonb("context").notNull(), // Ongoing conversation context
  lastInteraction: timestamp("last_interaction").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Avatar performance analytics
export const avatarAnalytics = pgTable("avatar_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  brandId: uuid("brand_id").notNull(),
  configId: uuid("config_id").notNull(),
  customerId: uuid("customer_id"),
  sessionId: varchar("session_id", { length: 100 }),
  interactionType: varchar("interaction_type", { length: 50 }).notNull(), // text, voice, video
  duration: varchar("duration", { length: 20 }), // Session duration
  customerSatisfaction: varchar("customer_satisfaction", { length: 20 }), // positive, neutral, negative
  resolvedIssue: boolean("resolved_issue"),
  escalatedToHuman: boolean("escalated_to_human").default(false),
  metadata: jsonb("metadata"), // Additional tracking data
  timestamp: timestamp("timestamp").defaultNow(),
});

// Type exports
export type AvatarConfig = typeof avatarConfigs.$inferSelect;
export type InsertAvatarConfig = typeof avatarConfigs.$inferInsert;

export type AvatarRequirements = typeof avatarRequirements.$inferSelect;
export type InsertAvatarRequirements = typeof avatarRequirements.$inferInsert;

export type AvatarKnowledge = typeof avatarKnowledge.$inferSelect;
export type InsertAvatarKnowledge = typeof avatarKnowledge.$inferInsert;

export type AvatarMemory = typeof avatarMemory.$inferSelect;
export type InsertAvatarMemory = typeof avatarMemory.$inferInsert;

export type AvatarAnalytics = typeof avatarAnalytics.$inferSelect;
export type InsertAvatarAnalytics = typeof avatarAnalytics.$inferInsert;

// Zod schemas
export const insertAvatarConfigSchema = createInsertSchema(avatarConfigs);
export const selectAvatarConfigSchema = createSelectSchema(avatarConfigs);

export const insertAvatarRequirementsSchema = createInsertSchema(avatarRequirements);
export const selectAvatarRequirementsSchema = createSelectSchema(avatarRequirements);

export const insertAvatarKnowledgeSchema = createInsertSchema(avatarKnowledge);
export const selectAvatarKnowledgeSchema = createSelectSchema(avatarKnowledge);

export const insertAvatarMemorySchema = createInsertSchema(avatarMemory);
export const selectAvatarMemorySchema = createSelectSchema(avatarMemory);

export const insertAvatarAnalyticsSchema = createInsertSchema(avatarAnalytics);
export const selectAvatarAnalyticsSchema = createSelectSchema(avatarAnalytics);

// Avatar requirements quiz schema
export const avatarQuizSchema = z.object({
  businessType: z.enum(['ecommerce', 'healthcare', 'education', 'finance', 'real_estate', 'consulting', 'technology', 'other']),
  primaryUseCase: z.enum(['customer_service', 'sales', 'coaching', 'consultation', 'support', 'training', 'marketing']),
  targetAudience: z.enum(['general_consumers', 'business_professionals', 'students', 'elderly', 'children', 'healthcare_patients', 'specific_niche']),
  communicationStyle: z.enum(['formal_professional', 'casual_friendly', 'warm_empathetic', 'energetic_enthusiastic', 'calm_reassuring', 'expert_authoritative']),
  expertise: z.array(z.string()).min(1),
  languages: z.array(z.string()).min(1),
  personalityTraits: z.array(z.enum(['helpful', 'patient', 'knowledgeable', 'friendly', 'professional', 'empathetic', 'enthusiastic', 'calm', 'confident', 'supportive'])),
  restrictions: z.array(z.string()).optional(),
  customInstructions: z.string().optional(),
});