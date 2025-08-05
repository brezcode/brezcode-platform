# Multi-Tenant Health Assessment SAAS Platform

## Overview

This platform (leadgen.to) is a comprehensive AI-powered business automation tool, designed to provide reusable AI-powered business tools customizable for various industries. It functions as a multi-tenant infrastructure, offering complete business isolation with custom domains. Key capabilities include AI avatar assistants, landing page builders, lead generation, sales CRM, customer service automation, multi-channel engagement, and specialized vertical tools like health coaching (e.g., BrezCode integration). The overarching vision is for any new feature to become part of the universal LeadGen toolkit, adaptable for health & wellness, e-commerce, service providers, consultants, and other business verticals.

## User Preferences

Preferred communication style: Simple, everyday language.
Platform approach: Personal-first tools with business features as optional additions.
Authentication preference: Separate login systems for different platforms (LeadGen vs BrezCode).
AI Learning Requirement: AI coding assistant must learn from actual conversation history across all projects and avoid repeating same errors and wrong logic.
Dashboard Naming: Clear separation between frontend (personal) and backend (business) dashboards.

## System Architecture

### Dual Platform Architecture
- **BrezCode Health Platform**: Complete standalone breast health coaching platform with dedicated backend management system
- **LeadGen.to Business Platform**: AI-powered business automation and lead generation platform
- **Complete Platform Separation**: Independent databases, user systems, and feature sets
- **Health-Focused Backend Tools**: AI training, user management, health analytics, and content management for BrezCode
- **Business-Focused Tools**: Lead generation, CRM, and business automation for LeadGen.to

### Frontend Architecture
- **Framework**: React 18 with TypeScript.
- **Routing**: Wouter for client-side routing with brand context.
- **UI Components**: Radix UI primitives with shadcn/ui styling system.
- **Styling**: Tailwind CSS with brand-specific color customization.
- **State Management**: TanStack Query + Brand Context Provider.
- **Dynamic Components**: Template-based rendering with brand-specific content.
- **UI/UX Decisions**: Sunnyside.co-inspired design with a bright color palette for landing pages, tabbed interfaces, and clear visual hierarchy for user profiles and dashboards.

### Backend Architecture
- **Runtime**: Node.js with Express.js server.
- **COMPLETELY SEPARATE DATABASES**: 
  - **BrezCode Health Database**: Personal health data (brezcode_health_db) for breast health users
  - **LeadGen Business Database**: Business analytics data (leadgen_business_db) for business users
  - **Platform Isolation**: Zero data sharing between platforms for privacy and compliance
- **Separate Schema Files**: 
  - `shared/brezcode-schema.ts` for health platform tables
  - `shared/leadgen-schema.ts` for business platform tables
  - Complete table separation with no foreign key relationships between platforms
- **Platform-Specific Authentication**: Completely separate login systems with no shared user tables
- **API Design**: Platform-specific RESTful endpoints with separate routing
- **Subscription Management**: Platform-specific billing and subscription management
- **Security**: Enterprise-level security with platform isolation, rate limiting, Helmet, input validation, SQL injection prevention, bcrypt, access control, and audit logging.

### Key Features

#### BrezCode Health Platform
- **Dr. Sakura AI Coaching**: Advanced health coaching with Claude AI, specialized for breast health
- **Health Assessment System**: Comprehensive risk assessment and personalized reporting
- **AI Training Platform**: Complete training system for health coaching scenarios and performance optimization
- **Health Analytics**: Advanced health outcomes tracking and population health metrics
- **Content Management**: Evidence-based health education content with personalized recommendations
- **User Management**: Complete health user lifecycle management with subscription tiers
- **Notification System**: Health-focused reminders, alerts, and milestone celebrations
- **Admin Dashboard**: Professional backend management interface for health platform

#### LeadGen.to Business Platform  
- **Business AI Avatars**: Claude AI integration for customer service, sales, and lead qualification
- **Landing Page Builder**: AI-powered page creation with industry-specific templates
- **Lead Generation System**: Automated capture, qualification, and nurturing workflows
- **Sales CRM**: Complete pipeline management with automated follow-ups and payment processing
- **Business Analytics**: Comprehensive business intelligence and performance tracking
- **Brand Management**: Multi-brand support with custom configurations
- **Business Consultant AI**: Claude-powered system for personalized business strategy generation

#### Shared Technologies
- **AI Training System**: Platform-specific training for both health and business scenarios
- **Internationalization**: Support for multiple languages, timezone awareness, and content localization
- **Calendar Integration**: React Big Calendar for scheduling and activity planning

## External Dependencies

- **React Ecosystem**: React 18, TanStack Query, Wouter.
- **UI Framework**: Radix UI, Tailwind CSS, shadcn/ui.
- **Backend**: Express.js, bcrypt, express-session.
- **Payment Processing**: Stripe (v12).
- **AI Services**: OpenAI API (GPT-4o), Anthropic Claude (Sonnet-4).
- **Database**: PostgreSQL (Neon Serverless) with Drizzle ORM.
- **Email Service**: SendGrid.
- **Messaging (Optional)**: Twilio for SMS.
- **Calendar**: React Big Calendar.
- **AI Avatar Generation (Future)**: HeyGen Interactive Avatars.
- **Mobile Integration**: HealthKit (iOS), Google Fit (Android).