import express from "express";
import session from "express-session";
import cors from "cors";
import { ViteDevServer } from "vite";
import healthRoutes from "./simple-routes";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'womenhealth-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// API routes
app.use(healthRoutes);

// Development setup with Vite
if (process.env.NODE_ENV === "development") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.ssrFixStacktrace);
  app.use("*", vite.middlewares);
}

// Production static file serving
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 WomenHealth server running on port ${PORT}`);
  if (process.env.NODE_ENV === "development") {
    console.log(`📱 Access your app at: http://localhost:${PORT}`);
  }
});

export default app;