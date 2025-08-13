import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Import available route modules
try {
  const { registerRoutes } = await import("./simple-routes");
  registerRoutes(app);
} catch (e) {
  console.log("Simple routes not available");
}

try {
  const brezcodeRoutes = await import("./brezcode-routes");
  app.use('/api/brezcode', brezcodeRoutes.default);
} catch (e) {
  console.log("BrezCode routes not available");
}

try {
  const avatarRoutes = await import("./routes/avatarRoutes");
  app.use('/api/avatar', avatarRoutes.default);
} catch (e) {
  console.log("Avatar routes not available");
}

try {
  const businessRoutes = await import("./businessRoutes");
  app.use('/api/business', businessRoutes.default);
} catch (e) {
  console.log("Business routes not available");
}

try {
  const aiTrainingRoutes = await import("./ai-training-routes");
  app.use('/api/ai-training', aiTrainingRoutes.default);
} catch (e) {
  console.log("AI training routes not available");
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'BrezCode Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(process.cwd(), 'dist', 'public');
  app.use(express.static(staticPath));
  
  // Serve index.html for all routes (SPA)
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
} else {
  // Development mode
  app.get('/', (req, res) => {
    res.json({ 
      message: 'BrezCode Platform API - Development Mode',
      routes: [
        '/api/health',
        '/api/brezcode/*',
        '/api/avatar/*',
        '/api/business/*',
        '/api/ai-training/*'
      ]
    });
  });
}

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 BrezCode Platform server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;