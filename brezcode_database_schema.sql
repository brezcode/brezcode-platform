-- BREZCODE PERSONAL HEALTH PLATFORM DATABASE
-- Completely separate database for breast health users
-- Frontend personal application focused on health coaching

-- 1. BREZCODE USERS (Personal Health Users)
CREATE TABLE brezcode_users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN DEFAULT false,
    phone VARCHAR(20),
    date_of_birth DATE,
    profile_photo TEXT,
    emergency_contact JSONB, -- {name, phone, relationship}
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. HEALTH ASSESSMENTS & RISK ANALYSIS
CREATE TABLE brezcode_health_assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES brezcode_users(id) ON DELETE CASCADE,
    assessment_type VARCHAR(50) DEFAULT 'breast_health', -- future: 'general', 'reproductive', etc.
    quiz_answers JSONB NOT NULL,
    risk_score DECIMAL(5,2),
    risk_category VARCHAR(50), -- 'low', 'moderate', 'high', 'very_high'
    user_profile VARCHAR(50), -- 'teenager', 'premenopausal', 'postmenopausal', 'pregnant'
    bmi DECIMAL(5,2),
    family_history JSONB,
    lifestyle_factors JSONB,
    assessment_version VARCHAR(10) DEFAULT '1.0',
    completed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. PERSONALIZED HEALTH REPORTS
CREATE TABLE brezcode_health_reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES brezcode_users(id) ON DELETE CASCADE,
    assessment_id INTEGER REFERENCES brezcode_health_assessments(id) ON DELETE CASCADE,
    report_title VARCHAR(255) NOT NULL,
    risk_summary TEXT NOT NULL,
    key_recommendations TEXT[] NOT NULL,
    risk_factors TEXT[],
    protective_factors TEXT[],
    screening_schedule JSONB, -- {next_mammogram, next_clinical_exam, self_exam_frequency}
    lifestyle_recommendations JSONB,
    dietary_suggestions TEXT[],
    exercise_plan JSONB,
    follow_up_timeline JSONB,
    doctor_discussion_points TEXT[],
    generated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP, -- When report should be refreshed
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. DAILY HEALTH ACTIVITIES & COMPLIANCE
CREATE TABLE brezcode_daily_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES brezcode_users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL, -- 'self_exam', 'exercise', 'medication', 'nutrition'
    activity_name VARCHAR(255) NOT NULL,
    description TEXT,
    recommended_frequency VARCHAR(50), -- 'daily', 'weekly', 'monthly'
    is_completed BOOLEAN DEFAULT false,
    completion_date DATE,
    completion_notes TEXT,
    reminder_time TIME,
    scheduled_date DATE DEFAULT CURRENT_DATE,
    streak_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. HEALTH METRICS TRACKING
CREATE TABLE brezcode_health_metrics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES brezcode_users(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- 'weight', 'mood', 'energy', 'symptoms', 'pain_level'
    value DECIMAL(10,2),
    text_value TEXT, -- For qualitative metrics
    unit VARCHAR(20),
    severity_level INTEGER, -- 1-10 scale for symptoms/pain
    body_location VARCHAR(100), -- For symptom tracking
    notes TEXT,
    recorded_date DATE DEFAULT CURRENT_DATE,
    recorded_time TIME DEFAULT CURRENT_TIME,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. AI HEALTH COACHING SESSIONS (Dr. Sakura)
CREATE TABLE brezcode_ai_coaching_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES brezcode_users(id) ON DELETE CASCADE,
    session_id TEXT UNIQUE NOT NULL,
    ai_coach_name VARCHAR(100) DEFAULT 'Dr. Sakura',
    conversation_history JSONB DEFAULT '[]',
    session_focus VARCHAR(100), -- 'risk_discussion', 'lifestyle_coaching', 'emotional_support'
    mood_before INTEGER, -- 1-10 scale
    mood_after INTEGER, -- 1-10 scale
    key_insights TEXT[],
    action_items TEXT[],
    follow_up_needed BOOLEAN DEFAULT false,
    follow_up_date DATE,
    session_duration INTEGER, -- minutes
    satisfaction_rating INTEGER, -- 1-5 stars
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. HEALTH REMINDERS & NOTIFICATIONS
CREATE TABLE brezcode_health_reminders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES brezcode_users(id) ON DELETE CASCADE,
    reminder_type VARCHAR(50) NOT NULL, -- 'self_exam', 'appointment', 'medication', 'checkup'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    reminder_date DATE NOT NULL,
    reminder_time TIME,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern VARCHAR(50), -- 'daily', 'weekly', 'monthly', 'yearly'
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    is_dismissed BOOLEAN DEFAULT false,
    dismissed_at TIMESTAMP,
    priority_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8. EDUCATIONAL CONTENT INTERACTION
CREATE TABLE brezcode_educational_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES brezcode_users(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL, -- 'article', 'video', 'infographic', 'quiz'
    content_id VARCHAR(100) NOT NULL,
    content_title VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- 'prevention', 'risk_factors', 'screening', 'lifestyle'
    is_completed BOOLEAN DEFAULT false,
    completion_percentage INTEGER DEFAULT 0,
    time_spent INTEGER, -- minutes
    quiz_score INTEGER, -- if applicable
    bookmarked BOOLEAN DEFAULT false,
    rating INTEGER, -- 1-5 stars
    notes TEXT,
    accessed_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- 9. SYMPTOM TRACKING & BODY MAPPING
CREATE TABLE brezcode_symptom_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES brezcode_users(id) ON DELETE CASCADE,
    symptom_type VARCHAR(100) NOT NULL, -- 'lump', 'pain', 'discharge', 'swelling', 'skin_changes'
    body_location VARCHAR(100) NOT NULL, -- 'left_breast_upper_outer', 'right_nipple', etc.
    severity_level INTEGER NOT NULL, -- 1-10 scale
    description TEXT,
    size_estimate VARCHAR(50), -- 'pea_sized', 'marble_sized', etc.
    texture VARCHAR(50), -- 'hard', 'soft', 'movable', 'fixed'
    duration VARCHAR(50), -- 'new', '1_week', '1_month', 'ongoing'
    associated_symptoms TEXT[],
    menstrual_cycle_day INTEGER,
    photo_reference TEXT, -- File path to image
    requires_medical_attention BOOLEAN DEFAULT false,
    doctor_notified BOOLEAN DEFAULT false,
    logged_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 10. SUBSCRIPTION & PREMIUM FEATURES
CREATE TABLE brezcode_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES brezcode_users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL, -- 'free', 'premium', 'family'
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    is_active BOOLEAN DEFAULT false,
    current_period_start DATE,
    current_period_end DATE,
    cancelled_at TIMESTAMP,
    premium_features_enabled TEXT[], -- ['ai_coaching', 'detailed_reports', 'family_sharing']
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 11. AUTHENTICATION & SECURITY
CREATE TABLE brezcode_user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES brezcode_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB, -- {device_type, browser, os}
    ip_address INET,
    location JSONB, -- {city, country} for security monitoring
    is_active BOOLEAN DEFAULT true,
    last_activity TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 12. EMAIL VERIFICATION FOR BREZCODE
CREATE TABLE brezcode_email_verifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES brezcode_users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    verification_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT false,
    verification_type VARCHAR(50) DEFAULT 'registration', -- 'registration', 'password_reset'
    created_at TIMESTAMP DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_brezcode_users_email ON brezcode_users(email);
CREATE INDEX idx_brezcode_assessments_user ON brezcode_health_assessments(user_id);
CREATE INDEX idx_brezcode_reports_user ON brezcode_health_reports(user_id);
CREATE INDEX idx_brezcode_activities_user_date ON brezcode_daily_activities(user_id, scheduled_date);
CREATE INDEX idx_brezcode_metrics_user_date ON brezcode_health_metrics(user_id, recorded_date);
CREATE INDEX idx_brezcode_coaching_user ON brezcode_ai_coaching_sessions(user_id);
CREATE INDEX idx_brezcode_reminders_user_date ON brezcode_health_reminders(user_id, reminder_date);
CREATE INDEX idx_brezcode_symptoms_user_date ON brezcode_symptom_logs(user_id, logged_date);
CREATE INDEX idx_brezcode_sessions_user ON brezcode_user_sessions(user_id, is_active);

-- TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_brezcode_users_updated_at BEFORE UPDATE ON brezcode_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brezcode_subscriptions_updated_at BEFORE UPDATE ON brezcode_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();