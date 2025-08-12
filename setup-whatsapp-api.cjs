#!/usr/bin/env node

/**
 * WhatsApp API Setup Script
 * This script sets up the complete WhatsApp Business API integration for Brezcode
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up WhatsApp Business API integration...\n');

// Step 1: Environment Configuration
console.log('📋 Step 1: Environment Configuration');
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
    console.log('⚠️  No .env file found. Creating from .env.example...');
    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ .env file created from template');
    } else {
        console.log('❌ .env.example not found. Please create .env file manually.');
        process.exit(1);
    }
} else {
    console.log('✅ .env file already exists');
}

// Step 2: Check required environment variables
console.log('\n📋 Step 2: WhatsApp Configuration Check');
const requiredEnvVars = [
    'WA_PHONE_NUMBER_ID',
    'WA_BUSINESS_ACCOUNT_ID', 
    'CLOUD_API_ACCESS_TOKEN',
    'WEBHOOK_VERIFICATION_TOKEN'
];

const envContent = fs.readFileSync(envPath, 'utf8');
const missingVars = [];

requiredEnvVars.forEach(varName => {
    if (!envContent.includes(`${varName}=`) || envContent.includes(`${varName}=your_`)) {
        missingVars.push(varName);
    }
});

if (missingVars.length > 0) {
    console.log('⚠️  The following environment variables need to be configured:');
    missingVars.forEach(varName => {
        console.log(`   - ${varName}`);
    });
    console.log('\n💡 Update your .env file with proper WhatsApp Business API credentials.');
} else {
    console.log('✅ All WhatsApp environment variables are configured');
}

// Step 3: Database setup instructions
console.log('\n📋 Step 3: Database Setup');
console.log('📄 Database schema file created: create-whatsapp-tables.sql');
console.log('💡 Run the following to set up WhatsApp tables:');

if (envContent.includes('DATABASE_URL=')) {
    const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
    if (dbUrlMatch && !dbUrlMatch[1].includes('your_database_url')) {
        console.log(`   psql "${dbUrlMatch[1]}" -f create-whatsapp-tables.sql`);
    } else {
        console.log('   psql your_database_url -f create-whatsapp-tables.sql');
    }
} else {
    console.log('   psql your_database_url -f create-whatsapp-tables.sql');
}

// Step 4: API Endpoints Summary
console.log('\n📋 Step 4: API Endpoints Summary');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;

console.log(`📡 Webhook URL (for Facebook Developer Console):`);
console.log(`   ${baseUrl}/api/whatsapp/webhook`);
console.log(`\n🔧 API Endpoints:`);
console.log(`   Health Check: GET ${baseUrl}/api/whatsapp/health`);
console.log(`   Send Message: POST ${baseUrl}/api/whatsapp/send-message`);
console.log(`   Send Welcome: POST ${baseUrl}/api/whatsapp/send-welcome`);
console.log(`   Business Profile: GET ${baseUrl}/api/whatsapp/business-profile`);
console.log(`   Conversation History: GET ${baseUrl}/api/whatsapp/conversation/:phoneNumber`);

// Step 5: Testing commands
console.log('\n📋 Step 5: Testing Commands');
console.log('🧪 Test webhook verification:');
console.log(`   curl -X GET "${baseUrl}/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=test_verify_token_12345&hub.challenge=test_challenge_123"`);

console.log('\n🧪 Test send message (replace phone number):');
console.log(`   curl -X POST "${baseUrl}/api/whatsapp/send-message" \\`);
console.log(`     -H "Content-Type: application/json" \\`);
console.log(`     -d '{"phoneNumber": "1234567890", "message": "Hello from Brezcode!", "type": "text"}'`);

console.log('\n🧪 Test health check:');
console.log(`   curl -X GET "${baseUrl}/api/whatsapp/health"`);

// Step 6: Facebook Developer Console Setup
console.log('\n📋 Step 6: Facebook Developer Console Setup');
console.log('🌐 Configure in Facebook Developer Console:');
console.log('   1. Go to https://developers.facebook.com/');
console.log('   2. Navigate to your WhatsApp Business API app');
console.log('   3. Configure Webhook:');
console.log(`      - Callback URL: ${baseUrl}/api/whatsapp/webhook`);
console.log(`      - Verify Token: [Your WEBHOOK_VERIFICATION_TOKEN from .env]`);
console.log('   4. Subscribe to webhook events: messages, messaging_postbacks');

// Step 7: Features Overview
console.log('\n📋 Step 7: Features Overview');
console.log('🤖 AI Assistants Available:');
console.log('   - Dr. Sakura (Health Coaching): Breast health guidance and education');
console.log('   - Sales Assistant: Pricing, plans, trials, and demos');
console.log('   - Support Agent: Technical support and account management');

console.log('\n🔄 Message Processing:');
console.log('   - Automatic context detection (coaching/sales/support)');
console.log('   - Conversation history tracking');
console.log('   - Media message support (images, documents, etc.)');
console.log('   - Interactive button responses');

console.log('\n📊 Business Features:');
console.log('   - Business profile management');
console.log('   - Message templates support');
console.log('   - Analytics and reporting');
console.log('   - QR code generation');

// Step 8: Next Steps
console.log('\n📋 Step 8: Next Steps');
console.log('1. ✏️  Update .env with your WhatsApp Business API credentials');
console.log('2. 🗄️  Run the database schema: create-whatsapp-tables.sql');
console.log('3. 🚀 Start the server: npm run dev');
console.log('4. 🌐 Configure webhook in Facebook Developer Console');
console.log('5. 📱 Test with your WhatsApp Business number');

console.log('\n✨ WhatsApp API setup complete! The integration is ready for use.');
console.log('📚 Check WHATSAPP_INTEGRATION_README.md for detailed documentation.');

// Create a quick reference file
const quickRef = `# WhatsApp API Quick Reference

## Environment Variables (Required)
- WA_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
- WA_BUSINESS_ACCOUNT_ID=your_whatsapp_business_account_id
- CLOUD_API_ACCESS_TOKEN=your_whatsapp_access_token
- WEBHOOK_VERIFICATION_TOKEN=your_webhook_verification_token_12345
- BREZCODE_WHATSAPP_NUMBER=+852 94740952

## Webhook URL
${baseUrl}/api/whatsapp/webhook

## Test Commands
### Health Check
curl -X GET "${baseUrl}/api/whatsapp/health"

### Send Message
curl -X POST "${baseUrl}/api/whatsapp/send-message" \\
  -H "Content-Type: application/json" \\
  -d '{"phoneNumber": "1234567890", "message": "Hello!", "type": "text"}'

### Send Welcome Message
curl -X POST "${baseUrl}/api/whatsapp/send-welcome" \\
  -H "Content-Type: application/json" \\
  -d '{"phoneNumber": "1234567890"}'

## AI Assistants
- Type "COACH" for Dr. Sakura health coaching
- Type "SALES" for pricing and plans
- Type "HELP" for customer support

## Database Setup
Run: psql your_database_url -f create-whatsapp-tables.sql
`;

fs.writeFileSync('whatsapp-api-reference.md', quickRef);
console.log('📄 Quick reference saved to: whatsapp-api-reference.md\n');