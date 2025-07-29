# Step-by-Step Migration Guide: WomenHealth Project

## Complete Migration to Independent Breast Health Platform

This guide provides detailed instructions for migrating the breast health assessment platform to a new independent "WomenHealth" Replit project.

## Phase 1: Create New Replit Project

### Step 1: Project Creation
1. Go to **replit.com** and log in
2. Click **"Create Repl"**
3. Select **"Node.js"** template (recommended for .replit.dev subdomain)
4. Name your project: **"WomenHealth"** or **"BreastHealthAssessment"**
5. Click **"Create Repl"**

### Step 2: Clear Default Files
1. Delete the default `index.js` file
2. Clear `package.json` content
3. Remove any other default files to start fresh

## Phase 2: Upload Migration Package

### Step 3: Upload Core Files
Upload these files from the migration package to your new project:

**Root Configuration Files:**
- `package.json` → Root directory
- `vite.config.ts` → Root directory  
- `tailwind.config.ts` → Root directory
- `tsconfig.json` → Root directory
- `drizzle.config.ts` → Root directory
- `postcss.config.js` → Root directory
- `.env.example` → Root directory

**Frontend Application:**
- `client/index.html` → Create `client/` folder and upload
- `client/src/main.tsx` → Create `client/src/` folder
- `client/src/App.tsx` → In `client/src/`
- `client/src/components/Hero.tsx` → Create `client/src/components/`
- `client/src/components/health-report.tsx` → In `client/src/components/`
- `client/src/pages/HomePage.tsx` → Create `client/src/pages/`

**Backend System:**
- `server/index.ts` → Create `server/` folder
- `server/simple-routes.ts` → In `server/`

**Database Schema:**
- `shared/schema.ts` → Create `shared/` folder

## Phase 3: Environment Setup

### Step 4: Configure Environment Variables
1. Copy `.env.example` to `.env`
2. Configure your environment variables:
```env
DATABASE_URL=your_replit_postgresql_url
SESSION_SECRET=your_secure_random_string
NODE_ENV=development
```

### Step 5: Database Setup
1. **Provision PostgreSQL Database:**
   - In Replit, go to **Tools** → **Database**
   - Click **"New Database"** → **"PostgreSQL"**
   - Note the connection URL

2. **Update Environment:**
   - Copy the DATABASE_URL to your `.env` file
   - Ensure `DATABASE_URL` is properly formatted

## Phase 4: Install Dependencies & Build

### Step 6: Install Packages
Run these commands in the Replit console:
```bash
npm install
```

### Step 7: Database Migration
```bash
npm run db:push
```

### Step 8: Start Development Server
```bash
npm run dev
```

## Phase 5: Verification & Testing

### Step 9: Test Application
1. **Homepage:** Verify Hero section loads with "1 in 8 women" statistic
2. **Quiz Flow:** Test navigation to quiz page
3. **Database:** Confirm database connection works
4. **API Endpoints:** Verify `/api/reports/generate` responds

### Step 10: Domain Configuration

**For .replit.dev Subdomain (Automatic):**
- Your app will be available at: `womenhealth-username.replit.dev`
- No additional configuration needed

**For Custom Domain (brezcode.com):**
1. Configure DNS in your domain provider
2. Point A record to Replit's deployment IP
3. Set up custom domain in Replit deployment settings

## Phase 6: Production Deployment

### Step 11: Deploy Application
1. In Replit, click **"Deploy"**
2. Choose **"Autoscale"** for production
3. Configure custom domain if desired
4. Monitor deployment logs

### Step 12: Final Testing
- Test all quiz functionality
- Verify report generation
- Confirm responsive design
- Test on mobile devices

## Troubleshooting Common Issues

### Database Connection Issues
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test database connection
npm run db:studio
```

### Missing Dependencies
```bash
# Reinstall packages
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear build cache
rm -rf dist
npm run build
```

### TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

## Expected Project Structure
```
womenhealth/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.tsx
│   │   │   └── health-report.tsx
│   │   ├── pages/
│   │   │   └── HomePage.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
├── server/
│   ├── index.ts
│   └── simple-routes.ts
├── shared/
│   └── schema.ts
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── .env
```

## Key Features Verified Working
✅ Hero section with breast cancer statistic  
✅ Comprehensive health assessment quiz  
✅ Personalized report generation  
✅ Database integration  
✅ Responsive design  
✅ Production-ready deployment  

## Support & Next Steps
- **Documentation:** Complete project documentation included
- **Customization:** Easily modify branding and content
- **Scaling:** Ready for production deployment
- **Extensions:** Add user authentication, advanced analytics

## Success Criteria
- [ ] Project created successfully
- [ ] All files uploaded correctly
- [ ] Dependencies installed
- [ ] Database connected
- [ ] Application running on development server
- [ ] Hero section displays properly
- [ ] Quiz functionality works
- [ ] Report generation functional
- [ ] Ready for production deployment

**Total Migration Time:** 30-60 minutes  
**Deployment Target:** brezcode.com or womenhealth.replit.dev  
**Status:** Complete independent platform ready for launch