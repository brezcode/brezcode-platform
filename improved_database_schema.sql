-- IMPROVED DATABASE SCHEMA FOR LEADGEN + BREZCODE PLATFORM
-- Addresses current issues and provides unified user management

-- 1. UNIFIED USER SYSTEM
CREATE TABLE unified_users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN DEFAULT false,
    phone VARCHAR(20),
    platform_access TEXT[] DEFAULT ARRAY['leadgen'], -- Multi-platform support
    profile_photo TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. PLATFORM-SPECIFIC PROFILES
CREATE TABLE user_platform_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES unified_users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'leadgen' | 'brezcode'
    profile_data JSONB DEFAULT '{}',
    subscription_tier VARCHAR(50) DEFAULT 'free',
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    is_subscription_active BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, platform)
);

-- 3. BREZCODE HEALTH ASSESSMENTS
CREATE TABLE brezcode_health_assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES unified_users(id) ON DELETE CASCADE,
    quiz_answers JSONB NOT NULL,
    risk_score DECIMAL(5,2),
    risk_category VARCHAR(50), -- 'low' | 'moderate' | 'high'
    user_profile VARCHAR(50), -- 'teenager' | 'premenopausal' | etc.
    assessment_version VARCHAR(10) DEFAULT '1.0',
    bmi DECIMAL(5,2),
    assessment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. BREZCODE HEALTH REPORTS
CREATE TABLE brezcode_health_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES unified_users(id) ON DELETE CASCADE,
    assessment_id INTEGER REFERENCES brezcode_health_assessments(id) ON DELETE CASCADE,
    report_data JSONB NOT NULL,
    daily_plan JSONB,
    recommendations TEXT[],
    risk_factors TEXT[],
    follow_up_timeline JSONB,
    coaching_focus TEXT[],
    personalized_plan JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. HEALTH TRACKING & PROGRESS
CREATE TABLE brezcode_health_metrics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES unified_users(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- 'weight', 'exercise', 'mood', etc.
    value DECIMAL(10,2),
    unit VARCHAR(20),
    notes TEXT,
    recorded_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. DAILY ACTIVITIES & COMPLIANCE
CREATE TABLE brezcode_daily_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES unified_users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    activity_description TEXT,
    is_completed BOOLEAN DEFAULT false,
    completion_date DATE,
    notes TEXT,
    scheduled_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. AI CHAT SESSIONS (Cross-platform)
CREATE TABLE ai_chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES unified_users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    session_id TEXT UNIQUE NOT NULL,
    ai_assistant_type VARCHAR(50), -- 'dr_sakura', 'business_coach', etc.
    conversation_history JSONB DEFAULT '[]',
    context_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    started_at TIMESTAMP DEFAULT NOW(),
    last_message_at TIMESTAMP DEFAULT NOW()
);

-- 8. NOTIFICATIONS & REMINDERS
CREATE TABLE user_notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES unified_users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    scheduled_for TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 9. AUTHENTICATION & SESSIONS
CREATE TABLE user_auth_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES unified_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    platform VARCHAR(50) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 10. EMAIL VERIFICATION
CREATE TABLE email_verifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES unified_users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    verification_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_users_email ON unified_users(email);
CREATE INDEX idx_platform_profiles_user_platform ON user_platform_profiles(user_id, platform);
CREATE INDEX idx_health_assessments_user ON brezcode_health_assessments(user_id);
CREATE INDEX idx_health_reports_user ON brezcode_health_reports(user_id);
CREATE INDEX idx_health_metrics_user_date ON brezcode_health_metrics(user_id, recorded_date);
CREATE INDEX idx_daily_activities_user_date ON brezcode_daily_activities(user_id, scheduled_date);
CREATE INDEX idx_chat_sessions_user_platform ON ai_chat_sessions(user_id, platform);
CREATE INDEX idx_notifications_user_unread ON user_notifications(user_id, is_read);

-- MIGRATION SCRIPT TO MOVE EXISTING DATA
-- This would move data from current 'users' table to new structure
INSERT INTO unified_users (id, first_name, last_name, email, password_hash, is_email_verified, phone, created_at)
SELECT id, first_name, last_name, email, password, is_email_verified, phone_number, created_at 
FROM users;

-- Create platform profiles for existing users
INSERT INTO user_platform_profiles (user_id, platform, subscription_tier, stripe_customer_id, stripe_subscription_id, is_subscription_active)
SELECT id, 
       CASE WHEN platform = 'leadgen' THEN 'leadgen' ELSE 'brezcode' END,
       COALESCE(subscription_tier, 'free'),
       stripe_customer_id,
       stripe_subscription_id,
       COALESCE(is_subscription_active, false)
FROM users;