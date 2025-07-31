import express from "express";
import { createServer } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { registerRoutes } from "./simple-routes";

const app = express();

// Basic middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Basic request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Register basic routes
registerRoutes(app);

// Basic API health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Simple error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({ message: "Internal server error" });
});

async function startServer() {
  const server = createServer(app);

  // Setup Vite for development or static files for production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Port 5000 is busy, finding available port...');
      server.listen(0, "0.0.0.0", () => {
        const address = server.address();
        const actualPort = typeof address === 'object' && address ? address.port : 'unknown';
        log(`Server running on port ${actualPort}`);
      });
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  server.listen(port, "0.0.0.0", () => {
    log(`Server running on port ${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});