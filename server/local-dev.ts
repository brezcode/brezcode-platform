import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3002;

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Simple request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BrezCode server is running locally!' });
});

// Basic API endpoints
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'BrezCode API is working!', 
    timestamp: new Date().toISOString(),
    environment: 'local development'
  });
});

// Serve static files for frontend (if available)
app.use(express.static('client'));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BrezCode server running locally on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
});