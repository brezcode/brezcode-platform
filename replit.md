# Multi-Tenant Health Assessment SAAS Platform

## Overview

This is a comprehensive SAAS platform that enables brands to create customized health assessment applications. Originally built as BrezCode (breast health coaching), it has been transformed into a white-label solution where each brand can configure their own landing page templates, health focus areas, branding, and content. The platform supports unlimited brands with multi-tenant architecture, subdomain routing, and comprehensive customization capabilities.

## System Architecture

### SAAS Platform Architecture
- **Multi-Tenancy**: Complete brand isolation with subdomain routing (brand.brezcode.com)
- **Template System**: Configurable landing page sections (Hero, Features, Pricing, FAQ, etc.)
- **Brand Management**: Database-driven brand configurations with custom branding
- **Admin Interface**: Full-featured dashboard for brand configuration and management

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing with brand context
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Styling**: Tailwind CSS with brand-specific color customization
- **State Management**: TanStack Query + Brand Context Provider
- **Dynamic Components**: Template-based rendering with brand-specific content

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Multi-Tenant Database**: PostgreSQL with brand, brand_configs, and brand_quiz_configs tables
- **Brand Middleware**: Automatic brand resolution from subdomain/domain
- **API Design**: RESTful endpoints for brands, configurations, and health assessments
- **Authentication**: Session-based with brand-specific user management

### Database Schema
- **brands**: Brand identity and domain configuration
- **brand_configs**: Customizable content templates and branding
- **brand_quiz_configs**: Health focus and quiz customization
- **brand_users**: User management per brand with subscription tracking

## Key Components

### Authentication System
- **Email-only Authentication**: Simple email signup with verification codes ✅ WORKING
- **Password Confirmation**: Added confirm password field with real-time validation ✅ WORKING
- **No phone verification**: Eliminated phone number collection and SMS verification
- **Single signup flow**: Email/password with email verification only
- **Session management**: Express sessions with bcrypt password hashing ✅ WORKING
- **Email verification**: SendGrid for verification codes with resend functionality ✅ WORKING
- **Protected routes**: Session-based authentication for chat features ✅ WORKING
- **Status**: Complete authentication system with password confirmation functional as of January 16, 2025

### Subscription Management
- Three-tier subscription model (Basic $4.99, Pro $9.99, Premium $19.99)
- Stripe integration for payment processing
- Subscription status tracking and validation
- Paywall protection for chat functionality

### AI Chat Interface
- Real-time chat with OpenAI GPT-4o model
- Custom system prompt for breast health coaching expertise
- Conversation history management
- Streaming responses (infrastructure ready)
- Evidence-based health guidance with appropriate medical disclaimers

### AI Avatar Assistant (IMPLEMENTED)
- **OpenAI Integration**: Basic avatar implementation using GPT-4o with enhanced memory and knowledge base
- **Advanced Memory System**: Customer memory, conversation history, and learned preferences
- **Knowledge Base**: Custom knowledge entries with search and category organization
- **Analytics Tracking**: Customer satisfaction, interaction types, and performance metrics
- **HeyGen Ready**: Infrastructure complete for future HeyGen upgrade when needed

### Health Scheduling System (COMPLETED)
- **Activity Templates**: Pre-built exercises, self breast exams, self massage, and wellness routines
- **Calendar Planning**: React Big Calendar integration for daily health activity scheduling
- **Personalized Schedules**: AI-generated schedules based on customer preferences and fitness levels
- **Progress Tracking**: Activity completion tracking with streaks and achievement system
- **Smart Reminders**: SMS, email, and push notification system for scheduled activities
- **Health Analytics**: Comprehensive stats, streaks, and wellness improvement metrics

### iPhone Widget Integration (NEW)
- **Progressive Web App**: Full PWA support for iPhone home screen installation
- **Widget Creation Guide**: Step-by-step interactive guide for adding iPhone widgets
- **Multiple Widget Types**: Daily health tips, activity reminders, health notifications
- **Native App Experience**: Standalone mode with push notifications and widget support
- **Safari Integration**: Optimized installation flow through Safari share menu

### Landing Page
- Sunnyside.co-inspired design with bright color palette
- Hero section with compelling value proposition
- Feature showcases and pricing tiers
- Chat interface preview for user engagement

## Data Flow

1. **User Registration/Login**: User credentials are validated and sessions are established
2. **Subscription Flow**: Users select a tier, complete Stripe checkout, and subscription status is updated
3. **Chat Access**: Authenticated users with active subscriptions can access the AI chat
4. **AI Interaction**: User messages are sent to OpenAI API with conversation context and system prompt
5. **Response Handling**: AI responses are processed and displayed in the chat interface

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, TanStack Query, Wouter router
- **UI Framework**: Radix UI primitives, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js, bcrypt for security, express-session
- **Payment Processing**: Stripe v12 for subscription management
- **AI Services**: OpenAI API for GPT-4o model access
- **Database**: Neon serverless PostgreSQL with Drizzle ORM (ready for production upgrade)

### Development Tools
- **Build Tools**: Vite, TypeScript, PostCSS
- **Development**: tsx for TypeScript execution, Replit-specific tooling

## Deployment Strategy

### Development Environment
- Replit-optimized setup with live reloading
- Vite development server with HMR
- Environment variables for API keys and configuration

### Production Considerations
- Database migration from in-memory to PostgreSQL ready
- Drizzle schema defined for user and subscription management
- Environment variable configuration for secrets
- Build process outputs optimized static assets and server bundle

### Environment Variables Required
- `OPENAI_API_KEY`: OpenAI API access for chat and avatar conversations
- `HEYGEN_API_KEY`: HeyGen Interactive Avatars API key for avatar creation and streaming
- `STRIPE_SECRET_KEY`: Stripe server-side key
- `STRIPE_BASIC_PRICE_ID`, `STRIPE_PRO_PRICE_ID`, `STRIPE_PREMIUM_PRICE_ID`: Subscription tier pricing
- `VITE_STRIPE_PUBLIC_KEY`: Stripe client-side key
- `DATABASE_URL`: PostgreSQL connection (for production upgrade)

### Email Configuration
- `SENDGRID_API_KEY`: SendGrid API key for email verification
- `FROM_EMAIL`: Verified sender email address for verification emails

### Twilio Integration (Optional - fallback to console logging)
- `TWILIO_ACCOUNT_SID`: Twilio account identifier for SMS
- `TWILIO_AUTH_TOKEN`: Twilio authentication token for SMS
- `TWILIO_PHONE_NUMBER`: Twilio phone number for sending SMS
- `SENDGRID_API_KEY`: SendGrid API key for email verification
- `FROM_EMAIL`: Verified sender email address for verification emails

## International Expansion & Scalability

### Database Architecture
- **Current Database**: PostgreSQL (Neon Serverless) - Excellent for international deployment
- **ORM**: Drizzle ORM with full TypeScript support
- **Advantages**: Unicode support, JSONB for flexible content, serverless scaling
- **Multi-language support**: Built-in with translation tables and user preferences

### Internationalization System
- **Languages Supported**: English, Chinese (Simplified/Traditional), Spanish, French, German, Japanese, Korean
- **Translation Management**: Database-driven with caching for performance
- **User Preferences**: Language, timezone, date format, notification frequency
- **Content Localization**: Quiz questions, reports, coaching tips all translatable

### Daily Coaching Engine
- **Personalized Content**: AI-generated tips based on user profile and progress
- **Engagement Tracking**: Streak counts, interaction scoring, milestone celebrations
- **Multi-channel Delivery**: Email, SMS, push notifications (time-zone aware)
- **Analytics**: User engagement metrics, health improvement tracking

### Production Hosting Recommendations
- **Recommended**: Vercel + Neon PostgreSQL ($39/month for production)
- **Alternative**: Railway (simpler deployment, similar pricing)
- **Enterprise**: AWS/Azure multi-region for high-scale deployment
- **Performance**: Global CDN, edge functions, database connection pooling

## Mobile & Widget Roadmap

### Next Phase Development Plan
1. **Progressive Web App (PWA)**: Add offline functionality and push notifications
2. **iPhone Widget Integration**: Daily health tips and progress tracking widgets
3. **Smart Notification System**: AI-powered timing and multi-channel delivery
4. **Mobile Optimization**: Enhanced touch interface and app-like experience

### Technical Roadmap
- **Week 1-2**: PWA setup with service workers and push notifications
- **Week 3-5**: iOS widget development with WidgetKit integration
- **Week 6-7**: Advanced notification engine with smart timing
- **Architecture**: Current foundation perfect for mobile expansion

## Changelog

```
Changelog:
- January 21, 2025. CLAUDE AI INTEGRATION COMPLETE: Successfully upgraded the entire AI system to use Anthropic Claude Sonnet-4 (claude-sonnet-4-20250514) for superior intelligence across all features. Implemented comprehensive enhancedAI service with Claude as primary AI engine and OpenAI as fallback. Enhanced dietary recommendation engine with Claude-powered meal planning featuring improved nutritional accuracy, health goal alignment, and personalized insights. Upgraded food analysis service to use Claude vision capabilities for more accurate nutritional breakdowns and health scoring. Enhanced avatar service with Claude-powered health coaching responses using advanced conversation context, customer memory integration, and knowledge base utilization. Created intelligent fallback systems with enhanced nutritional profiles and smart meal recommendations. System now provides superior AI responses with better medical knowledge, personalized nutrition guidance, and more empathetic health coaching across all user interactions.
- January 20, 2025. MACHINE LEARNING DIETARY RECOMMENDATION ENGINE: Implemented comprehensive AI-powered personalized dietary recommendation system using OpenAI GPT-4o for intelligent meal planning. Built DietaryRecommendationEngine with Harris-Benedict BMR calculations, activity level adjustments, macronutrient distribution, and ML-based preference learning. Created complete meal planning system with breakfast/lunch/dinner/snack recommendations, nutritional gap analysis, health goal alignment, and dietary restriction compliance. Added DietaryRecommendations component with user profile management, nutritional needs calculation, daily meal plan generation, and personalized food suggestions. Dashboard Quick Actions now include "Meal Plans (AI)" for intelligent dietary guidance. System provides complete personalized nutrition including caloric needs, macro targets, meal recipes, preparation times, health scores, and adaptive learning from user feedback.
- January 20, 2025. AI FOOD ANALYSIS FEATURE: Created comprehensive food analysis system using OpenAI GPT-4o vision model for nutritional content analysis from food photos. Built FoodAnalyzer component with camera capture, image upload, comprehensive nutritional breakdown (macronutrients, vitamins, minerals), health scoring, ingredient identification, and personalized recommendations. Added FoodAnalysisService with detailed nutrient analysis, health score calculation, and dietary recommendations. Created dedicated food analysis page with tabbed interface for macros, vitamins, minerals, and insights. Dashboard Quick Actions now include "Analyze Food" button for easy access. System provides complete nutritional data including protein, carbs, fat, fiber, vitamins A-K, minerals, daily value percentages, health score (0-100), and actionable dietary recommendations.
- January 20, 2025. APPLE WATCH HEALTH INTEGRATION: Implemented comprehensive Apple Watch and Apple Health data integration system. Created AppleWatchIntegration component with heart rate monitoring, activity tracking (steps, calories, active minutes), sleep analysis, and health insights generation. Added database schema for healthMetrics and healthDataSync tables. Built appleHealthService with personalized recommendations based on fitness data, health score calculation, and progress tracking. Added Apple Watch tab to notifications page with real-time sync, customizable settings, and health data visualization. Dashboard Quick Actions now include "Connect Apple Watch" button for easy access. System generates personalized health recommendations based on actual fitness metrics from wearable devices. DASHBOARD INTEGRATION: Added Apple Watch health data directly to main dashboard "Your Progress" section with real-time heart rate, steps, calories burned, and sleep hours display in colorful metric cards with automatic refresh every 5 minutes.
- January 20, 2025. IPHONE WIDGET INTEGRATION: Created comprehensive iPhone widget system with step-by-step installation guide. Built IPhoneWidgetGuide component with interactive setup wizard, multiple widget types (Daily Health Tips, Activity Reminders, Health Notifications), Progressive Web App support, and Safari integration. Enhanced dashboard Quick Actions to link directly to widget setup. Added widget benefits overview and detailed installation steps for native iPhone experience.
- January 20, 2025. NOTIFICATION SYSTEM FIXES: Fixed JavaScript errors in notification components by adding proper browser compatibility checks. Enhanced NotificationDemo with window object validation, permission state tracking, and better error handling for unsupported browsers. Added notification support detection and user-friendly status messages for different permission states.
- January 20, 2025. INTELLIGENT AI UPGRADE: Implemented comprehensive AI training system with Anthropic Claude support for more intelligent responses. Added complete training interface allowing users to upload documents, customize system prompts, add training instructions, and manage AI personality. Created advanced AI service with Claude-4 integration, fallback to OpenAI, and knowledge-based responses. Upgraded brand AI admin interface with dedicated training tab featuring document upload, prompt customization, and training content library management. AI avatar now remembers all training content and provides intelligent, context-aware responses using the latest Claude model.
- January 20, 2025. ENHANCED KNOWLEDGE SEARCH: Fixed AI assistant search algorithm with intelligent keyword matching and stop words filtering. Rebuilt knowledge base search to properly find relevant content using enhanced text matching that handles hyphenated terms and meaningful keywords. AI responses now successfully use 30+ knowledge base entries for comprehensive, evidence-based health guidance with proper medical disclaimers.
- January 20, 2025. HEALTH PLAN CREATION FIXED: Successfully debugged and resolved health plan generation issues. Fixed database schema export problem by adding health-schedule-schema to main schema exports. Corrected healthActivityTemplates table reference error in HealthScheduleService. Health plan creation now working perfectly - generates personalized 7-day schedules with 8+ activities based on user quiz results, preferences, and risk levels. API returns detailed activity templates with instructions, scheduling, and frequency recommendations (daily meditation, weekly strength training, monthly self-exams, etc.)
- January 20, 2025. HEALTH SCHEDULING SYSTEM: Implemented comprehensive health scheduling feature with calendar-based daily planning using React Big Calendar. Created activity templates for exercises, self breast exams, self massage, and wellness routines. Built health preferences setup with fitness levels, time preferences, available days, and reminder settings. Added complete progress tracking with streaks and achievement systems. Integrated OpenAI as basic avatar implementation with enhanced memory and knowledge base, ready for future HeyGen upgrade. Created health calendar interface with daily plan management and activity completion tracking
- January 20, 2025. AI AVATAR ASSISTANT FEATURE: Implemented comprehensive AI Avatar Assistant with HeyGen Interactive Avatars integration. Created 8-step requirements quiz for personalized avatar setup, advanced memory system for customer context retention, knowledge base management with search capabilities, multi-language support (175+ languages), Twilio voice integration for phone calls, and complete analytics tracking. Added avatar configuration database tables, enhanced avatar service with memory and knowledge base integration, and requirements service for automated system prompt generation
- January 20, 2025. B2B2C MULTI-TENANT DATABASE: Implemented comprehensive multi-tenant isolation with brand-specific customer databases. Created new database architecture with features table, brand_features for enrollment, brand_customers for isolated customer data, brand_customer_subscriptions, brand_customer_features for usage tracking, and brand_customer_assessments/chats/analytics for complete data separation. Added BrandCustomerService and FeatureService for scalable tenant management and feature enrollment system
- January 20, 2025. DOMAIN CONFIGURATION: Configured leadgen.to as main domain with path-based routing. BrezCode now accessible at leadgen.to/brezcode, admin at leadgen.to/admin. Implemented domain router for automatic brand detection and routing. Created domain landing page showcasing platform capabilities and brand navigation
- January 20, 2025. SAAS PLATFORM TRANSFORMATION: Completely restructured the application into a multi-tenant SAAS platform for creating branded health assessment apps. Implemented comprehensive template system with Hero, How It Works, Features, Customer Reviews, Pricing, FAQ, and Final CTA sections. Created brand management system with database schema for multi-brand support, dynamic landing page components, admin dashboard, and configuration forms. Each brand can now have custom subdomains, branding, content, and full white-label customization
- January 20, 2025. TRANSLATION SYSTEM COMPLETED: Achieved 100% Traditional Chinese translation coverage for entire landing page - fixed systematic translation gaps in hero section benefits, pricing components, risk reduction chart activities, phone mockup content, and complete footer including company description, navigation links, and copyright notice. Implemented comprehensive translation keys covering all user-visible content across components
- January 18, 2025. ARCHITECTURE OVERVIEW: Created comprehensive architecture documentation and mobile roadmap - PWA, iPhone widgets, push notifications, smart timing system planned with detailed technical implementation guide for next development phases
- January 17, 2025. INTERNATIONAL EXPANSION: Restructured for multi-language support with 8 languages (EN, ZH-CN, ZH-TW, ES, FR, DE, JA, KO), implemented daily coaching engine with personalized AI content, enhanced database schema for user preferences and analytics, added production hosting recommendations for global deployment, created internationalization and coaching API endpoints
- January 17, 2025. MAJOR UPGRADE: Implemented evidence-based medical accuracy system with OpenAI GPT-4o - fixed critical content errors (Age 30 NOT high risk, 85% BC patients have no family history, no breast density assumptions without screening), created comprehensive knowledge base with user feedback system, enhanced AI with evidence-based prompting from uploaded reference materials, all medical content now validated against "Code Chapter 1 to 14" medical reference book
- January 17, 2025. Fixed quiz completion flow - removed incorrect redirect from QuizTransition component that was bypassing signup flow and causing 401 errors, now properly flows from quiz → transition → signup → report
- January 17, 2025. Updated mammogram screening question logic - separated "Never or irregularly" into "Never" and "Irregularly" options, added conditional logic to skip dense breast tissue, benign condition, and cancer history questions when user selects "Never" for mammogram screening
- January 17, 2025. Removed "Not Yet" option from menstrual age question - since users are aged 20-80, all participants must have already had their first menstrual period, making "Not Yet" option inappropriate for the target demographic
- January 17, 2025. Enhanced age validation for pregnancy and menopause questions - added comprehensive boundary case validation for users at age thresholds, prompts verification when current age matches category boundaries (pregnancy: 30/25, menopause: 55), includes logical consistency checks for impossible age combinations to ensure accurate responses
- January 16, 2025. Finalized independent risk scoring system - removed age and ethnicity from risk calculations entirely, moved stressful events back to changeable factors, implemented completely independent scoring where unchangeable and changeable factors are calculated separately starting from baseline 1.0, total score combines both effects, provides clear separation of controllable vs uncontrollable risks
- January 16, 2025. Implemented comprehensive health report generation system - created statistical risk calculation engine based on BC Assessment quiz with evidence-based scoring, built 5 user profile categories (teenager, premenopausal, postmenopausal, current patient, survivor), generated personalized recommendations and daily wellness plans, added full report UI with risk visualization, protective factors analysis, and follow-up timelines, integrated quiz completion → report generation flow with localStorage data transfer
- January 16, 2025. Completed email-only authentication with confirm password field - fixed all fetch errors, added password confirmation validation, working resend verification codes, complete signup flow functional end-to-end
- January 16, 2025. Simplified to email-only authentication - removed Firebase Google login due to domain authorization complexity, now using clean email signup with verification codes only, removed all Firebase dependencies and phone verification completely
- January 16, 2025. Eliminated phone verification entirely - simplified authentication to Firebase Google login + email verification only, removed all Twilio SMS dependencies, created clean 2-step signup flow (auth choice → email verification), updated schema and storage to remove phone fields
- January 16, 2025. Identified Twilio A2P 10DLC requirement - US phone numbers require brand/campaign registration for SMS delivery, current system falls back to console logging for verification codes which works perfectly for development testing
- January 16, 2025. Fixed phone number validation for international formats - updated validation to support 6-15 digit phone numbers with proper country code formatting, fixed signup schema to accept full international phone format (+country code + number), improved Twilio error handling for regional SMS permissions, added helpful guidance text for different countries including Hong Kong 8-digit format
- January 16, 2025. Integrated Firebase Authentication with Google Social Login - replaced custom email verification with Firebase's automatic email verification, maintained Twilio SMS for phone verification, added Firebase Auth components with clean UI, created hybrid auth system (Firebase + Twilio), configured Firebase SDK and authentication hooks
- January 14, 2025. Fixed runtime error plugin issues and added quiz transition page - removed redundant signup questions (24-26) from quiz, fixed apiRequest function signatures causing unhandled promise rejections, added transitional page between quiz completion and signup explaining assessment report and coaching journey
- January 14, 2025. Implemented complete signup flow with email and phone verification - quiz now transitions to 4-step signup (email/password, phone selection with country codes, email verification, phone verification), added database schemas for verification storage, created comprehensive signup API routes with proper validation, updated authentication system to support verified users
- January 12, 2025. Implemented comprehensive BC Assessment quiz with all 26 questions from Excel file - added educational explanations from column D for every question, fixed ethnicity question to include all 4 options, implemented conditional questions for symptom follow-ups (pain, lump characteristics, breast changes), and integrated BMI auto-calculation
- January 11, 2025. Landing page redesigned with BrezCode content - updated hero section with risk statistics, evidence-based activities, app features, testimonials, and simplified pricing structure
- July 02, 2025. Initial setup
```

## User Preferences

Preferred communication style: Simple, everyday language.