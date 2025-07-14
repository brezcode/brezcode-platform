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
- Session-based authentication using express-session
- User registration and login with email/password
- Password hashing with bcrypt
- Protected routes requiring authentication and active subscription

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

## Changelog

```
Changelog:
- January 14, 2025. Implemented complete signup flow with email and phone verification - quiz now transitions to 4-step signup (email/password, phone selection with country codes, email verification, phone verification), added database schemas for verification storage, created comprehensive signup API routes with proper validation, updated authentication system to support verified users
- January 12, 2025. Implemented comprehensive BC Assessment quiz with all 26 questions from Excel file - added educational explanations from column D for every question, fixed ethnicity question to include all 4 options, implemented conditional questions for symptom follow-ups (pain, lump characteristics, breast changes), and integrated BMI auto-calculation
- January 11, 2025. Landing page redesigned with BrezCode content - updated hero section with risk statistics, evidence-based activities, app features, testimonials, and simplified pricing structure
- July 02, 2025. Initial setup
```

## User Preferences

Preferred communication style: Simple, everyday language.