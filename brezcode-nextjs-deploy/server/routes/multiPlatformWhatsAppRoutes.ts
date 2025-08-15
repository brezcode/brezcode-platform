import express from 'express';
import MultiPlatformWhatsAppService from '../services/multiPlatformWhatsAppService';

const router = express.Router();
const multiWhatsApp = MultiPlatformWhatsAppService.getInstance();

// 📱 UNIFIED WHATSAPP API FOR ALL PLATFORMS

/**
 * 🚀 BREZCODE ENDPOINTS
 */
router.post('/brezcode/send', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    
    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'Phone number and message required' });
    }

    const result = await multiWhatsApp.sendMessage(phoneNumber, message, 'brezcode');
    
    res.json({
      success: true,
      platform: 'brezcode',
      messageId: result.messageId,
      message: 'BrezCode health message sent successfully'
    });
  } catch (error: any) {
    console.error('❌ BrezCode WhatsApp error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ✨ SKINCOACH ENDPOINTS  
 */
router.post('/skincoach/send', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    
    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'Phone number and message required' });
    }

    const result = await multiWhatsApp.sendMessage(phoneNumber, message, 'skincoach');
    
    res.json({
      success: true,
      platform: 'skincoach',
      messageId: result.messageId,
      message: 'SkinCoach analysis message sent successfully'
    });
  } catch (error: any) {
    console.error('❌ SkinCoach WhatsApp error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🎯 LEADGEN ENDPOINTS
 */
router.post('/leadgen/send', async (req, res) => {
  try {
    const { phoneNumber, message, businessId } = req.body;
    
    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'Phone number and message required' });
    }

    const result = await multiWhatsApp.sendMessage(phoneNumber, message, 'leadgen', businessId);
    
    res.json({
      success: true,
      platform: 'leadgen',
      businessId: businessId || 'default',
      messageId: result.messageId,
      message: 'LeadGen business message sent successfully'
    });
  } catch (error: any) {
    console.error('❌ LeadGen WhatsApp error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🔄 UNIFIED WEBHOOK HANDLER
 * Handles incoming messages for ALL platforms
 */
router.post('/webhook', async (req, res) => {
  try {
    console.log('📨 Unified WhatsApp webhook received:', JSON.stringify(req.body, null, 2));

    const body = req.body;

    // Verify webhook
    if (body.object) {
      if (body.entry && body.entry[0] && body.entry[0].changes && body.entry[0].changes[0]) {
        const change = body.entry[0].changes[0];
        
        if (change.value && change.value.messages && change.value.messages[0]) {
          const message = change.value.messages[0];
          const fromPhoneNumber = message.from;
          const toPhoneNumber = change.value.metadata.phone_number_id;
          const messageText = message.text?.body || '';

          console.log(`📱 Processing message from ${fromPhoneNumber} to ${toPhoneNumber}: ${messageText}`);

          // Determine business context from URL or headers
          const businessId = req.query.businessId as string || req.headers['x-business-id'] as string;

          // Handle message through multi-platform service
          const response = await multiWhatsApp.handleIncomingMessage(
            fromPhoneNumber,
            toPhoneNumber,
            messageText,
            businessId
          );

          // Send AI response back
          if (response) {
            const platform = multiWhatsApp.detectPlatform(toPhoneNumber, businessId);
            await multiWhatsApp.sendMessage(fromPhoneNumber, response, platform.platform, businessId);
          }
        }
      }

      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * ✅ WEBHOOK VERIFICATION
 */
router.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFICATION_TOKEN || 'test_verify_token_12345';
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Multi-platform WhatsApp webhook verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

/**
 * 📊 PLATFORM STATISTICS
 */
router.get('/stats/:platform', async (req, res) => {
  try {
    const platform = req.params.platform as 'brezcode' | 'skincoach' | 'leadgen';
    const businessId = req.query.businessId as string;
    
    const stats = await multiWhatsApp.getPlatformStats(platform, businessId);
    
    res.json({
      success: true,
      platform,
      businessId: businessId || 'default',
      stats
    });
  } catch (error: any) {
    console.error('❌ Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🔧 LEADGEN SAAS CLIENT CONFIGURATION
 */
router.post('/leadgen/configure-client', async (req, res) => {
  try {
    const { businessId, businessName, welcomeMessage, branding } = req.body;
    
    if (!businessId || !businessName) {
      return res.status(400).json({ error: 'businessId and businessName are required' });
    }

    const clientConfig = multiWhatsApp.configureSaaSClient(
      businessId,
      businessName,
      welcomeMessage,
      branding
    );

    res.json({
      success: true,
      message: `SaaS client ${businessId} configured successfully`,
      config: clientConfig
    });
  } catch (error: any) {
    console.error('❌ Client configuration error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 💬 TEST ENDPOINTS FOR EACH PLATFORM
 */
router.post('/test/:platform', async (req, res) => {
  try {
    const platform = req.params.platform as 'brezcode' | 'skincoach' | 'leadgen';
    const { phoneNumber, businessId } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number required for testing' });
    }

    // Send platform-specific test message
    const testMessages = {
      brezcode: '👋 Hello from BrezCode! Dr. Sakura here - ready to help with your health journey!',
      skincoach: '✨ Hello from SkinCoach! Ready for your AI-powered skin analysis?',
      leadgen: '🚀 Hello from LeadGen Pro! Let\'s grow your business together!'
    };

    const result = await multiWhatsApp.sendMessage(
      phoneNumber, 
      testMessages[platform], 
      platform, 
      businessId
    );

    res.json({
      success: true,
      platform,
      businessId: businessId || 'default',
      message: `${platform} test message sent successfully`,
      messageId: result.messageId
    });
  } catch (error: any) {
    console.error(`❌ ${req.params.platform} test error:`, error);
    res.status(500).json({ error: error.message });
  }
});

export default router;