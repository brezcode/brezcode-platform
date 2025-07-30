# BrezCode Dashboard Architecture Guide

## 🏥 Two Distinct Dashboard Systems

### 1. **BrezCode Business Dashboard** 
**Route:** `/business/brezcode/dashboard`  
**Purpose:** Business Operations & Management  
**User:** BrezCode platform operators/administrators  

**Features:**
- Total platform users (1,247 users)
- Active assessments monitoring (89 active)
- Completion rates tracking (94%)
- Average health scores (82/100)
- Weekly growth metrics (12% growth)
- Customer satisfaction (4.8/5)
- AI training progress (85%)

**Business Management Tools:**
- AI Training (Train Dr. Sakura with breast health scenarios)
- Knowledge Center (Upload files to train AI avatars)
- User Analytics (View user engagement and health outcomes)
- Customer Support (Manage customer inquiries)
- Business Profile Management

---

### 2. **BrezCode Personal Health Dashboard**
**Route:** `/brezcode/dashboard`  
**Purpose:** Individual User Health Management & Coaching  
**User:** Individual users who took the breast health assessment  

**Features:**
- Personal health score (85/100)
- Current wellness streak (12 days)
- Weekly goal progress (75%)
- Active minutes tracking (280/week)
- Risk category status (Low Risk)
- Assessment completion tracking (3 completed)

**Personal Health Tools:**
- Interactive Health Calendar
- Daily wellness plans (morning, afternoon, evening activities)
- Activity completion tracking
- Dr. Sakura AI Coach integration
- Proactive research system (expert content every 2 minutes)
- Personal health metrics and progress

---

## 🎯 Navigation Structure

```
BrezCode Platform:
├── /brezcode → Landing page (WHO statistics, features, CTA)
├── /brezcode/dashboard → Personal Health Dashboard (individual users)
├── /brezcode/chat → Dr. Sakura AI Coach
├── /brezcode/assessment → Breast health quiz
└── /brezcode/profile → User profile

LeadGen Business Management:
├── /business/brezcode/dashboard → Business Dashboard (operators)
├── /business/brezcode/profile → Business profile management
└── /business/brezcode/avatar-training → AI training system
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