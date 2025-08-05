-- LEADGEN.TO BUSINESS PLATFORM DATABASE
-- Completely separate database for business analytics users
-- Backend business application focused on lead generation and business automation

-- 1. BUSINESS USERS (LeadGen Platform Users)
CREATE TABLE leadgen_business_users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN DEFAULT false,
    company_name VARCHAR(255),
    job_title VARCHAR(100),
    phone VARCHAR(20),
    business_address JSONB, -- {street, city, state, country, postal_code}
    business_type VARCHAR(100), -- 'healthcare', 'consulting', 'e-commerce', etc.
    company_size VARCHAR(50), -- '1-10', '11-50', '51-200', '200+'
    profile_photo TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. CLIENT BRANDS & BUSINESSES
CREATE TABLE leadgen_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id INTEGER REFERENCES leadgen_business_users(id) ON DELETE CASCADE,
    brand_name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    subdomain VARCHAR(100) UNIQUE,
    industry VARCHAR(100) NOT NULL,
    business_model VARCHAR(100), -- 'B2B', 'B2C', 'B2B2C'
    target_market VARCHAR(255),
    brand_description TEXT,
    brand_values TEXT[],
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#0ea5e9',
    secondary_color VARCHAR(7) DEFAULT '#f59e0b',
    font_family VARCHAR(100) DEFAULT 'Inter',
    is_active BOOLEAN DEFAULT true,
    subscription_tier VARCHAR(50) DEFAULT 'basic', -- 'basic', 'pro', 'enterprise'
    monthly_lead_limit INTEGER DEFAULT 100,
    api_key VARCHAR(255) UNIQUE,
    webhook_urls TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. BRAND CONFIGURATIONS & LANDING PAGES
CREATE TABLE leadgen_brand_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES leadgen_brands(id) ON DELETE CASCADE,
    config_type VARCHAR(50) NOT NULL, -- 'landing_page', 'quiz_config', 'ai_assistant'
    page_slug VARCHAR(100), -- For landing pages
    hero_headline TEXT,
    hero_subheadline TEXT,
    hero_cta_text VARCHAR(100),
    hero_image_url TEXT,
    trust_badges JSONB,
    features JSONB,
    testimonials JSONB,
    pricing_tiers JSONB,
    faqs JSONB,
    contact_info JSONB,
    seo_meta JSONB, -- {title, description, keywords}
    conversion_tracking JSONB, -- {google_analytics, facebook_pixel, etc.}
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. LEAD CAPTURE & MANAGEMENT
CREATE TABLE leadgen_leads (
    id SERIAL PRIMARY KEY,
    brand_id UUID REFERENCES leadgen_brands(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    lead_source VARCHAR(100), -- 'landing_page', 'quiz', 'chat', 'referral'
    lead_quality_score INTEGER, -- 1-100
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    referrer_url TEXT,
    ip_address INET,
    location JSONB, -- {city, state, country}
    device_info JSONB, -- {device_type, browser, os}
    lead_data JSONB, -- Custom form fields, quiz answers, etc.
    lead_status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
    assigned_to INTEGER REFERENCES leadgen_business_users(id),
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. LEAD NURTURING & AUTOMATION
CREATE TABLE leadgen_automation_sequences (
    id SERIAL PRIMARY KEY,
    brand_id UUID REFERENCES leadgen_brands(id) ON DELETE CASCADE,
    sequence_name VARCHAR(255) NOT NULL,
    sequence_type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'multi_channel'
    trigger_conditions JSONB, -- {lead_source, tags, score_threshold}
    steps JSONB NOT NULL, -- Array of automation steps
    is_active BOOLEAN DEFAULT true,
    total_enrolled INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2),
    created_by INTEGER REFERENCES leadgen_business_users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. AI BUSINESS ASSISTANT & CHAT
CREATE TABLE leadgen_ai_chat_sessions (
    id SERIAL PRIMARY KEY,
    brand_id UUID REFERENCES leadgen_brands(id) ON DELETE CASCADE,
    lead_id INTEGER REFERENCES leadgen_leads(id) ON DELETE SET NULL,
    session_id TEXT UNIQUE NOT NULL,
    ai_assistant_type VARCHAR(50) DEFAULT 'sales_assistant', -- 'sales', 'support', 'qualifier'
    conversation_history JSONB DEFAULT '[]',
    lead_qualification_data JSONB,
    intent_analysis JSONB, -- Detected customer intent
    sentiment_score DECIMAL(3,2), -- -1 to 1
    conversion_probability DECIMAL(5,2), -- 0-100%
    recommended_actions TEXT[],
    escalation_needed BOOLEAN DEFAULT false,
    human_handoff_requested BOOLEAN DEFAULT false,
    session_outcome VARCHAR(50), -- 'qualified', 'not_interested', 'scheduled_demo', etc.
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. ANALYTICS & REPORTING
CREATE TABLE leadgen_analytics_events (
    id SERIAL PRIMARY KEY,
    brand_id UUID REFERENCES leadgen_brands(id) ON DELETE CASCADE,
    lead_id INTEGER REFERENCES leadgen_leads(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL, -- 'page_view', 'form_submit', 'email_open', 'click'
    event_data JSONB,
    page_url TEXT,
    session_id TEXT,
    timestamp TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8. BUSINESS PERFORMANCE METRICS
CREATE TABLE leadgen_performance_metrics (
    id SERIAL PRIMARY KEY,
    brand_id UUID REFERENCES leadgen_brands(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    total_visitors INTEGER DEFAULT 0,
    total_leads INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2),
    qualified_leads INTEGER DEFAULT 0,
    cost_per_lead DECIMAL(10,2),
    revenue_generated DECIMAL(12,2),
    roi DECIMAL(5,2),
    traffic_sources JSONB, -- {organic, paid, social, referral}
    top_performing_pages JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(brand_id, metric_date)
);

-- 9. CRM & SALES PIPELINE
CREATE TABLE leadgen_sales_opportunities (
    id SERIAL PRIMARY KEY,
    brand_id UUID REFERENCES leadgen_brands(id) ON DELETE CASCADE,
    lead_id INTEGER REFERENCES leadgen_leads(id) ON DELETE CASCADE,
    opportunity_name VARCHAR(255) NOT NULL,
    stage VARCHAR(50) NOT NULL, -- 'prospecting', 'qualifying', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
    value DECIMAL(12,2),
    probability INTEGER, -- 0-100%
    expected_close_date DATE,
    actual_close_date DATE,
    lost_reason VARCHAR(255),
    sales_rep INTEGER REFERENCES leadgen_business_users(id),
    activities JSONB, -- {calls, emails, meetings}
    next_action TEXT,
    next_action_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 10. EMAIL MARKETING & CAMPAIGNS
CREATE TABLE leadgen_email_campaigns (
    id SERIAL PRIMARY KEY,
    brand_id UUID REFERENCES leadgen_brands(id) ON DELETE CASCADE,
    campaign_name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(50) NOT NULL, -- 'newsletter', 'promotional', 'nurture', 'transactional'
    subject_line VARCHAR(255) NOT NULL,
    email_content TEXT NOT NULL,
    recipient_segments JSONB, -- Targeting criteria
    total_recipients INTEGER DEFAULT 0,
    emails_sent INTEGER DEFAULT 0,
    emails_delivered INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    unsubscribes INTEGER DEFAULT 0,
    bounces INTEGER DEFAULT 0,
    open_rate DECIMAL(5,2),
    click_rate DECIMAL(5,2),
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_by INTEGER REFERENCES leadgen_business_users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 11. SUBSCRIPTION & BILLING
CREATE TABLE leadgen_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES leadgen_business_users(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES leadgen_brands(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL, -- 'basic', 'pro', 'enterprise'
    billing_cycle VARCHAR(20) NOT NULL, -- 'monthly', 'annual'
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    is_active BOOLEAN DEFAULT false,
    current_period_start DATE,
    current_period_end DATE,
    monthly_cost DECIMAL(10,2),
    annual_cost DECIMAL(10,2),
    features_enabled TEXT[], -- ['ai_assistant', 'automation', 'analytics', 'api_access']
    usage_limits JSONB, -- {leads_per_month, emails_per_month, storage_gb}
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 12. AUTHENTICATION & TEAM MANAGEMENT
CREATE TABLE leadgen_user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES leadgen_business_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB,
    ip_address INET,
    last_activity TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 13. TEAM COLLABORATION
CREATE TABLE leadgen_team_members (
    id SERIAL PRIMARY KEY,
    brand_id UUID REFERENCES leadgen_brands(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES leadgen_business_users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'owner', 'admin', 'manager', 'agent', 'viewer'
    permissions TEXT[], -- ['leads_read', 'leads_write', 'analytics_read', 'settings_write']
    invited_by INTEGER REFERENCES leadgen_business_users(id),
    invitation_accepted BOOLEAN DEFAULT false,
    joined_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(brand_id, user_id)
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_leadgen_users_email ON leadgen_business_users(email);
CREATE INDEX idx_leadgen_brands_owner ON leadgen_brands(owner_id);
CREATE INDEX idx_leadgen_brands_domain ON leadgen_brands(domain);
CREATE INDEX idx_leadgen_leads_brand ON leadgen_leads(brand_id);
CREATE INDEX idx_leadgen_leads_email ON leadgen_leads(email);
CREATE INDEX idx_leadgen_leads_status ON leadgen_leads(lead_status);
CREATE INDEX idx_leadgen_analytics_brand_date ON leadgen_analytics_events(brand_id, timestamp);
CREATE INDEX idx_leadgen_performance_brand_date ON leadgen_performance_metrics(brand_id, metric_date);
CREATE INDEX idx_leadgen_opportunities_brand ON leadgen_sales_opportunities(brand_id);
CREATE INDEX idx_leadgen_campaigns_brand ON leadgen_email_campaigns(brand_id);
CREATE INDEX idx_leadgen_sessions_user ON leadgen_user_sessions(user_id);

-- TRIGGERS FOR UPDATED_AT
CREATE TRIGGER update_leadgen_users_updated_at BEFORE UPDATE ON leadgen_business_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leadgen_brands_updated_at BEFORE UPDATE ON leadgen_brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leadgen_configs_updated_at BEFORE UPDATE ON leadgen_brand_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leadgen_leads_updated_at BEFORE UPDATE ON leadgen_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leadgen_sequences_updated_at BEFORE UPDATE ON leadgen_automation_sequences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leadgen_opportunities_updated_at BEFORE UPDATE ON leadgen_sales_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leadgen_subscriptions_updated_at BEFORE UPDATE ON leadgen_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();