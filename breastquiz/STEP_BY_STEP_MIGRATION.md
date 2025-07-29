# Step-by-Step Migration to WomenHealth Project

## Replit Setup Questions - Your Answers

**Platform Type**: **Node.js** 
- BreastQuiz is a full-stack application
- React frontend + Express backend + PostgreSQL database

**Template**: Choose "Node.js" or "Blank" template

## Migration Steps

### Step 1: Project Structure Setup
When Replit asks about structure, tell it:
- **Framework**: Node.js with React frontend
- **Build Tool**: Vite
- **Database**: PostgreSQL
- **Package Manager**: npm

### Step 2: File Transfer Order (Important!)

**First - Core Configuration:**
1. `package.json` (Dependencies - upload this FIRST)
2. `tsconfig.json` (TypeScript config)
3. `vite.config.ts` (Build configuration)
4. `tailwind.config.js` (Styling)
5. `drizzle.config.ts` (Database)

**Second - Application Code:**
6. `shared/schema.ts` (Database schemas)
7. `server/` folder (Backend API)
8. `client/` folder (React frontend)

**Third - Configuration:**
9. `.env.example` (Environment template)
10. `README.md` (Documentation)

### Step 3: Environment Setup

In WomenHealth project Secrets tab:
```
DATABASE_URL=postgresql://username:password@localhost:5432/breastquiz
SESSION_SECRET=women-health-secure-key-2025
NODE_ENV=development
PORT=5001
```

### Step 4: Installation Commands

Run in order:
```bash
npm install
npm run db:push
npm run dev
```

### Step 5: Test Core Features

Verify these work:
- [ ] Homepage loads with "1 in 8 women" statistic
- [ ] Blue gradient hero section
- [ ] "Take the quiz" button navigates to assessment
- [ ] Quiz questions display properly
- [ ] Database saves responses
- [ ] Results page shows recommendations

## File Structure in WomenHealth

```
WomenHealth/
├── package.json          # Dependencies (upload FIRST)
├── vite.config.ts        # Build config
├── tsconfig.json         # TypeScript
├── tailwind.config.js    # Styling
├── drizzle.config.ts     # Database
├── shared/
│   └── schema.ts         # Database schemas
├── server/
│   ├── index.ts          # Express server
│   ├── db.ts             # Database connection
│   └── routes/health.ts  # Health API
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.tsx      # "1 in 8 women" statistic
│   │   │   ├── Quiz.tsx      # Health assessment
│   │   │   ├── Navigation.tsx
│   │   │   └── Features.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── QuizPage.tsx
│   │   │   ├── ResultsPage.tsx
│   │   │   └── LoginPage.tsx
│   │   └── styles/
│   │       └── globals.css   # Blue gradient styling
│   └── index.html
└── public/               # Static assets
```

## Expected Outcome

**Before Migration:**
- NudgeNote project: LeadGen.to + BreastQuiz combined

**After Migration:**
- NudgeNote project: LeadGen.to only
- WomenHealth project: BreastQuiz only

**URLs:**
- LeadGen.to: `nudgenote-username.replit.dev`
- BreastQuiz: `womenhealth-username.replit.dev`

## Migration Checklist

- [ ] Create WomenHealth project (Node.js)
- [ ] Upload package.json first
- [ ] Upload configuration files
- [ ] Upload application code
- [ ] Set environment variables
- [ ] Run npm install
- [ ] Initialize database
- [ ] Test functionality
- [ ] Verify complete separation

## Troubleshooting

**If upload fails:**
- Upload package.json first, then run `npm install`
- Upload files in smaller batches
- Check file paths match exactly

**If database fails:**
- Verify DATABASE_URL in Secrets
- Run `npm run db:push` manually
- Check PostgreSQL is enabled in project

Your BreastQuiz platform will be completely independent at womenhealth-username.replit.dev!