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
- 🏥 **Dr. Sakura AI Avatar**: Empathetic health coach with cultural sensitivity
- 📊 **Health Assessments**: Personalized risk assessment and recommendations
- 🎯 **Proactive Research**: Educational content delivery with KOL integration
- 💬 **WhatsApp Integration**: Multi-platform messaging with health guidance

### SkinCoach AI Platform  
- 📸 **AI Skin Analysis**: Photo-based acne and skin condition assessment
- 🔬 **Skyn AI Technology**: Advanced computer vision for skin health
- 💡 **Personalized Recommendations**: Tailored skincare routines and products
- 📈 **Progress Tracking**: Before/after analysis and improvement monitoring

### LeadGen Business Platform
- 🤖 **AI Business Assistants**: Automated lead generation and customer engagement
- 🏢 **Multi-Tenant Architecture**: Isolated client environments
- 📱 **WhatsApp Business API**: Automated messaging and customer support
- 📊 **Analytics Dashboard**: Performance tracking and business insights

## Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Wouter Router
- **Backend**: Node.js + Express + Multi-Platform WhatsApp Service
- **AI**: Anthropic Claude Sonnet-4 + Custom Avatar Services
- **Database**: Neon Serverless PostgreSQL + Drizzle ORM
- **Deployment**: Vercel + Custom Domain Routing
- **Domains**: www.brezcode.com, www.skincoach.ai, leadgen.to

## Domain Architecture
- **Domain-specific routing**: Each platform loads appropriate content based on domain
- **Unified codebase**: Single repository with multi-platform deployment
- **Server-side detection**: Custom middleware for domain-specific content delivery
- **Client-side routing**: Hash-based routing with domain overrides

## Deployment
Configured for Vercel deployment with:
- Multi-domain support and SSL certificates
- Environment variable management for WhatsApp credentials
- Optimized build configuration for full-stack deployment
- Database migrations and multi-platform API routing

Built with ❤️ for the future of AI-powered health, beauty, and business automation.