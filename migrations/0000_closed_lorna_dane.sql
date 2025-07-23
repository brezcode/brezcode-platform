CREATE TABLE "brand_ai_config" (
	"id" text PRIMARY KEY NOT NULL,
	"brand_id" text NOT NULL,
	"assistant_name" text DEFAULT 'AI Health Assistant',
	"system_prompt" text,
	"temperature" real DEFAULT 0.7,
	"max_tokens" integer DEFAULT 500,
	"model" text DEFAULT 'gpt-4o',
	"expertise" text NOT NULL,
	"personality" text,
	"disclaimers" text[],
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "brand_ai_config_brand_id_unique" UNIQUE("brand_id")
);
--> statement-breakpoint
CREATE TABLE "brand_chat_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"brand_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"knowledge_used" text[]
);
--> statement-breakpoint
CREATE TABLE "brand_chat_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"brand_id" text NOT NULL,
	"session_id" text NOT NULL,
	"user_id" text,
	"language" text DEFAULT 'en',
	"created_at" timestamp DEFAULT now(),
	"last_active_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brand_knowledge_base" (
	"id" text PRIMARY KEY NOT NULL,
	"brand_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"category" text NOT NULL,
	"file_type" text,
	"file_name" text,
	"tags" text[],
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "coaching_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"content_type" varchar NOT NULL,
	"language_code" varchar(5) DEFAULT 'en' NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"sent_at" timestamp,
	"status" varchar DEFAULT 'pending',
	"target_profile" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "coaching_tips" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" varchar NOT NULL,
	"target_profile" varchar NOT NULL,
	"risk_level" varchar NOT NULL,
	"title" varchar NOT NULL,
	"content" text NOT NULL,
	"frequency" varchar DEFAULT 'daily',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "daily_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"interaction_type" varchar NOT NULL,
	"completed" boolean DEFAULT false,
	"response_data" jsonb,
	"content_sent" text,
	"engagement_score" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_data_sync" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"is_apple_health_enabled" boolean DEFAULT false,
	"is_apple_watch_connected" boolean DEFAULT false,
	"last_sync_at" timestamp,
	"sync_frequency" varchar DEFAULT 'daily',
	"enabled_metrics" jsonb DEFAULT '[]'::jsonb,
	"sync_errors" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"date" timestamp NOT NULL,
	"heart_rate_resting" integer,
	"heart_rate_max" integer,
	"heart_rate_variability" real,
	"steps" integer,
	"distance_walking" real,
	"calories_burned" integer,
	"active_minutes" integer,
	"exercise_minutes" integer,
	"stand_hours" integer,
	"sleep_duration" real,
	"sleep_quality" varchar,
	"weight" real,
	"body_fat" real,
	"blood_pressure_systolic" integer,
	"blood_pressure_diastolic" integer,
	"stress_level" varchar,
	"recovery_score" integer,
	"raw_health_data" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"assessment_date" timestamp NOT NULL,
	"health_score" numeric(5, 2) NOT NULL,
	"uncontrollable_score" numeric(5, 2) NOT NULL,
	"improvement_areas" text[],
	"goals_achieved" text[],
	"next_milestone" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"quiz_answers" jsonb NOT NULL,
	"risk_score" numeric(5, 2) NOT NULL,
	"risk_category" varchar NOT NULL,
	"user_profile" varchar NOT NULL,
	"risk_factors" jsonb NOT NULL,
	"recommendations" jsonb NOT NULL,
	"daily_plan" jsonb NOT NULL,
	"report_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "knowledge_base" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" varchar NOT NULL,
	"title" varchar NOT NULL,
	"content" text NOT NULL,
	"source_file" varchar,
	"page_number" integer,
	"evidence_level" varchar NOT NULL,
	"tags" text[],
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(5) NOT NULL,
	"name" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "languages_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"language_code" varchar(5) NOT NULL,
	"key" varchar(200) NOT NULL,
	"value" text NOT NULL,
	"context" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"event_type" varchar NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb,
	"session_id" varchar,
	"user_agent" text,
	"ip_address" varchar
);
--> statement-breakpoint
CREATE TABLE "user_coaching_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"frequency" varchar DEFAULT 'daily' NOT NULL,
	"next_interaction" timestamp NOT NULL,
	"last_interaction" timestamp,
	"streak_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_dashboard_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_strategies" integer DEFAULT 0,
	"active_tools" integer DEFAULT 0,
	"completed_actions" integer DEFAULT 0,
	"customer_interactions" integer DEFAULT 0,
	"leads_generated" integer DEFAULT 0,
	"sales_closed" integer DEFAULT 0,
	"last_login_at" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"report_id" integer,
	"feedback_type" varchar NOT NULL,
	"original_content" text NOT NULL,
	"corrected_content" text,
	"user_comment" text NOT NULL,
	"is_processed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"type" varchar NOT NULL,
	"title" varchar NOT NULL,
	"message" text NOT NULL,
	"scheduled_for" timestamp,
	"sent_at" timestamp,
	"read_at" timestamp,
	"status" varchar DEFAULT 'pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"language_code" varchar(5) DEFAULT 'en' NOT NULL,
	"timezone" varchar(50) DEFAULT 'UTC',
	"date_format" varchar(20) DEFAULT 'MM/DD/YYYY',
	"notification_frequency" varchar DEFAULT 'daily',
	"preferred_contact_method" varchar DEFAULT 'email',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"full_name" text,
	"location" text,
	"timezone" text,
	"phone_number" text,
	"personal_goals" jsonb,
	"work_style" text,
	"communication_preference" text,
	"availability_hours" text,
	"personal_challenges" jsonb,
	"business_name" text,
	"industry" text,
	"business_model" text,
	"target_audience" text,
	"monthly_revenue" text,
	"team_size" text,
	"marketing_channels" jsonb,
	"business_challenges" jsonb,
	"business_goals" jsonb,
	"growth_timeline" text,
	"marketing_budget" text,
	"business_tools" jsonb,
	"unique_value" text,
	"customer_acquisition" text,
	"customer_service_needs" text,
	"preferences" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_tool_usage" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"tool_name" text NOT NULL,
	"usage_count" integer DEFAULT 0,
	"last_used" timestamp,
	"is_active" boolean DEFAULT true,
	"configuration" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"is_email_verified" boolean DEFAULT false,
	"quiz_answers" jsonb,
	"subscription_tier" text DEFAULT null,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"is_subscription_active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"platform" text DEFAULT 'leadgen' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "leadgen_ai_chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"conversation_id" text NOT NULL,
	"messages" jsonb NOT NULL,
	"ai_personality" text,
	"purpose" text,
	"metrics" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leadgen_dashboard_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_strategies" integer DEFAULT 0,
	"active_tools" integer DEFAULT 0,
	"completed_actions" integer DEFAULT 0,
	"customer_interactions" integer DEFAULT 0,
	"leads_generated" integer DEFAULT 0,
	"sales_closed" integer DEFAULT 0,
	"ai_conversations" integer DEFAULT 0,
	"avatar_training_minutes" integer DEFAULT 0,
	"landing_pages_created" integer DEFAULT 0,
	"email_campaigns_sent" integer DEFAULT 0,
	"sms_campaigns_sent" integer DEFAULT 0,
	"last_login_at" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leadgen_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"full_name" text,
	"location" text,
	"timezone" text,
	"phone_number" text,
	"work_style" text,
	"communication_preference" text,
	"availability_hours" text,
	"personal_goals" jsonb,
	"personal_challenges" jsonb,
	"business_name" text,
	"industry" text,
	"business_model" text,
	"target_audience" text,
	"monthly_revenue" text,
	"team_size" text,
	"marketing_channels" jsonb,
	"business_challenges" jsonb,
	"business_goals" jsonb,
	"growth_timeline" text,
	"marketing_budget" text,
	"business_tools" jsonb,
	"unique_value" text,
	"customer_acquisition" text,
	"customer_service_needs" text,
	"preferences" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leadgen_strategies" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"action_steps" jsonb NOT NULL,
	"priority" text NOT NULL,
	"estimated_impact" text,
	"timeline" text,
	"is_completed" boolean DEFAULT false,
	"automation_available" boolean DEFAULT false,
	"results" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leadgen_tool_usage" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"tool_name" text NOT NULL,
	"usage_count" integer DEFAULT 0,
	"last_used" timestamp,
	"is_active" boolean DEFAULT true,
	"configuration" jsonb,
	"performance_metrics" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leadgen_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"is_email_verified" boolean DEFAULT false,
	"subscription_tier" text DEFAULT null,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"is_subscription_active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "leadgen_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "brezcode_ai_chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"conversation_id" text NOT NULL,
	"messages" jsonb NOT NULL,
	"health_focus" text,
	"risk_context" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brezcode_coaching_tips" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" varchar NOT NULL,
	"target_profile" varchar NOT NULL,
	"risk_level" varchar NOT NULL,
	"title" varchar NOT NULL,
	"content" text NOT NULL,
	"actionable" boolean DEFAULT true,
	"evidence_based" boolean DEFAULT true,
	"frequency" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brezcode_dashboard_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"weekly_goal_progress" integer DEFAULT 0,
	"current_streak" integer DEFAULT 0,
	"total_activities" integer DEFAULT 0,
	"weekly_minutes" integer DEFAULT 0,
	"health_score" integer DEFAULT 0,
	"completed_assessments" integer DEFAULT 0,
	"last_assessment_date" timestamp,
	"risk_improvement_score" numeric(5, 2),
	"last_login_at" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brezcode_health_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"duration" integer NOT NULL,
	"instructions" text,
	"scheduled_date" timestamp NOT NULL,
	"completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brezcode_health_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"metric_type" text NOT NULL,
	"value" real NOT NULL,
	"unit" text NOT NULL,
	"recorded_at" timestamp NOT NULL,
	"source" text DEFAULT 'apple_health',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brezcode_health_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"quiz_answers" jsonb NOT NULL,
	"risk_score" numeric(5, 2) NOT NULL,
	"risk_category" varchar NOT NULL,
	"user_profile" varchar NOT NULL,
	"risk_factors" jsonb NOT NULL,
	"recommendations" jsonb NOT NULL,
	"daily_plan" jsonb NOT NULL,
	"report_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brezcode_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"is_email_verified" boolean DEFAULT false,
	"quiz_answers" jsonb,
	"health_profile" text,
	"risk_level" text,
	"subscription_tier" text DEFAULT null,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"is_subscription_active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "brezcode_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "brand_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"hero_headline" text NOT NULL,
	"hero_subheadline" text NOT NULL,
	"hero_cta_text" varchar(100) NOT NULL,
	"hero_image_url" varchar(500),
	"trust_badges" jsonb,
	"logo_url" varchar(500),
	"primary_color" varchar(7) DEFAULT '#0ea5e9',
	"secondary_color" varchar(7) DEFAULT '#f59e0b',
	"font_family" varchar(100) DEFAULT 'Inter',
	"how_it_works_steps" jsonb,
	"features" jsonb,
	"testimonials" jsonb,
	"review_count" text,
	"average_rating" numeric(2, 1),
	"technical_specs" jsonb,
	"pricing_tiers" jsonb,
	"faqs" jsonb,
	"final_cta_headline" text NOT NULL,
	"final_cta_text" varchar(100) NOT NULL,
	"company_description" text NOT NULL,
	"contact_info" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brand_customer_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"event_data" jsonb,
	"session_id" varchar(100),
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brand_customer_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"assessment_type" varchar(100) NOT NULL,
	"responses" jsonb NOT NULL,
	"results" jsonb,
	"completed_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brand_customer_chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"session_id" uuid DEFAULT gen_random_uuid(),
	"messages" jsonb NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_message_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brand_customer_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"feature_id" uuid NOT NULL,
	"access_level" varchar(50) DEFAULT 'basic',
	"usage_count" integer DEFAULT 0,
	"usage_limit" integer,
	"last_used" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brand_customer_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"tier" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'active',
	"stripe_subscription_id" varchar(100),
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"cancelled_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brand_customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(100),
	"first_name" varchar(100),
	"last_name" varchar(100),
	"phone" varchar(20),
	"password_hash" varchar(255),
	"is_email_verified" boolean DEFAULT false,
	"is_phone_verified" boolean DEFAULT false,
	"profile_data" jsonb,
	"preferences" jsonb,
	"last_active" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brand_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"feature_id" uuid NOT NULL,
	"is_enabled" boolean DEFAULT true,
	"configuration" jsonb,
	"enrolled_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brand_quiz_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"quiz_title" varchar(255) NOT NULL,
	"quiz_description" text NOT NULL,
	"health_focus" varchar(100) NOT NULL,
	"custom_questions" jsonb,
	"risk_factors" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"subdomain" varchar(100) NOT NULL,
	"custom_domain" varchar(255),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "brands_subdomain_unique" UNIQUE("subdomain")
);
--> statement-breakpoint
CREATE TABLE "features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"category" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "activity_completions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"template_id" uuid NOT NULL,
	"scheduled_activity_id" uuid,
	"completed_date" date NOT NULL,
	"duration" integer,
	"intensity" varchar(20),
	"mood" varchar(20),
	"notes" text,
	"achievements" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_activity_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"category" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"instructions" jsonb NOT NULL,
	"duration" integer NOT NULL,
	"difficulty" varchar(20) NOT NULL,
	"benefits" jsonb NOT NULL,
	"precautions" jsonb,
	"video_url" varchar(500),
	"image_url" varchar(500),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"preferred_time" varchar(20),
	"reminder_settings" jsonb NOT NULL,
	"fitness_level" varchar(20) NOT NULL,
	"health_goals" jsonb NOT NULL,
	"medical_conditions" jsonb,
	"available_days" jsonb NOT NULL,
	"session_duration" integer DEFAULT 30,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"scheduled_activity_id" uuid NOT NULL,
	"reminder_type" varchar(20) NOT NULL,
	"reminder_time" timestamp NOT NULL,
	"message" text NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_streaks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"category" varchar(50) NOT NULL,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"last_activity_date" date,
	"total_activities" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scheduled_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schedule_id" uuid NOT NULL,
	"template_id" uuid NOT NULL,
	"scheduled_date" date NOT NULL,
	"scheduled_time" varchar(8),
	"status" varchar(20) DEFAULT 'pending',
	"completed_at" timestamp,
	"notes" text,
	"rating" integer,
	"feedback" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"business_name" text NOT NULL,
	"industry" text NOT NULL,
	"business_type" text NOT NULL,
	"target_audience" text NOT NULL,
	"current_revenue" text,
	"team_size" integer,
	"marketing_channels" jsonb DEFAULT '[]'::jsonb,
	"current_challenges" jsonb DEFAULT '[]'::jsonb,
	"goals" jsonb DEFAULT '[]'::jsonb,
	"timeline" text,
	"budget" text,
	"current_tools" jsonb DEFAULT '[]'::jsonb,
	"competitor_analysis" jsonb DEFAULT '{}'::jsonb,
	"unique_value_prop" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_strategies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_profile_id" uuid NOT NULL,
	"strategy_title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"priority" text NOT NULL,
	"estimated_impact" text,
	"time_to_implement" text,
	"required_resources" jsonb DEFAULT '[]'::jsonb,
	"action_plan" jsonb DEFAULT '[]'::jsonb,
	"kpi_metrics" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'pending',
	"ai_generated" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "onboarding_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_text" text NOT NULL,
	"question_type" text NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb,
	"category" text NOT NULL,
	"order" integer NOT NULL,
	"required" boolean DEFAULT true,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "onboarding_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"response" jsonb,
	"completed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "strategy_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"strategy_id" uuid NOT NULL,
	"action_step" text NOT NULL,
	"status" text NOT NULL,
	"automation_used" boolean DEFAULT false,
	"results" jsonb DEFAULT '{}'::jsonb,
	"metrics" jsonb DEFAULT '{}'::jsonb,
	"notes" text,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roleplay_feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"session_id" integer NOT NULL,
	"feedback_type" text NOT NULL,
	"comment" text NOT NULL,
	"suggestion" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roleplay_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"sender" text NOT NULL,
	"message" text NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"metadata" json
);
--> statement-breakpoint
CREATE TABLE "roleplay_scenarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"assistant_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"customer_type" text NOT NULL,
	"scenario" text NOT NULL,
	"objectives" json NOT NULL,
	"timeframe_mins" integer DEFAULT 10,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "roleplay_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"scenario_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"assistant_id" integer NOT NULL,
	"status" text NOT NULL,
	"start_time" timestamp DEFAULT now(),
	"end_time" timestamp,
	"customer_persona" text NOT NULL,
	"session_notes" text,
	"score" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_training_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"response_time" integer,
	"empathy_score" integer,
	"accuracy_score" integer,
	"sales_effectiveness_score" integer,
	"customer_satisfaction_score" integer,
	"improvement_areas" jsonb,
	"strengths" jsonb,
	"recommendations" jsonb,
	"completed_scenarios" integer DEFAULT 0,
	"total_training_hours" integer DEFAULT 0,
	"skill_level" text DEFAULT 'beginner',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_training_dialogues" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"message_order" integer NOT NULL,
	"speaker" text NOT NULL,
	"message" text NOT NULL,
	"message_type" text NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"needs_improvement" boolean DEFAULT false,
	"trainer_feedback" text,
	"suggested_response" text,
	"feedback_category" text,
	"is_reviewed" boolean DEFAULT false,
	"reviewed_at" timestamp,
	"reviewed_by" integer
);
--> statement-breakpoint
CREATE TABLE "ai_training_knowledge" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand_id" integer NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"keywords" jsonb,
	"priority" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_training_scenarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"scenario_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" text NOT NULL,
	"customer_persona" jsonb NOT NULL,
	"objectives" jsonb NOT NULL,
	"success_criteria" jsonb NOT NULL,
	"context" jsonb NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_training_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"scenario_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"session_name" text NOT NULL,
	"ai_assistant_role" text NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"duration" integer,
	"performance_score" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "code_patterns" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "code_patterns_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"session_id" integer,
	"pattern_name" text NOT NULL,
	"description" text NOT NULL,
	"code_example" text NOT NULL,
	"technology" text NOT NULL,
	"category" text NOT NULL,
	"use_count" integer DEFAULT 0,
	"success_rate" integer DEFAULT 100,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coding_context" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "coding_context_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"context_type" varchar(30) NOT NULL,
	"context_key" text NOT NULL,
	"context_value" jsonb NOT NULL,
	"priority" integer DEFAULT 1,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coding_metrics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "coding_metrics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"session_id" integer,
	"metric_type" varchar(30) NOT NULL,
	"metric_value" integer NOT NULL,
	"technology" text,
	"date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coding_sessions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "coding_sessions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"technologies" jsonb DEFAULT '[]'::jsonb,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "debugging_solutions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "debugging_solutions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"session_id" integer,
	"problem_description" text NOT NULL,
	"error_message" text,
	"solution" text NOT NULL,
	"code_before_fix" text,
	"code_after_fix" text,
	"technology" text NOT NULL,
	"time_to_solve" integer,
	"difficulty" varchar(10) DEFAULT 'medium',
	"is_verified" boolean DEFAULT false,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompting_strategies" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "prompting_strategies_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"strategy_name" text NOT NULL,
	"prompt_template" text NOT NULL,
	"description" text NOT NULL,
	"use_case" text NOT NULL,
	"success_examples" jsonb DEFAULT '[]'::jsonb,
	"effectiveness" integer DEFAULT 50,
	"times_used" integer DEFAULT 0,
	"avg_time_to_solution" integer,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation_feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"helpfulness_rating" integer,
	"accuracy_rating" integer,
	"clarity_rating" integer,
	"user_asked_followup" boolean DEFAULT false,
	"user_implemented_solution" boolean,
	"solution_worked" boolean,
	"user_came_back_with_same_problem" boolean DEFAULT false,
	"what_worked" text,
	"what_didnt_work" text,
	"suggestions" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversation_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"session_id" text NOT NULL,
	"user_message" text NOT NULL,
	"ai_response" text NOT NULL,
	"message_type" text NOT NULL,
	"technology" text,
	"problem_type" text,
	"difficulty" text,
	"was_helpful" boolean,
	"followup_needed" boolean,
	"error_resolved" boolean,
	"response_time" integer,
	"response_length" integer,
	"code_examples_count" integer,
	"user_agent" text,
	"ip_address" text,
	"timestamp" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "extracted_knowledge" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"knowledge_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" jsonb,
	"code_example" text,
	"technology" text NOT NULL,
	"tags" jsonb,
	"times_used" integer DEFAULT 0,
	"times_successful" integer DEFAULT 0,
	"average_helpfulness" real DEFAULT 0,
	"source_conversation_id" integer,
	"extracted_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"confidence" real DEFAULT 0.8,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "failed_approaches" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"conversation_id" integer,
	"approach_description" text NOT NULL,
	"error_message" text,
	"technology" text NOT NULL,
	"context" jsonb,
	"failure_reason" text,
	"user_feedback" text,
	"should_avoid" boolean DEFAULT true,
	"alternative_suggestion" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_learning_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"primary_languages" jsonb,
	"experience_level" text,
	"preferred_frameworks" jsonb,
	"communication_style" text,
	"prefers_detailed_explanations" boolean DEFAULT true,
	"prefers_code_examples" boolean DEFAULT true,
	"prefers_step_by_step" boolean DEFAULT false,
	"frequent_mistakes" jsonb,
	"successful_patterns" jsonb,
	"avoided_approaches" jsonb,
	"total_conversations" integer DEFAULT 0,
	"average_helpfulness" real DEFAULT 0,
	"most_common_problems" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_learning_profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "coaching_content" ADD CONSTRAINT "coaching_content_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_interactions" ADD CONSTRAINT "daily_interactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_data_sync" ADD CONSTRAINT "health_data_sync_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_metrics" ADD CONSTRAINT "health_metrics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_progress" ADD CONSTRAINT "health_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_reports" ADD CONSTRAINT "health_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_analytics" ADD CONSTRAINT "user_analytics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_coaching_schedules" ADD CONSTRAINT "user_coaching_schedules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_dashboard_stats" ADD CONSTRAINT "user_dashboard_stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_feedback" ADD CONSTRAINT "user_feedback_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_feedback" ADD CONSTRAINT "user_feedback_report_id_health_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."health_reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tool_usage" ADD CONSTRAINT "user_tool_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leadgen_ai_chats" ADD CONSTRAINT "leadgen_ai_chats_user_id_leadgen_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."leadgen_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leadgen_dashboard_stats" ADD CONSTRAINT "leadgen_dashboard_stats_user_id_leadgen_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."leadgen_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leadgen_profiles" ADD CONSTRAINT "leadgen_profiles_user_id_leadgen_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."leadgen_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leadgen_strategies" ADD CONSTRAINT "leadgen_strategies_user_id_leadgen_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."leadgen_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leadgen_tool_usage" ADD CONSTRAINT "leadgen_tool_usage_user_id_leadgen_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."leadgen_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brezcode_ai_chats" ADD CONSTRAINT "brezcode_ai_chats_user_id_brezcode_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."brezcode_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brezcode_dashboard_stats" ADD CONSTRAINT "brezcode_dashboard_stats_user_id_brezcode_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."brezcode_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brezcode_health_activities" ADD CONSTRAINT "brezcode_health_activities_user_id_brezcode_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."brezcode_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brezcode_health_metrics" ADD CONSTRAINT "brezcode_health_metrics_user_id_brezcode_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."brezcode_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brezcode_health_reports" ADD CONSTRAINT "brezcode_health_reports_user_id_brezcode_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."brezcode_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_configs" ADD CONSTRAINT "brand_configs_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_customer_analytics" ADD CONSTRAINT "brand_customer_analytics_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_customer_analytics" ADD CONSTRAINT "brand_customer_analytics_customer_id_brand_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."brand_customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_customer_assessments" ADD CONSTRAINT "brand_customer_assessments_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_customer_assessments" ADD CONSTRAINT "brand_customer_assessments_customer_id_brand_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."brand_customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_customer_chats" ADD CONSTRAINT "brand_customer_chats_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_customer_chats" ADD CONSTRAINT "brand_customer_chats_customer_id_brand_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."brand_customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_customer_features" ADD CONSTRAINT "brand_customer_features_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_customer_features" ADD CONSTRAINT "brand_customer_features_customer_id_brand_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."brand_customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_customer_features" ADD CONSTRAINT "brand_customer_features_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."features"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_customer_subscriptions" ADD CONSTRAINT "brand_customer_subscriptions_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_customer_subscriptions" ADD CONSTRAINT "brand_customer_subscriptions_customer_id_brand_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."brand_customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_customers" ADD CONSTRAINT "brand_customers_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_features" ADD CONSTRAINT "brand_features_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_features" ADD CONSTRAINT "brand_features_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."features"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_quiz_configs" ADD CONSTRAINT "brand_quiz_configs_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_training_analytics" ADD CONSTRAINT "ai_training_analytics_session_id_ai_training_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."ai_training_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_training_dialogues" ADD CONSTRAINT "ai_training_dialogues_session_id_ai_training_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."ai_training_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_training_sessions" ADD CONSTRAINT "ai_training_sessions_scenario_id_ai_training_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."ai_training_scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_feedback" ADD CONSTRAINT "conversation_feedback_conversation_id_conversation_history_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation_history"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extracted_knowledge" ADD CONSTRAINT "extracted_knowledge_source_conversation_id_conversation_history_id_fk" FOREIGN KEY ("source_conversation_id") REFERENCES "public"."conversation_history"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "failed_approaches" ADD CONSTRAINT "failed_approaches_conversation_id_conversation_history_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation_history"("id") ON DELETE no action ON UPDATE no action;