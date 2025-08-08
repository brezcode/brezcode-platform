# Brezcode WhatsApp Testing Guide

## 📱 **Test Setup**
- **Business Number**: +85294740952 (Cambodia)
- **Personal Test Number**: +852 96099766 (Hong Kong)
- **Connection**: Personal number connected to business account

## 🧪 **Testing Methods**

### **1. Automated API Testing**
Run the comprehensive test suite:
```bash
# Start the server
npm run dev

# Run Brezcode WhatsApp tests
node test-brezcode-whatsapp.js
```

**Tests Include:**
- Business information validation
- Welcome message formatting
- Dr. Sakura coaching responses
- Sales assistant functionality
- Customer support messages
- Health tip delivery
- Webhook AI processing
- Contact link generation

### **2. Manual WhatsApp Testing**

#### **A. From Your Personal Number (+852 96099766)**
Send these messages to **+85294740952**:

1. **Initial Contact**
   ```
   Hello Brezcode! Testing the integration.
   ```

2. **Health Coaching Test**
   ```
   I need help with breast health
   ```
   *Expected: Dr. Sakura introduction and health guidance*

3. **Sales Inquiry Test**
   ```
   What are your pricing plans?
   ```
   *Expected: Detailed pricing information and trial options*

4. **Customer Support Test**
   ```
   I need help with my account
   ```
   *Expected: Support menu and troubleshooting options*

5. **Quick Commands**
   ```
   COACH
   SALES  
   HELP
   MENU
   TRIAL
   ```

#### **B. API-Driven Testing**
Use the business setup endpoints to send test messages:

**Send Welcome Message:**
```bash
curl -X POST http://localhost:3000/api/whatsapp/send-welcome \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "85296099766"}'
```

**Send Custom Test Message:**
```bash
curl -X POST http://localhost:3000/api/whatsapp/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "85296099766",
    "message": "🌸 Test from Brezcode! Dr. Sakura is ready to help with your health journey."
  }'
```

**Send Health Tip:**
```bash
curl -X POST http://localhost:3000/api/whatsapp/send-proactive \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "85296099766",
    "messageType": "tip",
    "content": "💡 Daily Tip: Regular self-exams are key to early detection!"
  }'
```

### **3. Production Setup Testing**

#### **Step 1: Configure Environment**
Create `.env` file with real credentials:
```bash
# WhatsApp Business API Configuration
WA_PHONE_NUMBER_ID=your_actual_phone_number_id
WA_BUSINESS_ACCOUNT_ID=your_business_account_id  
CLOUD_API_ACCESS_TOKEN=your_permanent_access_token
CLOUD_API_VERSION=v19.0
BREZCODE_WHATSAPP_NUMBER=+85294740952

# Webhook Configuration
WEBHOOK_VERIFICATION_TOKEN=your_secure_webhook_token
```

#### **Step 2: Set Up Webhook**
Configure in Meta Business:
```
Webhook URL: https://your-domain.com/api/whatsapp/webhook
Verify Token: [Your secure token from .env]
```

#### **Step 3: Test Real Messaging**
1. Send message from +852 96099766 to +85294740952
2. Verify AI responds automatically
3. Test different conversation contexts
4. Check message history in database

## 📊 **Expected Test Results**

### **Successful API Tests:**
- ✅ Business info retrieval
- ✅ Message formatting and queuing
- ✅ AI context detection
- ✅ Webhook payload processing
- ✅ Contact link generation

### **Expected WhatsApp Responses:**

#### **Welcome Message:**
```
🌸 Welcome to Brezcode!
Your AI Health Coach at +85294740952

I'm your AI assistant, here to help with:

🏥 Health Coaching (Dr. Sakura)
💼 Sales & Pricing Information  
🆘 Customer Support

Quick Start:
• Type "COACH" for health guidance
• Type "SALES" for pricing info
• Type "HELP" for support menu

How can I assist you today?
```

#### **Dr. Sakura Health Response:**
```
🌸 Hello! I'm Dr. Sakura, your breast health coach.

I'm here to provide personalized guidance on:
• Breast health education
• Self-examination techniques
• Risk assessment interpretation
• Preventive care recommendations
• Emotional support for health concerns

What aspect of your health journey can I help you with today?

Type "SELF-EXAM" for examination guide or "PREVENTION" for health tips.
```

#### **Sales Response:**
```
💼 Brezcode Health Plans

🌸 Wellness Plan - $29/month
• Unlimited Dr. Sakura coaching
• Self-exam reminders
• Health tracking

🏥 Premium Plan - $49/month  
• Everything in Wellness
• Advanced analysis tools
• Priority support

Ready to start? Type "TRIAL" for 7-day free trial!
```

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **Messages Not Sending**
   - Check API credentials
   - Verify phone number format (85296099766, no + or spaces)
   - Confirm webhook verification

2. **AI Not Responding**
   - Check webhook URL configuration
   - Verify webhook token
   - Check server logs for errors

3. **Wrong Context Detection**
   - Review keyword matching in AI assistant
   - Test with different message variations
   - Check conversation history

### **Debug Commands:**

**Check Business Setup:**
```bash
curl http://localhost:3000/api/whatsapp/business/brezcode-info
```

**Check WhatsApp Health:**
```bash
curl http://localhost:3000/api/whatsapp/health
```

**Generate Contact Links:**
```bash
curl "http://localhost:3000/api/whatsapp/business/contact-link?message=Testing"
```

**View Conversation History:**
```bash
curl http://localhost:3000/api/whatsapp/conversation/85296099766
```

## 🎯 **Production Deployment Checklist**

### **Before Going Live:**
- [ ] Configure real WhatsApp Business API credentials
- [ ] Set up production webhook URL with HTTPS
- [ ] Test all message types (text, interactive, templates)
- [ ] Verify AI context switching works correctly
- [ ] Test automated health reminders
- [ ] Set up monitoring and alerting
- [ ] Train support team on escalation procedures

### **Post-Launch Monitoring:**
- [ ] Track message volume and response times
- [ ] Monitor AI response quality
- [ ] Check webhook delivery success rates
- [ ] Review user engagement metrics
- [ ] Collect feedback and iterate

## 📱 **Quick Test Commands**

**Start Testing:**
```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: Run tests
node test-brezcode-whatsapp.js

# Terminal 3: Manual API tests
curl -X POST http://localhost:3000/api/whatsapp/business/test-message \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "85296099766", "message": "Hello from Brezcode!"}'
```

**WhatsApp Contact Links:**
- **Web**: https://wa.me/85294740952?text=Hello%20Brezcode!
- **Mobile**: whatsapp://send?phone=85294740952&text=Hello%20Brezcode!

---

## 🌟 **Success Metrics**

Your integration is working correctly when:
- Messages send successfully between +85294740952 ↔ +852 96099766
- AI detects conversation context automatically
- Dr. Sakura provides relevant health guidance
- Sales assistant handles pricing inquiries
- Customer support resolves technical questions
- Automated reminders are delivered on schedule

**🎉 Ready to revolutionize health coaching through WhatsApp!**