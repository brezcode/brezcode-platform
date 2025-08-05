-- DATABASE MIGRATION GUIDE
-- Complete separation of BrezCode and LeadGen.to platforms
-- This script migrates existing data to separate database structures

-- STEP 1: CREATE NEW SEPARATE DATABASES (Run these as separate database creation commands)
-- CREATE DATABASE brezcode_health_db;
-- CREATE DATABASE leadgen_business_db;

-- STEP 2: MIGRATE EXISTING USER DATA TO APPROPRIATE PLATFORMS

-- 2A: Migrate BrezCode Health Users
-- Users who have quiz_answers or health-related data go to BrezCode database
INSERT INTO brezcode_health_db.brezcode_users (
    id, first_name, last_name, email, password_hash, 
    is_email_verified, phone, created_at
)
SELECT 
    id, first_name, last_name, email, password, 
    is_email_verified, phone_number, created_at
FROM users 
WHERE platform = 'brezcode' 
   OR quiz_answers IS NOT NULL 
   OR id IN (SELECT user_id FROM health_reports);

-- 2B: Migrate LeadGen Business Users  
-- Business users and those with 'leadgen' platform go to LeadGen database
INSERT INTO leadgen_business_db.leadgen_business_users (
    id, first_name, last_name, email, password_hash,
    is_email_verified, phone, created_at
)
SELECT 
    id, first_name, last_name, email, password,
    is_email_verified, phone_number, created_at
FROM users 
WHERE platform = 'leadgen' 
   OR platform IS NULL
   OR id NOT IN (SELECT user_id FROM health_reports WHERE user_id IS NOT NULL);

-- STEP 3: MIGRATE HEALTH DATA TO BREZCODE DATABASE

-- 3A: Migrate Health Assessments
INSERT INTO brezcode_health_db.brezcode_health_assessments (
    user_id, quiz_answers, risk_score, risk_category, 
    user_profile, completed_at
)
SELECT 
    user_id,
    quiz_answers::jsonb,
    risk_score,
    risk_category,
    user_profile,
    created_at
FROM health_reports 
WHERE user_id IS NOT NULL;

-- 3B: Migrate Health Reports
INSERT INTO brezcode_health_db.brezcode_health_reports (
    user_id, assessment_id, report_title, risk_summary,
    key_recommendations, risk_factors, lifestyle_recommendations,
    generated_at
)
SELECT 
    hr.user_id,
    bha.id, -- Link to new assessment
    'Health Assessment Report',
    COALESCE(hr.report_data->>'summary', 'Comprehensive health assessment completed'),
    CASE 
        WHEN hr.recommendations IS NOT NULL 
        THEN string_to_array(hr.recommendations::text, ',')
        ELSE ARRAY['Regular self-examinations', 'Maintain healthy lifestyle']
    END,
    CASE 
        WHEN hr.risk_factors IS NOT NULL 
        THEN string_to_array(hr.risk_factors::text, ',')
        ELSE ARRAY[]::text[]
    END,
    hr.daily_plan,
    hr.created_at
FROM health_reports hr
JOIN brezcode_health_db.brezcode_health_assessments bha ON hr.user_id = bha.user_id
WHERE hr.user_id IS NOT NULL;

-- STEP 4: MIGRATE BRAND DATA TO LEADGEN DATABASE

-- 4A: Migrate Brands
INSERT INTO leadgen_business_db.leadgen_brands (
    id, brand_name, domain, subdomain, industry,
    brand_description, is_active, created_at
)
SELECT 
    id::uuid,
    name,
    domain,
    subdomain,
    COALESCE(industry, 'Healthcare'),
    COALESCE(description, 'AI-powered business automation'),
    is_active,
    created_at
FROM brands;

-- 4B: Migrate Brand Configurations
INSERT INTO leadgen_business_db.leadgen_brand_configs (
    brand_id, config_type, hero_headline, hero_subheadline,
    hero_cta_text, hero_image_url, trust_badges, features,
    testimonials, pricing_tiers, faqs, contact_info
)
SELECT 
    brand_id::uuid,
    'landing_page',
    hero_headline,
    hero_subheadline,
    hero_cta_text,
    hero_image_url,
    trust_badges,
    features,
    testimonials,
    pricing_tiers,
    faqs,
    contact_info
FROM brand_configs;

-- STEP 5: CREATE DEFAULT DATA FOR NEW USERS

-- 5A: Create default health reminder for BrezCode users
INSERT INTO brezcode_health_db.brezcode_health_reminders (
    user_id, reminder_type, title, message, reminder_date,
    is_recurring, recurrence_pattern, priority_level
)
SELECT 
    id,
    'self_exam',
    'Monthly Self-Examination Reminder',
    'It''s time for your monthly breast self-examination. Take a few minutes to check for any changes.',
    DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month',
    true,
    'monthly',
    'high'
FROM brezcode_health_db.brezcode_users;

-- 5B: Create default subscription records
INSERT INTO brezcode_health_db.brezcode_subscriptions (
    user_id, plan_type, is_active, premium_features_enabled
)
SELECT 
    id,
    'free',
    true,
    ARRAY['basic_assessments', 'health_tracking']
FROM brezcode_health_db.brezcode_users;

INSERT INTO leadgen_business_db.leadgen_subscriptions (
    user_id, plan_type, billing_cycle, is_active, features_enabled
)
SELECT 
    id,
    'basic',
    'monthly',
    true,
    ARRAY['lead_capture', 'basic_analytics']
FROM leadgen_business_db.leadgen_business_users;

-- STEP 6: HANDLE CURRENT USER (leedennyps@gmail.com)
-- This user exists in main users table but needs proper platform assignment

-- Check current user data
SELECT 
    id, first_name, last_name, email, platform, quiz_answers,
    created_at
FROM users 
WHERE email = 'leedennyps@gmail.com';

-- If user should be in BrezCode (has health interest):
INSERT INTO brezcode_health_db.brezcode_users (
    id, first_name, last_name, email, password_hash,
    is_email_verified, created_at
) 
SELECT 
    14, 'den', 'lee', 'leedennyps@gmail.com', 
    '$2b$10$czLP1La4f.513xPb20LJweVMZ/HvfBqWxBCT8es5zBKQDUCNzf7JC',
    true, '2025-08-02 08:08:21.197229'
ON CONFLICT (email) DO NOTHING;

-- Create initial health assessment for this user
INSERT INTO brezcode_health_db.brezcode_health_assessments (
    user_id, assessment_type, quiz_answers, risk_category, 
    user_profile, assessment_version
) VALUES (
    14, 'breast_health', 
    '{"initial": true, "needs_assessment": true}',
    'unknown', 'new_user', '1.0'
);

-- STEP 7: UPDATE APPLICATION SCHEMA FILES

-- Update shared/schema.ts to include separate schemas:
-- - brezcode-schema.ts for health platform
-- - leadgen-schema.ts for business platform

-- STEP 8: UPDATE CONNECTION STRINGS
-- Environment variables needed:
-- BREZCODE_DATABASE_URL=postgresql://...brezcode_health_db
-- LEADGEN_DATABASE_URL=postgresql://...leadgen_business_db

-- STEP 9: VERIFICATION QUERIES

-- Verify BrezCode data
SELECT 
    'BrezCode Users' as table_name,
    COUNT(*) as record_count
FROM brezcode_health_db.brezcode_users
UNION ALL
SELECT 
    'BrezCode Health Assessments',
    COUNT(*) 
FROM brezcode_health_db.brezcode_health_assessments
UNION ALL
SELECT 
    'BrezCode Health Reports',
    COUNT(*) 
FROM brezcode_health_db.brezcode_health_reports;

-- Verify LeadGen data  
SELECT 
    'LeadGen Business Users' as table_name,
    COUNT(*) as record_count
FROM leadgen_business_db.leadgen_business_users
UNION ALL
SELECT 
    'LeadGen Brands',
    COUNT(*) 
FROM leadgen_business_db.leadgen_brands
UNION ALL
SELECT 
    'LeadGen Brand Configs',
    COUNT(*) 
FROM leadgen_business_db.leadgen_brand_configs;

-- STEP 10: CLEANUP (Run after verification)
-- After confirming data migration is successful:
-- DROP TABLE users; -- Original unified table
-- DROP TABLE health_reports; -- Migrated to BrezCode
-- DROP TABLE brands; -- Migrated to LeadGen
-- DROP TABLE brand_configs; -- Migrated to LeadGen