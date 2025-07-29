# WomenHealth Project Migration Package

## Complete Independent Breast Health Assessment Platform

This package contains all files needed to migrate the breast health assessment platform to a new independent "WomenHealth" Replit project.

## Package Contents (27 Files Total)

### 1. Frontend Components (React + TypeScript)
```
client/src/components/
├── Hero.tsx                    # Hero section with "1 in 8 women" statistic
├── health-report.tsx           # Comprehensive health report display
├── quiz-component.tsx          # Complete 26-question assessment
└── ui/                         # Shadcn/ui components (Card, Button, Progress, etc.)

client/src/pages/
├── quiz.tsx                    # Quiz page
├── registration.tsx            # User registration
├── personalized-report.tsx     # Report display page
└── App.tsx                     # Main application routing
```

### 2. Backend API (Express + Node.js)
```
server/
├── index.ts                    # Main server entry point
├── simple-routes.ts            # Health assessment API endpoints
├── db.ts                       # Database connection (PostgreSQL)
└── storage.ts                  # Data management layer
```

### 3. Database Schema (PostgreSQL)
```
shared/
├── schema.ts                   # Main database schema
└── brezcode-schema.ts          # Health-specific tables
```

### 4. Configuration Files
```
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Styling configuration
├── vite.config.ts             # Build configuration
├── drizzle.config.ts          # Database configuration
└── .env.example               # Environment variables template
```

## Key Features Included

### ✅ Complete Health Assessment
- 26-question comprehensive breast cancer risk assessment
- Evidence-based scoring algorithm
- BMI calculation and risk factor analysis
- Personalized user profiling (teenager, premenopausal, postmenopausal, etc.)

### ✅ Comprehensive Health Reports
- Detailed section analysis (Demographics, Family History, Lifestyle, Reproductive)
- 1000+ word medical analysis with research context
- Personalized coaching focus areas
- Daily wellness plans (morning, afternoon, evening)
- Follow-up timeline with specific actions

### ✅ Professional Hero Section
- "1 in 8 women in US will develop breast cancer" hero statistic
- Evidence-based health activities showcase
- Professional medical design and branding
- Call-to-action for assessment completion

### ✅ User Registration System
- Email-based registration with validation
- Session management and authentication
- Profile creation and data persistence
- Secure data handling

### ✅ Database Integration
- PostgreSQL database with proper schemas
- User management and assessment storage
- Report generation and retrieval
- Data migration scripts

## Migration Steps

### Step 1: Create New Replit Project
1. Go to Replit.com
2. Click "Create Repl"
3. Select "Node.js" template (recommended for .replit.dev subdomain)
4. Name it "WomenHealth" or "BreastHealthAssessment"

### Step 2: Upload Package Files
Upload all 27 files from this migration package to your new project:

**Core Application Files:**
- package.json (dependencies)
- All client/ directory files (React frontend)
- All server/ directory files (Express backend)
- All shared/ directory files (database schemas)
- Configuration files (vite.config.ts, tailwind.config.ts, etc.)

### Step 3: Environment Setup
1. Copy `.env.example` to `.env`
2. Configure required environment variables:
```
DATABASE_URL=your_postgresql_connection_string
ANTHROPIC_API_KEY=your_claude_api_key (optional, for enhanced reports)
```

### Step 4: Database Setup
1. Provision PostgreSQL database in Replit
2. Run database migrations:
```bash
npm run db:push
```

### Step 5: Install Dependencies & Run
```bash
npm install
npm run dev
```

## Domain Configuration

### For .replit.dev Subdomain
- Your app will be available at: `womenhealth.replit.dev`
- No additional configuration needed

### For Custom Domain (brezcode.com)
1. Configure DNS settings in your domain provider
2. Point A record to Replit's IP
3. Set up custom domain in Replit deployment settings

## Technical Architecture

### Frontend Stack
- React 18 with TypeScript
- Tailwind CSS for styling
- Shadcn/ui component library
- Vite for build system
- Wouter for routing

### Backend Stack
- Node.js with Express
- TypeScript for type safety
- PostgreSQL database
- Drizzle ORM
- Session-based authentication

### Key Endpoints
```
GET  /                          # Landing page with hero
GET  /quiz                      # Health assessment quiz
POST /api/reports/generate      # Generate health report
GET  /personalized-report       # Display report results
POST /api/auth/register         # User registration
```

## Data Privacy & Security
- Secure session management
- HIPAA-compliant data handling considerations
- User data encryption
- Proper authentication flows

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:push      # Update database schema
npm run db:studio    # Open database admin interface
```

## Support & Customization
- Fully customizable branding and content
- Modular component architecture
- Easy to extend with additional features
- Professional medical-grade styling

## Deployment Ready
- Optimized for Replit deployment
- Production-ready configuration
- Scalable architecture
- Mobile-responsive design

---

**Total Package Size:** 27 files ready for independent deployment
**Target Domain:** brezcode.com or womenhealth.replit.dev
**Status:** Production-ready independent platform

This migration package provides everything needed to deploy a professional, comprehensive breast health assessment platform completely separate from the LeadGen.to system.