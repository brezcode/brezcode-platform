import express from 'express';
import { WhatsAppService } from '../whatsappService';

const router = express.Router();
const whatsappService = WhatsAppService.getInstance();

// Endpoint to set up Brezcode business profile
router.post('/setup-brezcode-profile', async (req, res) => {
  try {
    console.log('📱 Setting up Brezcode WhatsApp Business profile...');

    const brezcodeProfile = {
      about: "🌸 Brezcode - AI-powered breast health coaching and wellness platform. Get personalized health guidance, self-exam reminders, and expert support 24/7.",
      description: "Your trusted AI health coach Dr. Sakura provides personalized breast health guidance, preventive care recommendations, and wellness support through advanced AI technology.",
      email: "support@brezcode.com",
      websites: ["https://brezcode.com"]
    };

    const success = await whatsappService.setBusinessProfile(brezcodeProfile);

    if (success) {
      res.json({
        success: true,
        message: 'Brezcode WhatsApp Business profile configured successfully',
        businessNumber: '+852 94740952',
        profile: brezcodeProfile
      });
    } else {
      res.json({
        success: false,
        message: 'Failed to configure business profile. This is expected in test mode.',
        businessNumber: '+85294740952'
      });
    }

  } catch (error: any) {
    console.error('❌ Error setting up Brezcode profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to setup business profile',
      details: error.message
    });
  }
});

// Get Brezcode WhatsApp business information
router.get('/brezcode-info', (req, res) => {
  try {
    const businessInfo = {
      businessNumber: '+852 94740952',
      country: 'Hong Kong',
      countryCode: '+855',
      displayName: 'Brezcode Health Coach',
      description: 'AI-powered breast health coaching platform',
      features: [
        '🏥 24/7 AI Health Coaching with Dr. Sakura',
        '💼 Sales and Pricing Support',
        '🆘 Customer Support and Technical Help',
        '📅 Automated Health Reminders',
        '🎯 Personalized Wellness Guidance'
      ],
      services: {
        coaching: {
          name: 'Dr. Sakura Health Coach',
          description: 'Personalized breast health guidance and wellness support',
          keywords: ['coach', 'health', 'wellness', 'breast', 'self-exam', 'medical']
        },
        sales: {
          name: 'Sales Assistant',
          description: 'Product information, pricing, and trial management',
          keywords: ['price', 'cost', 'plan', 'subscription', 'trial', 'features']
        },
        support: {
          name: 'Customer Support',
          description: 'Technical help, account assistance, and troubleshooting',
          keywords: ['help', 'support', 'problem', 'account', 'login', 'issue']
        }
      },
      quickCommands: {
        'COACH': 'Start health coaching with Dr. Sakura',
        'SALES': 'View pricing plans and features',
        'HELP': 'Get customer support',
        'MENU': 'Show all available options',
        'TRIAL': 'Start 7-day free trial',
        'ASSESSMENT': 'Take health assessment'
      },
      businessHours: '24/7 AI Support Available',
      responseTime: 'Instant AI responses',
      languages: ['English'],
      integrations: [
        'Brezcode Health Platform',
        'Dr. Sakura AI Avatar',
        'Health Reminder System',
        'Automated Scheduling'
      ]
    };

    res.json({
      success: true,
      businessInfo
    });

  } catch (error: any) {
    console.error('❌ Error getting business info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get business information'
    });
  }
});

// Test message to Brezcode WhatsApp
router.post('/test-message', async (req, res) => {
  try {
    const { phoneNumber, message = 'Hello from Brezcode test!' } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'phoneNumber is required for test message'
      });
    }

    console.log(`📱 Sending test message from Brezcode (+852 94740952) to ${phoneNumber}`);

    const testMessage = `🌸 **Test Message from Brezcode**

Business Number: +852 94740952
Message: ${message}

Your Brezcode WhatsApp integration is working!

Reply with:
• "COACH" for Dr. Sakura
• "SALES" for pricing
• "HELP" for support`;

    const success = await whatsappService.sendTextMessage(phoneNumber, testMessage);

    res.json({
      success,
      message: success ? 'Test message sent successfully' : 'Test message failed (expected without credentials)',
      from: '+852 94740952',
      to: phoneNumber
    });

  } catch (error: any) {
    console.error('❌ Error sending test message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test message',
      details: error.message
    });
  }
});

// Generate WhatsApp link for easy contact
router.get('/contact-link/:phoneNumber?', (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { message } = req.query;

    const brezcodeNumber = '85294740952'; // Without + for WhatsApp links (correct number)
    
    // Default welcome message
    const defaultMessage = "Hello Brezcode! I'd like to learn about your AI health coaching services.";
    const encodedMessage = encodeURIComponent((message as string) || defaultMessage);

    // Generate WhatsApp links
    const links = {
      web: `https://wa.me/${brezcodeNumber}?text=${encodedMessage}`,
      mobile: `whatsapp://send?phone=${brezcodeNumber}&text=${encodedMessage}`,
      businessNumber: '+852 94740952',
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://wa.me/${brezcodeNumber}?text=${encodedMessage}`,
      instructions: {
        web: 'Click the web link to open WhatsApp in browser',
        mobile: 'Click the mobile link to open WhatsApp app',
        manual: 'Save +85294740952 and message directly',
        qr: 'Scan QR code to start conversation'
      }
    };

    res.json({
      success: true,
      links,
      businessNumber: '+852 94740952',
      message: 'WhatsApp contact links generated successfully'
    });

  } catch (error: any) {
    console.error('❌ Error generating contact link:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate contact links'
    });
  }
});

// Health check for Brezcode WhatsApp setup
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Brezcode WhatsApp Business Setup',
    businessNumber: '+85294740952',
    country: 'Hong Kong (+852)',
    status: 'Active',
    features: [
      'AI Health Coaching',
      'Sales Automation', 
      'Customer Support',
      'Automated Scheduling'
    ],
    timestamp: new Date().toISOString()
  });
});

export default router;