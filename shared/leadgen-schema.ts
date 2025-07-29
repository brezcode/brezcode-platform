import { pgTable, text, integer, timestamp, boolean, json, serial } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// LeadGen.to Platform Tables
export const leadgenUsers = pgTable("leadgen_users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  company: text("company"),
  industry: text("industry"),
  phone: text("phone"),
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationCode: text("email_verification_code"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const leadgenBusinesses = pgTable("leadgen_businesses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => leadgenUsers.id).notNull(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  website: text("website"),
  description: text("description"),
  targetAudience: text("target_audience"),
  businessGoals: json("business_goals").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leadgenAvatars = pgTable("leadgen_avatars", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => leadgenBusinesses.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // sales, customer_service, technical, etc.
  personality: text("personality"),
  expertise: json("expertise").$type<string[]>(),
  communicationStyle: text("communication_style"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leadgenCampaigns = pgTable("leadgen_campaigns", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => leadgenBusinesses.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // email, sms, linkedin, etc.
  status: text("status").default("draft"), // draft, active, paused, completed
  targetAudience: json("target_audience"),
  content: json("content"),
  metrics: json("metrics"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leadgenLeads = pgTable("leadgen_leads", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => leadgenBusinesses.id).notNull(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  source: text("source"), // website, linkedin, referral, etc.
  status: text("status").default("new"), // new, qualified, contacted, converted
  tags: json("tags").$type<string[]>(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert and Select Schemas
export const insertLeadgenUserSchema = createInsertSchema(leadgenUsers);
export const selectLeadgenUserSchema = createSelectSchema(leadgenUsers);
export type InsertLeadgenUser = z.infer<typeof insertLeadgenUserSchema>;
export type LeadgenUser = z.infer<typeof selectLeadgenUserSchema>;

export const insertLeadgenBusinessSchema = createInsertSchema(leadgenBusinesses);
export const selectLeadgenBusinessSchema = createSelectSchema(leadgenBusinesses);
export type InsertLeadgenBusiness = z.infer<typeof insertLeadgenBusinessSchema>;
export type LeadgenBusiness = z.infer<typeof selectLeadgenBusinessSchema>;

export const insertLeadgenAvatarSchema = createInsertSchema(leadgenAvatars);
export const selectLeadgenAvatarSchema = createSelectSchema(leadgenAvatars);
export type InsertLeadgenAvatar = z.infer<typeof insertLeadgenAvatarSchema>;
export type LeadgenAvatar = z.infer<typeof selectLeadgenAvatarSchema>;

export const insertLeadgenCampaignSchema = createInsertSchema(leadgenCampaigns);
export const selectLeadgenCampaignSchema = createSelectSchema(leadgenCampaigns);
export type InsertLeadgenCampaign = z.infer<typeof insertLeadgenCampaignSchema>;
export type LeadgenCampaign = z.infer<typeof selectLeadgenCampaignSchema>;

export const insertLeadgenLeadSchema = createInsertSchema(leadgenLeads);
export const selectLeadgenLeadSchema = createSelectSchema(leadgenLeads);
export type InsertLeadgenLead = z.infer<typeof insertLeadgenLeadSchema>;
export type LeadgenLead = z.infer<typeof selectLeadgenLeadSchema>;