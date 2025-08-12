# BrezCode Multi-Platform Health & Business Ecosystem

## Overview
Comprehensive multi-platform application featuring three distinct AI-powered platforms:

### 🌸 **BrezCode** (www.brezcode.com)
AI-powered health and wellness coach specializing in breast health education, personalized assessments, and wellness guidance with Dr. Sakura avatar integration.

### ✨ **SkinCoach AI** (www.skincoach.ai)
Advanced AI skin analysis platform using Skyn AI technology for acne assessment, skin condition analysis, and personalized skincare recommendations.

### 🚀 **LeadGen Platform**
AI business automation and lead generation tools for businesses, featuring multi-tenant SaaS architecture and WhatsApp integration.

## Platform Features

### BrezCode Health Platform
- 🌸 **Breast Health Focus**: Specialized AI coaching for breast health education and wellness
- 🏥 **Dr. Sakura AI Avatar**: Empathetic health coach with cultural sensitivity
- 📊 **Breast Health Assessments**: Risk evaluation and personalized recommendations
- 🎯 **Educational Content**: KOL-curated research and proactive health guidance
- 💬 **WhatsApp Health Support**: Direct messaging with AI health coach

### SkinCoach AI Platform  
- 📸 **Skin Analysis Technology**: Photo-based acne and skin condition assessment
- 🔬 **Advanced AI Vision**: Computer vision for comprehensive skin health analysis
- 💡 **Skincare Recommendations**: Personalized routines and product suggestions
- 📈 **Progress Tracking**: Before/after analysis and improvement monitoring
- ✨ **Dermatology Focus**: Specialized platform separate from general health

### LeadGen Business Platform
- 🤖 **Business Automation**: AI-powered lead generation and customer acquisition
- 🏢 **Multi-Client SaaS**: Isolated environments for different business clients
- 📱 **WhatsApp Business API**: Automated messaging and customer support
- 📊 **Growth Analytics**: Performance tracking and business intelligence
- 🚀 **Sales Optimization**: Separate platform focused purely on business growth

## Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Wouter Router
- **Backend**: Node.js + Express + Multi-Platform WhatsApp Service
- **AI**: Anthropic Claude Sonnet-4 + Custom Avatar Services
- **Database**: Neon Serverless PostgreSQL + Drizzle ORM
- **Deployment**: Vercel + Custom Domain Routing
- **Domains**: www.brezcode.com, www.skincoach.ai, leadgen.to

## Architecture & Infrastructure

### "Copy-on-Need" Development Strategy
This repository serves as a **Shared Tools Laboratory** for developing reusable components:
- **Central Development Hub**: Build tools, services, and components once
- **Selective Distribution**: Copy specific tools to individual platforms only when needed
- **Platform Independence**: Each platform runs completely independently after copying
- **Zero Runtime Dependencies**: No shared services or coupling between platforms
- **Modular Components**: WhatsApp API, Camera tools, AI services, etc. developed here

### Database Architecture (Platform Isolation)
```bash
# Completely Separate Databases Per Platform
brezcode_production     # Health data (HIPAA compliant)
skincoach_production    # Skin analysis data (GDPR compliant)  
leadgen_production      # Business data (standard compliance)

# Optional: Minimal shared services
shared_auth_production  # User accounts, sessions only
shared_logs_production  # System logs, analytics only
```

### Domain Architecture
- **Domain-specific routing**: Each platform loads appropriate content based on domain
- **Complete Platform Isolation**: No data mixing or cross-platform dependencies
- **Server-side detection**: Custom middleware for domain-specific content delivery
- **Client-side routing**: Hash-based routing with domain overrides

### Benefits of This Architecture
- ✅ **Maximum Security**: Complete data isolation per platform
- ✅ **Regulatory Compliance**: HIPAA (BrezCode), GDPR (SkinCoach), Business (LeadGen)
- ✅ **Risk Management**: Platform failures isolated, no cascading issues
- ✅ **Development Efficiency**: Build tools once, copy to multiple platforms
- ✅ **Independent Scaling**: Each platform scales without affecting others
- ✅ **Technology Freedom**: Each platform can use different tech stacks after copying

## Deployment
Configured for Vercel deployment with:
- Multi-domain support and SSL certificates
- Environment variable management for WhatsApp credentials
- Optimized build configuration for full-stack deployment
- Database migrations and multi-platform API routing

Built with ❤️ for the future of AI-powered health, beauty, and business automation.