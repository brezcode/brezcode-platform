import express from 'express';
import { BrezcodeAvatarService } from '../services/brezcodeAvatarService';
import { ProactiveContentService } from '../services/proactiveContentService';
import { HealthResearchService } from '../services/healthResearchService';
import { brezcodeDb } from '../brezcode-db';
import { brezcodeUsers, brezcodeAssessments } from '@shared/brezcode-schema';
import { eq, desc } from 'drizzle-orm';

const router = express.Router();

// Get Dr. Sakura avatar configuration
router.get('/dr-sakura/config', async (req, res) => {
  try {
    const config = BrezcodeAvatarService.getDrSakuraConfig();
    
    res.json({
      success: true,
      avatar: config
    });
  } catch (error: any) {
    console.error('Error fetching Dr. Sakura config:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get BrezCode training scenarios
router.get('/training-scenarios', async (req, res) => {
  try {
    const scenarios = BrezcodeAvatarService.getBrezcodeTtrainingScenarios();
    
    res.json({
      success: true,
      scenarios
    });
  } catch (error: any) {
    console.error('Error fetching training scenarios:', error);
    res.status(500).json({ error: error.message });
  }
});

// Chat with Dr. Sakura (main endpoint)
router.post('/dr-sakura/chat', async (req, res) => {
  try {
    const { userId, message, conversationHistory = [], context = {} } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({ 
        error: 'userId and message are required' 
      });
    }

    console.log(`🌸 Dr. Sakura responding to user ${userId}: "${message.substring(0, 50)}..."`);
    
    // Generate Dr. Sakura's response
    const response = await BrezcodeAvatarService.generateDrSakuraResponse(
      userId,
      message,
      conversationHistory,
      context
    );
    
    // Generate multimedia content based on the user's message and response
    const { MultimediaContentService } = await import('../services/multimediaContentService');
    const multimediaContent = MultimediaContentService.generateMultimediaContent(
      message,
      response.content,
      'breast_health'
    );
    
    console.log(`✅ Dr. Sakura response generated (Empathy: ${response.empathyScore}, Medical: ${response.medicalAccuracy}) with ${multimediaContent.length} multimedia items`);
    
    res.json({
      success: true,
      response: {
        content: response.content,
        multimediaContent: multimediaContent, // Enhanced multimedia support
        avatarId: 'dr_sakura_brezcode',
        avatarName: 'Dr. Sakura Wellness',
        role: 'Breast Health Coach',
        qualityScores: {
          empathy: response.empathyScore,
          medicalAccuracy: response.medicalAccuracy,
          overall: Math.round((response.empathyScore + response.medicalAccuracy) / 2)
        },
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error in Dr. Sakura chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's health context for personalized responses
router.get('/users/:userId/health-context', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's recent assessment data
    const [recentAssessment] = await brezcodeDb
      .select()
      .from(brezcodeAssessments)
      .where(eq(brezcodeAssessments.userId, parseInt(userId)))
      .orderBy(desc(brezcodeAssessments.completedAt))
      .limit(1);
    
    // Get user basic info
    const [user] = await brezcodeDb
      .select({
        id: brezcodeUsers.id,
        firstName: brezcodeUsers.firstName,
        age: brezcodeUsers.age
      })
      .from(brezcodeUsers)
      .where(eq(brezcodeUsers.id, parseInt(userId)));
    
    res.json({
      success: true,
      healthContext: {
        user: user || null,
        recentAssessment: recentAssessment || null,
        hasHealthProfile: !!user,
        riskLevel: recentAssessment?.riskCategory || 'unknown'
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching health context:', error);
    res.status(500).json({ error: error.message });
  }
});

// Proactive Research System - Start automated educational content delivery
router.post('/dr-sakura/start-proactive-research', async (req, res) => {
  try {
    const { userId, intervalMinutes = 2 } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`🔍 Starting proactive research for user ${userId} with ${intervalMinutes} minute intervals`);
    
    // Store the interval in a simple in-memory store for this demo
    global.proactiveResearchIntervals = global.proactiveResearchIntervals || {};
    
    // Clear any existing interval for this user
    if (global.proactiveResearchIntervals[userId]) {
      clearInterval(global.proactiveResearchIntervals[userId]);
    }
    
    // Educational topics featuring renowned scientists and KOLs
    const educationalTopics = [
      'dr_rhonda_patrick',
      'dr_david_sinclair', 
      'self_examination',
      'lifestyle_prevention'
    ];
    
    let topicIndex = 0;
    
    // Set up automated content delivery
    const interval = setInterval(async () => {
      try {
        const currentTopic = educationalTopics[topicIndex % educationalTopics.length];
        
        // Generate proactive educational content
        const { MultimediaContentService } = await import('../services/multimediaContentService');
        const educationalContent = MultimediaContentService.generateProactiveEducationalContent(currentTopic);
        
        console.log(`📚 Proactive research: Delivering ${currentTopic} content to user ${userId}`);
        
        // Store this as a proactive message that the frontend can poll
        global.proactiveMessages = global.proactiveMessages || {};
        global.proactiveMessages[userId] = global.proactiveMessages[userId] || [];
        
        const proactiveMessage = {
          id: `proactive_${Date.now()}`,
          type: 'proactive_research',
          topic: currentTopic,
          content: educationalContent,
          timestamp: new Date().toISOString()
        };
        
        global.proactiveMessages[userId].push(proactiveMessage);
        
        // Keep only the last 10 proactive messages
        if (global.proactiveMessages[userId].length > 10) {
          global.proactiveMessages[userId] = global.proactiveMessages[userId].slice(-10);
        }
        
        topicIndex++;
      } catch (error) {
        console.error('Error in proactive research delivery:', error);
      }
    }, intervalMinutes * 60 * 1000);
    
    global.proactiveResearchIntervals[userId] = interval;
    
    res.json({
      success: true,
      message: `Proactive research started with ${intervalMinutes} minute intervals`,
      intervalMinutes,
      status: 'active'
    });
    
  } catch (error: any) {
    console.error('Error starting proactive research:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stop proactive research
router.post('/dr-sakura/stop-proactive-research', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`🛑 Stopping proactive research for user ${userId}`);
    
    global.proactiveResearchIntervals = global.proactiveResearchIntervals || {};
    
    if (global.proactiveResearchIntervals[userId]) {
      clearInterval(global.proactiveResearchIntervals[userId]);
      delete global.proactiveResearchIntervals[userId];
    }
    
    res.json({
      success: true,
      message: 'Proactive research stopped',
      status: 'inactive'
    });
    
  } catch (error: any) {
    console.error('Error stopping proactive research:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get proactive messages for a user
router.get('/dr-sakura/proactive-messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    global.proactiveMessages = global.proactiveMessages || {};
    const messages = global.proactiveMessages[userId] || [];
    
    res.json({
      success: true,
      messages,
      count: messages.length
    });
    
  } catch (error: any) {
    console.error('Error fetching proactive messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark proactive message as read
router.post('/dr-sakura/mark-proactive-read', async (req, res) => {
  try {
    const { userId, messageId } = req.body;
    
    if (!userId || !messageId) {
      return res.status(400).json({ error: 'userId and messageId are required' });
    }
    
    global.proactiveMessages = global.proactiveMessages || {};
    if (global.proactiveMessages[userId]) {
      global.proactiveMessages[userId] = global.proactiveMessages[userId].filter(
        (msg: any) => msg.id !== messageId
      );
    }
    
    res.json({
      success: true,
      message: 'Proactive message marked as read'
    });
    
  } catch (error: any) {
    console.error('Error marking proactive message as read:', error);
    res.status(500).json({ error: error.message });
  }
});

// Training session endpoint for BrezCode
router.post('/training/start', async (req, res) => {
  try {
    const { scenarioId, userId = 1 } = req.body;
    
    const scenarios = BrezcodeAvatarService.getBrezcodeTtrainingScenarios();
    const scenario = scenarios.find(s => s.id === scenarioId);
    
    if (!scenario) {
      return res.status(404).json({ error: 'Training scenario not found' });
    }
    
    // Create training session
    const sessionId = `brezcode_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      success: true,
      session: {
        id: sessionId,
        avatarId: 'dr_sakura_brezcode',
        scenario: scenario,
        status: 'active',
        messages: [],
        startedAt: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('Error starting training session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Continue training conversation
router.post('/training/:sessionId/continue', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userMessage, conversationHistory = [] } = req.body;
    
    console.log(`🎯 Continuing BrezCode training session: ${sessionId}`);
    
    // Generate contextual training response
    const response = await BrezcodeAvatarService.generateDrSakuraResponse(
      1, // Default training user
      userMessage || "Please continue with the breast health consultation...",
      conversationHistory,
      { currentConcerns: ['training session'] }
    );
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      role: 'avatar',
      content: response.content,
      timestamp: new Date().toISOString(),
      qualityScores: {
        empathy: response.empathyScore,
        medicalAccuracy: response.medicalAccuracy
      }
    };
    
    res.json({
      success: true,
      session: {
        id: sessionId,
        messages: [...conversationHistory, newMessage],
        lastMessage: newMessage
      }
    });
    
  } catch (error: any) {
    console.error('Error continuing training session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start proactive research content delivery
router.post('/dr-sakura/start-proactive-research', async (req, res) => {
  try {
    const { userId, intervalMinutes = 2 } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        error: 'userId is required' 
      });
    }

    console.log(`🔬 Starting proactive research delivery for user ${userId} every ${intervalMinutes} minutes`);
    
    // Mock callback for demonstration (in real implementation, you'd use WebSocket or SSE)
    const callback = (message: any) => {
      console.log(`📚 Proactive message ready for user ${userId}:`, message.content.substring(0, 100) + '...');
      // In real implementation, you'd send this via WebSocket to the client
    };
    
    const result = ProactiveContentService.startContentDelivery(userId, callback, intervalMinutes);
    
    res.json({
      success: true,
      message: `Proactive research delivery started for Dr. Sakura`,
      details: result,
      nextDelivery: new Date(Date.now() + 30000).toISOString() // First message in 30 seconds
    });
    
  } catch (error: any) {
    console.error('❌ Error starting proactive research:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stop proactive research content delivery
router.post('/dr-sakura/stop-proactive-research', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        error: 'userId is required' 
      });
    }

    const stopped = ProactiveContentService.stopContentDelivery(userId);
    
    res.json({
      success: true,
      message: stopped 
        ? 'Proactive research delivery stopped' 
        : 'No active delivery found for this user'
    });
    
  } catch (error: any) {
    console.error('❌ Error stopping proactive research:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get proactive delivery status
router.get('/dr-sakura/proactive-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const status = ProactiveContentService.getDeliveryStatus(parseInt(userId));
    
    res.json({
      success: true,
      status
    });
    
  } catch (error: any) {
    console.error('❌ Error getting proactive status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send specific researcher content
router.post('/dr-sakura/send-research', async (req, res) => {
  try {
    const { userId, researcherName = 'Dr. Rhonda Patrick' } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        error: 'userId is required' 
      });
    }

    const message = await ProactiveContentService.sendSpecificResearch(userId, researcherName);
    
    if (!message) {
      return res.status(404).json({
        error: 'No content found for the specified researcher'
      });
    }
    
    res.json({
      success: true,
      message: 'Research content sent',
      preview: message.content.substring(0, 150) + '...',
      multimediaCount: message.multimediaContent.length
    });
    
  } catch (error: any) {
    console.error('❌ Error sending specific research:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get available researchers and their content
router.get('/research/experts', async (req, res) => {
  try {
    const experts = [
      { name: 'Dr. Rhonda Patrick', specialty: 'Aging & Nutrition', contentCount: 2 },
      { name: 'Dr. David Sinclair', specialty: 'Longevity Research', contentCount: 1 },
      { name: 'Dr. Peter Attia', specialty: 'Longevity Medicine', contentCount: 1 },
      { name: 'Dr. Sara Gottfried', specialty: 'Hormone Balance', contentCount: 1 }
    ];
    
    res.json({
      success: true,
      experts,
      totalContent: 5
    });
    
  } catch (error: any) {
    console.error('❌ Error fetching expert list:', error);
    res.status(500).json({ error: error.message });
  }
});

// Training session endpoint for BrezCode
router.post('/training/start', async (req, res) => {
  try {
    const { scenarioId, userId = 1 } = req.body;
    
    const scenarios = BrezcodeAvatarService.getBrezcodeTtrainingScenarios();
    const scenario = scenarios.find(s => s.id === scenarioId);
    
    if (!scenario) {
      return res.status(404).json({ error: 'Training scenario not found' });
    }
    
    // Create training session
    const sessionId = `brezcode_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      success: true,
      session: {
        id: sessionId,
        avatarId: 'dr_sakura_brezcode',
        scenario: scenario,
        status: 'active',
        messages: [],
        startedAt: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('Error starting training session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Continue training conversation
router.post('/training/:sessionId/continue', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userMessage, conversationHistory = [] } = req.body;
    
    console.log(`🎯 Continuing BrezCode training session: ${sessionId}`);
    
    // Generate contextual training response
    const response = await BrezcodeAvatarService.generateDrSakuraResponse(
      1, // Default training user
      userMessage || "Please continue with the breast health consultation...",
      conversationHistory,
      { currentConcerns: ['training session'] }
    );
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      role: 'avatar',
      content: response.content,
      timestamp: new Date().toISOString(),
      qualityScores: {
        empathy: response.empathyScore,
        medicalAccuracy: response.medicalAccuracy
      }
    };
    
    res.json({
      success: true,
      session: {
        id: sessionId,
        messages: [...conversationHistory, newMessage],
        lastMessage: newMessage
      }
    });
    
  } catch (error: any) {
    console.error('Error continuing training session:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;