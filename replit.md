# BrezCode - Breast Health Coach AI

## Overview

This is a subscription-based web application that provides AI-powered breast health coaching through a conversational interface. The application features a modern landing page inspired by the BrezCode design document with evidence-based risk reduction activities, AI chat functionality, and subscription tiers. It's built as a full-stack React application with an Express.js backend, designed to run on Replit with session-based authentication and in-memory storage for the MVP.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens inspired by Sunnyside.co
- **State Management**: TanStack Query for server state management
- **Payment Integration**: Stripe React components for subscription handling

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful endpoints for authentication, chat, and payments
- **Session Management**: Express sessions with in-memory storage
- **Authentication**: Session-based with bcrypt password hashing
- **AI Integration**: OpenAI GPT-4o for conversational health coaching

### Build System
- **Bundler**: Vite for frontend development and building
- **TypeScript**: Full TypeScript support across client and server
- **Module System**: ESM modules throughout the application

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
- `OPENAI_API_KEY`: OpenAI API access
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

## Changelog

```
Changelog:
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