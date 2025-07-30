import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./simple-routes";
import { setupVite, serveStatic, log } from "./vite";
import { registerAvatarKnowledgeRoutes } from "./avatar-knowledge-routes";

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
    console.log(`🔍 DIRECT: Fetching scenario ${scenarioId}`);
    
    const { TRAINING_SCENARIOS } = await import('./avatarTrainingScenarios');
    const scenario = TRAINING_SCENARIOS.find(s => s.id === scenarioId);
    
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    
    console.log(`✅ DIRECT: Found scenario ${scenarioId}`);
    res.json({
      success: true,
      scenario
    });
  } catch (error: any) {
    console.error('❌ DIRECT: Error fetching scenario:', error);
    res.status(500).json({ error: error.message });
  }
});

// Avatar performance endpoints
app.get('/api/avatar-performance/:sessionId', async (req, res) => {
  try {
    console.log('🎯 DIRECT: Avatar performance request for sessionId:', req.params.sessionId);
    
    // Mock performance data for now
    const performanceData = {
      sessionId: req.params.sessionId,
      averageScore: 87,
      completedScenarios: 12,
      improvementAreas: ["Empathy responses", "Technical accuracy"],
      strengths: ["Active listening", "Problem resolution"],
      recommendations: ["Practice more emotional support scenarios", "Review technical documentation"]
    };
    
    res.json({
      success: true,
      performance: performanceData
    });
  } catch (error: any) {
    console.error('❌ DIRECT: Avatar performance error:', error);
    res.status(500).json({ error: error.message });
  }
});

console.log('Starting server...');

// Register main application routes
registerRoutes(app);
console.log('✅ Main routes registered successfully');

// Register Avatar Knowledge Base routes
console.log('📚 Registering Avatar Knowledge Base routes...');
registerAvatarKnowledgeRoutes(app);
console.log('✅ Avatar Knowledge Base routes registered successfully');

// Try to register additional routes if they exist
try {
  console.log('🌸 Registering BrezCode avatar routes...');
  const { registerBrezcodeAvatarRoutes } = await import('./routes/brezcodeAvatarRoutes');
  registerBrezcodeAvatarRoutes(app);
  console.log('✅ BrezCode avatar routes registered successfully');
} catch (error) {
  console.log('⚠️ BrezCode avatar routes not found, skipping...');
}

try {
  console.log('🚀 Registering avatar training routes...');
  const { registerAvatarTrainingRoutes } = await import('./avatar-training-routes');
  registerAvatarTrainingRoutes(app);
  console.log('✅ Avatar training routes registered successfully');
} catch (error) {
  console.log('⚠️ Avatar training routes not found, skipping...');
}

try {
  console.log('🎯 Registering Avatar Performance routes...');
  const { registerAvatarPerformanceRoutes } = await import('./routes/avatarPerformanceRoutes');
  registerAvatarPerformanceRoutes(app);
  console.log('✅ Avatar Performance routes registered successfully');
} catch (error) {
  console.log('⚠️ Avatar performance routes not found, skipping...');
}

// Setup Vite middleware (this should be last)
if (app.get("env") === "development") {
  await setupVite(app);
} else {
  serveStatic(app);
}

const server = createServer(app);

server.listen(5000, "0.0.0.0", () => {
  log(`serving on port 5000`);
});