# LeadGen.to Domain Setup with Namecheap

## Step 1: Configure DNS Records in Namecheap

### Required DNS Configuration for leadgen.to

You need to set up the following DNS records in your Namecheap account:

#### Primary DNS Records
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: 1 hour

Type: A Record
Host: @
Value: 76.76.19.19
TTL: 1 hour

Type: A Record
Host: @
Value: 76.76.21.21
TTL: 1 hour
```

#### Subdomain Support (Optional)
```
Type: CNAME
Host: *
Value: cname.vercel-dns.com
TTL: 1 hour
```

### Namecheap Setup Instructions

1. **Login to Namecheap**
   - Go to https://namecheap.com
   - Login to your account
   - Navigate to "Domain List"

2. **Access DNS Settings**
   - Find "leadgen.to" in your domain list
   - Click "Manage" next to the domain
   - Go to "Advanced DNS" tab

3. **Clear Existing Records**
   - Delete any existing A records for "@" (root domain)
   - Delete any existing CNAME records for "www"

4. **Add New Records**
   
   **Add CNAME for www:**
   - Type: CNAME Record
   - Host: www
   - Value: cname.vercel-dns.com
   - TTL: 1 hour
   
   **Add A Records for root domain:**
   - Type: A Record
   - Host: @
   - Value: 76.76.19.19
   - TTL: 1 hour
   
   - Type: A Record
   - Host: @
   - Value: 76.76.21.21
   - TTL: 1 hour

   **Add Wildcard CNAME (for subdomains):**
   - Type: CNAME Record
   - Host: *
   - Value: cname.vercel-dns.com
   - TTL: 1 hour

5. **Save Changes**
   - Click "Save all changes"
   - DNS propagation can take 24-48 hours

### Verification Commands

After 30-60 minutes, test the DNS setup:

```bash
# Check A records
dig leadgen.to

# Check CNAME records
dig www.leadgen.to

# Check wildcard subdomain
dig test.leadgen.to
```

Expected results:
- `leadgen.to` should resolve to 76.76.19.19 or 76.76.21.21
- `www.leadgen.to` should show CNAME to cname.vercel-dns.com
- `*.leadgen.to` should also resolve via CNAME

### Current Application Support

The codebase already supports:
- ✅ `leadgen.to` - Main platform landing page
- ✅ `www.leadgen.to` - Same as root domain
- ✅ `leadgen.to/brezcode` - BrezCode brand path
- ✅ `leadgen.to/admin` - Admin interface
- ✅ `leadgen.to/login` - User authentication
- ✅ `brezcode.leadgen.to` - Subdomain routing (once DNS is configured)

## Step 2: Deploy to Vercel

### 1. Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from Replit
In your Replit terminal, run:
```bash
vercel --prod
```

When prompted:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N** 
- Project name: **leadgen-platform**
- Directory: **.**
- Override settings? **N**

### 4. Add Custom Domain in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on your **leadgen-platform** project
3. Go to **Settings** → **Domains**
4. Add domain: **leadgen.to**
5. Add domain: **www.leadgen.to**

Vercel will show you the DNS records to verify - they should match what you already set up in Namecheap.

### 5. Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:
- `DATABASE_URL` (your PostgreSQL connection string)
- `OPENAI_API_KEY` (if using AI features)
- `ANTHROPIC_API_KEY` (for Claude AI)
- `SENDGRID_API_KEY` (for email verification)
- `FROM_EMAIL` (your verified sender email)

## Step 3: Final Deployment

### Deploy Now
Click the **Deploy** button in Replit or run in terminal:
```bash
npx vercel --prod
```

### Post-Deployment Verification (30-60 minutes after DNS propagation)

**Test these URLs:**
- https://leadgen.to - Main platform landing page
- https://www.leadgen.to - Should redirect to main domain
- https://leadgen.to/login - User authentication
- https://leadgen.to/profile - Profile editor with modular system
- https://leadgen.to/business-landing-creator - Business landing wizard
- https://leadgen.to/brezcode - BrezCode health platform
- https://leadgen.to/admin - Admin interface
- https://brezcode.leadgen.to - Subdomain routing

**Verify Features:**
- ✅ Profile editor with international support (195+ countries)
- ✅ Business landing creator with 4 templates
- ✅ AI training system and roleplay scenarios
- ✅ Health assessment tools and reports
- ✅ Multi-brand routing and authentication

### Environment Variables to Set in Vercel

After deployment, add these in Vercel Dashboard → Settings → Environment Variables:
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - For AI features  
- `ANTHROPIC_API_KEY` - For Claude AI
- `SENDGRID_API_KEY` - Email verification
- `FROM_EMAIL` - Verified sender email

### Success Indicators
- SSL certificates automatically provisioned
- All routes responding correctly
- Domain routing working for brands and subdomains
- Application features fully functional on production domain

**Status: READY FOR DEPLOYMENT** 🚀