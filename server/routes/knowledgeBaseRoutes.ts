import express from 'express';
import { conversationStorageService } from '../services/conversationStorageService';

const router = express.Router();

// Get user's conversation history
router.get('/conversations', async (req, res) => {
  try {
    // In production, get userId from authenticated session
    const userId = 1; // Demo user
    const limit = parseInt(req.query.limit as string) || 50;
    
    const conversations = await conversationStorageService.getUserConversations(userId, limit);
    
    res.json({
      success: true,
      conversations,
      total: conversations.length
    });
  } catch (error: any) {
    console.error('❌ Failed to get conversations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's knowledge base
router.get('/knowledge', async (req, res) => {
  try {
    // In production, get userId from authenticated session
    const userId = 1; // Demo user
    const category = req.query.category as string;
    
    const knowledge = await conversationStorageService.getUserKnowledgeBase(userId, category);
    
    res.json({
      success: true,
      knowledge,
      total: knowledge.length
    });
  } catch (error: any) {
    console.error('❌ Failed to get knowledge base:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search knowledge base
router.get('/knowledge/search', async (req, res) => {
  try {
    // In production, get userId from authenticated session
    const userId = 1; // Demo user
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const results = await conversationStorageService.searchKnowledgeBase(userId, query);
    
    res.json({
      success: true,
      results,
      query,
      total: results.length
    });
  } catch (error: any) {
    console.error('❌ Failed to search knowledge base:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get learning analytics
router.get('/analytics', async (req, res) => {
  try {
    // In production, get userId from authenticated session
    const userId = 1; // Demo user
    
    const analytics = await conversationStorageService.getUserLearningAnalytics(userId);
    
    res.json({
      success: true,
      analytics,
      total: analytics.length
    });
  } catch (error: any) {
    console.error('❌ Failed to get learning analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate session summary
router.post('/sessions/:sessionId/summary', async (req, res) => {
  try {
    // In production, get userId from authenticated session
    const userId = 1; // Demo user
    const { sessionId } = req.params;
    
    const summary = await conversationStorageService.generateSessionSummary(sessionId, userId);
    
    // Update session analytics with summary
    await conversationStorageService.updateSessionAnalytics(
      userId,
      sessionId,
      'brezcode_health_coach',
      'health_coaching',
      'brezcode',
      { sessionSummary: summary }
    );
    
    res.json({
      success: true,
      sessionId,
      summary
    });
  } catch (error: any) {
    console.error('❌ Failed to generate session summary:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;