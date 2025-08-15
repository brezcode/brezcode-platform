# BrezCode Backend API

Express.js backend API for the BrezCode multi-platform application (BrezCode, SkinCoach, LeadGen).

## 🚀 Quick Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

## 🏗️ Architecture

- **Express.js** API server optimized for Railway deployment
- **PostgreSQL** database with Drizzle ORM
- **Multi-platform CORS** support for all three domains
- **TypeScript** for type safety
- **Production-ready** with health checks and monitoring

## 🌐 Supported Platforms

- **BrezCode** (`www.brezcode.com`) - Business platform
- **SkinCoach** (`www.skincoach.ai`) - Health coaching platform  
- **LeadGen** (`www.leadgen.to`) - Lead generation platform

## 📋 Environment Variables

Set these in Railway Dashboard → Variables:

```bash
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
SESSION_SECRET=your_random_session_secret
ANTHROPIC_API_KEY=your_anthropic_key  # Optional
OPENAI_API_KEY=your_openai_key        # Optional
```

## 🔗 API Endpoints

- `GET /health` - Health check
- `GET /api/test` - API test endpoint
- `POST /api/brezcode/*` - BrezCode platform routes
- `POST /api/skincoach/*` - SkinCoach platform routes
- `POST /api/leadgen/*` - LeadGen platform routes

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Railway (Recommended)

1. Connect your GitHub repository to Railway
2. Add PostgreSQL service
3. Set environment variables
4. Deploy automatically

### Manual Deployment

1. Clone the repository
2. Set environment variables
3. Run `npm install && npm run build && npm start`

## 📊 Database

Uses PostgreSQL with Drizzle ORM for:
- User management and authentication
- Multi-platform data separation
- Real-time conversation storage
- AI training and knowledge bases

## 🔐 Security

- CORS configured for specific domains only
- Rate limiting on API endpoints
- Secure session management
- Environment-based configuration

## 📱 Frontend Integration

Works seamlessly with:
- **Vercel frontend** at `www.brezcode.com`
- **Mobile applications** (future)
- **Third-party integrations**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For deployment issues or questions:
- Check Railway logs for errors
- Verify environment variables
- Test `/health` endpoint
- Review CORS configuration