import express from 'express';
import { BrezcodeAvatarService } from '../services/brezcodeAvatarService';
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
    
    console.log(`✅ Dr. Sakura response generated (Empathy: ${response.empathyScore}, Medical: ${response.medicalAccuracy})`);
    
    res.json({
      success: true,
      response: {
        content: response.content,
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