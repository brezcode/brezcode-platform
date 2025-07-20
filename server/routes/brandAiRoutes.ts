import { Router } from 'express';
import { brandAiService } from '../services/brandAiService';
import { z } from 'zod';

const router = Router();

// Chat endpoint for brand-specific AI
router.post('/chat', async (req, res) => {
  try {
    const { brandId, sessionId, message, userId, language = 'en' } = req.body;

    if (!brandId || !sessionId || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Brand ID, session ID, and message are required' 
      });
    }

    console.log(`Brand AI chat request for brand ${brandId}:`, { sessionId, message });

    const result = await brandAiService.generateResponse(brandId, sessionId, message, userId);

    res.json({
      success: true,
      response: result.response,
      knowledgeUsed: result.knowledgeUsed,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Brand AI chat error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// Initialize AI configuration for a brand
router.post('/initialize', async (req, res) => {
  try {
    const { brandId, expertise, personality } = req.body;

    if (!brandId || !expertise) {
      return res.status(400).json({ 
        success: false, 
        error: 'Brand ID and expertise are required' 
      });
    }

    const config = await brandAiService.initializeBrandAi(brandId, expertise, personality);

    res.json({
      success: true,
      config,
    });

  } catch (error: any) {
    console.error('Brand AI initialization error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to initialize AI configuration',
      details: error.message 
    });
  }
});

// Get AI configuration for a brand
router.get('/config/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params;

    const config = await brandAiService.getBrandAiConfig(brandId);

    if (!config) {
      return res.status(404).json({ 
        success: false, 
        error: 'AI configuration not found for this brand' 
      });
    }

    res.json({
      success: true,
      config,
    });

  } catch (error: any) {
    console.error('Get brand AI config error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get AI configuration',
      details: error.message 
    });
  }
});

// Add knowledge to brand's knowledge base
router.post('/knowledge', async (req, res) => {
  try {
    const { brandId, title, content, category, fileType, fileName, tags } = req.body;

    if (!brandId || !title || !content || !category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Brand ID, title, content, and category are required' 
      });
    }

    const knowledge = await brandAiService.addKnowledge(brandId, {
      title,
      content,
      category,
      fileType,
      fileName,
      tags,
    });

    res.json({
      success: true,
      knowledge,
    });

  } catch (error: any) {
    console.error('Add knowledge error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add knowledge',
      details: error.message 
    });
  }
});

// Upload knowledge from file content
router.post('/knowledge/upload', async (req, res) => {
  try {
    const { brandId, fileName, fileType, content, category = 'general' } = req.body;

    if (!brandId || !fileName || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Brand ID, file name, and content are required' 
      });
    }

    const knowledgeEntries = await brandAiService.uploadKnowledgeFromFile(
      brandId, 
      fileName, 
      fileType || 'txt', 
      content, 
      category
    );

    res.json({
      success: true,
      message: `Successfully uploaded ${knowledgeEntries.length} knowledge entries`,
      entries: knowledgeEntries.length,
    });

  } catch (error: any) {
    console.error('Upload knowledge error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload knowledge',
      details: error.message 
    });
  }
});

// Search brand's knowledge base
router.get('/knowledge/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params;
    const { query, category } = req.query;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search query is required' 
      });
    }

    const knowledge = await brandAiService.searchKnowledge(
      brandId, 
      query as string, 
      category as string
    );

    res.json({
      success: true,
      knowledge,
      count: knowledge.length,
    });

  } catch (error: any) {
    console.error('Search knowledge error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to search knowledge',
      details: error.message 
    });
  }
});

// Get chat history for a session
router.get('/chat/:brandId/:sessionId', async (req, res) => {
  try {
    const { brandId, sessionId } = req.params;
    const { limit = '10' } = req.query;

    const history = await brandAiService.getChatHistory(
      brandId, 
      sessionId, 
      parseInt(limit as string)
    );

    res.json({
      success: true,
      history: history.reverse(), // Return in chronological order
      count: history.length,
    });

  } catch (error: any) {
    console.error('Get chat history error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get chat history',
      details: error.message 
    });
  }
});

export default router;