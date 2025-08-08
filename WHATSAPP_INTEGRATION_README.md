# Brezcode WhatsApp Integration Module

## 🌟 Overview

This module provides comprehensive WhatsApp Business API integration for the Brezcode platform, enabling AI-powered conversations for coaching, sales, and customer support through WhatsApp.

## 🚀 Features

### Core Functionality
- **Multi-context AI Assistant**: Automatically switches between coaching (Dr. Sakura), sales, and support contexts
- **WhatsApp Business API Integration**: Full webhook processing and message sending capabilities
- **Automated Health Reminders**: Scheduled daily tips and weekly health check-ins
- **Conversation Management**: Persistent chat history and context tracking
- **Interactive Messages**: Support for buttons, templates, and rich media

### AI Assistant Contexts

#### 🏥 Health Coaching (Dr. Sakura)
- Integrates with existing BrezCode avatar service
- Provides personalized breast health guidance
- Self-examination tutorials and reminders
- Preventive care recommendations
- Emotional support for health anxiety

#### 💼 Sales Assistant
- Product information and pricing
- Feature comparisons
- Free trial management
- Plan recommendations
- Sales funnel automation

#### 🆘 Customer Support
- Account management
- Technical troubleshooting
- Billing inquiries
- Feature guidance
- Escalation handling

## 📦 Module Components

### 1. Core Service (`whatsappService.ts`)
```typescript
WhatsAppService.getInstance()
  .sendTextMessage(phoneNumber, message)
  .sendTemplateMessage(phoneNumber, templateName, language, parameters)
  .sendInteractiveMessage(phoneNumber, header, body, buttons)
  .getConversationHistory(phoneNumber, limit)
  .updateOrCreateContact(phoneNumber, contactData)
```

### 2. AI Assistant (`whatsappAiAssistant.ts`)
- Context-aware message processing
- Automatic assistant type determination
- Integration with Dr. Sakura avatar
- Proactive messaging capabilities

### 3. Database Schema (`shared/whatsapp-schema.ts`)
- `whatsappContacts`: Contact management
- `whatsappMessages`: Message history
- `whatsappConversations`: Conversation tracking
- `whatsappAiSessions`: AI session management
- `whatsappWebhookLogs`: Webhook debugging

### 4. API Routes (`routes/whatsappRoutes.ts`)
- `GET /api/whatsapp/webhook` - Webhook verification
- `POST /api/whatsapp/webhook` - Message processing
- `POST /api/whatsapp/send-message` - Send messages
- `POST /api/whatsapp/send-welcome` - Welcome sequences
- `GET /api/whatsapp/conversation/:phoneNumber` - History
- `GET /api/whatsapp/business-profile` - Profile management

### 5. Scheduler (`whatsappScheduler.ts`)
- Automated health reminders
- Daily health tips
- Onboarding sequences
- Follow-up messages
- Custom scheduling

## 🛠 Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# WhatsApp Business API Configuration
WA_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
WA_BUSINESS_ACCOUNT_ID=your_whatsapp_business_account_id
CLOUD_API_ACCESS_TOKEN=your_whatsapp_access_token
CLOUD_API_VERSION=v19.0

# Webhook Configuration
WEBHOOK_VERIFICATION_TOKEN=your_secure_verification_token
WEBHOOK_ENDPOINT=whatsapp/webhook
```

### 2. WhatsApp Business API Setup
1. Create a Meta Business account
2. Set up WhatsApp Business API
3. Generate access tokens
4. Configure webhook endpoints
5. Verify phone number

### 3. Database Migration
Run database migrations to create WhatsApp tables:
```bash
npm run db:push
```

### 4. Start the Server
```bash
npm run dev
```

The WhatsApp integration will be available at:
- Webhook: `https://your-domain.com/api/whatsapp/webhook`
- Health Check: `https://your-domain.com/api/whatsapp/health`

## 📱 Usage Examples

### Send a Message
```typescript
const whatsappService = WhatsAppService.getInstance();
await whatsappService.sendTextMessage('15551234567', 'Hello from Brezcode!');
```

### Process Incoming Messages
Messages are automatically processed through the webhook. The AI assistant determines context and responds appropriately.

### Schedule Follow-up
```typescript
const scheduler = WhatsAppScheduler.getInstance();
scheduler.scheduleFollowUp('15551234567', 24, 'How are you feeling today?');
```

### Start Onboarding
```typescript
const aiAssistant = new WhatsAppAiAssistant();
await aiAssistant.sendOnboardingSequence('15551234567');
```

## 🤖 AI Conversation Flow

### Context Detection
The AI automatically detects conversation context based on:
- Explicit keywords (e.g., "coach", "sales", "support")
- Message content analysis
- Previous conversation history
- User interaction patterns

### Response Generation
1. **Coaching Context**: Uses Dr. Sakura avatar service for health guidance
2. **Sales Context**: Provides product information and pricing
3. **Support Context**: Handles technical and account issues

### Example Interactions

#### Health Coaching
```
User: "I need help with breast health"
Dr. Sakura: "Hello! I'm Dr. Sakura, your breast health coach. 🌸
I'm here to provide personalized guidance on breast health, self-examinations, and wellness.
How can I support your health journey today?"
```

#### Sales Inquiry
```
User: "What are your pricing plans?"
Sales Bot: "💼 **Brezcode Health Plans**
🌸 **Wellness Plan** - $29/month
• Unlimited Dr. Sakura coaching
• Self-exam reminders
• Health tracking
..."
```

#### Support Request
```
User: "I can't log into my account"
Support Bot: "🔐 **Account Support**
I can help you with login issues. Let's troubleshoot:
1. Try resetting your password
2. Check your email for verification
3. Clear your browser cache
..."
```

## 📊 Monitoring & Analytics

### Health Check Endpoint
```bash
curl https://your-domain.com/api/whatsapp/health
```

### Conversation Analytics
- Message volume tracking
- Response time metrics
- Context distribution
- User engagement patterns

### Webhook Logs
All webhook events are logged for debugging and monitoring in the `whatsappWebhookLogs` table.

## 🔧 Customization

### Adding New Contexts
1. Update `determineAssistantType()` method
2. Create new processing method (e.g., `processNewContextMessage()`)
3. Add keyword detection logic
4. Implement response templates

### Custom Schedulers
```typescript
// Custom health reminder
scheduler.scheduleFollowUp(phoneNumber, 168, // 1 week
  "🌸 Weekly self-exam reminder! Have you checked this month?"
);
```

### Template Messages
```typescript
await whatsappService.sendTemplateMessage(
  phoneNumber, 
  'welcome_template', 
  'en', 
  ['Dr. Sakura', 'Brezcode']
);
```

## 🧪 Testing

Run the comprehensive test suite:
```bash
node test-whatsapp-modules.js
```

Tests cover:
- Module structure validation
- API endpoint functionality
- AI conversation logic
- Database schema integrity
- Webhook processing
- Message type handling

## 🚦 Production Deployment

### Security Considerations
- Secure webhook verification tokens
- API access token protection
- Rate limiting implementation
- Message encryption for sensitive data

### Scaling
- Implement message queuing for high volume
- Database connection pooling
- Caching for frequently accessed data
- Horizontal scaling support

### Monitoring
- Set up alerts for webhook failures
- Monitor response times
- Track user engagement metrics
- Log analysis for optimization

## 📞 Support & Troubleshooting

### Common Issues
1. **Webhook Verification Fails**: Check `WEBHOOK_VERIFICATION_TOKEN`
2. **Messages Not Sending**: Verify `CLOUD_API_ACCESS_TOKEN` and `WA_PHONE_NUMBER_ID`
3. **AI Not Responding**: Check Dr. Sakura service integration
4. **Database Errors**: Ensure migrations are run

### Debug Mode
Enable debug logging:
```bash
NODE_ENV=development WHATSAPP_DEBUG=true npm run dev
```

### Contact Support
- Technical issues: Check server logs and webhook logs table
- API issues: Verify Meta Business API configuration
- Integration questions: Review this documentation

## 🔄 Integration with Existing Brezcode Features

### Dr. Sakura Avatar
- Seamless integration with existing avatar service
- Maintains conversation context and personalization
- Access to health knowledge base

### User Management
- Links WhatsApp contacts to existing user accounts
- Preserves conversation history across platforms
- Unified health tracking

### Notification System
- Extends existing notification infrastructure
- WhatsApp as additional channel
- Preference management integration

---

## 🎯 Quick Start Checklist

- [ ] Configure environment variables
- [ ] Set up WhatsApp Business API
- [ ] Run database migrations  
- [ ] Configure webhook endpoint
- [ ] Test webhook verification
- [ ] Send test message
- [ ] Verify AI responses
- [ ] Enable scheduler (production)
- [ ] Monitor webhook logs
- [ ] Set up production alerts

**🌸 Your Brezcode WhatsApp integration is ready to enhance user engagement and provide 24/7 AI-powered health support!**