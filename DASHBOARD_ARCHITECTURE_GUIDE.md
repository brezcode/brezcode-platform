# Platform Architecture Guide

## 📊 **LeadGen.to - Universal Business Management Platform**
**Route:** `/` (Root platform)  
**Purpose:** Business and personal management app that contains multiple businesses  
**User:** Business owners and entrepreneurs managing various ventures  

**Contains Multiple Businesses:**
- BrezCode (breast health coaching)
- Other businesses (e-commerce, consulting, etc.)

---

## 🏢 **BrezCode Business Dashboard (Within LeadGen.to)**
**Route:** `/business/brezcode/dashboard`  
**Location:** Inside LeadGen.to platform as one of the businesses  
**Purpose:** Manage BrezCode as a business venture within LeadGen  
**User:** Business operators managing BrezCode operations  

**Business Metrics:**
- Total platform users (1,247 users)
- Active assessments monitoring (89 active)
- Completion rates tracking (94%)
- Average health scores (82/100)
- Weekly growth metrics (12% growth)
- Customer satisfaction (4.8/5)
- AI training progress (85%)

**Management Tools:**
- AI Training (Train Dr. Sakura with breast health scenarios)
- Knowledge Center (Upload files to train AI avatars)
- User Analytics (View user engagement and health outcomes)
- Customer Support (Manage customer inquiries)
- Business Profile Management

---

## 🩺 **BrezCode - Independent Breast Health Coaching App**
**Route:** `/brezcode` (Completely separate app)  
**Purpose:** Standalone breast health coaching and wellness management  
**User:** Individual users seeking breast health guidance and coaching  

**Personal Health Features:**
- Personal health score (85/100)
- Current wellness streak (12 days)
- Weekly goal progress (75%)
- Active minutes tracking (280/week)
- Risk category status (Low Risk)
- Assessment completion tracking (3 completed)

**Coaching Tools:**
- Interactive Health Calendar
- Daily wellness plans (morning, afternoon, evening activities)
- Activity completion tracking
- Dr. Sakura AI Coach integration
- Proactive research system (expert content every 2 minutes)
- Personal health metrics and progress

---

## 🎯 Platform Structure

```
LeadGen.to (Universal Business Management):
├── / → LeadGen.to homepage (business management platform)
├── /business-dashboard → Main business dashboard
├── /business/brezcode/dashboard → BrezCode business management
├── /business/brezcode/profile → BrezCode business profile
└── /business/brezcode/avatar-training → AI training for BrezCode

BrezCode (Independent Breast Health App):
├── /brezcode → BrezCode landing page (WHO statistics, features)
├── /brezcode/dashboard → Personal health dashboard (users)
├── /brezcode/chat → Dr. Sakura AI Coach
├── /brezcode/assessment → Breast health quiz
└── /brezcode/profile → User health profile
```

## 🔄 User Journey

### For Individual Users (Personal Health):
1. Visit `/brezcode` (landing page)
2. Take assessment → `/brezcode/assessment`
3. Login/Register
4. Access personal dashboard → `/brezcode/dashboard`
5. Use Dr. Sakura coaching → `/brezcode/chat`

### For Business Operators (Business Management):
1. Login to LeadGen.to
2. Access BrezCode business dashboard → `/business/brezcode/dashboard`
3. Monitor platform metrics and user analytics
4. Train AI avatars and manage business operations

## 🎨 Visual Identity

**Personal Health Dashboard:**
- Pink/rose gradient background
- Heart icons and wellness-focused UI
- Personal progress tracking
- Individual health metrics

**Business Dashboard:**
- Professional business layout
- Platform operation metrics
- Customer analytics
- Business management tools

Both platforms are completely independent with separate databases, authentication, and functionality while sharing the same codebase infrastructure.