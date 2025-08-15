import type { Express } from "express";
import { AvatarTrainingSessionService } from './services/avatarTrainingSessionService';

// Middleware to check authentication
const requireAuth = (req: any, res: any, next: any) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = userId;
  next();
};

export function registerAvatarPerformanceRoutes(app: Express): void {
  console.log('🎯 Registering Avatar Performance routes...');

  // Get completed training sessions for Performance page
  app.get('/api/performance/completed-sessions', requireAuth, async (req, res) => {
    try {
      const userId = req.userId;
      const businessContext = req.query.businessContext as string || 'brezcode';
      
      const completedSessions = await AvatarTrainingSessionService.getCompletedSessionsForPerformance(
        userId,
        businessContext
      );
      
      console.log(`📊 Retrieved ${completedSessions.length} completed sessions for performance display`);
      res.json({
        success: true,
        sessions: completedSessions
      });
    } catch (error) {
      console.error('Error fetching completed sessions:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch completed sessions' 
      });
    }
  });

  // Get detailed session view for Performance page click-through
  app.get('/api/performance/session/:sessionId', requireAuth, async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const sessionDetails = await AvatarTrainingSessionService.getSessionDetailsForPerformance(sessionId);
      
      if (!sessionDetails) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }
      
      console.log(`🔍 Retrieved session details for ${sessionId} with ${sessionDetails.messages.length} messages`);
      res.json({
        success: true,
        sessionDetails
      });
    } catch (error) {
      console.error('Error fetching session details:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch session details'
      });
    }
  });

  // Complete a training session (called when user closes session)
  app.post('/api/performance/complete-session/:sessionId', requireAuth, async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      await AvatarTrainingSessionService.completeSession(sessionId);
      
      console.log(`✅ Training session completed: ${sessionId}`);
      res.json({
        success: true,
        message: 'Session completed successfully'
      });
    } catch (error) {
      console.error('Error completing session:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to complete session'
      });
    }
  });

  console.log('✅ Avatar Performance routes registered successfully');
}