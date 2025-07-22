# LeadGen.to - AI Business Automation Platform

## 🚀 Comprehensive Business AI Platform

leadgen.to provides complete business automation tools starting with personal productivity and expanding to full business automation. Originally developed while building BrezCode (health assessment client), the platform has evolved into a complete business automation ecosystem.

## ✨ Core Features

### Personal-First Platform Tools
- **AI Avatar Assistant**: Claude-powered virtual assistant for customer service and sales
- **Landing Page Builder**: AI-powered page creation with custom branding
- **Lead Generation System**: Automated capture, qualification, and nurturing
- **Sales CRM**: Complete pipeline management with automated follow-ups
- **Booking Service**: Automated scheduling with calendar integration
- **Multi-Channel Engagement**: Email, SMS, WhatsApp, LinkedIn automation
- **AI Content Creation**: Daily content generation with image creation
- **Health & Wellness Tools**: Assessment forms, dietary recommendations, food analysis

### Business Applications
- **BrezCode**: Health assessment and coaching platform (leadgen.to/brezcode)
- **Modular Profile System**: International support for 195+ countries
- **Business Landing Creator**: 4-step wizard with template selection
- **AI Training System**: Role-playing scenario testing for assistant training

## 🏗️ Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing with brand context
- **Radix UI** primitives with shadcn/ui styling
- **Tailwind CSS** with brand-specific customization
- **TanStack Query** for state management

### Backend
- **Node.js** with Express.js server
- **PostgreSQL** multi-tenant database with Drizzle ORM
- **Brand Middleware** for automatic brand resolution
- **RESTful API** design with session-based authentication

### AI Integration
- **Claude Sonnet-4** as primary AI engine
- **OpenAI GPT-4o** as fallback system
- **Advanced memory systems** with conversation context
- **Knowledge base integration** with search capabilities

## 🌍 International Support

- **Languages**: English, Chinese (Simplified/Traditional), Spanish, French, German, Japanese, Korean
- **Global Profile System**: 195+ countries with phone codes and address formatting
- **Multi-timezone Support**: Automated timezone detection and handling
- **Cultural Localization**: Content adaptation for different regions

## 🚀 Deployment

### Production URLs
- **Main Platform**: https://leadgen.to
- **Profile Editor**: https://leadgen.to/profile  
- **Business Creator**: https://leadgen.to/business-landing-creator
- **BrezCode Health**: https://leadgen.to/brezcode
- **Admin Interface**: https://leadgen.to/admin
- **Subdomain Support**: https://brezcode.leadgen.to

### Build Commands
```bash
npm install
npm run build
npm run dev
```

### Environment Variables
```
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key  
DATABASE_URL=your_postgres_url
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=your_verified_email
```

## 📊 Performance
- **Server Bundle**: 69.8KB optimized
- **Client Assets**: 1.09MB with 102KB CSS
- **Global CDN**: Vercel edge functions
- **Database**: Neon serverless PostgreSQL

## 🎯 Business Model

LeadGen.to operates as a comprehensive business automation platform where:
- **Users start with personal tools** (profile, productivity, health tracking)
- **Business features are optional additions** (CRM, landing pages, AI assistants)
- **BrezCode demonstrates platform capabilities** in health/wellness vertical
- **All tools are available to any business** for their specific industry needs

## 📈 Recent Achievements

- **January 2025**: Complete authentication system with email verification
- **Multi-business AI assistant creation** with industry categorization
- **International profile system** supporting 195+ countries
- **Business landing creator** with 4 professional templates
- **AI training platform** with role-playing scenarios
- **Domain deployment ready** with optimized Vercel configuration

## 🛠️ Development

Built with modern full-stack JavaScript patterns, emphasizing frontend-heavy architecture with backend focused on data persistence and API calls. Designed for scalability with multi-tenant database architecture and comprehensive error handling.

---

**Platform Status**: FULLY OPERATIONAL - Ready for live deployment at leadgen.to