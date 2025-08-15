# BrezCode Backend - Railway Deployment Guide

## 🚀 Quick Deploy to Railway

1. **Create Railway Account**: Go to [railway.app](https://railway.app) and sign up
2. **Connect GitHub**: Link your GitHub account to Railway
3. **Deploy from GitHub**: 
   - Upload this `railway-backend` folder to a new GitHub repository
   - In Railway dashboard, click "New Project" → "Deploy from GitHub"
   - Select your repository

## 📋 Required Environment Variables

Set these in Railway Dashboard → Project → Variables:

### Database
```
DATABASE_URL=postgresql://user:password@host:port/database
```

### AI Services
```
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
```

### Email (Optional)
```
SENDGRID_API_KEY=your_sendgrid_key
```

### Twilio (Optional)
```
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

### Stripe (Optional)
```
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### General
```
NODE_ENV=production
PORT=3001
SESSION_SECRET=your_random_session_secret
```

## 🗄️ Database Setup

Railway provides PostgreSQL addon:
1. Railway Dashboard → Add Service → PostgreSQL
2. Copy the DATABASE_URL from PostgreSQL service
3. Add it to your main service environment variables

## 🌐 Frontend Integration

Update your Vercel frontend environment variables:
```
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```

## 🔗 API Endpoints

Once deployed, your API will be available at:
- `https://your-app.railway.app/health` - Health check
- `https://your-app.railway.app/api/test` - API test
- `https://your-app.railway.app/api/brezcode/*` - BrezCode routes
- `https://your-app.railway.app/api/skincoach/*` - SkinCoach routes

## 📊 Monitoring

Railway provides built-in monitoring:
- **Logs**: Railway Dashboard → Deployments → View Logs
- **Metrics**: Railway Dashboard → Metrics
- **Health**: Check `/health` endpoint

## 🔧 Local Development

```bash
npm install
npm run dev
```

## 🚀 Production Deployment

Railway automatically:
1. Installs dependencies (`npm install`)
2. Builds the application (`npm run build`)
3. Starts the server (`npm start`)

## 📱 Multi-Platform Support

The API supports CORS for:
- www.brezcode.com (BrezCode platform)
- www.skincoach.ai (SkinCoach platform)  
- www.leadgen.to (LeadGen platform)
- localhost (development)