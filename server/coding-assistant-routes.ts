import { Router } from "express";
import { z } from "zod";
import { codingAssistantService } from "./codingAssistantService";
import { 
  insertCodingSessionSchema,
  insertCodePatternSchema,
  insertDebuggingSolutionSchema,
  insertPromptingStrategySchema,
  insertCodingContextSchema
} from "@shared/coding-assistant-schema";

const router = Router();

// Authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

// Session Management
router.post("/sessions", requireAuth, async (req: any, res: any) => {
  try {
    const data = insertCodingSessionSchema.omit({ userId: true }).parse(req.body);
    const session = await codingAssistantService.createSession(req.session.userId, data);
    res.json(session);
  } catch (error) {
    console.error("Error creating coding session:", error);
    res.status(400).json({ error: "Invalid session data" });
  }
});

router.get("/sessions", requireAuth, async (req: any, res: any) => {
  try {
    const sessions = await codingAssistantService.getActiveSessions(req.session.userId);
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

router.patch("/sessions/:id", requireAuth, async (req: any, res: any) => {
  try {
    const sessionId = parseInt(req.params.id);
    const updates = insertCodingSessionSchema.omit({ userId: true }).partial().parse(req.body);
    await codingAssistantService.updateSession(sessionId, updates);
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(400).json({ error: "Invalid update data" });
  }
});

// Code Patterns
router.post("/patterns", requireAuth, async (req: any, res: any) => {
  try {
    const data = insertCodePatternSchema.omit({ userId: true }).parse(req.body);
    
    // Record the prompt that led to this pattern creation for best practice analysis
    if (req.body.originalPrompt) {
      await codingAssistantService.recordPromptInteraction(req.session.userId, {
        type: 'pattern_creation',
        prompt: req.body.originalPrompt,
        response: data.codeExample,
        effectiveness: 1,
        context: {
          technology: data.technology,
          category: data.category,
          tags: data.tags
        }
      });
    }
    
    const pattern = await codingAssistantService.saveCodePattern(req.session.userId, data);
    res.json(pattern);
  } catch (error) {
    console.error("Error saving code pattern:", error);
    res.status(400).json({ error: "Invalid pattern data" });
  }
});

router.get("/patterns", requireAuth, async (req: any, res: any) => {
  try {
    const { technology, category } = req.query;
    const patterns = await codingAssistantService.getCodePatterns(
      req.session.userId, 
      technology as string, 
      category as string
    );
    res.json(patterns);
  } catch (error) {
    console.error("Error fetching patterns:", error);
    res.status(500).json({ error: "Failed to fetch patterns" });
  }
});

router.get("/patterns/search", requireAuth, async (req: any, res: any) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Search query required" });
    }
    const patterns = await codingAssistantService.searchPatterns(req.session.userId, q as string);
    res.json(patterns);
  } catch (error) {
    console.error("Error searching patterns:", error);
    res.status(500).json({ error: "Failed to search patterns" });
  }
});

// Debugging Solutions
router.post("/solutions", requireAuth, async (req: any, res: any) => {
  try {
    const data = insertDebuggingSolutionSchema.omit({ userId: true }).parse(req.body);
    const solution = await codingAssistantService.saveDebuggingSolution(req.session.userId, data);
    res.json(solution);
  } catch (error) {
    console.error("Error saving debugging solution:", error);
    res.status(400).json({ error: "Invalid solution data" });
  }
});

router.get("/solutions", requireAuth, async (req: any, res: any) => {
  try {
    const { limit } = req.query;
    const solutions = await codingAssistantService.getDebuggingHistory(
      req.session.userId, 
      limit ? parseInt(limit as string) : undefined
    );
    res.json(solutions);
  } catch (error) {
    console.error("Error fetching solutions:", error);
    res.status(500).json({ error: "Failed to fetch solutions" });
  }
});

router.get("/solutions/similar", requireAuth, async (req: any, res: any) => {
  try {
    const { problem, technology } = req.query;
    if (!problem || !technology) {
      return res.status(400).json({ error: "Problem description and technology required" });
    }
    const solutions = await codingAssistantService.getSimilarProblems(
      req.session.userId, 
      problem as string, 
      technology as string
    );
    res.json(solutions);
  } catch (error) {
    console.error("Error finding similar problems:", error);
    res.status(500).json({ error: "Failed to find similar problems" });
  }
});

// Prompting Strategies
router.post("/strategies", requireAuth, async (req: any, res: any) => {
  try {
    const data = insertPromptingStrategySchema.omit({ userId: true }).parse(req.body);
    const strategy = await codingAssistantService.savePromptingStrategy(req.session.userId, data);
    res.json(strategy);
  } catch (error) {
    console.error("Error saving prompting strategy:", error);
    res.status(400).json({ error: "Invalid strategy data" });
  }
});

router.get("/strategies", requireAuth, async (req: any, res: any) => {
  try {
    const { useCase } = req.query;
    const strategies = await codingAssistantService.getPromptingStrategies(
      req.session.userId, 
      useCase as string
    );
    res.json(strategies);
  } catch (error) {
    console.error("Error fetching strategies:", error);
    res.status(500).json({ error: "Failed to fetch strategies" });
  }
});

router.patch("/strategies/:id/effectiveness", requireAuth, async (req: any, res: any) => {
  try {
    const strategyId = parseInt(req.params.id);
    const { timeTaken, successful } = req.body;
    await codingAssistantService.updateStrategyEffectiveness(strategyId, timeTaken, successful);
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating strategy effectiveness:", error);
    res.status(400).json({ error: "Invalid effectiveness data" });
  }
});

// Context Management
router.post("/context", requireAuth, async (req: any, res: any) => {
  try {
    const data = insertCodingContextSchema.omit({ userId: true }).parse(req.body);
    const context = await codingAssistantService.saveContext(req.session.userId, data);
    res.json(context);
  } catch (error) {
    console.error("Error saving context:", error);
    res.status(400).json({ error: "Invalid context data" });
  }
});

router.get("/context", requireAuth, async (req: any, res: any) => {
  try {
    const { type, sessionId } = req.query;
    const context = await codingAssistantService.getContext(
      req.session.userId, 
      type as string, 
      sessionId ? parseInt(sessionId as string) : undefined
    );
    res.json(context);
  } catch (error) {
    console.error("Error fetching context:", error);
    res.status(500).json({ error: "Failed to fetch context" });
  }
});

// AI Assistant Intelligence
router.get("/suggestions", requireAuth, async (req: any, res: any) => {
  try {
    const { problem, technology } = req.query;
    if (!problem || !technology) {
      return res.status(400).json({ error: "Problem and technology required" });
    }
    const suggestions = await codingAssistantService.getContextualSuggestions(
      req.session.userId, 
      problem as string, 
      technology as string
    );
    res.json(suggestions);
  } catch (error) {
    console.error("Error getting suggestions:", error);
    res.status(500).json({ error: "Failed to get suggestions" });
  }
});

// Analytics
router.get("/stats", requireAuth, async (req: any, res: any) => {
  try {
    const { days } = req.query;
    const stats = await codingAssistantService.getCodingStats(
      req.session.userId, 
      days ? parseInt(days as string) : undefined
    );
    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/insights", requireAuth, async (req: any, res: any) => {
  try {
    const insights = await codingAssistantService.generateLearningInsights(req.session.userId);
    res.json(insights);
  } catch (error) {
    console.error("Error generating insights:", error);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

// Metrics recording
router.post("/metrics", requireAuth, async (req: any, res: any) => {
  try {
    const metricSchema = z.object({
      sessionId: z.number().optional(),
      metricType: z.string(),
      metricValue: z.number(),
      technology: z.string().optional(),
    });
    
    const data = metricSchema.parse(req.body);
    const metric = await codingAssistantService.recordMetric(req.session.userId, data);
    res.json(metric);
  } catch (error) {
    console.error("Error recording metric:", error);
    res.status(400).json({ error: "Invalid metric data" });
  }
});

export default router;