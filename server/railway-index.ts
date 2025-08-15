import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import database and routes
import { registerRoutes } from "./simple-routes";
import { registerAvatarKnowledgeRoutes } from "./avatar-knowledge-routes";
import brezcodeAdminRoutes from "./routes/brezcodeAvatarRoutes";
import skinAnalysisRoutes from "./routes/skinAnalysisRoutes";
import skincoachAdminRoutes from "./routes/skincoachAdminRoutes";
import skincoachChatRoutes from "./routes/skincoachChatRoutes";

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API server
  crossOriginEmbedderPolicy: false
}));

// CORS setup for frontend domain
app.use(cors({
  origin: [
    'https://www.brezcode.com',
    'https://brezcode.com',
    'https://www.skincoach.ai',
    'https://skincoach.ai',
    'https://www.leadgen.to',
    'https://leadgen.to',
    'http://localhost:3000',
    'https://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'BrezCode API server is running!',
    timestamp: new Date().toISOString()
  });
});

// Register routes
try {
  console.log('🚀 Registering API routes...');
  
  // Register main routes
  registerRoutes(app);
  
  // Register avatar knowledge routes
  registerAvatarKnowledgeRoutes(app);
  
  // Register platform-specific routes
  app.use('/api/brezcode', brezcodeAdminRoutes);
  app.use('/api/skin-analysis', skinAnalysisRoutes);
  app.use('/api/skincoach/admin', skincoachAdminRoutes);
  app.use('/api/skincoach/chat', skincoachChatRoutes);
  
  console.log('✅ All routes registered successfully');
} catch (error) {
  console.error('❌ Error registering routes:', error);
}

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.originalUrl,
    message: 'The requested endpoint does not exist'
  });
});

// Start server
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 BrezCode API Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for frontend domains`);
  console.log(`💾 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

export default app;