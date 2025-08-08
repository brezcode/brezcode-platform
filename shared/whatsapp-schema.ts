import { pgTable, text, timestamp, boolean, serial, integer } from 'drizzle-orm/pg-core';

export const whatsappContacts = pgTable('whatsapp_contacts', {
  id: serial('id').primaryKey(),
  phoneNumber: text('phone_number').notNull().unique(),
  displayName: text('display_name'),
  profileUrl: text('profile_url'),
  conversationContext: text('conversation_context').notNull().default('support'), // 'coaching' | 'sales' | 'support'
  lastActive: timestamp('last_active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const whatsappMessages = pgTable('whatsapp_messages', {
  id: serial('id').primaryKey(),
  phoneNumber: text('phone_number').notNull(),
  messageType: text('message_type').notNull(), // 'text' | 'image' | 'audio' | 'video' | 'document'
  content: text('content'),
  mediaUrl: text('media_url'),
  direction: text('direction').notNull(), // 'inbound' | 'outbound'
  whatsappMessageId: text('whatsapp_message_id'),
  timestamp: timestamp('timestamp').defaultNow(),
  processed: boolean('processed').default(false),
  createdAt: timestamp('created_at').defaultNow()
});

export const whatsappConversations = pgTable('whatsapp_conversations', {
  id: serial('id').primaryKey(),
  phoneNumber: text('phone_number').notNull(),
  context: text('context').notNull(), // 'coaching' | 'sales' | 'support'
  status: text('status').notNull().default('active'), // 'active' | 'closed' | 'paused'
  assignedAgent: text('assigned_agent'), // For human handoff
  metadata: text('metadata'), // JSON string for additional context
  startedAt: timestamp('started_at').defaultNow(),
  lastMessageAt: timestamp('last_message_at'),
  closedAt: timestamp('closed_at')
});

export const whatsappAiSessions = pgTable('whatsapp_ai_sessions', {
  id: serial('id').primaryKey(),
  phoneNumber: text('phone_number').notNull(),
  conversationId: integer('conversation_id').references(() => whatsappConversations.id),
  aiAssistantType: text('ai_assistant_type').notNull(), // 'dr_sakura' | 'sales_assistant' | 'support_agent'
  sessionData: text('session_data'), // JSON string for conversation state
  messageCount: integer('message_count').default(0),
  lastInteractionAt: timestamp('last_interaction_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const whatsappWebhookLogs = pgTable('whatsapp_webhook_logs', {
  id: serial('id').primaryKey(),
  webhookType: text('webhook_type').notNull(), // 'message' | 'status' | 'verification'
  payload: text('payload').notNull(), // JSON string of the webhook payload
  processed: boolean('processed').default(false),
  processingError: text('processing_error'),
  receivedAt: timestamp('received_at').defaultNow(),
  processedAt: timestamp('processed_at')
});

export type WhatsAppContact = typeof whatsappContacts.$inferSelect;
export type NewWhatsAppContact = typeof whatsappContacts.$inferInsert;

export type WhatsAppMessage = typeof whatsappMessages.$inferSelect;
export type NewWhatsAppMessage = typeof whatsappMessages.$inferInsert;

export type WhatsAppConversation = typeof whatsappConversations.$inferSelect;
export type NewWhatsAppConversation = typeof whatsappConversations.$inferInsert;

export type WhatsAppAiSession = typeof whatsappAiSessions.$inferSelect;
export type NewWhatsAppAiSession = typeof whatsappAiSessions.$inferInsert;

export type WhatsAppWebhookLog = typeof whatsappWebhookLogs.$inferSelect;
export type NewWhatsAppWebhookLog = typeof whatsappWebhookLogs.$inferInsert;