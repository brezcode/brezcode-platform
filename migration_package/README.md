# WomenHealth - Breast Health Assessment Platform

## Overview

WomenHealth is a comprehensive, evidence-based breast health assessment platform that provides personalized risk analysis and health recommendations. Built with modern web technologies, this platform offers users a professional-grade health evaluation experience.

## Key Features

### 🏥 Comprehensive Health Assessment
- 26-question evidence-based breast cancer risk assessment
- BMI calculation and lifestyle factor analysis
- Personalized user profiling (teenager, premenopausal, postmenopausal, etc.)
- Professional medical accuracy with rule-based fallback systems

### 📊 Detailed Health Reports
- Comprehensive section analysis (Demographics, Family History, Lifestyle, Reproductive)
- 1000+ word medical analysis with research context
- Personalized coaching focus areas
- Daily wellness plans with specific recommendations
- Follow-up timeline with actionable steps

### 🎯 Professional Hero Section
- Featured "1 in 8 women in US will develop breast cancer" statistic
- Evidence-based health activities showcase
- Professional medical design and responsive layout
- Clear call-to-action for assessment completion

### 👤 User Management System
- Email-based registration with validation
- Secure session management and authentication
- Profile creation and persistent data storage
- HIPAA-compliant data handling considerations

## Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive styling
- **Shadcn/ui** component library for professional UI
- **Vite** for fast development and optimized builds
- **Wouter** for lightweight client-side routing

### Backend
- **Node.js** with Express.js server framework
- **TypeScript** for full-stack type safety
- **PostgreSQL** database with Drizzle ORM
- **Session-based authentication** with bcrypt
- **RESTful API** design with comprehensive endpoints

### Database
- **PostgreSQL** with optimized schemas
- **Drizzle ORM** for type-safe database operations
- **User management** and assessment storage
- **Report generation** and retrieval systems

## Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database access
- Modern web browser

### Installation

1. **Clone or download the project files**
```bash
# If using git
git clone <repository-url>
cd womenhealth

# Or extract the migration package files
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Set up the database**
```bash
npm run db:push
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:5173` to see the application.

## API Endpoints

### Health Assessment
- `POST /api/reports/generate` - Generate personalized health report
- `GET /api/reports/:id` - Retrieve existing health report

### User Management
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Environment Variables

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/womenhealth

# Session Security
SESSION_SECRET=your_secure_session_secret_here

# AI Integration (Optional)
ANTHROPIC_API_KEY=your_claude_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Email Services (Optional)
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@yourdomain.com

# Environment
NODE_ENV=development
```

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run db:push      # Update database schema
npm run db:studio    # Open database admin interface
```

## Project Structure

```
womenhealth/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
│   └── index.html         # Main HTML template
├── server/                # Backend Express application
│   ├── routes/            # API route handlers
│   ├── services/          # Business logic
│   └── middleware/        # Express middleware
├── shared/                # Shared types and schemas
├── docs/                  # Documentation
└── migration_package/     # Migration files
```

## Features Deep Dive

### Health Assessment Algorithm
- Evidence-based risk factor calculation
- Age-stratified risk assessment
- Family history genetic risk analysis
- Lifestyle factor impact evaluation
- BMI and reproductive history consideration

### Report Generation
- Comprehensive section-by-section analysis
- Personalized recommendations engine
- Daily wellness plan creation
- Follow-up timeline generation
- Risk category determination

### User Experience
- Mobile-responsive design
- Professional medical styling
- Intuitive assessment flow
- Clear result presentation
- Actionable recommendations

## Security & Privacy

### Data Protection
- Secure session management
- Encrypted password storage
- HTTPS enforcement in production
- Input validation and sanitization
- SQL injection prevention

### Privacy Considerations
- Minimal data collection
- User consent mechanisms
- Data retention policies
- Secure data transmission
- Privacy-by-design architecture

## Deployment

### Development Deployment (Replit)
1. Create new Node.js Repl
2. Upload migration package files
3. Configure environment variables
4. Install dependencies: `npm install`
5. Start server: `npm run dev`

### Production Deployment
1. Build application: `npm run build`
2. Configure production environment variables
3. Set up PostgreSQL database
4. Deploy to hosting platform (Vercel, Railway, etc.)
5. Configure custom domain if desired

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for new features
- Maintain documentation updates
- Follow semantic versioning

### Code Style
- Use TypeScript for all new code
- Follow React functional component patterns
- Implement proper error handling
- Write self-documenting code
- Use meaningful variable names

## License

This project is proprietary software. All rights reserved.

## Support

For technical support or questions:
- Review the documentation in `/docs`
- Check the migration guide in `STEP_BY_STEP_MIGRATION.md`
- Contact the development team

## Version History

- **v1.0.0** - Initial release with comprehensive health assessment
- **v1.1.0** - Enhanced reporting with detailed analysis
- **v1.2.0** - Migration package for independent deployment

---

**Status:** Production-ready independent platform  
**Target Deployment:** brezcode.com or womenhealth.replit.dev  
**Architecture:** Full-stack TypeScript with PostgreSQL database