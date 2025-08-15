import { Router } from 'express';
import { skincoachAvatarService } from '../services/skincoachAvatarService';
import { skincoachDb, skincoachUsers } from '../skincoach-db';
import { eq } from 'drizzle-orm';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for chat endpoints
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute per IP
  message: {
    error: 'Too many chat messages, please slow down.',
  },
});

// Apply rate limiting to chat routes
router.use('/chat', chatLimiter);

// Get avatar configuration
router.get('/avatar/:avatarId/config', async (req, res) => {
  try {
    const { avatarId } = req.params;
    
    const avatar = await skincoachAvatarService.getAvatarConfig(avatarId);
    
    res.json({
      success: true,
      avatar
    });

  } catch (error) {
    console.error('Error fetching avatar config:', error);
    res.status(500).json({ error: 'Failed to fetch avatar configuration' });
  }
});

// Start or get conversation
router.post('/chat/conversation', async (req, res) => {
  try {
    const { userId, avatarId = 'dr_sophia_skincare' } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // For demo purposes, if user doesn't exist, create a temporary one
    let user;
    try {
      const existingUser = await skincoachDb
        .select()
        .from(skincoachUsers)
        .where(eq(skincoachUsers.id, userId))
        .limit(1);
      
      if (!existingUser.length) {
        // Create demo user
        const newUser = await skincoachDb
          .insert(skincoachUsers)
          .values({
            email: `demo_user_${userId}@skincoach.ai`,
            name: 'Demo User',
            skin_type: 'combination',
            concerns: ['dark spots', 'dehydration'],
            goals: ['even skin tone', 'improved hydration'],
            budget: 'moderate'
          })
          .returning();
        user = newUser[0];
      } else {
        user = existingUser[0];
      }
    } catch (error) {
      // If there's a database error, continue with mock data
      console.warn('Database error, using mock user data:', error);
      user = { id: userId, name: 'Demo User' };
    }

    const conversation = await skincoachAvatarService.getOrCreateConversation(
      user.id, 
      avatarId
    );

    res.json({
      success: true,
      conversation: {
        id: conversation.conversation_id,
        userId: user.id,
        avatarId,
        messages: conversation.messages || [],
        context: conversation.context
      }
    });

  } catch (error) {
    console.error('Error creating/getting conversation:', error);
    res.status(500).json({ error: 'Failed to create or get conversation' });
  }
});

// Send message to AI
router.post('/chat/message', async (req, res) => {
  try {
    const { userId, avatarId = 'dr_sophia_skincare', message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message too long. Please keep it under 1000 characters.' });
    }

    const result = await skincoachAvatarService.processMessage(
      userId,
      avatarId,
      message
    );

    res.json({
      success: true,
      conversation: {
        id: result.conversationId,
        userMessage: result.userMessage,
        assistantMessage: result.assistantMessage
      }
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      fallbackResponse: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."
    });
  }
});

// Get conversation history
router.get('/chat/conversation/:conversationId/history', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50 } = req.query;

    const history = await skincoachAvatarService.getConversationHistory(conversationId);

    // Limit messages if requested
    const messages = history.messages.slice(-Number(limit));

    res.json({
      success: true,
      conversation: {
        id: conversationId,
        messages,
        context: history.conversation.context,
        totalMessages: history.messages.length
      }
    });

  } catch (error) {
    console.error('Error fetching conversation history:', error);
    res.status(500).json({ error: 'Failed to fetch conversation history' });
  }
});

// Get user's conversations
router.get('/chat/user/:userId/conversations', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { limit = 10 } = req.query;

    const conversations = await skincoachAvatarService.getUserConversations(
      userId, 
      Number(limit)
    );

    res.json({
      success: true,
      conversations: conversations.map(conv => ({
        id: conv.conversation_id,
        status: conv.status,
        messageCount: conv.messages?.length || 0,
        lastActivity: conv.updated_at,
        created: conv.created_at
      }))
    });

  } catch (error) {
    console.error('Error fetching user conversations:', error);
    res.status(500).json({ error: 'Failed to fetch user conversations' });
  }
});

// Feedback endpoints

// Rate conversation
router.post('/chat/conversation/:conversationId/feedback', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { rating, feedback, messageId } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // In a real implementation, this would save to a feedback table
    // For now, we'll just acknowledge the feedback
    console.log(`Feedback received for conversation ${conversationId}: ${rating}/5 - ${feedback}`);

    res.json({
      success: true,
      message: 'Feedback recorded successfully',
      conversationId,
      rating,
      messageId
    });

  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// Report inappropriate content
router.post('/chat/report', async (req, res) => {
  try {
    const { conversationId, messageId, reason, description } = req.body;

    if (!conversationId || !messageId || !reason) {
      return res.status(400).json({ error: 'conversationId, messageId, and reason are required' });
    }

    // In a real implementation, this would log to a moderation system
    console.log(`Content reported: Conversation ${conversationId}, Message ${messageId}, Reason: ${reason}`);

    res.json({
      success: true,
      message: 'Report submitted successfully',
      reportId: `report_${Date.now()}`
    });

  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// Health check for chat service
router.get('/health', async (req, res) => {
  try {
    // Test database connectivity
    await skincoachDb.select().from(skincoachUsers).limit(1);
    
    res.json({
      status: 'healthy',
      service: 'SkinCoach Chat API',
      timestamp: new Date().toISOString(),
      features: {
        aiChat: 'operational',
        conversationHistory: 'operational',
        userManagement: 'operational',
        feedbackSystem: 'operational'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Demo endpoints for testing

// Create demo conversation
router.post('/demo/conversation', async (req, res) => {
  try {
    const demoUserId = Math.floor(Math.random() * 10000) + 1000;
    
    // Create demo conversation
    const conversation = await skincoachAvatarService.getOrCreateConversation(
      demoUserId,
      'dr_sophia_skincare'
    );

    // Send a welcome message
    const welcomeResult = await skincoachAvatarService.processMessage(
      demoUserId,
      'dr_sophia_skincare',
      'Hello! I just completed my skin analysis and would like some advice.'
    );

    res.json({
      success: true,
      demo: true,
      userId: demoUserId,
      conversation: {
        id: conversation.conversation_id,
        messages: [welcomeResult.userMessage, welcomeResult.assistantMessage]
      },
      message: 'Demo conversation created successfully'
    });

  } catch (error) {
    console.error('Error creating demo conversation:', error);
    res.status(500).json({ error: 'Failed to create demo conversation' });
  }
});

export default router;