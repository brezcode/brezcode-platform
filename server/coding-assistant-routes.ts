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

// Simulate coding conversations for demo
router.post('/simulate', async (req, res) => {
  try {
    // Simulate realistic coding conversations
    const conversations = [
      {
        user: "How do I handle async/await errors in JavaScript?",
        ai: "Use try/catch blocks around your await calls:\n\ntry {\n  const result = await fetchData();\n  console.log(result);\n} catch (error) {\n  console.error('Error:', error);\n}",
        tech: "JavaScript"
      },
      {
        user: "Show me React useState with TypeScript",
        ai: "Here's how to use useState with TypeScript:\n\nconst [count, setCount] = useState<number>(0);\nconst [user, setUser] = useState<User | null>(null);",
        tech: "React"
      },
      {
        user: "I'm getting 'Cannot read property of undefined' error",
        ai: "This error occurs when you try to access a property of undefined. Use optional chaining:\n\nuser?.profile?.name instead of user.profile.name\n\nOr check if the object exists first:\nif (user && user.profile) { console.log(user.profile.name); }",
        tech: "JavaScript"
      },
      {
        user: "How to make API calls in React with proper error handling?",
        ai: "Use fetch with async/await and proper error handling:\n\nconst fetchUser = async (id) => {\n  try {\n    const response = await fetch(`/api/users/${id}`);\n    if (!response.ok) throw new Error('Failed to fetch');\n    const user = await response.json();\n    return user;\n  } catch (error) {\n    console.error('API Error:', error);\n    throw error;\n  }\n};",
        tech: "React"
      }
    ];

    for (const conv of conversations) {
      await aiCodingAnalyzer.recordCodingInteraction(
        conv.user,
        conv.ai,
        { technology: conv.tech, problemType: 'general' }
      );
    }

    res.json({ 
      success: true, 
      message: `Simulated ${conversations.length} coding conversations`,
      conversations: conversations.length
    });
  } catch (error) {
    console.error("Error simulating conversations:", error);
    res.status(500).json({ error: "Failed to simulate conversations" });
  }
});

export default router;