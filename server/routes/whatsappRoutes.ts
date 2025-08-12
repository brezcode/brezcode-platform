import express from 'express';
import { WhatsAppService } from '../whatsappService';
import WhatsAppAiAssistant from '../whatsappAiAssistant';
import { db } from '../db';
import { whatsappWebhookLogs } from '../../shared/whatsapp-schema';

const router = express.Router();
const whatsappService = WhatsAppService.getInstance();
const aiAssistant = new WhatsAppAiAssistant();

// Webhook verification endpoint (GET)
router.get('/webhook', (req, res) => {
  try {
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'] as string;

    console.log('📞 WhatsApp webhook verification request:', { mode, token: token ? '***' : 'missing' });

    const verificationResult = whatsappService.verifyWebhook(mode, token, challenge);
    
    if (verificationResult) {
      console.log('✅ WhatsApp webhook verified successfully');
      res.status(200).send(verificationResult);
    } else {
      console.error('❌ WhatsApp webhook verification failed');
      res.status(403).send('Forbidden');
    }
  } catch (error) {
    console.error('❌ Error in webhook verification:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Webhook message handler (POST)
router.post('/webhook', async (req, res) => {
  try {
    const webhookPayload = req.body;
    
    // Log webhook for debugging
    console.log('📨 WhatsApp webhook received:', JSON.stringify(webhookPayload, null, 2));
    
    // Store webhook log (handle gracefully if table doesn't exist)
    try {
      await db.insert(whatsappWebhookLogs).values({
        webhookType: 'message',
        payload: JSON.stringify(webhookPayload),
        receivedAt: new Date()
      });
    } catch (dbError) {
      console.log('📝 Note: Webhook logging skipped (table may not exist yet)');
    }

    // Process webhook payload
    if (webhookPayload.entry && webhookPayload.entry.length > 0) {
      for (const entry of webhookPayload.entry) {
        if (entry.changes && entry.changes.length > 0) {
          for (const change of entry.changes) {
            if (change.field === 'messages') {
              await processMessageChange(change.value);
            }
          }
        }
      }
    }

    // Always respond with 200 to acknowledge webhook
    res.status(200).send('EVENT_RECEIVED');
    
  } catch (error) {
    console.error('❌ Error processing WhatsApp webhook:', error);
    
    // Log error but still return 200 to prevent WhatsApp from retrying
    try {
      await db.insert(whatsappWebhookLogs).values({
        webhookType: 'message',
        payload: JSON.stringify(req.body),
        processed: false,
        processingError: error instanceof Error ? error.message : 'Unknown error',
        receivedAt: new Date()
      });
    } catch (dbError) {
      console.log('📝 Error logging skipped (table may not exist yet)');
    }
    
    res.status(200).send('EVENT_RECEIVED');
  }
});

async function processMessageChange(messageData: any) {
  try {
    // Process incoming messages
    if (messageData.messages && messageData.messages.length > 0) {
      for (const message of messageData.messages) {
        await processIncomingMessage(message, messageData.contacts);
      }
    }

    // Process message status updates
    if (messageData.statuses && messageData.statuses.length > 0) {
      for (const status of messageData.statuses) {
        await processMessageStatus(status);
      }
    }
  } catch (error) {
    console.error('❌ Error processing message change:', error);
  }
}

async function processIncomingMessage(message: any, contacts: any[]) {
  try {
    const phoneNumber = message.from;
    const messageId = message.id;
    const timestamp = message.timestamp;

    // Find contact info
    const contact = contacts?.find((c: any) => c.wa_id === phoneNumber);
    const contactName = contact?.profile?.name || '';

    console.log(`📨 Processing message from ${contactName || phoneNumber} (${messageId})`);

    // Store message
    await whatsappService.storeMessage({
      from: phoneNumber,
      to: message.to || '',
      messageId: messageId,
      timestamp: new Date(parseInt(timestamp) * 1000).toISOString(),
      type: message.type,
      text: message.text?.body || message.interactive?.button_reply?.title || '',
      mediaUrl: message.image?.id || message.video?.id || message.audio?.id || message.document?.id
    });

    // Update contact if we have name info
    if (contactName) {
      await whatsappService.updateOrCreateContact(phoneNumber, {
        name: contactName,
        phoneNumber: phoneNumber
      });
    }

    // Process different message types
    let messageContent = '';
    
    switch (message.type) {
      case 'text':
        messageContent = message.text.body;
        break;
      case 'interactive':
        if (message.interactive.type === 'button_reply') {
          messageContent = message.interactive.button_reply.title;
        } else if (message.interactive.type === 'list_reply') {
          messageContent = message.interactive.list_reply.title;
        }
        break;
      case 'button':
        messageContent = message.button.text;
        break;
      case 'image':
      case 'video':
      case 'audio':
      case 'document':
        messageContent = `[${message.type.toUpperCase()} RECEIVED]`;
        // TODO: Handle media download and processing
        break;
      default:
        messageContent = `[UNSUPPORTED MESSAGE TYPE: ${message.type}]`;
    }

    // Process message with AI assistant
    if (messageContent) {
      await aiAssistant.processIncomingMessage(phoneNumber, messageContent, message.type);
    }

    // Mark message as processed
    await whatsappService.markMessageAsProcessed(messageId);

  } catch (error) {
    console.error('❌ Error processing incoming message:', error);
  }
}

async function processMessageStatus(status: any) {
  try {
    console.log(`📊 Message status update: ${status.id} -> ${status.status}`);
    
    // TODO: Update message status in database
    // This can be used to track delivery confirmations, read receipts, etc.
    
  } catch (error) {
    console.error('❌ Error processing message status:', error);
  }
}

// Send message endpoint
router.post('/send-message', async (req, res) => {
  try {
    const { phoneNumber, message, type = 'text' } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        error: 'phoneNumber and message are required'
      });
    }

    // Validate phone number format
    const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, '');
    if (cleanPhoneNumber.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format'
      });
    }

    let success = false;
    
    if (type === 'text') {
      success = await whatsappService.sendTextMessage(cleanPhoneNumber, message);
    }

    res.json({
      success,
      message: success ? 'Message sent successfully' : 'Failed to send message',
      phoneNumber: cleanPhoneNumber
    });

  } catch (error: any) {
    console.error('❌ Error in send message endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Send welcome message endpoint
router.post('/send-welcome', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'phoneNumber is required'
      });
    }

    await aiAssistant.sendWelcomeMessage(phoneNumber);

    res.json({
      success: true,
      message: 'Welcome message sent successfully'
    });

  } catch (error: any) {
    console.error('❌ Error sending welcome message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send welcome message',
      details: error.message
    });
  }
});

// Send proactive message endpoint
router.post('/send-proactive', async (req, res) => {
  try {
    const { phoneNumber, messageType, content } = req.body;

    if (!phoneNumber || !messageType || !content) {
      return res.status(400).json({
        success: false,
        error: 'phoneNumber, messageType, and content are required'
      });
    }

    await aiAssistant.sendProactiveMessage(phoneNumber, messageType, content);

    res.json({
      success: true,
      message: 'Proactive message sent successfully'
    });

  } catch (error: any) {
    console.error('❌ Error sending proactive message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send proactive message',
      details: error.message
    });
  }
});

// Get conversation history endpoint
router.get('/conversation/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { limit = 50 } = req.query;

    const history = await whatsappService.getConversationHistory(
      phoneNumber, 
      parseInt(limit as string)
    );

    res.json({
      success: true,
      phoneNumber,
      messages: history,
      total: history.length
    });

  } catch (error: any) {
    console.error('❌ Error fetching conversation history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation history',
      details: error.message
    });
  }
});

// Get business profile endpoint
router.get('/business-profile', async (req, res) => {
  try {
    const profile = await whatsappService.getBusinessProfile();
    
    res.json({
      success: true,
      profile
    });

  } catch (error: any) {
    console.error('❌ Error fetching business profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch business profile',
      details: error.message
    });
  }
});

// Update business profile endpoint
router.put('/business-profile', async (req, res) => {
  try {
    const { about, address, description, email, websites } = req.body;
    
    const success = await whatsappService.setBusinessProfile({
      about,
      address, 
      description,
      email,
      websites
    });

    res.json({
      success,
      message: success ? 'Business profile updated successfully' : 'Failed to update business profile'
    });

  } catch (error: any) {
    console.error('❌ Error updating business profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update business profile',
      details: error.message
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'WhatsApp service is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router;