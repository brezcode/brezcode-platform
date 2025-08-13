import { pgTable, serial, text, integer, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// AI Training Scenarios
export const aiTrainingScenarios = pgTable('ai_training_scenarios', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id').notNull(),
  userId: integer('user_id').notNull(), // Brand owner who created the scenario
  scenarioType: text('scenario_type').notNull(), // 'lead_generation', 'customer_service', 'sales', 'support'
  title: text('title').notNull(),
  description: text('description').notNull(),
  difficulty: text('difficulty').notNull(), // 'beginner', 'intermediate', 'advanced'
  customerPersona: jsonb('customer_persona').notNull(), // Customer profile and behavior
  objectives: jsonb('objectives').notNull(), // What the AI should accomplish
  successCriteria: jsonb('success_criteria').notNull(), // How to measure success
  context: jsonb('context').notNull(), // Background information, company details
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// AI Training Sessions (Role-play sessions)
export const aiTrainingSessions = pgTable('ai_training_sessions', {
  id: serial('id').primaryKey(),
  scenarioId: integer('scenario_id').notNull().references(() => aiTrainingScenarios.id),
  userId: integer('user_id').notNull(), // AI trainer (brand owner or team member)
  sessionName: text('session_name').notNull(),
  aiAssistantRole: text('ai_assistant_role').notNull(), // 'sales_rep', 'support_agent', 'lead_qualifier'
  status: text('status').notNull().default('in_progress'), // 'in_progress', 'completed', 'reviewed'
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  duration: integer('duration'), // Session duration in minutes
  performanceScore: integer('performance_score'), // 0-100 score
  createdAt: timestamp('created_at').defaultNow()
});

// AI Training Dialogues (Individual messages in role-play)
export const aiTrainingDialogues = pgTable('ai_training_dialogues', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').notNull().references(() => aiTrainingSessions.id),
  messageOrder: integer('message_order').notNull(), // Order of message in conversation
  speaker: text('speaker').notNull(), // 'customer', 'ai_assistant', 'trainer'
  message: text('message').notNull(),
  messageType: text('message_type').notNull(), // 'text', 'action', 'emotion', 'system'
  timestamp: timestamp('timestamp').defaultNow(),
  
  // Training feedback fields
  needsImprovement: boolean('needs_improvement').default(false),
  trainerFeedback: text('trainer_feedback'), // Brand owner's feedback on this specific message
  suggestedResponse: text('suggested_response'), // What the AI should have said
  feedbackCategory: text('feedback_category'), // 'tone', 'accuracy', 'empathy', 'sales_technique'
  isReviewed: boolean('is_reviewed').default(false),
  reviewedAt: timestamp('reviewed_at'),
  reviewedBy: integer('reviewed_by') // User ID who provided feedback
});

// AI Training Performance Analytics
export const aiTrainingAnalytics = pgTable('ai_training_analytics', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').notNull().references(() => aiTrainingSessions.id),
  userId: integer('user_id').notNull(),
  
  // Performance metrics
  responseTime: integer('response_time'), // Average response time in seconds
  empathyScore: integer('empathy_score'), // 0-100
  accuracyScore: integer('accuracy_score'), // 0-100
  salesEffectivenessScore: integer('sales_effectiveness_score'), // 0-100
  customerSatisfactionScore: integer('customer_satisfaction_score'), // 0-100
  
  // Improvement areas
  improvementAreas: jsonb('improvement_areas'), // Array of areas needing work
  strengths: jsonb('strengths'), // Array of strong performance areas
  recommendations: jsonb('recommendations'), // Specific training recommendations
  
  // Training progress
  completedScenarios: integer('completed_scenarios').default(0),
  totalTrainingHours: integer('total_training_hours').default(0),
  skillLevel: text('skill_level').default('beginner'), // 'beginner', 'intermediate', 'advanced', 'expert'
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// AI Knowledge Base for Training
export const aiTrainingKnowledge = pgTable('ai_training_knowledge', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id').notNull(),
  category: text('category').notNull(), // 'product_info', 'company_policy', 'sales_scripts', 'faq'
  title: text('title').notNull(),
  content: text('content').notNull(),
  keywords: jsonb('keywords'), // For search functionality
  priority: integer('priority').default(1), // 1-5, higher is more important
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Insert schemas for validation
export const insertAiTrainingScenarioSchema = createInsertSchema(aiTrainingScenarios).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertAiTrainingSessionSchema = createInsertSchema(aiTrainingSessions).omit({
  id: true,
  createdAt: true
});

export const insertAiTrainingDialogueSchema = createInsertSchema(aiTrainingDialogues).omit({
  id: true,
  timestamp: true
});

export const insertAiTrainingAnalyticsSchema = createInsertSchema(aiTrainingAnalytics).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertAiTrainingKnowledgeSchema = createInsertSchema(aiTrainingKnowledge).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Type exports
export type AiTrainingScenario = typeof aiTrainingScenarios.$inferSelect;
export type InsertAiTrainingScenario = z.infer<typeof insertAiTrainingScenarioSchema>;

export type AiTrainingSession = typeof aiTrainingSessions.$inferSelect;
export type InsertAiTrainingSession = z.infer<typeof insertAiTrainingSessionSchema>;

export type AiTrainingDialogue = typeof aiTrainingDialogues.$inferSelect;
export type InsertAiTrainingDialogue = z.infer<typeof insertAiTrainingDialogueSchema>;

export type AiTrainingAnalytics = typeof aiTrainingAnalytics.$inferSelect;
export type InsertAiTrainingAnalytics = z.infer<typeof insertAiTrainingAnalyticsSchema>;

export type AiTrainingKnowledge = typeof aiTrainingKnowledge.$inferSelect;
export type InsertAiTrainingKnowledge = z.infer<typeof insertAiTrainingKnowledgeSchema>;