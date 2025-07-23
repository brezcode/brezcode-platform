import { Router } from "express";

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

export default router;