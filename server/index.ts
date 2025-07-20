import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
// Increase payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

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
