import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
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

// CRITICAL FIX: Direct avatar training routes to bypass Vite conflicts
// Get all scenarios endpoint with avatarType filtering
app.get('/api/avatar-training/scenarios', async (req, res) => {
  try {
    const { avatarType } = req.query;
    console.log(`🔍 DIRECT: Fetching training scenarios for avatarType: ${avatarType || 'all'}`);
    
    const { TRAINING_SCENARIOS } = await import('./avatarTrainingScenarios');
    
    // Filter scenarios by avatarType if specified
    let filteredScenarios = TRAINING_SCENARIOS;
    if (avatarType) {
      filteredScenarios = TRAINING_SCENARIOS.filter(scenario => scenario.avatarType === avatarType);
      console.log(`✅ DIRECT: Found ${filteredScenarios.length} scenarios for ${avatarType}`);
    } else {
      console.log(`✅ DIRECT: Found ${TRAINING_SCENARIOS.length} total scenarios`);
    }
    
    res.json({
      success: true,
      scenarios: filteredScenarios
    });
  } catch (error: any) {
    console.error('❌ DIRECT: Error fetching scenarios:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single scenario endpoint
app.get('/api/avatar-training/scenarios/:scenarioId', async (req, res) => {
  try {
    const { scenarioId } = req.params;
    console.log(`🔍 DIRECT: Looking for scenario: ${scenarioId}`);
    
    const { TRAINING_SCENARIOS } = await import('./avatarTrainingScenarios');
    const scenario = TRAINING_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) {
      console.log(`❌ DIRECT: Scenario not found: ${scenarioId}`);
      return res.status(404).json({ error: 'Scenario not found' });
    }
    
    console.log(`✅ DIRECT: Found scenario: ${scenario.name}`);
    res.json({
      success: true,
      scenario: scenario
    });
  } catch (error: any) {
    console.error('❌ DIRECT: Error fetching scenario:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/avatar-training/sessions', async (req, res) => {
  try {
    const { avatarType, scenarioId, businessContext, userId } = req.body;
    
    console.log('🚀 DIRECT: Creating training session:', { avatarType, scenarioId, businessContext, userId });
    
    if (!avatarType || !scenarioId) {
      return res.status(400).json({ error: 'avatarType and scenarioId are required' });
    }
    
    const { TRAINING_SCENARIOS } = await import('./avatarTrainingScenarios');
    const scenario = TRAINING_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    
    const { AvatarTrainingSessionService } = await import('./services/avatarTrainingSessionService');
    const session = await AvatarTrainingSessionService.createSession(
      userId || 1,
      avatarType,
      scenarioId,
      businessContext || 'health_coaching',
      scenario
    );
    
    console.log(`✅ DIRECT: Session created successfully: ${session.sessionId}`);
    
    res.json({
      success: true,
      session: {
        sessionId: session.sessionId,
        avatarType: session.avatarType,
        scenarioId: session.scenarioId,
        businessContext: session.businessContext,
        status: session.status,
        startedAt: session.startedAt?.toISOString(),
        messages: []
      }
    });
  } catch (error: any) {
    console.error('❌ DIRECT: Session creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Manual message endpoint (direct routing to bypass Vite conflicts)
app.post('/api/avatar-training/sessions/:sessionId/message', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message, role = 'customer' } = req.body;

    console.log(`🔄 DIRECT: Manual message received for session ${sessionId}: "${message.trim()}"`);

    const { AvatarTrainingSessionService } = await import('./services/avatarTrainingSessionService');
    const session = await AvatarTrainingSessionService.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Add customer message to database
    const customerMessage = await AvatarTrainingSessionService.addMessage(
      sessionId,
      'customer',
      message.trim(),
      'neutral'
    );

    // Generate AI response 
    const aiResponse = await AvatarTrainingSessionService.generateResponse(
      sessionId,
      message.trim()
    );

    // Save the AI response to the database
    const avatarMessage = await AvatarTrainingSessionService.addMessage(
      sessionId,
      'avatar',
      aiResponse.content,
      'neutral',
      {
        qualityScore: aiResponse.qualityScore,
        responseTime: aiResponse.responseTime,
        aiModel: 'claude-sonnet-4'
      }
    );

    console.log(`✅ DIRECT: Manual message processed successfully for session ${sessionId}`);

    res.json({
      success: true,
      response: aiResponse.content,
      quality_score: aiResponse.qualityScore,
      userMessage: {
        id: customerMessage.messageId,
        role: 'customer',
        content: customerMessage.content,
        timestamp: customerMessage.createdAt
      },
      avatarMessage: {
        id: avatarMessage.messageId,
        role: 'avatar',
        content: avatarMessage.content,
        timestamp: avatarMessage.createdAt,
        quality_score: avatarMessage.qualityScore
      }
    });
  } catch (error: any) {
    console.error('❌ DIRECT: Manual message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI Continue conversation endpoint (direct routing to bypass Vite conflicts)
app.post('/api/avatar-training/sessions/:sessionId/continue', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { customerMessage } = req.body;

    console.log('🔍 DIRECT: AI Continue Request for session:', sessionId);

    const { AvatarTrainingSessionService } = await import('./services/avatarTrainingSessionService');
    const session = await AvatarTrainingSessionService.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Continue the conversation with AI-generated patient question and Dr. Sakura response
    const updatedSession = await AvatarTrainingSessionService.continueConversation(sessionId);

    console.log(`✅ DIRECT: AI Continue processed successfully for session ${sessionId}`);

    res.json({
      success: true,
      session: updatedSession
    });
  } catch (error: any) {
    console.error('❌ DIRECT: AI Continue error:', error);
    res.status(500).json({ error: error.message });
  }
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

  // Use registerRoutes with error handling for main functionality
  let server;
  try {
    server = await registerRoutes(app);
    console.log('✅ Main routes registered successfully');
  } catch (error) {
    console.error('❌ Error registering main routes:', error);
    // Create a simple HTTP server fallback
    server = createServer(app);
  }

  // Register additional routes later when they're fixed
  // TODO: Re-enable these routes after fixing TypeScript errors
  // registerAvatarTrainingRoutes(app);
  // app.use('/api/avatar-training', avatarKnowledgeRoutes);
  // registerBusinessAvatarRoutes(app);
  // registerKnowledgeUploadRoutes(app);

  // Register avatar performance routes for completed session display
  try {
    console.log('🎯 Registering avatar performance routes...');
    const { registerAvatarPerformanceRoutes } = await import('./avatar-performance-routes');
    registerAvatarPerformanceRoutes(app);
    console.log('✅ Avatar performance routes registered successfully');
  } catch (error) {
    console.error('❌ Error registering performance routes:', error);
  }

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