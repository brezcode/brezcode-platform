# Twilio Integration Setup

BrezCode now uses Twilio services for both email and SMS verification:

## Required Environment Variables

### 1. Twilio SMS (Required for phone verification)
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token  
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### 2. SendGrid Email (Required for email verification)
```
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@your-domain.com
```

## How to Get These Keys

### Twilio SMS Setup
1. Sign up at [twilio.com](https://twilio.com)
2. Go to Console Dashboard
3. Copy your Account SID and Auth Token
4. Purchase a phone number for SMS sending
5. Add these to your environment variables

### SendGrid Email Setup  
1. Sign up at [sendgrid.com](https://sendgrid.com) (owned by Twilio)
2. Go to Settings > API Keys
3. Create a new API key with "Mail Send" permissions
4. Verify a sender email address in SendGrid
5. Add the API key and FROM_EMAIL to environment variables

## Development vs Production

- **Development**: If keys are not provided, codes will be logged to console
- **Production**: Real emails and SMS will be sent using Twilio services

## Testing

After adding the environment variables:
1. Restart the application
2. Complete the quiz and signup flow
3. Check that real emails/SMS are being sent instead of console logs

## Cost Information

- **SendGrid**: Free tier includes 100 emails/day
- **Twilio SMS**: Pay-per-message (~$0.0075 per SMS in US)
- Both services are cost-effective for verification codes