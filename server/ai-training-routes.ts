import type { Express } from "express";
import { AiTrainingService } from './aiTrainingService';

const aiTrainingService = new AiTrainingService();

// Middleware to check authentication
const requireAuth = (req: any, res: any, next: any) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = userId;
  next();
};

export function registerAiTrainingRoutes(app: Express): void {
  // Get training scenarios for a brand
  app.get('/api/ai-training/scenarios/:brandId', requireAuth, async (req, res) => {
    try {
      const brandId = parseInt(req.params.brandId);
      const scenarios = await aiTrainingService.getScenarios(brandId);
      res.json(scenarios);
    } catch (error) {
      console.error('Error fetching training scenarios:', error);
      res.status(500).json({ error: 'Failed to fetch training scenarios' });
    }
  });

  // Generate new AI training scenario
  app.post('/api/ai-training/scenarios/generate', requireAuth, async (req, res) => {
    try {
      const { brandId, scenarioType, industry } = req.body;
      const userId = req.userId;
      
      if (!brandId || !scenarioType) {
        return res.status(400).json({ error: 'Brand ID and scenario type are required' });
      }

      const scenario = await aiTrainingService.generateScenario(brandId, userId, scenarioType, industry);
      res.json(scenario);
    } catch (error) {
      console.error('Error generating training scenario:', error);
      res.status(500).json({ error: 'Failed to generate training scenario' });
    }
  });

  // Create custom training scenario
  app.post('/api/ai-training/scenarios', requireAuth, async (req, res) => {
    try {
      const scenarioData = {
        ...req.body,
        userId: req.userId
      };
      
      const scenario = await aiTrainingService.createScenario(scenarioData);
      res.json(scenario);
    } catch (error) {
      console.error('Error creating training scenario:', error);
      res.status(500).json({ error: 'Failed to create training scenario' });
    }
  });

  // Start new training session
  app.post('/api/ai-training/sessions', requireAuth, async (req, res) => {
    try {
      const { scenarioId, sessionName, aiAssistantRole } = req.body;
      const userId = req.userId;
      
      if (!scenarioId || !sessionName || !aiAssistantRole) {
        return res.status(400).json({ error: 'Scenario ID, session name, and AI assistant role are required' });
      }

      const session = await aiTrainingService.startSession(scenarioId, userId, sessionName, aiAssistantRole);
      res.json(session);
    } catch (error) {
      console.error('Error starting training session:', error);
      res.status(500).json({ error: 'Failed to start training session' });
    }
  });

  // Get training sessions for user
  app.get('/api/ai-training/sessions', requireAuth, async (req, res) => {
    try {
      const userId = req.userId;
      const sessions = await aiTrainingService.getSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching training sessions:', error);
      res.status(500).json({ error: 'Failed to fetch training sessions' });
    }
  });

  // Get dialogue history for a session
  app.get('/api/ai-training/sessions/:sessionId/dialogues', requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const dialogues = await aiTrainingService.getSessionDialogues(sessionId);
      res.json(dialogues);
    } catch (error) {
      console.error('Error fetching session dialogues:', error);
      res.status(500).json({ error: 'Failed to fetch session dialogues' });
    }
  });

  // Send message in training session (role-play)
  app.post('/api/ai-training/sessions/:sessionId/messages', requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const { speaker, message, messageType = 'text' } = req.body;
      
      if (!speaker || !message) {
        return res.status(400).json({ error: 'Speaker and message are required' });
      }

      // Get current conversation history
      const conversationHistory = await aiTrainingService.getSessionDialogues(sessionId);
      const nextOrder = Math.max(...conversationHistory.map(d => d.messageOrder), 0) + 1;

      // Add the user/customer message
      await aiTrainingService.addDialogue(sessionId, {
        messageOrder: nextOrder,
        speaker,
        message,
        messageType
      });

      // If it's a customer message, generate AI assistant response
      let aiResponse = null;
      if (speaker === 'customer') {
        const aiResponseText = await aiTrainingService.generateAiResponse(sessionId, conversationHistory, message);
        
        aiResponse = await aiTrainingService.addDialogue(sessionId, {
          messageOrder: nextOrder + 1,
          speaker: 'ai_assistant',
          message: aiResponseText,
          messageType: 'text'
        });
      }

      res.json({ 
        userMessage: { speaker, message, messageOrder: nextOrder },
        aiResponse 
      });
    } catch (error) {
      console.error('Error sending training message:', error);
      res.status(500).json({ error: 'Failed to send training message' });
    }
  });

  // Add trainer feedback to dialogue
  app.post('/api/ai-training/dialogues/:dialogueId/feedback', requireAuth, async (req, res) => {
    try {
      const dialogueId = parseInt(req.params.dialogueId);
      const feedback = req.body;
      const reviewerId = req.userId;
      
      const updatedDialogue = await aiTrainingService.addTrainerFeedback(dialogueId, feedback, reviewerId);
      res.json(updatedDialogue);
    } catch (error) {
      console.error('Error adding trainer feedback:', error);
      res.status(500).json({ error: 'Failed to add trainer feedback' });
    }
  });

  // Complete training session
  app.post('/api/ai-training/sessions/:sessionId/complete', requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const completedSession = await aiTrainingService.completeSession(sessionId);
      res.json(completedSession);
    } catch (error) {
      console.error('Error completing training session:', error);
      res.status(500).json({ error: 'Failed to complete training session' });
    }
  });

  // Get training analytics for user
  app.get('/api/ai-training/analytics', requireAuth, async (req, res) => {
    try {
      const userId = req.userId;
      const analytics = await aiTrainingService.getTrainingAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching training analytics:', error);
      res.status(500).json({ error: 'Failed to fetch training analytics' });
    }
  });
}