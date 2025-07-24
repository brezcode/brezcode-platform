import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./simple-routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
// Increase payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Direct API routes for AI training (BEFORE any middleware to avoid conflicts)
app.get('/direct-api/test', (req, res) => {
  res.json({ success: true, message: 'Direct API routing works!' });
});

app.post('/direct-api/training/start', (req, res) => {
  try {
    const { avatarId, customerId, scenario } = req.body;
    
    if (!avatarId || !customerId || !scenario) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Validate avatar ID exists (basic validation for testing)
    const validAvatarIds = ['sales_specialist_alex', 'customer_service_miko', 'technical_kai', 'business_luna', 'health_sakura', 'education_sage'];
    if (!validAvatarIds.includes(avatarId)) {
      return res.status(400).json({ error: 'Invalid avatar ID' });
    }
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session = {
      id: sessionId,
      avatar_id: avatarId,
      customer_id: customerId,
      scenario: scenario,
      status: 'running',
      messages: [{
        id: `msg_${Date.now()}_1`,
        role: 'customer',
        content: `Hi, I'm interested in discussing ${scenario}. Can you help me with this?`,
        timestamp: new Date().toISOString(),
        emotion: 'curious',
        intent: 'inquire about service'
      }],
      performance_metrics: {
        response_quality: Math.floor(Math.random() * 30) + 70,
        customer_satisfaction: Math.floor(Math.random() * 25) + 65,
        goal_achievement: Math.floor(Math.random() * 20) + 60,
        conversation_flow: Math.floor(Math.random() * 15) + 75
      },
      started_at: new Date().toISOString(),
      duration: 0
    };
    
    res.json(session);
  } catch (error) {
    console.error('Error starting training session:', error);
    res.status(500).json({ error: 'Failed to start training session' });
  }
});

app.post('/direct-api/training/:sessionId/continue', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const avatarResponses = [
      "I understand your pricing concerns. Let me show you the specific value we provide.",
      "That's a great technical question. Based on your requirements, here's how we can help.",
      "I appreciate you bringing this to my attention. Let me resolve this for you.",
      "Compared to competitors, here are our three key advantages that clients value most.",
      "I hear your frustration. Here's what we can do to improve your experience immediately."
    ];
    
    const session = {
      id: sessionId,
      status: 'running',
      messages: [
        {
          id: `msg_${Date.now()}_1`,
          role: 'customer', 
          content: "I have some concerns about this solution.",
          timestamp: new Date(Date.now() - 60000).toISOString(),
          emotion: 'skeptical'
        },
        {
          id: `msg_${Date.now()}_2`,
          role: 'avatar',
          content: avatarResponses[Math.floor(Math.random() * avatarResponses.length)],
          timestamp: new Date().toISOString(),
          quality_score: Math.floor(Math.random() * 30) + 70
        }
      ],
      performance_metrics: {
        response_quality: Math.floor(Math.random() * 30) + 70,
        customer_satisfaction: Math.floor(Math.random() * 25) + 65,
        goal_achievement: Math.floor(Math.random() * 20) + 60,
        conversation_flow: Math.floor(Math.random() * 15) + 75
      }
    };
    
    res.json(session);
  } catch (error) {
    console.error('Error continuing training:', error);
    res.status(500).json({ error: 'Failed to continue training' });
  }
});

app.post('/direct-api/training/:sessionId/stop', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const finalSession = {
      id: sessionId,
      status: 'completed',
      duration: Math.floor(Math.random() * 300) + 180,
      performance_metrics: {
        response_quality: Math.floor(Math.random() * 30) + 70,
        customer_satisfaction: Math.floor(Math.random() * 25) + 65, 
        goal_achievement: Math.floor(Math.random() * 20) + 60,
        conversation_flow: Math.floor(Math.random() * 15) + 75
      },
      messages: []
    };
    
    res.json(finalSession);
  } catch (error) {
    console.error('Error stopping training:', error);
    res.status(500).json({ error: 'Failed to stop training' });
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  console.log('Starting server...');
  
  // Comment out problematic initializations for now
  /*
  // Initialize knowledge base with evidence-based medical facts
  try {
    const { knowledgeBaseManager } = await import('./knowledgeBase');
    await knowledgeBaseManager.initializeKnowledgeBase();
    console.log('✅ Knowledge base initialized with evidence-based medical facts');
  } catch (error) {
    console.error('❌ Knowledge base initialization failed:', error);
  }

  // Initialize platform features
  try {
    const { seedFeatures } = await import('./seedFeatures');
    await seedFeatures();
  } catch (error) {
    console.error('Failed to seed platform features:', error);
  }

  // Initialize default brand
  try {
    const { seedDefaultBrand } = await import('./seedBrand');
    await seedDefaultBrand();
  } catch (error) {
    console.error('Failed to seed default brand:', error);
  }
  
  // Initialize brand knowledge bases
  try {
    const { initializeBrandKnowledge } = await import('./initializeBrandKnowledge');
    await initializeBrandKnowledge();
  } catch (error) {
    console.error('Failed to initialize brand knowledge:', error);
  }

  // Initialize business onboarding questions
  try {
    const { seedOnboardingQuestions } = await import('./seedBusinessQuestions');
    await seedOnboardingQuestions();
  } catch (error) {
    console.error('Failed to seed business questions:', error);
  }
  */
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
