# BreastQuiz Subdomain Setup Guide

## Getting breastquiz.replit.dev or Custom Domain

### Current Options for Your WomenHealth Project

**Option 1: Automatic .replit.dev Subdomain**
When you transfer BreastQuiz to your "WomenHealth" project, it will automatically get:
- `womenhealth-yourusername.replit.dev`
- This happens automatically when you create the new Replit

**Option 2: Deploy with Custom Replit Domain**
After transfer to WomenHealth project:
1. Click "Deploy" in your WomenHealth project
2. Choose "Autoscale Deployment"
3. Replit will assign a deployment URL like:
   - `breastquiz-abc123.replit.app`
   - Or request specific name: `breastquiz.replit.app`

**Option 3: Custom Domain Setup**
For professional hosting at `brezcode.com`:
1. Deploy your WomenHealth project
2. In deployment settings, add custom domain
3. Configure DNS records provided by Replit
4. Replit handles SSL certificates automatically

### Recommended Setup Process

1. **Transfer to WomenHealth Project First**
   - Copy all breastquiz files to new WomenHealth Replit
   - Get automatic `.replit.dev` subdomain

2. **Test Everything Works**
   - Verify quiz functionality
   - Test database connections
   - Confirm all features operational

3. **Deploy for Production**
   - Use Replit's deployment system
   - Get production `.replit.app` domain
   - Optional: Connect custom domain

### Configuration for WomenHealth Project

```toml
[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]
publicDir = "client/dist"

[domains]
primary = "breastquiz"  # Requests breastquiz.replit.app
```

### Expected URLs After Setup

**Development:**
- `womenhealth-yourusername.replit.dev`

**Production Deployment:**
- `breastquiz.replit.app` (if available)
- Or custom: `brezcode.com`

### Benefits of Separate Domain

✅ **Professional Branding**: breastquiz.replit.dev looks professional
✅ **Complete Independence**: Separate from LeadGen.to platform  
✅ **Custom Domain Ready**: Easy upgrade to brezcode.com
✅ **SSL Included**: Automatic HTTPS security
✅ **Global CDN**: Fast loading worldwide

The subdomain setup will give your BreastQuiz platform a professional, independent web presence!