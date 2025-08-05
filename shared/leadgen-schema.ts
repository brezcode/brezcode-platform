// LEADGEN.TO BUSINESS PLATFORM SCHEMA
// Separate database schema for business analytics backend app
// Database: leadgen_business_db

import { pgTable, text, integer, timestamp, boolean, decimal, jsonb, uuid, date, inet, serial } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

// BUSINESS USERS (LeadGen Platform Users)
export const leadgenBusinessUsers = pgTable('leadgen_business_users', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  isEmailVerified: boolean('is_email_verified').default(false),
  companyName: text('company_name'),
  jobTitle: text('job_title'),
  phone: text('phone'),
  businessAddress: jsonb('business_address'), // {street, city, state, country, postal_code}
  businessType: text('business_type'), // 'healthcare', 'consulting', 'e-commerce', etc.
  companySize: text('company_size'), // '1-10', '11-50', '51-200', '200+'
  profilePhoto: text('profile_photo'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// CLIENT BRANDS & BUSINESSES
export const leadgenBrands = pgTable('leadgen_brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: integer('owner_id').references(() => leadgenBusinessUsers.id).notNull(),
  brandName: text('brand_name').notNull(),
  domain: text('domain').unique(),
  subdomain: text('subdomain').unique(),
  industry: text('industry').notNull(),
  businessModel: text('business_model'), // 'B2B', 'B2C', 'B2B2C'
  targetMarket: text('target_market'),
  brandDescription: text('brand_description'),
  brandValues: text('brand_values').array(),
  logoUrl: text('logo_url'),
  primaryColor: text('primary_color').default('#0ea5e9'),
  secondaryColor: text('secondary_color').default('#f59e0b'),
  fontFamily: text('font_family').default('Inter'),
  isActive: boolean('is_active').default(true),
  subscriptionTier: text('subscription_tier').default('basic'), // 'basic', 'pro', 'enterprise'
  monthlyLeadLimit: integer('monthly_lead_limit').default(100),
  apiKey: text('api_key').unique(),
  webhookUrls: text('webhook_urls').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// BRAND CONFIGURATIONS & LANDING PAGES
export const leadgenBrandConfigs = pgTable('leadgen_brand_configs', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').references(() => leadgenBrands.id).notNull(),
  configType: text('config_type').notNull(), // 'landing_page', 'quiz_config', 'ai_assistant'
  pageSlug: text('page_slug'), // For landing pages
  heroHeadline: text('hero_headline'),
  heroSubheadline: text('hero_subheadline'),
  heroCtaText: text('hero_cta_text'),
  heroImageUrl: text('hero_image_url'),
  trustBadges: jsonb('trust_badges'),
  features: jsonb('features'),
  testimonials: jsonb('testimonials'),
  pricingTiers: jsonb('pricing_tiers'),
  faqs: jsonb('faqs'),
  contactInfo: jsonb('contact_info'),
  seoMeta: jsonb('seo_meta'), // {title, description, keywords}
  conversionTracking: jsonb('conversion_tracking'), // {google_analytics, facebook_pixel, etc.}
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// LEAD CAPTURE & MANAGEMENT
export const leadgenLeads = pgTable('leadgen_leads', {
  id: serial('id').primaryKey(),
  brandId: uuid('brand_id').references(() => leadgenBrands.id).notNull(),
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  leadSource: text('lead_source'), // 'landing_page', 'quiz', 'chat', 'referral'
  leadQualityScore: integer('lead_quality_score'), // 1-100
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  referrerUrl: text('referrer_url'),
  ipAddress: inet('ip_address'),
  location: jsonb('location'), // {city, state, country}
  deviceInfo: jsonb('device_info'), // {device_type, browser, os}
  leadData: jsonb('lead_data'), // Custom form fields, quiz answers, etc.
  leadStatus: text('lead_status').default('new'), // 'new', 'contacted', 'qualified', 'converted', 'lost'
  assignedTo: integer('assigned_to').references(() => leadgenBusinessUsers.id),
  tags: text('tags').array(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// LEAD NURTURING & AUTOMATION
export const leadgenAutomationSequences = pgTable('leadgen_automation_sequences', {
  id: serial('id').primaryKey(),
  brandId: uuid('brand_id').references(() => leadgenBrands.id).notNull(),
  sequenceName: text('sequence_name').notNull(),
  sequenceType: text('sequence_type').notNull(), // 'email', 'sms', 'multi_channel'
  triggerConditions: jsonb('trigger_conditions'), // {lead_source, tags, score_threshold}
  steps: jsonb('steps').notNull(), // Array of automation steps
  isActive: boolean('is_active').default(true),
  totalEnrolled: integer('total_enrolled').default(0),
  conversionRate: decimal('conversion_rate', { precision: 5, scale: 2 }),
  createdBy: integer('created_by').references(() => leadgenBusinessUsers.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// AI BUSINESS ASSISTANT & CHAT
export const leadgenAiChatSessions = pgTable('leadgen_ai_chat_sessions', {
  id: serial('id').primaryKey(),
  brandId: uuid('brand_id').references(() => leadgenBrands.id).notNull(),
  leadId: integer('lead_id').references(() => leadgenLeads.id),
  sessionId: text('session_id').notNull().unique(),
  aiAssistantType: text('ai_assistant_type').default('sales_assistant'), // 'sales', 'support', 'qualifier'
  conversationHistory: jsonb('conversation_history').default([]),
  leadQualificationData: jsonb('lead_qualification_data'),
  intentAnalysis: jsonb('intent_analysis'), // Detected customer intent
  sentimentScore: decimal('sentiment_score', { precision: 3, scale: 2 }), // -1 to 1
  conversionProbability: decimal('conversion_probability', { precision: 5, scale: 2 }), // 0-100%
  recommendedActions: text('recommended_actions').array(),
  escalationNeeded: boolean('escalation_needed').default(false),
  humanHandoffRequested: boolean('human_handoff_requested').default(false),
  sessionOutcome: text('session_outcome'), // 'qualified', 'not_interested', 'scheduled_demo', etc.
  startedAt: timestamp('started_at').defaultNow(),
  endedAt: timestamp('ended_at'),
  createdAt: timestamp('created_at').defaultNow()
})

// ANALYTICS & REPORTING
export const leadgenAnalyticsEvents = pgTable('leadgen_analytics_events', {
  id: serial('id').primaryKey(),
  brandId: uuid('brand_id').references(() => leadgenBrands.id).notNull(),
  leadId: integer('lead_id').references(() => leadgenLeads.id),
  eventType: text('event_type').notNull(), // 'page_view', 'form_submit', 'email_open', 'click'
  eventData: jsonb('event_data'),
  pageUrl: text('page_url'),
  sessionId: text('session_id'),
  timestamp: timestamp('timestamp').defaultNow(),
  createdAt: timestamp('created_at').defaultNow()
})

// BUSINESS PERFORMANCE METRICS
export const leadgenPerformanceMetrics = pgTable('leadgen_performance_metrics', {
  id: serial('id').primaryKey(),
  brandId: uuid('brand_id').references(() => leadgenBrands.id).notNull(),
  metricDate: date('metric_date').notNull(),
  totalVisitors: integer('total_visitors').default(0),
  totalLeads: integer('total_leads').default(0),
  conversionRate: decimal('conversion_rate', { precision: 5, scale: 2 }),
  qualifiedLeads: integer('qualified_leads').default(0),
  costPerLead: decimal('cost_per_lead', { precision: 10, scale: 2 }),
  revenueGenerated: decimal('revenue_generated', { precision: 12, scale: 2 }),
  roi: decimal('roi', { precision: 5, scale: 2 }),
  trafficSources: jsonb('traffic_sources'), // {organic, paid, social, referral}
  topPerformingPages: jsonb('top_performing_pages'),
  createdAt: timestamp('created_at').defaultNow()
})

// SUBSCRIPTION & BILLING
export const leadgenSubscriptions = pgTable('leadgen_subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => leadgenBusinessUsers.id).notNull(),
  brandId: uuid('brand_id').references(() => leadgenBrands.id).notNull(),
  planType: text('plan_type').notNull(), // 'basic', 'pro', 'enterprise'
  billingCycle: text('billing_cycle').notNull(), // 'monthly', 'annual'
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  isActive: boolean('is_active').default(false),
  currentPeriodStart: date('current_period_start'),
  currentPeriodEnd: date('current_period_end'),
  monthlyCost: decimal('monthly_cost', { precision: 10, scale: 2 }),
  annualCost: decimal('annual_cost', { precision: 10, scale: 2 }),
  featuresEnabled: text('features_enabled').array(), // ['ai_assistant', 'automation', 'analytics', 'api_access']
  usageLimits: jsonb('usage_limits'), // {leads_per_month, emails_per_month, storage_gb}
  cancelledAt: timestamp('cancelled_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

// AUTHENTICATION & TEAM MANAGEMENT
export const leadgenUserSessions = pgTable('leadgen_user_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => leadgenBusinessUsers.id).notNull(),
  sessionToken: text('session_token').notNull().unique(),
  deviceInfo: jsonb('device_info'),
  ipAddress: inet('ip_address'),
  lastActivity: timestamp('last_activity').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

// ZOD SCHEMAS FOR VALIDATION
export const insertLeadgenBusinessUserSchema = createInsertSchema(leadgenBusinessUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const insertLeadgenBrandSchema = createInsertSchema(leadgenBrands).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const insertLeadgenBrandConfigSchema = createInsertSchema(leadgenBrandConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const insertLeadgenLeadSchema = createInsertSchema(leadgenLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const insertLeadgenAutomationSequenceSchema = createInsertSchema(leadgenAutomationSequences).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const insertLeadgenAiChatSessionSchema = createInsertSchema(leadgenAiChatSessions).omit({
  id: true,
  startedAt: true,
  createdAt: true
})

// TYPE EXPORTS
export type LeadgenBusinessUser = typeof leadgenBusinessUsers.$inferSelect
export type InsertLeadgenBusinessUser = z.infer<typeof insertLeadgenBusinessUserSchema>

export type LeadgenBrand = typeof leadgenBrands.$inferSelect
export type InsertLeadgenBrand = z.infer<typeof insertLeadgenBrandSchema>

export type LeadgenBrandConfig = typeof leadgenBrandConfigs.$inferSelect
export type InsertLeadgenBrandConfig = z.infer<typeof insertLeadgenBrandConfigSchema>

export type LeadgenLead = typeof leadgenLeads.$inferSelect
export type InsertLeadgenLead = z.infer<typeof insertLeadgenLeadSchema>

export type LeadgenAutomationSequence = typeof leadgenAutomationSequences.$inferSelect
export type InsertLeadgenAutomationSequence = z.infer<typeof insertLeadgenAutomationSequenceSchema>

export type LeadgenAiChatSession = typeof leadgenAiChatSessions.$inferSelect
export type InsertLeadgenAiChatSession = z.infer<typeof insertLeadgenAiChatSessionSchema>