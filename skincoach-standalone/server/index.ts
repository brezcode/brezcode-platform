import express from "express";
import cors from "cors";
import { createServer } from "http";
import skinAnalysisRoutes from "./routes/skinAnalysisRoutes";
import skincoachAdminRoutes from "./routes/skincoachAdminRoutes";
import skincoachChatRoutes from "./routes/skincoachChatRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// API Routes
app.use('/api', skinAnalysisRoutes);
app.use('/api', skincoachAdminRoutes);
app.use('/api', skincoachChatRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist/public'));
  
  // Serve index.html for all routes (SPA)
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'dist/public' });
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'SkinCoach API' });
});

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 SkinCoach server running on port ${PORT}`);
});

export default app;