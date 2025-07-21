# Reusable Email Verification Module

This project includes a complete, reusable email verification system that can be easily integrated into any application.

## Backend Module (`server/emailVerificationModule.ts`)

### Features
- ✅ Generate and manage 6-digit verification codes
- ✅ Session-based pending user storage
- ✅ Configurable code expiry (default: 15 minutes)
- ✅ Resend functionality with cooldown protection
- ✅ Express.js middleware integration
- ✅ SendGrid email integration with HTML templates
- ✅ Console logging fallback for development

### Quick Integration

```typescript
import { EmailVerificationModule, createEmailVerificationRoutes } from './emailVerificationModule';

// Create instance with custom config
const emailVerification = new EmailVerificationModule({
  codeLength: 6,
  codeExpiryMinutes: 15,
  allowResend: true,
  resendCooldownSeconds: 60
});

// Add routes to Express app
const emailRoutes = createEmailVerificationRoutes(emailVerification);
app.post("/api/auth/signup", emailRoutes.signup);
app.post("/api/auth/verify-email", emailRoutes.verifyEmail);
app.post("/api/auth/resend-verification", emailRoutes.resendVerification);
```

### Custom Email Sending

Override the `sendVerificationCode` method for production email service:

```typescript
class CustomEmailVerification extends EmailVerificationModule {
  async sendVerificationCode(email: string, code: string): Promise<void> {
    await yourEmailService.send({
      to: email,
      subject: "Verify your email address",
      template: "verification-code",
      data: { code }
    });
  }
}
```

## Frontend Module (`client/src/components/EmailVerificationModule.tsx`)

### Features
- ✅ Complete React component with form validation
- ✅ Customizable UI and configuration
- ✅ Built-in API integration
- ✅ Toast notifications for user feedback
- ✅ Development mode indicators
- ✅ Reusable hook for custom implementations

### Quick Integration

```typescript
import { EmailVerificationStep } from './components/EmailVerificationModule';

function RegistrationFlow() {
  const [showVerification, setShowVerification] = useState(false);
  const [email, setEmail] = useState('');

  return showVerification ? (
    <EmailVerificationStep
      email={email}
      onVerificationComplete={(user) => {
        console.log('User verified:', user);
        // Redirect to dashboard
      }}
      onBack={() => setShowVerification(false)}
      config={{
        title: "Custom Title",
        description: "Custom description",
        codeLength: 6,
        developmentMode: true
      }}
    />
  ) : (
    // Your registration form
  );
}
```

### Using the Hook

```typescript
import { useEmailVerification } from './components/EmailVerificationModule';

function CustomVerificationForm() {
  const { verifyEmail, resendVerification, isVerifying, isResending } = useEmailVerification();
  
  const handleVerify = async () => {
    try {
      const result = await verifyEmail(email, code);
      console.log('Verification successful:', result);
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };
}
```

## API Endpoints

### POST /api/auth/signup
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "password": "password123",
  "subscriptionTier": "basic"
}
```

Response:
```json
{
  "message": "Account created successfully. Please verify your email.",
  "requiresVerification": true,
  "email": "john@example.com"
}
```

### POST /api/auth/verify-email
```json
{
  "email": "john@example.com",
  "code": "123456"
}
```

Response:
```json
{
  "user": {
    "id": 1234567890,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true
  },
  "message": "Email verified successfully"
}
```

### POST /api/auth/resend-verification
```json
{
  "email": "john@example.com"
}
```

Response:
```json
{
  "message": "Verification code resent successfully"
}
```

## Configuration Options

### Backend Configuration
```typescript
interface EmailVerificationConfig {
  codeLength: number;           // Default: 6
  codeExpiryMinutes: number;    // Default: 15
  allowResend: boolean;         // Default: true
  resendCooldownSeconds: number; // Default: 60
}
```

### Frontend Configuration
```typescript
interface EmailVerificationConfig {
  codeLength?: number;          // Default: 6
  title?: string;               // Default: "Verify Your Email"
  description?: string;         // Default: "We've sent a verification code to"
  developmentMode?: boolean;    // Default: process.env.NODE_ENV === "development"
  apiEndpoints?: {
    verify: string;             // Default: "/api/auth/verify-email"
    resend: string;             // Default: "/api/auth/resend-verification"
  };
}
```

## Integration Examples

### Next.js Integration
```typescript
// pages/api/auth/signup.ts
import { defaultEmailVerification, createEmailVerificationRoutes } from '../../lib/emailVerificationModule';

const emailRoutes = createEmailVerificationRoutes(defaultEmailVerification);

export default function handler(req, res) {
  if (req.method === 'POST') {
    return emailRoutes.signup(req, res);
  }
  res.status(405).json({ message: 'Method not allowed' });
}
```

### Remix Integration
```typescript
// app/routes/auth/signup.tsx
import { defaultEmailVerification, createEmailVerificationRoutes } from '~/lib/emailVerificationModule';

export const action = async ({ request }: ActionArgs) => {
  const emailRoutes = createEmailVerificationRoutes(defaultEmailVerification);
  return emailRoutes.signup(request, new Response());
};
```

## Security Features

- ✅ Session-based verification (prevents cross-user attacks)
- ✅ Code expiry protection (prevents indefinite code reuse)
- ✅ Input validation and sanitization
- ✅ Proper error handling without information leakage
- ✅ Rate limiting friendly (resend cooldown)

## Production Deployment

1. **Environment Variables**: Set up SendGrid email service credentials
   ```bash
   # SendGrid for Email
   SENDGRID_API_KEY=your_sendgrid_api_key
   FROM_EMAIL=noreply@yourdomain.com
   ```

2. **Email Service Setup**: Configure SendGrid for professional email delivery
3. **Database**: Consider storing verification attempts for audit trails
4. **Rate Limiting**: Add request rate limiting to verification endpoints
5. **Monitoring**: Add logging and monitoring for verification success rates
6. **Phone Validation**: Add phone number format validation for different countries

## Testing

The module includes comprehensive development mode features:
- Verification codes logged to console
- Clear error messages for debugging
- Development mode indicators in UI

## License

This module is part of the LeadGen.to platform and can be reused in any project.