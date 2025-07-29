# BreastQuiz - Breast Health Assessment Platform

A comprehensive breast health assessment quiz platform built with modern web technologies.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **Authentication**: Session-based with bcrypt

## Project Structure

```
breastquiz/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── styles/        # CSS and styling files
├── server/                # Backend Express application
│   ├── routes/           # API route handlers
│   └── services/         # Business logic services
├── shared/               # Shared types and schemas
└── public/              # Static assets
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Push database schema:
   ```bash
   npm run db:push
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Features

- [ ] User authentication and registration
- [ ] Comprehensive breast health quiz
- [ ] Risk assessment and scoring
- [ ] Personalized health reports
- [ ] Responsive design
- [ ] Data privacy and security