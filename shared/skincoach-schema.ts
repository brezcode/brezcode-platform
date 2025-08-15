import { pgTable, text, serial, timestamp, jsonb, integer, boolean, decimal, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// SkinCoach Users Table
export const skincoachUsers = pgTable("skincoach_users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  age_range: text("age_range"),
  gender: text("gender"),
  skin_type: text("skin_type"),
  concerns: jsonb("concerns").$type<string[]>(),
  goals: jsonb("goals").$type<string[]>(),
  routine: text("routine"),
  sun_exposure: text("sun_exposure"),
  lifestyle: jsonb("lifestyle").$type<string[]>(),
  budget: text("budget"),
  previous_treatments: text("previous_treatments"),
  allergies: text("allergies"),
  additional_notes: text("additional_notes"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Skin Analysis Results Table
export const skinAnalysisResults = pgTable("skin_analysis_results", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => skincoachUsers.id),
  analysis_id: text("analysis_id").unique().notNull(),
  overall_score: integer("overall_score").notNull(),
  scores: jsonb("scores").$type<{
    acne: number;
    wrinkles: number;
    sagging: number;
    redness: number;
    dark_spots: number;
    dark_circles: number;
    eye_bags: number;
    texture: number;
    pores: number;
    hydration: number;
  }>().notNull(),
  concerns: jsonb("concerns").$type<string[]>(),
  improvements: jsonb("improvements").$type<string[]>(),
  confidence_scores: jsonb("confidence_scores").$type<Record<string, number>>(),
  recommendations: jsonb("recommendations").$type<{
    immediate: string[];
    short_term: string[];
    long_term: string[];
  }>(),
  image_url: text("image_url"), // Optional: store image reference
  processing_time: text("processing_time"),
  models_used: jsonb("models_used").$type<string[]>(),
  created_at: timestamp("created_at").defaultNow(),
});

// SkinCoach Products Table
export const skincoachProducts = pgTable("skincoach_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(), // cleanser, serum, moisturizer, etc.
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  description: text("description"),
  ingredients: jsonb("ingredients").$type<string[]>(),
  skin_types: jsonb("skin_types").$type<string[]>(), // normal, dry, oily, etc.
  skin_concerns: jsonb("skin_concerns").$type<string[]>(), // acne, wrinkles, etc.
  budget_category: text("budget_category"), // budget, moderate, premium, luxury
  rating: decimal("rating", { precision: 3, scale: 2 }),
  image_url: text("image_url"),
  affiliate_link: text("affiliate_link"),
  is_recommended: boolean("is_recommended").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// SkinCoach AI Avatar Table
export const skincoachAvatars = pgTable("skincoach_avatars", {
  id: serial("id").primaryKey(),
  avatar_id: text("avatar_id").unique().notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // "Skin Health Coach", "Dermatology Assistant", etc.
  personality: jsonb("personality").$type<{
    empathetic: boolean;
    professional: boolean;
    encouraging: boolean;
    scientificApproach: boolean;
  }>(),
  expertise: jsonb("expertise").$type<string[]>(),
  appearance: jsonb("appearance").$type<{
    hairColor: string;
    eyeColor: string;
    style: string;
    demeanor: string;
  }>(),
  communication_style: text("communication_style"),
  knowledge_base: jsonb("knowledge_base").$type<Record<string, any>>(),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// AI Conversations Table
export const skincoachConversations = pgTable("skincoach_conversations", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => skincoachUsers.id),
  avatar_id: integer("avatar_id").references(() => skincoachAvatars.id),
  conversation_id: text("conversation_id").unique().notNull(),
  messages: jsonb("messages").$type<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>>(),
  context: jsonb("context").$type<{
    skinAnalysis?: any;
    userProfile?: any;
    currentConcerns?: string[];
    recommendedProducts?: any[];
  }>(),
  status: text("status").default("active"), // active, completed, archived
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// AI Training Data Table
export const skincoachTrainingData = pgTable("skincoach_training_data", {
  id: serial("id").primaryKey(),
  avatar_id: integer("avatar_id").references(() => skincoachAvatars.id),
  training_type: text("training_type").notNull(), // "conversation", "product_knowledge", "skin_analysis"
  input_data: jsonb("input_data").notNull(),
  expected_output: jsonb("expected_output"),
  actual_output: jsonb("actual_output"),
  feedback_score: integer("feedback_score"), // 1-5 rating
  feedback_notes: text("feedback_notes"),
  is_validated: boolean("is_validated").default(false),
  validator_id: text("validator_id"), // Who validated this training data
  created_at: timestamp("created_at").defaultNow(),
});

// Product Recommendations History
export const productRecommendations = pgTable("product_recommendations", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => skincoachUsers.id),
  analysis_id: integer("analysis_id").references(() => skinAnalysisResults.id),
  product_id: integer("product_id").references(() => skincoachProducts.id),
  recommendation_reason: text("recommendation_reason"),
  confidence_score: decimal("confidence_score", { precision: 3, scale: 2 }),
  priority: integer("priority"), // 1 = highest priority
  was_purchased: boolean("was_purchased").default(false),
  user_feedback: integer("user_feedback"), // 1-5 rating
  created_at: timestamp("created_at").defaultNow(),
});

// User Progress Tracking
export const skinProgressTracking = pgTable("skin_progress_tracking", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => skincoachUsers.id),
  tracking_date: timestamp("tracking_date").notNull(),
  scores: jsonb("scores").$type<{
    acne: number;
    wrinkles: number;
    sagging: number;
    redness: number;
    dark_spots: number;
    dark_circles: number;
    eye_bags: number;
    texture: number;
    pores: number;
    hydration: number;
  }>(),
  user_notes: text("user_notes"),
  photos: jsonb("photos").$type<string[]>(), // Array of photo URLs
  routine_adherence: integer("routine_adherence"), // 1-100 percentage
  products_used: jsonb("products_used").$type<number[]>(), // Array of product IDs
  created_at: timestamp("created_at").defaultNow(),
});

// Admin Users for SkinCoach Backend
export const skincoachAdmins = pgTable("skincoach_admins", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // "admin", "content_manager", "ai_trainer"
  permissions: jsonb("permissions").$type<string[]>(),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Zod schemas for validation
export const insertSkincoachUserSchema = createInsertSchema(skincoachUsers);
export const selectSkincoachUserSchema = createSelectSchema(skincoachUsers);

export const insertSkinAnalysisResultSchema = createInsertSchema(skinAnalysisResults);
export const selectSkinAnalysisResultSchema = createSelectSchema(skinAnalysisResults);

export const insertSkincoachProductSchema = createInsertSchema(skincoachProducts);
export const selectSkincoachProductSchema = createSelectSchema(skincoachProducts);

export const insertSkincoachAvatarSchema = createInsertSchema(skincoachAvatars);
export const selectSkincoachAvatarSchema = createSelectSchema(skincoachAvatars);

export const insertSkincoachConversationSchema = createInsertSchema(skincoachConversations);
export const selectSkincoachConversationSchema = createSelectSchema(skincoachConversations);

export const insertSkincoachTrainingDataSchema = createInsertSchema(skincoachTrainingData);
export const selectSkincoachTrainingDataSchema = createSelectSchema(skincoachTrainingData);

export type SkincoachUser = typeof skincoachUsers.$inferSelect;
export type InsertSkincoachUser = typeof skincoachUsers.$inferInsert;

export type SkinAnalysisResult = typeof skinAnalysisResults.$inferSelect;
export type InsertSkinAnalysisResult = typeof skinAnalysisResults.$inferInsert;

export type SkincoachProduct = typeof skincoachProducts.$inferSelect;
export type InsertSkincoachProduct = typeof skincoachProducts.$inferInsert;

export type SkincoachAvatar = typeof skincoachAvatars.$inferSelect;
export type InsertSkincoachAvatar = typeof skincoachAvatars.$inferInsert;

export type SkincoachConversation = typeof skincoachConversations.$inferSelect;
export type InsertSkincoachConversation = typeof skincoachConversations.$inferInsert;

export type SkincoachTrainingData = typeof skincoachTrainingData.$inferSelect;
export type InsertSkincoachTrainingData = typeof skincoachTrainingData.$inferInsert;