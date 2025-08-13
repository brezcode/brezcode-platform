import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import cors from 'cors';
import { registerRoutes } from "./simple-routes";
import { registerAvatarKnowledgeRoutes } from "./avatar-knowledge-routes";
import brezcodeAdminRoutes from "../brezcode/server/routes/brezcode-admin-routes";
import skinAnalysisRoutes from "./routes/skinAnalysisRoutes";
import skincoachAdminRoutes from "./routes/skincoachAdminRoutes";
import skincoachChatRoutes from "./routes/skincoachChatRoutes";

const app = express();

// CORS configuration for all three platforms
const corsOptions = {
  origin: [
    // BrezCode domains
    'https://www.brezcode.com',
    'https://brezcode.com',
    // LeadGen domains  
    'https://www.leadgen.to',
    'https://leadgen.to',
    // SkinCoach domains
    'https://www.skincoach.ai',
    'https://skincoach.ai',
    // Development
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

app.use(cors(corsOptions));

// Increase payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'brezcode-backend-api',
    timestamp: new Date().toISOString() 
  });
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'BrezCode Backend API is working!',
    timestamp: new Date().toISOString()
  });
});

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

// Register all API routes
try {
  registerRoutes(app);
  console.log('✅ Registered main routes');
} catch (error) {
  console.error('❌ Error registering main routes:', error);
}

try {
  registerAvatarKnowledgeRoutes(app);  
  console.log('✅ Registered avatar knowledge routes');
} catch (error) {
  console.error('❌ Error registering avatar knowledge routes:', error);
}

// Register additional route modules
app.use('/api/brezcode-admin', brezcodeAdminRoutes);
app.use('/api/skin-analysis', skinAnalysisRoutes);  
app.use('/api/skincoach-admin', skincoachAdminRoutes);
app.use('/api/skincoach-chat', skincoachChatRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler for API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'BrezCode Backend API',
    status: 'running',
    version: '1.0.0',
    endpoints: [
      'GET /health - Health check',
      'GET /api/test - API test',
      'GET /api/* - Various API endpoints'
    ]
  });
});

const port = parseInt(process.env.PORT || "3000");
const server = createServer(app);

server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 BrezCode Backend API server running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Health check: http://localhost:${port}/health`);
});

export default app;