-- WhatsApp Integration Database Schema
-- This creates all necessary tables for WhatsApp Business API integration

-- Table for storing WhatsApp contacts
CREATE TABLE IF NOT EXISTS whatsapp_contacts (
    id SERIAL PRIMARY KEY,
    phone_number TEXT NOT NULL UNIQUE,
    display_name TEXT,
    profile_url TEXT,
    conversation_context TEXT NOT NULL DEFAULT 'support', -- 'coaching' | 'sales' | 'support'
    last_active TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing WhatsApp messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id SERIAL PRIMARY KEY,
    phone_number TEXT NOT NULL,
    message_type TEXT NOT NULL, -- 'text' | 'image' | 'audio' | 'video' | 'document'
    content TEXT,
    media_url TEXT,
    direction TEXT NOT NULL, -- 'inbound' | 'outbound'
    whatsapp_message_id TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for managing conversation contexts
CREATE TABLE IF NOT EXISTS whatsapp_conversations (
    id SERIAL PRIMARY KEY,
    phone_number TEXT NOT NULL,
    context TEXT NOT NULL, -- 'coaching' | 'sales' | 'support'
    status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'closed' | 'paused'
    assigned_agent TEXT, -- For human handoff
    metadata TEXT, -- JSON string for additional context
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP,
    closed_at TIMESTAMP
);

-- Table for AI assistant sessions
CREATE TABLE IF NOT EXISTS whatsapp_ai_sessions (
    id SERIAL PRIMARY KEY,
    phone_number TEXT NOT NULL,
    conversation_id INTEGER REFERENCES whatsapp_conversations(id),
    ai_assistant_type TEXT NOT NULL, -- 'dr_sakura' | 'sales_assistant' | 'support_agent'
    session_data TEXT, -- JSON string for conversation state
    message_count INTEGER DEFAULT 0,
    last_interaction_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for webhook logging and debugging
CREATE TABLE IF NOT EXISTS whatsapp_webhook_logs (
    id SERIAL PRIMARY KEY,
    webhook_type TEXT NOT NULL, -- 'message' | 'status' | 'verification'
    payload TEXT NOT NULL, -- JSON string of the webhook payload
    processed BOOLEAN DEFAULT FALSE,
    processing_error TEXT,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_phone ON whatsapp_contacts(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone ON whatsapp_messages(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_timestamp ON whatsapp_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_phone ON whatsapp_conversations(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_ai_sessions_phone ON whatsapp_ai_sessions(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_webhook_logs_received ON whatsapp_webhook_logs(received_at);

-- Insert default data
INSERT INTO whatsapp_contacts (phone_number, display_name, conversation_context) 
VALUES ('85294740952', 'Brezcode Health', 'support')
ON CONFLICT (phone_number) DO NOTHING;

COMMENT ON TABLE whatsapp_contacts IS 'Stores WhatsApp contact information and conversation preferences';
COMMENT ON TABLE whatsapp_messages IS 'Stores all incoming and outgoing WhatsApp messages';
COMMENT ON TABLE whatsapp_conversations IS 'Manages conversation contexts and handoff states';
COMMENT ON TABLE whatsapp_ai_sessions IS 'Tracks AI assistant sessions and conversation state';
COMMENT ON TABLE whatsapp_webhook_logs IS 'Logs all webhook events for debugging and monitoring';