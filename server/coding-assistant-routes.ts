import { Router } from "express";
import { aiCodingAnalyzer } from "./aiCodingAnalyzer";

const router = Router();

// Simple in-memory storage for now to avoid database issues
let patterns: any[] = [];
let strategies: any[] = [];
let solutions: any[] = [];

// Get code patterns
router.get('/patterns', async (req, res) => {
  try {
    res.json(patterns);
  } catch (error) {
    console.error("Error getting patterns:", error);
    res.status(500).json({ error: "Failed to retrieve patterns" });
  }
});

// Add code pattern
router.post('/patterns', async (req, res) => {
  try {
    const pattern = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date(),
      originalPrompt: req.body.originalPrompt || `Create a ${req.body.technology} pattern for ${req.body.patternName}`
    };
    
    patterns.push(pattern);
    
    // Log prompt for analysis
    console.log("Prompt recorded:", {
      type: "code_pattern",
      prompt: pattern.originalPrompt,
      technology: req.body.technology,
      category: req.body.category,
      timestamp: new Date()
    });
    
    res.json(pattern);
  } catch (error) {
    console.error("Error adding pattern:", error);
    res.status(500).json({ error: "Failed to add pattern" });
  }
});

// Get prompting strategies
router.get('/strategies', async (req, res) => {
  try {
    res.json(strategies);
  } catch (error) {
    console.error("Error getting strategies:", error);
    res.status(500).json({ error: "Failed to retrieve strategies" });
  }
});

// Add prompting strategy
router.post('/strategies', async (req, res) => {
  try {
    const strategy = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date(),
      effectiveness: 50,
      timesUsed: 0
    };
    
    strategies.push(strategy);
    
    // Log prompt strategy for analysis
    console.log("Strategy recorded:", {
      type: "prompting_strategy",
      strategy: req.body.strategyName,
      template: req.body.promptTemplate,
      useCase: req.body.useCase,
      timestamp: new Date()
    });
    
    res.json(strategy);
  } catch (error) {
    console.error("Error adding strategy:", error);
    res.status(500).json({ error: "Failed to add strategy" });
  }
});

// Get debugging solutions
router.get('/solutions', async (req, res) => {
  try {
    res.json(solutions);
  } catch (error) {
    console.error("Error getting solutions:", error);
    res.status(500).json({ error: "Failed to retrieve solutions" });
  }
});

// Add debugging solution
router.post('/solutions', async (req, res) => {
  try {
    const solution = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date(),
      isVerified: false
    };
    
    solutions.push(solution);
    
    // Log solution for analysis
    console.log("Solution recorded:", {
      type: "debugging_solution",
      problem: req.body.problemDescription,
      technology: req.body.technology,
      timeToSolve: req.body.timeToSolve,
      timestamp: new Date()
    });
    
    res.json(solution);
  } catch (error) {
    console.error("Error adding solution:", error);
    res.status(500).json({ error: "Failed to add solution" });
  }
});

// Analytics endpoint
router.get('/analytics', async (req, res) => {
  try {
    const analytics = {
      totalPatterns: patterns.length,
      totalStrategies: strategies.length,
      totalSolutions: solutions.length,
      avgEffectiveness: strategies.length > 0 
        ? Math.round(strategies.reduce((sum, s) => sum + (s.effectiveness || 50), 0) / strategies.length)
        : 50,
      recentActivity: [
        ...patterns.slice(-3).map(p => ({ type: 'pattern', item: p })),
        ...strategies.slice(-3).map(s => ({ type: 'strategy', item: s })),
        ...solutions.slice(-3).map(s => ({ type: 'solution', item: s }))
      ].sort((a, b) => new Date(b.item.createdAt).getTime() - new Date(a.item.createdAt).getTime())
    };
    
    res.json(analytics);
  } catch (error) {
    console.error("Error getting analytics:", error);
    res.status(500).json({ error: "Failed to retrieve analytics" });
  }
});

// Auto-learning endpoint - records coding conversations
router.post('/learn', async (req, res) => {
  try {
    const { userMessage, aiResponse, technology, problemType, sessionId } = req.body;
    
    await aiCodingAnalyzer.recordCodingInteraction(
      userMessage, 
      aiResponse, 
      { technology, problemType, sessionId }
    );
    
    res.json({ success: true, message: "Interaction recorded for learning" });
  } catch (error) {
    console.error("Error recording interaction:", error);
    res.status(500).json({ error: "Failed to record interaction" });
  }
});

// Get AI insights about coding patterns
router.get('/insights', async (req, res) => {
  try {
    const insights = await aiCodingAnalyzer.generateInsights();
    res.json(insights);
  } catch (error) {
    console.error("Error getting insights:", error);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

// Get recent interactions for analysis
router.get('/interactions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const interactions = aiCodingAnalyzer.getRecentInteractions(limit);
    res.json(interactions);
  } catch (error) {
    console.error("Error getting interactions:", error);
    res.status(500).json({ error: "Failed to get interactions" });
  }
});

// Load and analyze real conversation history
router.post('/analyze-history', async (req, res) => {
  try {
    console.log("Loading conversation history for analysis...");
    const conversationLogs = await aiCodingAnalyzer.loadConversationHistory();
    
    // Force analysis of all loaded conversations
    await aiCodingAnalyzer.analyzeAndExtractPatterns();
    
    res.json({ 
      success: true, 
      message: `Analyzed ${conversationLogs.length} conversation logs`,
      conversationsAnalyzed: conversationLogs.length,
      conversationLogs: conversationLogs.map(log => ({
        user: log.userMessage.substring(0, 150) + "...",
        ai: log.aiResponse.substring(0, 150) + "...",
        technology: log.technology,
        timestamp: log.timestamp
      }))
    });
  } catch (error) {
    console.error("Error analyzing conversation history:", error);
    res.status(500).json({ error: "Failed to analyze conversation history" });
  }
});

// Get conversation logs for display
router.get('/conversation-logs', async (req, res) => {
  try {
    const recentLogs = aiCodingAnalyzer.getRecentInteractions(20);
    res.json({
      logs: recentLogs.map((log, index) => ({
        id: index,
        userMessage: log.userMessage,
        aiResponse: log.aiResponse,
        technology: log.technology,
        problemType: log.problemType,
        timestamp: log.timestamp,
        sessionId: log.sessionId
      }))
    });
  } catch (error) {
    console.error("Error getting conversation logs:", error);
    res.status(500).json({ error: "Failed to get conversation logs" });
  }
});

// Simulate coding conversations for demo (keeping for fallback)
router.post('/simulate', async (req, res) => {
  try {
    // Load real conversation history instead of simulating
    const conversationLogs = await aiCodingAnalyzer.loadConversationHistory();
    
    res.json({ 
      success: true, 
      message: `Loaded ${conversationLogs.length} real coding conversations from history`,
      conversations: conversationLogs.length,
      source: "conversation_history"
    });
  } catch (error) {
    console.error("Error loading conversations:", error);
    res.status(500).json({ error: "Failed to load conversations" });
  }
});

export default router;