# BreastQuiz - Breast Health Assessment Platform

## Overview
BreastQuiz is an independent breast health assessment platform that provides personalized risk analysis and health recommendations based on evidence-based medical guidelines.

## Key Features
- **Comprehensive Health Assessment**: Multi-step questionnaire covering age, family history, lifestyle factors
- **Evidence-Based Risk Analysis**: Risk scoring algorithm considering medical factors
- **Personalized Recommendations**: Tailored health guidance based on individual risk profile
- **User-Friendly Interface**: Clean, responsive design with blue gradient hero section
- **Statistical Foundation**: Based on "1 in 8 women in US will develop breast cancer" medical statistic

## Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite
- **Hosting**: Replit-ready with independent deployment

## Project Structure
```
breastquiz/
├── client/          # React frontend application
├── server/          # Express backend API
├── shared/          # Shared TypeScript schemas
├── public/          # Static assets
└── package.json     # Dependencies and scripts
```

## Development Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Setup Environment Variables**
```bash
cp .env.example .env
# Add your DATABASE_URL and other required variables
```

3. **Run Database Migration**
```bash
npm run db:push
```

4. **Start Development Server**
```bash
npm run dev
```

## Database Schema
- `users`: User authentication and profile data
- `quiz_responses`: User assessment answers
- `health_reports`: Generated risk analysis and recommendations

## Deployment
Ready for deployment on:
- Replit (recommended for quick setup)
- Vercel + Neon PostgreSQL
- Railway
- Any Node.js hosting platform

## Independent Platform
This is a completely independent platform separate from LeadGen.to, designed specifically for breast health assessment and education.