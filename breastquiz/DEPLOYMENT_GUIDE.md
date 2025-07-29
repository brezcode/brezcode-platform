# BreastQuiz Independent Deployment Guide

## Current Status
✅ **Complete Independence Achieved**: BreastQuiz is now completely separated from LeadGen.to with its own database schema, API routes, and user management system.

## Separation Options

### Option 1: Create New Replit (Easiest - 5 minutes)

1. **Create New Replit:**
   - Go to [replit.com](https://replit.com)
   - Click "Create Repl"
   - Choose "Node.js" template
   - Name it "BreastQuiz-Assessment" or "brezcode"

2. **Upload BreastQuiz Code:**
   - Download/copy all files from the `breastquiz/` folder
   - Upload to your new Replit workspace
   - Files to transfer:
     ```
     breastquiz/
     ├── client/          # React frontend
     ├── server/          # Express backend  
     ├── shared/          # Database schemas
     ├── public/          # Static assets
     ├── package.json     # Dependencies
     ├── vite.config.ts   # Build config
     ├── drizzle.config.ts # Database config
     ├── tsconfig.json    # TypeScript config
     └── tailwind.config.js # Styling
     ```

3. **Configure Environment:**
   - Add DATABASE_URL environment variable in Replit Secrets
   - Run `npm run db:push` to create database tables
   - Run the project with "Run" button

### Option 2: GitHub + New Replit (Professional - 10 minutes)

1. **Create GitHub Repository:**
   - Create new repository named "breastquiz-platform"
   - Upload all files from `breastquiz/` folder
   - Include the `.gitignore` and `README.md` created

2. **Import to Replit:**
   - In Replit, click "Create Repl" 
   - Choose "Import from GitHub"
   - Enter your repository URL
   - Replit will automatically set up the project

3. **Configure Deployment:**
   - Set up environment variables in Secrets
   - Configure database connection
   - Deploy using Replit's deployment options

## Database Setup

The BreastQuiz platform uses its own dedicated database schema:

```sql
-- Independent tables (no relation to LeadGen.to)
users            # User authentication
quiz_responses   # Assessment answers  
health_reports   # Risk analysis results
```

## Environment Variables Required

```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret_key
NODE_ENV=production
```

## Deployment Targets

### Replit Deployment (Recommended)
- **Autoscale Deployment**: Best for variable traffic
- **Reserved VM**: For consistent performance
- Custom domain: Connect brezcode.com

### Alternative Platforms
- **Vercel + Neon PostgreSQL**: $0-39/month
- **Railway**: Simple deployment with database
- **Heroku + PostgreSQL**: Traditional hosting

## Custom Domain Setup

Once deployed on Replit:
1. Go to your Replit deployment dashboard
2. Click "Domains" 
3. Add custom domain: `brezcode.com`
4. Configure DNS records as instructed

## Post-Deployment Checklist

✅ Database tables created (`npm run db:push`)  
✅ Environment variables configured  
✅ Custom domain connected (brezcode.com)  
✅ SSL certificate active  
✅ Health assessment quiz functional  
✅ Risk analysis engine working  
✅ User registration/login operational  

## Independent Features Confirmed

- ✅ "1 in 8 women" breast cancer statistic in hero
- ✅ Blue gradient background with yellow CTA buttons
- ✅ Comprehensive health assessment questionnaire  
- ✅ Evidence-based risk scoring algorithm
- ✅ Personalized health recommendations
- ✅ Complete user journey: Landing → Quiz → Results
- ✅ Dedicated database separate from LeadGen.to
- ✅ Independent hosting environment ready

## Support

For deployment assistance or custom domain setup, the platform is fully configured and ready for independent hosting at brezcode.com.