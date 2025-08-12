# 🚀 Multi-Platform WhatsApp API Setup Guide

## 🎯 **Overview**
Your unified WhatsApp backend now supports **3 platforms** with intelligent routing:

- **🌸 BrezCode** (Health Coaching) - Dr. Sakura AI
- **✨ SkinCoach** (Skin Analysis) - SkinCoach AI  
- **🎯 LeadGen** (Business SaaS) - LeadGen AI + Multi-tenant support

## 📱 **API Endpoints**

### **Base URL:** `https://workspace.brezcode2024.replit.dev/api/whatsapp-multi`

### **Platform-Specific Sending:**
```bash
# BrezCode Health Messages
POST /api/whatsapp-multi/brezcode/send
{
  "phoneNumber": "+1234567890",
  "message": "Hello from Dr. Sakura!"
}

# SkinCoach Analysis Messages  
POST /api/whatsapp-multi/skincoach/send
{
  "phoneNumber": "+1234567890", 
  "message": "Ready for skin analysis?"
}

# LeadGen Business Messages
POST /api/whatsapp-multi/leadgen/send
{
  "phoneNumber": "+1234567890",
  "message": "Let's grow your business!",
  "businessId": "client123" // Optional for SaaS
}
```

### **Unified Webhook:**
```bash
# Single webhook handles ALL platforms
POST /api/whatsapp-multi/webhook
GET /api/whatsapp-multi/webhook (verification)
```

### **Testing Endpoints:**
```bash
# Test each platform
POST /api/whatsapp-multi/test/brezcode
POST /api/whatsapp-multi/test/skincoach  
POST /api/whatsapp-multi/test/leadgen
```

## 🔧 **Environment Setup**

### **Required Environment Variables:**
```env
# Shared WhatsApp API credentials
WA_BUSINESS_ACCOUNT_ID=your_business_account_id
CLOUD_API_ACCESS_TOKEN=your_access_token
CLOUD_API_VERSION=v19.0

# Platform-specific phone numbers (optional)
BREZCODE_PHONE_NUMBER_ID=phone_id_1
SKINCOACH_PHONE_NUMBER_ID=phone_id_2  
LEADGEN_PHONE_NUMBER_ID=phone_id_3

# Or use single number for all platforms
WA_PHONE_NUMBER_ID=your_shared_phone_id

# Webhook security
WEBHOOK_VERIFICATION_TOKEN=your_secure_token
```

## 🌟 **Key Features**

### **1. Intelligent Platform Detection**
- **Different phone numbers** → Auto-routes to correct platform
- **Single phone number** → Uses message context to determine platform
- **Business ID parameter** → Routes LeadGen SaaS clients

### **2. AI Integration**
- **BrezCode** → Dr. Sakura health coaching AI
- **SkinCoach** → Skin analysis and recommendations
- **LeadGen** → Business growth and lead generation AI

### **3. Multi-Tenant SaaS Support**
```bash
# Configure new LeadGen client
POST /api/whatsapp-multi/leadgen/configure-client
{
  "businessId": "restaurant123",
  "businessName": "Pizza Palace",
  "welcomeMessage": "Welcome to Pizza Palace! Ready to grow your restaurant?",
  "branding": {
    "brandColor": "#ff6b35",
    "logoUrl": "https://pizzapalace.com/logo.png"
  }
}
```

### **4. Platform Statistics**
```bash
# Get usage stats per platform
GET /api/whatsapp-multi/stats/brezcode
GET /api/whatsapp-multi/stats/skincoach
GET /api/whatsapp-multi/stats/leadgen?businessId=client123
```

## 🎨 **Platform Branding**

### **BrezCode (Health)**
- Color: Pink (#e91e63)
- Emoji: 🌸
- Personality: Dr. Sakura - Empathetic health coach
- Focus: Breast health, wellness, medical guidance

### **SkinCoach (Beauty)**  
- Color: Purple (#9c27b0)
- Emoji: ✨
- Personality: SkinCoach AI - Expert skin analyst
- Focus: Skin analysis, skincare, beauty recommendations

### **LeadGen (Business)**
- Color: Blue (#2196f3)  
- Emoji: 🚀
- Personality: LeadGen AI - Business growth expert
- Focus: Lead generation, sales, business automation

## 📊 **Usage Examples**

### **Single Business Setup:**
```javascript
// Use same phone number for all platforms
// Platform detection based on conversation context
```

### **Multi-Number Setup:**
```javascript
// Different phone numbers for each platform
// Automatic routing based on incoming number
```

### **SaaS Client Setup:**
```javascript
// Multiple businesses using LeadGen platform
// Custom branding and messaging per client
```

## 🔗 **Webhook Configuration**

### **Facebook/Meta Setup:**
1. **Webhook URL:** `https://workspace.brezcode2024.replit.dev/api/whatsapp-multi/webhook`
2. **Verify Token:** Use your `WEBHOOK_VERIFICATION_TOKEN`
3. **Events:** Subscribe to `messages` and `message_status`

### **Multiple Webhook Support:**
- **Single webhook** handles all platforms
- **Platform detection** happens automatically
- **Business ID** can be passed via query parameter: `?businessId=client123`

## 🚀 **Deployment Notes**

### **Domain Routing Already Setup:**
- ✅ **www.brezcode.com** → BrezCode landing → WhatsApp integration
- ✅ **www.skincoach.ai** → SkinCoach landing → WhatsApp integration  
- ✅ **leadgen.to** → LeadGen platform → Multi-tenant WhatsApp

### **Scalability:**
- **Unlimited SaaS clients** supported
- **Custom branding** per client
- **Separate analytics** per business
- **White-label ready** for resellers

## 📈 **Business Model Support**

### **BrezCode:** Direct health coaching service
### **SkinCoach:** Direct skin analysis service  
### **LeadGen:** SaaS platform for multiple businesses

**All powered by the same unified WhatsApp infrastructure!** 🎯

## 🔧 **Next Steps**

1. **Add your WhatsApp phone numbers** to environment variables
2. **Configure webhook** in Facebook Business Manager  
3. **Test each platform** using the test endpoints
4. **Set up first LeadGen SaaS client** 
5. **Monitor usage** via stats endpoints

Your multi-platform WhatsApp empire is ready! 🚀