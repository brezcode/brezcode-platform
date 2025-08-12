# WhatsApp API Quick Reference

## Environment Variables (Required)
- WA_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
- WA_BUSINESS_ACCOUNT_ID=your_whatsapp_business_account_id
- CLOUD_API_ACCESS_TOKEN=your_whatsapp_access_token
- WEBHOOK_VERIFICATION_TOKEN=your_webhook_verification_token_12345
- BREZCODE_WHATSAPP_NUMBER=+852 94740952

## Webhook URL
http://localhost:3000/api/whatsapp/webhook

## Test Commands
### Health Check
curl -X GET "http://localhost:3000/api/whatsapp/health"

### Send Message
curl -X POST "http://localhost:3000/api/whatsapp/send-message" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "1234567890", "message": "Hello!", "type": "text"}'

### Send Welcome Message
curl -X POST "http://localhost:3000/api/whatsapp/send-welcome" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "1234567890"}'

## AI Assistants
- Type "COACH" for Dr. Sakura health coaching
- Type "SALES" for pricing and plans
- Type "HELP" for customer support

## Database Setup
Run: psql your_database_url -f create-whatsapp-tables.sql
