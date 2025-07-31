# Multi-Tenant Health Assessment SAAS Platform

## Overview

This platform (leadgen.to) is a comprehensive AI-powered business automation tool, designed to provide reusable AI-powered business tools customizable for various industries. It functions as a multi-tenant infrastructure, offering complete business isolation with custom domains. Key capabilities include AI avatar assistants, landing page builders, lead generation, sales CRM, customer service automation, multi-channel engagement, and specialized vertical tools like health coaching (e.g., BrezCode integration). The overarching vision is for any new feature to become part of the universal LeadGen toolkit, adaptable for health & wellness, e-commerce, service providers, consultants, and other business verticals.

## User Preferences

Preferred communication style: Simple, everyday language.
Platform approach: Personal-first tools with business features as optional additions.
Authentication preference: Simple login using existing infrastructure, no complex onboarding.
AI Learning Requirement: AI coding assistant must learn from actual conversation history across all projects and avoid repeating same errors and wrong logic.

## System Architecture

### Business Platform Architecture
- **Ultimate Business App**: Comprehensive AI-powered business automation platform.
- **Modular Tool System**: Reusable AI components for diverse applications.
- **Multi-Tenant Infrastructure**: Complete business isolation with custom domains.
- **AI Avatar Integration**: Claude-powered virtual assistants for customer service and sales.
- **Multi-Channel Engagement**: Email, SMS, WhatsApp, LinkedIn automation.

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
- **Multi-Tenant Database**: PostgreSQL with separate tables for brands, brand configurations, and health assessment settings. Independent database schemas (e.g., leadgen-schema.ts and brezcode-schema.ts) for platform separation.
- **Brand Middleware**: Automatic brand resolution from subdomain/domain.
- **API Design**: RESTful endpoints for brands, configurations, and health assessments.
- **Authentication**: Session-based with brand-specific user management, bcrypt password hashing, and SendGrid for email verification.
- **Subscription Management**: Three-tier model with Stripe integration.
- **Security**: Enterprise-level security with rate limiting, Helmet, input validation, SQL injection prevention, bcrypt, access control, and audit logging.

### Key Features
- **AI Avatar System**: Claude AI integration (with OpenAI fallback) for customer service, sales, lead qualification, and booking assistance, featuring advanced context retention and modular responses. Includes a personal avatar system separate from business avatars.
- **Landing Page Builder**: AI-powered page creation with industry-specific templates.
- **Lead Generation System**: Automated capture, qualification, and nurturing workflows.
- **Sales CRM**: Complete pipeline management with automated follow-ups and payment processing.
- **Booking Service**: Automated scheduling with calendar integration.
- **AI Content Creation**: Daily content generation with image creation capabilities.
- **Health & Wellness Suite (BrezCode)**: Assessment forms, dietary recommendations, food analysis, health coaching, activity planning. Includes a comprehensive health scheduling feature with calendar-based daily planning using React Big Calendar.
- **AI Training System**: Comprehensive platform for training AI assistants with specialized avatar types and authentic customer scenarios, performance analytics, and Claude-powered analysis.
- **Profile Management**: Detailed user profile and business dashboard system for centralized management and analytics.
- **Business Consultant AI**: Claude-powered system for personalized business strategy generation.
- **Internationalization**: Support for multiple languages, timezone awareness, and content localization.

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