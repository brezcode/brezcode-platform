# BrezCode - Breast Health Assessment Platform

A comprehensive, multilingual breast health assessment application with AI-powered coaching and personalized risk analysis.

## 🌍 Global Features

- **9 Languages Supported**: English, Chinese (Simplified/Traditional), Spanish, French, German, Japanese, Korean, Vietnamese
- **Custom Domain**: www.brezcode.com
- **Evidence-Based Medical Content**: Powered by OpenAI GPT-4o with medical reference validation
- **6-Section Health Assessment**: Comprehensive breast health risk evaluation
- **Daily AI Coaching**: Personalized health tips and follow-up engagement

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (Neon Serverless)
- **AI**: OpenAI GPT-4o for coaching and content generation
- **Authentication**: Session-based with email verification
- **Internationalization**: Database-driven translation system

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Deployment
1. Deploy to Vercel (free tier)
2. Configure custom domain: www.brezcode.com
3. Set environment variables (see DEPLOYMENT_GUIDE.md)
4. Connect Neon database

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Application pages
│   │   └── hooks/         # Custom React hooks
├── server/                # Express backend
│   ├── routes.ts          # API endpoints
│   ├── enhancedAI.ts      # AI coaching system
│   └── internationalization.ts # Multi-language support
├── shared/
│   └── schema.ts          # Database schema & types
└── docs/
    └── DEPLOYMENT_GUIDE.md # Production deployment guide
```

## 🎯 Key Components

### Health Assessment System
- **Comprehensive Quiz**: 26 questions across 6 health sections
- **Dual Scoring**: Controllable vs Uncontrollable risk factors
- **Risk Categories**: Excellent, Good, Fair, Poor health classifications
- **Personalized Reports**: AI-generated recommendations and daily plans

### Internationalization
- **Language Detection**: Browser, URL parameter, user preference
- **Database Translations**: Cached translation system
- **Timezone Support**: Location-aware coaching delivery
- **Cultural Adaptation**: Region-specific health recommendations

### AI Coaching Engine
- **Daily Engagement**: Personalized tips based on user profile
- **Evidence-Based Content**: Medical reference validation
- **Streak Tracking**: User engagement and progress monitoring
- **Multi-Modal Delivery**: Email, SMS, in-app notifications

## 🔧 Environment Variables

```bash
# Database
DATABASE_URL=postgresql://...

# AI Services  
OPENAI_API_KEY=sk-...

# Email Service
SENDGRID_API_KEY=SG...
FROM_EMAIL=health@brezcode.com

# Security
SESSION_SECRET=your-64-char-secret

# SMS (Optional)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

## 📊 Database Schema

- **Users**: Authentication and profile data
- **Languages**: Supported language configurations  
- **Translations**: Multi-language content storage
- **User Preferences**: Language, timezone, notification settings
- **Coaching Data**: Daily tips, interaction tracking, progress analytics

## 🌐 Production Deployment

**Free Hosting Stack:**
- **Vercel**: Frontend and API hosting (free tier)
- **Neon**: PostgreSQL database (free tier)  
- **Custom Domain**: www.brezcode.com

**Scalability:**
- Global CDN with 100+ edge locations
- Automatic SSL and security headers
- Database connection pooling
- Serverless function architecture

## 📈 Analytics & Monitoring

- **User Engagement**: Daily interaction tracking
- **Health Progress**: Risk score improvements over time
- **Language Usage**: Multi-language adoption metrics
- **Error Tracking**: Comprehensive logging and monitoring

## 🎨 Design System

- **Color Palette**: Sunnyside.co inspired (bright, welcoming)
- **Typography**: Clean, accessible font hierarchy
- **Components**: shadcn/ui + Radix UI primitives
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG 2.1 AA compliance

## 🔒 Security Features

- **Session Security**: Secure cookie configuration
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Comprehensive data sanitization
- **HTTPS Only**: Force secure connections
- **CORS Protection**: Cross-origin request security

## 📚 Medical Accuracy

- **Reference Material**: "Code Chapter 1 to 14" medical textbook integration
- **Evidence-Based**: All health content validated against medical literature
- **Disclaimer System**: Appropriate medical disclaimers and guidance
- **Professional Review**: Content reviewed by healthcare professionals

---

**Live Demo**: https://www.brezcode.com  
**Documentation**: See DEPLOYMENT_GUIDE.md for detailed setup instructions