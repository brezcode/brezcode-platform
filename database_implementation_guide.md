# COMPLETE DATABASE SEPARATION IMPLEMENTATION GUIDE
**BrezCode Health Platform vs LeadGen.to Business Platform**

## Overview
This guide implements complete database separation between two distinct platforms:
- **BrezCode**: Personal health coaching frontend app for breast health users
- **LeadGen.to**: Business analytics backend app for business users

## Database Architecture

### BrezCode Health Platform Database
```
Database Name: brezcode_health_db
Connection: BREZCODE_DATABASE_URL
Purpose: Personal health data for breast health users
```

**Core Tables:**
- `brezcode_users` - Personal health users
- `brezcode_health_assessments` - Risk assessments and quiz data
- `brezcode_health_reports` - Personalized health reports
- `brezcode_daily_activities` - Health tracking activities
- `brezcode_health_metrics` - Vital signs and health metrics
- `brezcode_ai_coaching_sessions` - Dr. Sakura coaching sessions
- `brezcode_health_reminders` - Health notifications
- `brezcode_subscriptions` - Health platform subscriptions
- `brezcode_user_sessions` - Authentication sessions

### LeadGen Business Platform Database
```
Database Name: leadgen_business_db
Connection: LEADGEN_DATABASE_URL
Purpose: Business automation data for business users
```

**Core Tables:**
- `leadgen_business_users` - Business platform users
- `leadgen_brands` - Client brands and businesses
- `leadgen_brand_configs` - Landing page configurations
- `leadgen_leads` - Lead capture and management
- `leadgen_automation_sequences` - Marketing automation
- `leadgen_ai_chat_sessions` - Business AI assistant
- `leadgen_analytics_events` - Business analytics
- `leadgen_performance_metrics` - Performance tracking
- `leadgen_subscriptions` - Business platform subscriptions
- `leadgen_user_sessions` - Authentication sessions

## Implementation Steps

### 1. Environment Configuration
```bash
# Add to .env file
BREZCODE_DATABASE_URL=postgresql://username:password@host/brezcode_health_db
LEADGEN_DATABASE_URL=postgresql://username:password@host/leadgen_business_db
```

### 2. Database Connection Setup
Create separate database connection utilities:

**server/database/brezcode-db.ts**
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless'
import * as brezcodeSchema from '@shared/brezcode-schema'

const brezcodeDb = drizzle(
  process.env.BREZCODE_DATABASE_URL!, 
  { schema: brezcodeSchema }
)

export default brezcodeDb
```

**server/database/leadgen-db.ts**
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless'
import * as leadgenSchema from '@shared/leadgen-schema'

const leadgenDb = drizzle(
  process.env.LEADGEN_DATABASE_URL!, 
  { schema: leadgenSchema }
)

export default leadgenDb
```

### 3. Storage Interface Updates
Update `server/storage.ts` to use platform-specific connections:

```typescript
// BrezCode Storage Interface
export interface BrezcodeStorage {
  // User management
  createUser(user: InsertBrezcodeUser): Promise<BrezcodeUser>
  getUserByEmail(email: string): Promise<BrezcodeUser | null>
  
  // Health assessments
  createHealthAssessment(assessment: InsertBrezcodeHealthAssessment): Promise<BrezcodeHealthAssessment>
  getHealthReports(userId: number): Promise<BrezcodeHealthReport[]>
  
  // Health tracking
  createDailyActivity(activity: InsertBrezcodeDailyActivity): Promise<BrezcodeDailyActivity>
  getHealthMetrics(userId: number): Promise<BrezcodeHealthMetric[]>
}

// LeadGen Storage Interface
export interface LeadgenStorage {
  // Business user management
  createBusinessUser(user: InsertLeadgenBusinessUser): Promise<LeadgenBusinessUser>
  getBusinessUserByEmail(email: string): Promise<LeadgenBusinessUser | null>
  
  // Brand management
  createBrand(brand: InsertLeadgenBrand): Promise<LeadgenBrand>
  getBrandsByOwner(ownerId: number): Promise<LeadgenBrand[]>
  
  // Lead management
  createLead(lead: InsertLeadgenLead): Promise<LeadgenLead>
  getLeadsByBrand(brandId: string): Promise<LeadgenLead[]>
}
```

### 4. Route Separation
Create platform-specific route files:

**server/routes/brezcode-routes.ts**
```typescript
import { Router } from 'express'
import brezcodeDb from '../database/brezcode-db'

const brezcodeRouter = Router()

// BrezCode authentication routes
brezcodeRouter.post('/brezcode-register', async (req, res) => {
  // BrezCode user registration
})

brezcodeRouter.post('/brezcode-login', async (req, res) => {
  // BrezCode user login
})

// Health assessment routes
brezcodeRouter.post('/health-assessment', async (req, res) => {
  // Create health assessment
})

brezcodeRouter.get('/health-reports/:userId', async (req, res) => {
  // Get health reports
})

export default brezcodeRouter
```

**server/routes/leadgen-routes.ts**
```typescript
import { Router } from 'express'
import leadgenDb from '../database/leadgen-db'

const leadgenRouter = Router()

// LeadGen authentication routes
leadgenRouter.post('/leadgen-register', async (req, res) => {
  // Business user registration
})

leadgenRouter.post('/leadgen-login', async (req, res) => {
  // Business user login
})

// Brand management routes
leadgenRouter.post('/brands', async (req, res) => {
  // Create brand
})

leadgenRouter.get('/brands/:ownerId', async (req, res) => {
  // Get brands by owner
})

export default leadgenRouter
```

### 5. Frontend Platform Detection
Update routing to detect platform and use appropriate API endpoints:

**client/src/lib/api-client.ts**
```typescript
const getApiBaseUrl = () => {
  const hostname = window.location.hostname
  
  // BrezCode platform detection
  if (hostname.includes('brezcode') || window.location.pathname.includes('/brezcode')) {
    return '/api/brezcode'
  }
  
  // LeadGen platform (default)
  return '/api/leadgen'
}

export const apiClient = {
  get: (endpoint: string) => fetch(`${getApiBaseUrl()}${endpoint}`),
  post: (endpoint: string, data: any) => fetch(`${getApiBaseUrl()}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}
```

### 6. Migration for Current User (leedennyps@gmail.com)
Since the user currently exists in the legacy `users` table but needs to access BrezCode:

```sql
-- Create BrezCode user record
INSERT INTO brezcode_health_db.brezcode_users (
  id, first_name, last_name, email, password_hash, is_email_verified, created_at
) VALUES (
  14, 'den', 'lee', 'leedennyps@gmail.com',
  '$2b$10$czLP1La4f.513xPb20LJweVMZ/HvfBqWxBCT8es5zBKQDUCNzf7JC',
  true, '2025-08-02 08:08:21.197229'
);

-- Create initial health assessment
INSERT INTO brezcode_health_db.brezcode_health_assessments (
  user_id, assessment_type, quiz_answers, risk_category, user_profile
) VALUES (
  14, 'breast_health', '{"initial": true, "needs_assessment": true}',
  'unknown', 'new_user'
);

-- Create default subscription
INSERT INTO brezcode_health_db.brezcode_subscriptions (
  user_id, plan_type, is_active, premium_features_enabled
) VALUES (
  14, 'free', true, ARRAY['basic_assessments', 'health_tracking']
);
```

### 7. Authentication Middleware Updates
Create platform-specific authentication middleware:

**server/middleware/brezcode-auth.ts**
```typescript
import brezcodeDb from '../database/brezcode-db'
import { brezcodeUsers } from '@shared/brezcode-schema'
import { eq } from 'drizzle-orm'

export const brezcodeAuthMiddleware = async (req: any, res: any, next: any) => {
  const sessionId = req.session?.userId
  
  if (sessionId) {
    const user = await brezcodeDb
      .select()
      .from(brezcodeUsers)
      .where(eq(brezcodeUsers.id, sessionId))
      .limit(1)
    
    if (user.length > 0) {
      req.user = user[0]
      req.platform = 'brezcode'
    }
  }
  
  next()
}
```

**server/middleware/leadgen-auth.ts**
```typescript
import leadgenDb from '../database/leadgen-db'
import { leadgenBusinessUsers } from '@shared/leadgen-schema'
import { eq } from 'drizzle-orm'

export const leadgenAuthMiddleware = async (req: any, res: any, next: any) => {
  const sessionId = req.session?.userId
  
  if (sessionId) {
    const user = await leadgenDb
      .select()
      .from(leadgenBusinessUsers)
      .where(eq(leadgenBusinessUsers.id, sessionId))
      .limit(1)
    
    if (user.length > 0) {
      req.user = user[0]
      req.platform = 'leadgen'
    }
  }
  
  next()
}
```

## Benefits of Complete Separation

### 1. **Privacy Compliance**
- Personal health data completely isolated from business data
- HIPAA compliance easier to maintain
- No accidental data leakage between platforms

### 2. **Scalability**
- Each platform can scale independently
- Database performance optimized for specific use cases
- Separate backup and disaster recovery strategies

### 3. **Security**
- Platform-specific security policies
- Reduced attack surface area
- Independent authentication systems

### 4. **Development Efficiency**
- Teams can work on platforms independently
- Clear separation of concerns
- Easier testing and deployment

### 5. **Regulatory Compliance**
- Health data governance separate from business data
- Easier audit trails
- Platform-specific compliance requirements

## Next Steps

1. **Create separate databases** in your PostgreSQL instance
2. **Run schema creation scripts** for both platforms
3. **Update environment variables** with separate connection strings
4. **Implement database connection utilities**
5. **Update storage interfaces** for platform separation
6. **Create platform-specific routes**
7. **Test user migration** for existing users
8. **Update frontend** to use platform-specific APIs
9. **Implement authentication middleware**
10. **Deploy and validate** complete separation

This architecture ensures complete platform isolation while maintaining the ability to expand each platform independently.