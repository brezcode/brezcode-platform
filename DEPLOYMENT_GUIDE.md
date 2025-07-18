# BrezCode Deployment Guide - www.brezcode.com

## Quick Deployment Steps

### Step 1: GitHub Repository Setup
1. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Repository name: `brezcode-health-app`
   - Set to Public (required for Vercel free tier)
   - Initialize with README

2. **Upload Project to GitHub**:
   - Download all files from this Replit
   - Upload to your GitHub repository
   - Commit with message: "Initial BrezCode deployment"

### Step 2: Vercel Deployment (FREE)

#### Auto-Deploy Setup:

1. **Connect to Vercel** (FREE):
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure project settings:
     ```
     Framework Preset: Other
     Build Command: cd client && npm run build
     Output Directory: client/dist
     Install Command: npm install
     ```

2. **Deploy Settings**:
   - Root Directory: `./` (leave empty)
   - Node Version: 18.x
   - Build & Development Settings: Use default

### Step 3: Environment Variables Setup
**In Vercel Dashboard → Project Settings → Environment Variables:**

**Required for Production:**
```bash
# Database (Neon Free Tier)
DATABASE_URL=your_neon_database_connection_string

# AI & Email Services
OPENAI_API_KEY=your_openai_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=your_verified_sender_email

# Security
SESSION_SECRET=your_random_session_secret_64_chars

# SMS (Optional - fallback to console logging)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token  
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

**How to Get Each Secret:**
- **DATABASE_URL**: From Neon dashboard → Connection Details
- **OPENAI_API_KEY**: From OpenAI platform → API Keys  
- **SENDGRID_API_KEY**: From SendGrid → API Keys
- **SESSION_SECRET**: Generate random 64-character string

### Step 4: Custom Domain Setup (www.brezcode.com)

#### In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Add Domain: `www.brezcode.com`
3. Vercel will show DNS configuration

#### In Your Domain Provider (GoDaddy/Namecheap):
**Required DNS Records:**
```
Type: CNAME
Name: www  
Value: cname.vercel-dns.com
TTL: 3600 (1 hour)

Type: A (for apex domain - optional)
Name: @
Value: 76.76.19.19  
TTL: 3600
```

**Steps:**
1. Login to your domain registrar
2. Go to DNS Management/DNS Settings
3. Add the CNAME record above
4. Wait 24-48 hours for DNS propagation
5. Verify at https://whatsmydns.net

#### SSL Certificate:
- ✅ Automatic (Vercel provides free SSL)
- ✅ HTTPS redirect (enabled by default)
- ✅ Global CDN (100+ edge locations)

### 2. Domain DNS Configuration

#### Required DNS Records:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600

Type: A (optional, for apex domain)
Name: @
Value: 76.76.19.19
TTL: 3600
```

#### Domain Provider Setup:
1. Login to your domain registrar (GoDaddy, Namecheap, etc.)
2. Go to DNS Management
3. Add/update the CNAME record as shown above
4. Wait 24-48 hours for DNS propagation

### 3. Multi-Language URL Structure

#### Language Detection Priority:
1. URL parameter: `?lang=zh-CN`
2. User account preference (if logged in)
3. Browser Accept-Language header
4. Default: English

#### URL Examples:
- English: `https://www.brezcode.com/`
- Chinese: `https://www.brezcode.com/?lang=zh-CN`
- Vietnamese: `https://www.brezcode.com/?lang=vi`
- Spanish: `https://www.brezcode.com/?lang=es`

### 4. Performance Optimization

#### CDN Configuration:
- Vercel's global CDN serves static assets
- Edge locations in 100+ cities worldwide
- Automatic image optimization

#### Caching Strategy:
- Static assets: 1 year cache
- API responses: No cache (dynamic content)
- Translation files: 24 hour cache

### 5. Monitoring & Analytics

#### Recommended Setup:
1. **Vercel Analytics**: Built-in performance monitoring
2. **Google Analytics**: User behavior tracking
3. **Sentry**: Error tracking and monitoring
4. **Uptime Robot**: Uptime monitoring

#### Health Checks:
- Endpoint: `https://www.brezcode.com/api/health`
- Database connectivity check
- API response time monitoring

## Language Testing

### Current Language Support:
- ✅ English (en)
- ✅ Chinese Simplified (zh-CN)
- ✅ Chinese Traditional (zh-TW)
- ✅ Spanish (es)
- ✅ French (fr)
- ✅ German (de)
- ✅ Japanese (ja)
- ✅ Korean (ko)
- ✅ Vietnamese (vi) - **NEWLY ADDED**

### Test Different Languages:
1. **Manual Testing**: Add `?lang=vi` to URL
2. **Language Selector**: Use dropdown in top navigation
3. **Browser Language**: Change browser language setting
4. **API Testing**: `GET /api/translations/vi`

### Translation Coverage:
- Quiz questions and explanations
- Health report sections
- Coaching tips and recommendations
- UI buttons and navigation
- Error messages and notifications

## Production Checklist

### Pre-Deployment:
- [ ] Environment variables configured
- [ ] Database schema pushed (`npm run db:push`)
- [ ] SSL certificate provisioned
- [ ] Domain DNS configured
- [ ] Performance testing completed

### Post-Deployment:
- [ ] Health check endpoint responding
- [ ] All language versions accessible
- [ ] Payment processing functional
- [ ] Email notifications working
- [ ] Analytics tracking active

### Ongoing Maintenance:
- [ ] Database backups scheduled
- [ ] Error monitoring alerts configured
- [ ] Performance metrics tracking
- [ ] Security updates applied
- [ ] Content translations updated

## Cost Estimation

### Monthly Costs:
- **Vercel Pro**: $20/month
- **Neon Database**: $19/month
- **Custom Domain**: $12/year
- **SendGrid**: $15/month (email)
- **Total**: ~$54/month

### Scale Costs (10k+ users):
- **Vercel**: $20-100/month
- **Neon Scale**: $69/month
- **Additional Services**: $50/month
- **Total**: $139-219/month

## Support & Maintenance

### Regular Tasks:
1. **Weekly**: Review error logs and performance metrics
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Review user feedback and add new translations
4. **Annually**: Domain renewal and SSL certificate updates

### Emergency Contacts:
- **Vercel Support**: Available 24/7 for Pro accounts
- **Neon Support**: Database-specific issues
- **Domain Registrar**: DNS and domain issues

Your app is now ready for international deployment at www.brezcode.com with 9 language support!