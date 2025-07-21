import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Basic health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development"
    });
  });

  // Simple API routes for testing
  app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
  });

  // Create HTTP server
  const server = createServer(app);

  return server;
}