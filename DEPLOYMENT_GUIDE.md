# BrezCode Deployment Guide - www.brezcode.com

## Custom Domain Setup

### 1. Vercel Deployment (Recommended)

#### Step 1: Deploy to Vercel
1. Connect GitHub repository to Vercel
2. Import project with these settings:
   - Framework: Other
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

#### Step 2: Environment Variables
Add these to Vercel dashboard:
```
DATABASE_URL=your_neon_database_url
OPENAI_API_KEY=your_openai_key
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=your_verified_email
SESSION_SECRET=your_session_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

#### Step 3: Custom Domain Configuration
1. In Vercel dashboard, go to Project Settings → Domains
2. Add custom domain: `www.brezcode.com`
3. Configure DNS records with your domain provider:
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

#### Step 4: SSL Certificate
- Vercel automatically provisions SSL certificates
- Force HTTPS redirects are enabled by default

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