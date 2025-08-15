import express from 'express';
import { appleHealthService } from '../appleHealthService';
import { storage } from '../storage';

const router = express.Router();

// Connect Apple Watch and sync health data
router.post('/apple-health/sync', async (req, res) => {
  try {
    const { userId, healthData } = req.body;

    if (!userId || !healthData) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and health data are required' 
      });
    }

    // Process the Apple Health data
    const processedMetrics = await appleHealthService.processHealthData(userId, healthData);
    
    // Generate insights
    const insights = appleHealthService.generateHealthInsights(processedMetrics);
    
    // Calculate health score
    const healthScore = appleHealthService.calculateHealthScore(processedMetrics);

    res.json({
      success: true,
      metrics: processedMetrics,
      insights,
      healthScore,
      message: 'Health data synced successfully'
    });

  } catch (error) {
    console.error('Apple Health sync error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to sync health data' 
    });
  }
});

// Get user's health metrics history
router.get('/apple-health/metrics/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const days = parseInt(req.query.days as string) || 30;

    const metrics = await appleHealthService.getHealthTrends(userId, days);
    
    res.json({
      success: true,
      metrics,
      period: `${days} days`
    });

  } catch (error) {
    console.error('Get health metrics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve health metrics' 
    });
  }
});

// Get latest health metrics for a user
router.get('/apple-health/latest/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    const latestMetrics = await storage.getLatestHealthMetrics(userId);
    
    if (!latestMetrics) {
      return res.json({
        success: true,
        metrics: null,
        message: 'No health data found'
      });
    }

    const insights = appleHealthService.generateHealthInsights(latestMetrics);
    const healthScore = appleHealthService.calculateHealthScore(latestMetrics);

    res.json({
      success: true,
      metrics: latestMetrics,
      insights,
      healthScore
    });

  } catch (error) {
    console.error('Get latest metrics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve latest health metrics' 
    });
  }
});

// Update sync settings
router.post('/apple-health/sync-settings', async (req, res) => {
  try {
    const { userId, settings } = req.body;

    if (!userId || !settings) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and settings are required' 
      });
    }

    const updatedSettings = await appleHealthService.updateSyncSettings(userId, settings);
    
    res.json({
      success: true,
      settings: updatedSettings,
      message: 'Sync settings updated successfully'
    });

  } catch (error) {
    console.error('Update sync settings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update sync settings' 
    });
  }
});

// Get sync settings
router.get('/apple-health/sync-settings/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    const settings = await appleHealthService.getSyncSettings(userId);
    
    res.json({
      success: true,
      settings: settings || {
        isAppleHealthEnabled: false,
        isAppleWatchConnected: false,
        syncFrequency: 'daily',
        enabledMetrics: []
      }
    });

  } catch (error) {
    console.error('Get sync settings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve sync settings' 
    });
  }
});

// Generate personalized recommendations based on health data
router.post('/apple-health/recommendations', async (req, res) => {
  try {
    const { userId, healthGoals } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const latestMetrics = await storage.getLatestHealthMetrics(userId);
    
    if (!latestMetrics) {
      return res.json({
        success: true,
        recommendations: ['Connect your Apple Watch to get personalized health recommendations'],
        message: 'No health data available for recommendations'
      });
    }

    const recommendations = appleHealthService.generatePersonalizedRecommendations(
      latestMetrics, 
      healthGoals || []
    );
    
    res.json({
      success: true,
      recommendations,
      basedOn: 'Apple Watch health data'
    });

  } catch (error) {
    console.error('Generate recommendations error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate recommendations' 
    });
  }
});

export default router;