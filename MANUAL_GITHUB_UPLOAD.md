# Manual GitHub Upload Process

## Step-by-Step File Upload to GitHub

Since ZIP download isn't available, we'll copy files manually. This is faster and more reliable.

### Step 1: Go to Your Repository
Visit: https://github.com/leedennyps/leadgen.to

### Step 2: Upload Core Files (Start with these)

**A. Create package.json**
1. Click "Add file" → "Create new file"
2. File name: `package.json`
3. Copy and paste this content:

```json
{
  "name": "rest-express",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.32.0",
    "@neondatabase/serverless": "^0.14.6",
    "@sendgrid/mail": "^8.1.4",
    "@stripe/react-stripe-js": "^3.0.1",
    "@stripe/stripe-js": "^4.14.0",
    "bcrypt": "^5.1.1",
    "connect-pg-simple": "^10.0.0",
    "drizzle-orm": "^0.40.3",
    "drizzle-zod": "^0.5.1",
    "express": "^4.21.1",
    "express-session": "^1.18.1",
    "memorystore": "^1.6.7",
    "openai": "^4.79.1",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "stripe": "^17.9.0",
    "twilio": "^5.5.0",
    "ws": "^8.18.0",
    "zod": "^3.24.1"
  }
}
```

**B. Create vercel.json**
1. Click "Add file" → "Create new file"
2. File name: `vercel.json`
3. Copy and paste:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "dist/index.html"
    }
  ],
  "functions": {
    "dist/index.js": {
      "maxDuration": 30
    }
  }
}
```

**C. Create README.md**
1. Click "Add file" → "Create new file"  
2. File name: `README.md`
3. Copy the README content I created earlier (comprehensive documentation)

### Step 3: Essential Config Files

**Create these additional files:**
- `tsconfig.json` (TypeScript config)
- `tailwind.config.ts` (Styling config)
- `vite.config.ts` (Build config)
- `.gitignore` (Exclude node_modules)

### Step 4: Create Directory Structure

After core files, create folders:
1. Click "Create new file"
2. Type `client/src/App.tsx` (creates client/src folder)
3. Type `server/index.ts` (creates server folder)
4. Type `shared/schema.ts` (creates shared folder)

### Step 5: Deploy to Vercel

Once you have the core files uploaded:
1. Go to https://vercel.com/new
2. Import the GitHub repository
3. Configure build settings
4. Deploy!

Should I help you copy the specific file contents one by one?